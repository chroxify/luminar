'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Label } from '@feedbase/ui/components/label';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@feedbase/ui/components/tabs';
import { cn } from '@feedbase/ui/lib/utils';
import { fontMono } from '@feedbase/ui/styles/fonts';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Check, CheckIcon, ClipboardList, RefreshCcw, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import useWorkspace from '@/lib/swr/use-workspace';
import { actionFetcher, fetcher, formatRootUrl } from '@/lib/utils';
import SettingsCard from '@/components/settings/settings-card';
import FetchError from '@/components/shared/fetch-error';
import { Icons } from '@/components/shared/icons/icons-static';
import InputGroup from '@/components/shared/input-group';

interface domainData {
  name: string;
  apexName: string;
  verified: boolean;
  verification: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}

export default function DomainSettings({ params }: { params: { slug: string } }) {
  const [domain, setDomain] = useState<string>('');
  const { workspace, loading, isValidating, mutate, error } = useWorkspace();
  const [domainStatus, setDomainStatus] = useState<'unset' | 'verifying' | 'verified'>('unset');
  const [hasCopied, setHasCopied] = useState<string[]>([]);
  const [redirectRule, setRedirectRule] = useState<'direct_redirect' | 'root_redirect' | 'no_redirect'>();

  const {
    data: domainData,
    isValidating: domainIsValidating,
    mutate: domainMutate,
  } = useSWR<domainData>(`/api/v1/workspaces/${params.slug}/domain`, fetcher, {
    errorRetryInterval: 30000,
    refreshInterval: 5000,
  });

  const { trigger: submitDomainVerification, isMutating: isSubmittingDomain } = useSWRMutation(
    `/api/v1/workspaces/${params.slug}/domain`,
    actionFetcher,
    {
      onSuccess: () => {
        setDomainStatus('verifying');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const { trigger: removeDomain, isMutating: isRemovingDomain } = useSWRMutation(
    `/api/v1/workspaces/${params.slug}/domain`,
    actionFetcher,
    {
      onSuccess: () => {
        setDomainStatus('unset');
        setDomain('');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const { trigger: updateWorkspace } = useSWRMutation(`/api/v1/workspaces/${params.slug}`, actionFetcher, {
    onSuccess: () => {
      toast.success('Redirect rule updated.');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (workspace?.custom_domain) {
      // Set domain if it is not set
      if (!domain) {
        setDomain(workspace.custom_domain);
      }

      // Set domain status
      if (workspace.custom_domain_verified || domainData?.verified) {
        setDomainStatus('verified');
      } else {
        setDomainStatus('verifying');
      }
    } else {
      setDomainStatus('unset');
    }

    setRedirectRule(workspace?.custom_domain_redirect);
  }, [workspace, domainData]);

  function handleCopyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    setHasCopied((prevHasCopied) => [...prevHasCopied, value]);

    setTimeout(() => {
      setHasCopied((prevHasCopied) => prevHasCopied.filter((item) => item !== value));
    }, 3000);
  }

  // Loading State
  if (loading) {
    return (
      <SettingsCard title='Custom Domain' description='Host your public hub at your own custom domain.'>
        <Skeleton className='col-span-2 h-80 w-full' />
      </SettingsCard>
    );
  }

  // Error State
  if (error) {
    return (
      <SettingsCard title='Custom Domain' description='Host your public hub at your own custom domain.'>
        <div className='col-span-2 h-full w-full'>
          <FetchError error={error} mutate={mutate} name='workspace' isValidating={isValidating} />
        </div>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard title='Custom Domain' description='Host your public hub at your own custom domain.'>
      <div className='col-span-1 -mt-1 w-full space-y-1'>
        <Label className='text-foreground/70 text-sm '>Domain</Label>
        <form className='flex w-full gap-1.5'>
          <InputGroup
            type='url'
            prefix='https://'
            placeholder='feedbase.app'
            disabled={domainStatus !== 'unset'}
            value={domain}
            onChange={(event) => {
              setDomain(event.target.value);
            }}
          />
          {domainStatus === 'unset' ? (
            <Button
              type='submit'
              onClick={async () => {
                submitDomainVerification({ name: domain });
              }}
              disabled={isSubmittingDomain || !domain}>
              {isSubmittingDomain ? <Icons.Spinner className='mr-2 h-3.5 w-3.5 animate-spin' /> : null}
              Connect
            </Button>
          ) : (
            <Button
              type='button'
              variant='default'
              size='icon'
              className='shrink-0'
              disabled={isRemovingDomain}
              onClick={async () => {
                removeDomain({ method: 'DELETE' });
              }}>
              {isRemovingDomain ? (
                <Icons.Spinner className='h-3.5 w-3.5 animate-spin' />
              ) : (
                <Trash2Icon className='h-4 w-4' />
              )}
            </Button>
          )}
        </form>
        <Label className='text-muted-foreground text-xs'>
          Want to host on a sub-path? Check out our{' '}
          <Link href={formatRootUrl('docs')} className='hover:text-foreground underline transition-colors'>
            documentation
          </Link>
          .
        </Label>
      </div>

      <div className='col-span-1 -mt-1 flex h-full w-full flex-col space-y-1'>
        <Label className='text-foreground/70 text-sm '>Redirect Feedbase Subdomain</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-fit'>
              {redirectRule === 'direct_redirect' && 'Redirect direct path'}
              {redirectRule === 'root_redirect' && 'Redirect to root'}
              {redirectRule === 'no_redirect' && "Don't Redirect"}
              <ChevronUpDownIcon className='ml-1 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuItem
              className='flex h-fit flex-row items-center gap-1 py-1'
              key='redirect_direct'
              onSelect={() => {
                updateWorkspace({ method: 'PATCH', custom_domain_redirect: 'direct_redirect' });
                setRedirectRule('direct_redirect');
              }}>
              <div className='flex flex-col items-start gap-0.5'>
                <span>Redirect direct path</span>
                <span className='text-muted-foreground text-xs'>
                  Redirects to equivalent path on your custom domain.
                </span>
              </div>

              <Check
                className={cn(
                  'ml-auto h-4 w-4',
                  redirectRule === 'direct_redirect' ? 'text-primary' : 'text-transparent'
                )}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className='flex h-fit flex-row items-center gap-1 py-1'
              key='redirect_root'
              onSelect={() => {
                updateWorkspace({ method: 'PATCH', custom_domain_redirect: 'root_redirect' });
                setRedirectRule('root_redirect');
              }}>
              <div className='flex flex-col items-start gap-0.5'>
                <span>Redirect to root</span>
                <span className='text-muted-foreground text-xs '>
                  Redirects to the root of your custom domain.
                </span>
              </div>

              <Check
                className={cn(
                  'ml-auto h-4 w-4',
                  redirectRule === 'root_redirect' ? 'text-primary' : 'text-transparent'
                )}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className='flex h-fit flex-row items-center gap-1 py-1'
              key='no_redirect'
              onSelect={() => {
                updateWorkspace({ method: 'PATCH', custom_domain_redirect: 'no_redirect' });
                setRedirectRule('no_redirect');
              }}>
              <div className='flex flex-col items-start gap-0.5'>
                <span>Don&apos;t Redirect</span>
                <span className='text-muted-foreground text-xs '>
                  Does not redirect any requests to your custom domain.
                </span>
              </div>

              <Check
                className={cn(
                  'ml-auto h-4 w-4',
                  redirectRule === 'no_redirect' ? 'text-primary' : 'text-transparent'
                )}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Label className='text-muted-foreground text-xs'>
          Wether to redirect the default {process.env.NEXT_PUBLIC_ROOT_DOMAIN} subdomain to your custom
          domain.
        </Label>
      </div>

      <div className='col-span-2 -mt-1 flex h-full w-full flex-col gap-2'>
        {domainStatus === 'verifying' ? (
          <>
            <div className='flex flex-row items-center gap-1.5 text-sm'>
              <ExclamationCircleIcon className='h-5 w-5 text-yellow-500' />
              Verification Required
            </div>

            {/* Initial Loading state */}
            {!domainData && (
              <div className='flex w-1/2 max-w-[600px] flex-col items-center justify-center gap-2 pt-10'>
                <Icons.Spinner className='text-foreground/70 h-5 w-5 animate-spin' />
                <Label className='text-foreground/70 text-sm '>Fetching domain data...</Label>
              </div>
            )}

            {domainData ? (
              <div className='flex h-full w-full flex-col'>
                {/* Tabs, if domain is not assigned to a vercel workspace yet */}
                {domainData.verification === undefined ? (
                  <Tabs defaultValue='a' className='w-fit'>
                    <div className='flex flex-row items-center gap-1.5'>
                      <TabsList className='bg-background gap-1 rounded-lg border p-0.5'>
                        <TabsTrigger
                          value='a'
                          className='data-[state=active]:bg-muted data-[state=active]:text-secondary-foreground data-[state=active]:border-border h-full rounded-md border border-transparent px-1.5 py-1 text-sm'>
                          A Record (Recommended)
                        </TabsTrigger>
                        <TabsTrigger
                          value='cname'
                          className='data-[state=active]:bg-muted data-[state=active]:text-secondary-foreground data-[state=active]:border-border h-full rounded-md border border-transparent px-1.5 py-1 text-sm'>
                          CNAME Record
                        </TabsTrigger>
                      </TabsList>

                      {/* Refresh Status */}
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                          domainMutate();
                        }}
                        disabled={domainIsValidating}
                        className='text-secondary-foreground hover:text-foreground'>
                        {domainIsValidating ? (
                          <Icons.Spinner className='h-4 w-4 animate-spin' />
                        ) : (
                          <RefreshCcw className='h-4 w-4' />
                        )}
                      </Button>
                    </div>

                    <TabsContent value='a' className='flex w-full flex-col gap-1.5'>
                      <Label className='text-foreground/80 cursor-text select-text pt-1 text-sm '>
                        To verify your domain, add the following A Records to your DNS settings.
                      </Label>

                      {/* Info Table */}
                      <div className='bg-background overflow-x-auto rounded border px-5 py-3'>
                        {/* Type */}
                        <div className='flex flex-row gap-3'>
                          <div className='flex w-full flex-col justify-start gap-2'>
                            <Label className='text-foreground/90 text-sm '>Type</Label>
                            <span
                              className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                              A
                            </span>
                          </div>
                          <div className='flex w-full flex-col justify-start gap-2'>
                            <Label className='text-foreground/90 text-sm '>Name</Label>
                            <button
                              className='group flex cursor-pointer flex-row items-center justify-between space-x-2'
                              onClick={() => {
                                handleCopyToClipboard('@');
                              }}
                              type='button'>
                              <span
                                className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                                @
                              </span>

                              {hasCopied.includes('@') ? (
                                <CheckIcon className='h-4 w-4 text-green-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              ) : (
                                <ClipboardList className='text-foreground/70 h-4 w-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              )}
                            </button>
                          </div>
                          <div className='flex w-full flex-col justify-start gap-2'>
                            <Label className='text-foreground/90 text-sm '>Value</Label>

                            <button
                              className='group flex cursor-pointer flex-row items-center justify-between space-x-2'
                              onClick={() => {
                                handleCopyToClipboard('76.76.21.21');
                              }}
                              type='button'>
                              <span
                                className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                                76.76.21.21
                              </span>

                              {hasCopied.includes('76.76.21.21') ? (
                                <CheckIcon className='h-4 w-4 text-green-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              ) : (
                                <ClipboardList className='text-foreground/70 h-4 w-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              )}
                            </button>
                          </div>
                          <div className='flex w-full flex-col justify-start gap-2'>
                            <Label className='text-foreground/90 text-sm'>TTL</Label>
                            <button
                              className='group flex cursor-pointer flex-row items-center justify-between space-x-2'
                              onClick={() => {
                                handleCopyToClipboard('86400');
                              }}
                              type='button'>
                              <span
                                className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                                86400
                              </span>

                              {hasCopied.includes('86400') ? (
                                <CheckIcon className='h-4 w-4 text-green-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              ) : (
                                <ClipboardList className='text-foreground/70 h-4 w-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Note */}
                      <Label className='text-muted-foreground cursor-text select-text text-xs'>
                        Note: If{' '}
                        <span
                          className={`${fontMono.variable} bg-background font-monospace rounded px-1 py-0.5`}>
                          86400
                        </span>{' '}
                        is not supported for TLL, make sure to use the highest TTL value available.
                      </Label>
                    </TabsContent>
                    <TabsContent value='cname' className='flex w-full flex-col gap-1.5'>
                      <Label className='text-foreground/80 cursor-text select-text text-sm'>
                        To verify your domain, add the following CNAME Records to your DNS settings.
                      </Label>

                      {/* Info Table */}
                      <div className='bg-background overflow-x-auto rounded border px-5 py-3'>
                        {/* Type */}
                        <div className='flex flex-row gap-3'>
                          <div className='flex w-full flex-col justify-start gap-2'>
                            <Label className='text-foreground/90 text-sm '>Type</Label>
                            <span
                              className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                              CNAME
                            </span>
                          </div>
                          <div className='flex w-full flex-col justify-start gap-2'>
                            <Label className='text-foreground/90 text-sm '>Name</Label>
                            <button
                              className='group flex cursor-pointer flex-row items-center justify-between space-x-2'
                              onClick={() => {
                                handleCopyToClipboard('www');
                              }}
                              type='button'>
                              <span
                                className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                                www
                              </span>

                              {hasCopied.includes('www') ? (
                                <CheckIcon className='h-4 w-4 shrink-0 text-green-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              ) : (
                                <ClipboardList className='text-foreground/70 h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              )}
                            </button>
                          </div>
                          <div className='flex w-full flex-col justify-start gap-2'>
                            <Label className='text-foreground/90 text-sm '>Value</Label>

                            <button
                              className='group flex cursor-pointer flex-row items-center justify-between space-x-2'
                              onClick={() => {
                                handleCopyToClipboard('76.76.21.21');
                              }}
                              type='button'>
                              <span
                                className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                                cname.vercel-dns.com
                              </span>

                              {hasCopied.includes('76.76.21.21') ? (
                                <CheckIcon className='h-4 w-4 shrink-0 text-green-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              ) : (
                                <ClipboardList className='text-foreground/70 h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              )}
                            </button>
                          </div>
                          <div className='flex w-full flex-col justify-start gap-2'>
                            <Label className='text-foreground/90 text-sm '>TTL</Label>
                            <button
                              className='group flex cursor-pointer flex-row items-center justify-between space-x-2'
                              onClick={() => {
                                handleCopyToClipboard('86400');
                              }}
                              type='button'>
                              <span
                                className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                                86400
                              </span>

                              {hasCopied.includes('86400') ? (
                                <CheckIcon className='h-4 w-4 shrink-0 text-green-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              ) : (
                                <ClipboardList className='text-foreground/70 h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Note */}
                      <Label className='text-muted-foreground cursor-text select-text text-xs'>
                        Note: If{' '}
                        <span
                          className={`${fontMono.variable} bg-background font-monospace rounded px-1 py-0.5`}>
                          86400
                        </span>{' '}
                        is not supported for TLL, make sure to use the highest TTL value available.
                      </Label>
                    </TabsContent>
                  </Tabs>
                ) : null}

                {/* Verification Instructions for already vercel assigned domains */}
                {domainData.verification !== undefined ? (
                  <div className='flex max-w-[600px] flex-col space-y-2'>
                    <Label className='text-foreground/80 cursor-text select-text pt-1 text-sm '>
                      To prove ownership of{' '}
                      <span
                        className={`${fontMono.variable} bg-background font-monospace rounded px-1 py-0.5`}>
                        {domainData.apexName}
                      </span>
                      , please add the following TXT Record to your DNS settings.
                    </Label>

                    {/* Info Table */}
                    <div className='bg-background my-3 overflow-x-auto rounded border px-5 py-3'>
                      {/* Type */}
                      <div className='flex flex-row gap-3'>
                        <div className='flex w-full flex-col justify-start gap-2'>
                          <Label className='text-foreground/90 text-sm '>Type</Label>
                          <span className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                            TXT
                          </span>
                        </div>
                        <div className='flex w-full flex-col justify-start gap-2'>
                          <Label className='text-foreground/90 text-sm '>Name</Label>
                          <button
                            className='group flex cursor-pointer flex-row items-center justify-between space-x-2'
                            onClick={() => {
                              handleCopyToClipboard(domainData.verification[0].domain);
                            }}
                            type='button'>
                            <span
                              className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                              {domainData.verification[0].domain}
                            </span>

                            {hasCopied.includes(domainData.verification[0].domain) ? (
                              <CheckIcon className='h-4 w-4 shrink-0 text-green-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                            ) : (
                              <ClipboardList className='text-foreground/70 h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                            )}
                          </button>
                        </div>
                        <div className='flex w-full flex-col justify-start gap-2'>
                          <Label className='text-foreground/90 text-sm '>Value</Label>

                          <button
                            className='group flex cursor-pointer flex-row items-center justify-between space-x-2'
                            onClick={() => {
                              handleCopyToClipboard(domainData.verification[0].value);
                            }}
                            type='button'>
                            <span
                              className={`${fontMono.variable} font-monospace text-foreground/70 text-sm `}>
                              {domainData.verification[0].value}
                            </span>

                            {hasCopied.includes(domainData.verification[0].value) ? (
                              <CheckIcon className='h-4 w-4 shrink-0 text-green-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                            ) : (
                              <ClipboardList className='text-foreground/70 h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100' />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    <Label className='text-foreground/80 cursor-text select-text text-sm '>
                      Warning: If{' '}
                      <span
                        className={`${fontMono.variable} bg-background font-monospace rounded px-1 py-0.5`}>
                        {domainData.apexName}
                      </span>{' '}
                      is already in use, the TXT Record will transfer away from the existing domain ownership
                      and break the site. Consider using a subdomain instead.
                    </Label>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </SettingsCard>
  );
}
