// 'use client';

// import { useCallback, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@feedbase/ui/components/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@feedbase/ui/components/card';
// import { Input } from '@feedbase/ui/components/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@feedbase/ui/components/select';
// import { Switch } from '@feedbase/ui/components/switch';
// import { cn } from '@feedbase/ui/lib/utils';
// import { Label } from '@radix-ui/react-label';
// import { Check, Download, Pen } from 'lucide-react';
// import { toast } from 'sonner';
// import { WorkspaceConfigWithoutSecretProps, WorkspaceProps } from '@/lib/types';
// import FileDrop from '@/components/shared/file-drop';
// import CustomizeThemeModal from '../modals/add-custom-theme-modal';

// export default function HubConfigCards({
//   workspaceData,
//   workspaceConfigData,
// }: {
//   workspaceData: WorkspaceProps['Row'];
//   workspaceConfigData: WorkspaceConfigWithoutSecretProps;
// }) {
//   const [workspace, setWorkspace] = useState<WorkspaceProps['Row']>(workspaceData);
//   const [workspaceConfig, setWorkspaceConfig] =
//     useState<WorkspaceConfigWithoutSecretProps>(workspaceConfigData);
//   const [ogImage, setOgImage] = useState<string | null>(workspaceConfig.workspace_og_image || null);
//   const router = useRouter();

//   async function handleSaveWorkspace(noToast?: boolean) {
//     const promise = new Promise((resolve, reject) => {
//       fetch(`/api/v1/workspaces/${workspaceData.slug}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         // Pass only the changed values
//         body: JSON.stringify({
//           icon: workspace.icon !== workspaceData.icon ? workspace.icon : undefined,
//           icon_radius:
//             workspace.icon_radius !== workspaceData.icon_radius ? workspace.icon_radius : undefined,
//           og_image: ogImage !== workspaceData.og_image ? ogImage : undefined,
//         }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.error) {
//             reject(data.error);
//           } else {
//             resolve(data);
//           }
//         })
//         .catch((err) => {
//           reject(err.message);
//         });
//     });

//     if (!noToast) {
//       toast.promise(promise, {
//         loading: 'Updating workspace...',
//         success: 'Workspace updated successfully.',
//         error: (err) => {
//           return err;
//         },
//       });
//     }

//     promise.then(() => {
//       router.refresh();
//     });
//   }

//   // handle save workspace config
//   async function handleSaveWorkspaceConfig() {
//     const promise = new Promise((resolve, reject) => {
//       fetch(`/api/v1/workspaces/${workspaceData.slug}/config`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         // Pass only the changed values
//         body: JSON.stringify({
//           changelog_twitter_handle:
//             workspaceConfig.changelog_twitter_handle !== workspaceConfigData.changelog_twitter_handle
//               ? workspaceConfig.changelog_twitter_handle
//               : undefined,
//           changelog_preview_style:
//             workspaceConfig.changelog_preview_style !== workspaceConfigData.changelog_preview_style
//               ? workspaceConfig.changelog_preview_style
//               : undefined,
//           feedback_allow_anon_upvoting:
//             workspaceConfig.feedback_allow_anon_upvoting !== workspaceConfigData.feedback_allow_anon_upvoting
//               ? workspaceConfig.feedback_allow_anon_upvoting
//               : undefined,
//           workspace_theme:
//             workspaceConfig.workspace_theme !== workspaceConfigData.workspace_theme
//               ? workspaceConfig.workspace_theme
//               : undefined,
//           custom_theme_root:
//             workspaceConfig.custom_theme_root !== workspaceConfigData.custom_theme_root
//               ? workspaceConfig.custom_theme_root
//               : undefined,
//           custom_theme_primary_foreground:
//             workspaceConfig.custom_theme_primary_foreground !==
//             workspaceConfigData.custom_theme_primary_foreground
//               ? workspaceConfig.custom_theme_primary_foreground
//               : undefined,
//           custom_theme_background:
//             workspaceConfig.custom_theme_background !== workspaceConfigData.custom_theme_background
//               ? workspaceConfig.custom_theme_background
//               : undefined,
//           custom_theme_secondary_background:
//             workspaceConfig.custom_theme_secondary_background !==
//             workspaceConfigData.custom_theme_secondary_background
//               ? workspaceConfig.custom_theme_secondary_background
//               : undefined,
//           custom_theme_accent:
//             workspaceConfig.custom_theme_accent !== workspaceConfigData.custom_theme_accent
//               ? workspaceConfig.custom_theme_accent
//               : undefined,
//           custom_theme_border:
//             workspaceConfig.custom_theme_border !== workspaceConfigData.custom_theme_border
//               ? workspaceConfig.custom_theme_border
//               : undefined,
//           logo_redirect_url:
//             workspaceConfig.logo_redirect_url !== workspaceConfigData.logo_redirect_url
//               ? workspaceConfig.logo_redirect_url
//               : undefined,
//           changelog_enabled:
//             workspaceConfig.changelog_enabled !== workspaceConfigData.changelog_enabled
//               ? workspaceConfig.changelog_enabled
//               : undefined,
//         }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.error) {
//             reject(data.error);
//           } else {
//             resolve(data);
//           }
//         })
//         .catch((err) => {
//           reject(err.message);
//         });
//     });

//     toast.promise(promise, {
//       loading: 'Updating workspace...',
//       success: 'Workspace updated successfully.',
//       error: (err) => {
//         return err;
//       },
//     });

//     promise.then(() => {
//       router.refresh();
//     });
//   }

//   // Handle download subscribers
//   async function handleDownloadSubscribers() {
//     const promise = new Promise((resolve, reject) => {
//       fetch(`/api/v1/workspaces/${workspaceData.slug}/changelogs/subscribers`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then((res) => res.blob())
//         .then((blob) => {
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement('a');
//           a.href = url;
//           a.download = `subscribers-${workspaceData.slug}.csv`;
//           a.click();
//           resolve(true);
//         })
//         .catch((err) => {
//           reject(err.message);
//         });
//     });

//     toast.promise(promise, {
//       loading: 'Fetching subscribers...',
//       success: 'Download is ready.',
//       error: (err) => {
//         return err;
//       },
//     });
//   }

//   const onChangePicture = useCallback(
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     (e: any) => {
//       // setFileError(null);
//       const file = e.target.files[0];
//       if (file) {
//         if (file.size / 1024 / 1024 > 5) {
//           // setFileError('File size too big (max 5MB)');
//         } else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
//           // setFileError('File type not supported.');
//         } else {
//           const reader = new FileReader();
//           reader.onload = (e) => {
//             setWorkspace((prev) => ({ ...prev, icon: e.target?.result as string }));
//           };
//           reader.readAsDataURL(file);
//         }
//       }
//     },
//     [setWorkspace]
//   );

//   // Set the workspace data to the new one (Due to data://urls)
//   useEffect(() => {
//     setWorkspace((prev) => ({ ...prev, icon: workspaceData.icon }));
//     setOgImage(workspaceData.og_image || null);
//   }, [workspaceData.icon, workspaceData.og_image]);

//   return (
//     <>
//       {/* Theme Card */}
//       <Card className='flex w-full flex-col '>
//         <CardHeader>
//           <CardTitle>Branding</CardTitle>
//           <CardDescription>Configure your workspace&apos;s branding.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* Name & Slug Config */}
//           <div className='flex h-full w-full flex-col space-y-3'>
//             {/* Workspace Logo */}
//             <div className='flex h-full w-full flex-col space-y-4'>
//               <div className='space-y-1'>
//                 <Label className='text-foreground/70 text-sm '>Logo</Label>

//                 {/* File Upload */}
//                 <div className='group flex h-16 w-16 items-center justify-center transition-all'>
//                   <label
//                     htmlFor='dropzone-file'
//                     className={cn(
//                       'bg-background hover:bg-background/90 group-hover:bg-background/90 flex h-full w-full cursor-pointer flex-col items-center justify-center border',
//                       workspace.icon_radius
//                     )}>
//                     <p className='text-foreground/70 absolute hidden text-xs group-hover:block group-hover:transition-all group-hover:duration-300 '>
//                       Upload
//                     </p>
//                     {/* <Image src='/favicon.ico' alt='Logo' width={40} height={40} className='h-full w-full rounded-md object-cover group-hover:opacity-0' /> */}
//                     {/* TODO: Find a way to disable caching for next/image and use that */}
//                     {workspace.icon ? (
//                       <img
//                         src={workspace.icon}
//                         alt='Preview'
//                         width={40}
//                         height={40}
//                         className={cn(
//                           'h-full w-full object-cover group-hover:opacity-0',
//                           workspace.icon_radius
//                         )}
//                       />
//                     ) : (
//                       <p className='text-foreground/70 absolute text-xs group-hover:hidden'>Upload</p>
//                     )}
//                     <input id='dropzone-file' type='file' className='hidden' onChange={onChangePicture} />
//                   </label>
//                 </div>

//                 <Label className='text-foreground/50 text-xs'>Recommended size is 256x256.</Label>
//               </div>
//             </div>

//             <div className='space-y-1'>
//               <Label className='text-foreground/70 text-sm '>Logo Radius</Label>
//               <div className='flex h-10 w-full flex-row space-x-2'>
//                 <Select
//                   defaultValue={workspace.icon_radius || 'rounded-md'}
//                   onValueChange={(value) => {
//                     setWorkspace((prev) => ({ ...prev, icon_radius: value }));
//                   }}>
//                   <SelectTrigger className='w-[160px] text-sm'>
//                     <SelectValue placeholder='Select a radius' />
//                   </SelectTrigger>
//                   <SelectContent className=''>
//                     <SelectItem value='rounded-md'>Rounded</SelectItem>
//                     <SelectItem value='rounded-none'>Square</SelectItem>
//                     <SelectItem value='rounded-full'>Circle</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Label className='text-foreground/50 text-xs'>This is the radius of your logo.</Label>
//             </div>

//             {/* OG Image */}
//             <div className='max-w-xs space-y-1'>
//               <FileDrop
//                 labelComponent={<Label className='text-foreground/70 text-sm '>OG Image</Label>}
//                 image={ogImage}
//                 setImage={setOgImage}
//               />

//               <Label className='text-foreground/50 text-xs'>
//                 The OG Image used when sharing your workspace.
//               </Label>
//             </div>

//             {/* Theme */}
//             <div className='space-y-2'>
//               <Label className='text-foreground/70 text-sm '>Theme</Label>
//               <div className='flex h-10 w-full flex-row gap-3'>
//                 <Button
//                   size='icon'
//                   className={cn(
//                     'bg-root hover:bg-root h-7 w-7 rounded-full border',
//                     workspaceConfig.workspace_theme === 'default' && 'ring-border ring-2 ring-offset-2'
//                   )}
//                   onClick={() => {
//                     setWorkspaceConfig((prev) => ({ ...prev, workspace_theme: 'default' }));
//                   }}>
//                   {workspaceConfig.workspace_theme === 'default' && (
//                     <Check className='text-foreground h-3.5 w-3.5' />
//                   )}
//                   <span className='sr-only'>Light</span>
//                 </Button>

//                 <Button
//                   size='icon'
//                   className={cn(
//                     'h-7 w-7 rounded-full',
//                     workspaceConfig.workspace_theme === 'light' && 'ring-foreground ring-2 ring-offset-2'
//                   )}
//                   onClick={() => {
//                     setWorkspaceConfig((prev) => ({ ...prev, workspace_theme: 'light' }));
//                   }}>
//                   {workspaceConfig.workspace_theme === 'light' && <Check className='h-3.5 w-3.5 text-black' />}
//                   <span className='sr-only'>Light</span>
//                 </Button>

//                 <CustomizeThemeModal
//                   workspaceConfig={workspaceConfig}
//                   setWorkspaceConfig={setWorkspaceConfig}>
//                   <Button
//                     size='icon'
//                     variant='outline'
//                     className={cn(
//                       'h-7 w-7 rounded-full',
//                       workspaceConfig.workspace_theme === 'custom' && 'ring-input ring-2 ring-offset-2'
//                     )}>
//                     <Pen className='text-foreground h-3 w-3' />
//                   </Button>
//                 </CustomizeThemeModal>
//               </div>

//               <Label className='text-foreground/50 text-xs'>
//                 This will only be applied to your public hub.
//               </Label>

//               <div className='space-y-1'>
//                 <Label className='text-foreground/70 text-sm '>Logo Redirect Url</Label>
//                 <Input
//                   className='w-full max-w-xs'
//                   placeholder='https://example.com'
//                   value={workspaceConfig.logo_redirect_url || ''}
//                   onChange={(e) => {
//                     setWorkspaceConfig((prev) => ({ ...prev, logo_redirect_url: e.target.value }));
//                   }}
//                 />
//                 <Label className='text-foreground/50 text-xs'>
//                   The url to redirect to when clicking on the logo. (Blank to disable)
//                 </Label>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button
//             className='w-32'
//             disabled={
//               (workspace.icon === workspaceData.icon || (!workspace.icon && !workspaceData.icon)) &&
//               workspace.icon_radius === workspaceData.icon_radius &&
//               (ogImage === workspaceData.og_image || (!ogImage && !workspaceData.og_image)) &&
//               workspaceConfig.workspace_theme === workspaceConfigData.workspace_theme &&
//               workspaceConfig.custom_theme_root === workspaceConfigData.custom_theme_root &&
//               workspaceConfig.custom_theme_primary_foreground ===
//                 workspaceConfigData.custom_theme_primary_foreground &&
//               workspaceConfig.custom_theme_background === workspaceConfigData.custom_theme_background &&
//               workspaceConfig.custom_theme_secondary_background ===
//                 workspaceConfigData.custom_theme_secondary_background &&
//               workspaceConfig.custom_theme_accent === workspaceConfigData.custom_theme_accent &&
//               workspaceConfig.custom_theme_border === workspaceConfigData.custom_theme_border &&
//               workspaceConfig.logo_redirect_url === workspaceConfigData.logo_redirect_url
//             }
//             onClick={() => {
//               // If both changed, save both
//               if (
//                 !(
//                   (workspace.icon === workspaceData.icon || (!workspace.icon && !workspaceData.icon)) &&
//                   workspace.icon_radius === workspaceData.icon_radius &&
//                   (ogImage === workspaceData.og_image || (!ogImage && !workspaceData.og_image))
//                 ) &&
//                 !(
//                   workspaceConfig.workspace_theme === workspaceConfigData.workspace_theme &&
//                   workspaceConfig.custom_theme_root === workspaceConfigData.custom_theme_root &&
//                   workspaceConfig.custom_theme_primary_foreground ===
//                     workspaceConfigData.custom_theme_primary_foreground &&
//                   workspaceConfig.custom_theme_background === workspaceConfigData.custom_theme_background &&
//                   workspaceConfig.custom_theme_secondary_background ===
//                     workspaceConfigData.custom_theme_secondary_background &&
//                   workspaceConfig.custom_theme_accent === workspaceConfigData.custom_theme_accent &&
//                   workspaceConfig.custom_theme_border === workspaceConfigData.custom_theme_border &&
//                   workspaceConfig.logo_redirect_url === workspaceConfigData.logo_redirect_url
//                 )
//               ) {
//                 handleSaveWorkspaceConfig();
//                 handleSaveWorkspace(true);
//                 return;
//               }

//               // If only theme changed, save only the theme
//               if (
//                 (workspace.icon === workspaceData.icon || (!workspace.icon && !workspaceData.icon)) &&
//                 workspace.icon_radius === workspaceData.icon_radius &&
//                 (ogImage === workspaceData.og_image || (!ogImage && !workspaceData.og_image))
//               ) {
//                 handleSaveWorkspaceConfig();
//               } else {
//                 // If only workspace changed, save only the workspace
//                 handleSaveWorkspace();
//               }
//             }}>
//             Save changes
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* Changelog */}
//       <Card className='flex w-full flex-col '>
//         <CardHeader className='flex flex-row items-center justify-between space-y-0'>
//           <div className='flex flex-col gap-1.5'>
//             <CardTitle>Changelog</CardTitle>
//             <CardDescription>Configure your workspace&apos;s changelog.</CardDescription>
//           </div>

//           <div className='flex flex-row items-center gap-2'>
//             <Label
//               className={cn(
//                 'text-sm ',
//                 workspaceConfig.changelog_enabled ? 'text-text-foreground' : 'text-muted-foreground'
//               )}>
//               {workspaceConfig.changelog_enabled ? 'Enabled' : 'Disabled'}
//             </Label>
//             <Switch
//               checked={workspaceConfig.changelog_enabled}
//               onCheckedChange={() => {
//                 setWorkspaceConfig((prev) => ({ ...prev, changelog_enabled: !prev.changelog_enabled }));
//               }}
//             />
//           </div>
//         </CardHeader>
//         <CardContent className='flex flex-col space-y-4'>
//           {/* Name & Slug Config */}
//           <div className='flex h-full w-full flex-col space-y-3'>
//             <div className='space-y-1'>
//               <Label className='text-foreground/70 text-sm '>Twitter</Label>
//               <div
//                 className={cn(
//                   'bg-background focus-within:ring-ring ring-offset-root flex h-8 w-full max-w-xs rounded-md border text-sm transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1',
//                   !workspaceConfig.changelog_enabled && 'opacity-50'
//                 )}>
//                 <div className='text-foreground/50 bg-accent flex select-none items-center justify-center rounded-l-md border-r px-3'>
//                   @
//                 </div>
//                 <Input
//                   className='h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
//                   placeholder='username'
//                   disabled={!workspaceConfig.changelog_enabled}
//                   value={workspaceConfig.changelog_twitter_handle || ''}
//                   onChange={(e) => {
//                     setWorkspaceConfig((prev) => ({ ...prev, changelog_twitter_handle: e.target.value }));
//                   }}
//                 />
//               </div>
//               <Label className='text-foreground/50 text-xs'>
//                 Twitter handle linked in your changelog. (Blank to disable)
//               </Label>
//             </div>
//           </div>

//           {/* Preview Style */}
//           <div className='space-y-1'>
//             <Label className='text-foreground/70 text-sm '>Preview Style</Label>
//             <div className='flex h-10 w-full flex-row space-x-2'>
//               <Select
//                 disabled={!workspaceConfig.changelog_enabled}
//                 defaultValue={workspaceConfig.changelog_preview_style || 'rounded-md'}
//                 onValueChange={(value) => {
//                   // Set the value
//                   setWorkspaceConfig((prev) => ({ ...prev, changelog_preview_style: value }));
//                 }}>
//                 <SelectTrigger className='max-w-xs text-sm'>
//                   <SelectValue placeholder='Select a style' />
//                 </SelectTrigger>
//                 <SelectContent className=''>
//                   <SelectItem value='summary'>Summary</SelectItem>
//                   <SelectItem value='content'>Content</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <Label className='text-foreground/50 text-xs '>
//               Whether to show summary or content as preview.
//             </Label>
//           </div>

//           {/* Download Email Audience */}
//           <div className='flex flex-col space-y-1'>
//             <Label className='text-foreground/70 text-sm '>Email Subscribers</Label>
//             <Button
//               variant='outline'
//               className='text-foreground/70 w-[160px] '
//               onClick={handleDownloadSubscribers}>
//               <Download className='mr-2 h-4 w-4' />
//               Download List
//             </Button>
//             <Label className='text-foreground/50 text-xs '>Download a list of your changelog audience.</Label>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button
//             className='w-32'
//             disabled={
//               // If the values are the same as the ones in the database or if they are empty
//               workspaceConfig.changelog_preview_style === workspaceConfigData.changelog_preview_style &&
//               workspaceConfig.changelog_twitter_handle === workspaceConfigData.changelog_twitter_handle &&
//               workspaceConfig.changelog_enabled === workspaceConfigData.changelog_enabled
//             }
//             onClick={handleSaveWorkspaceConfig}>
//             Save changes
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* Feedback */}
//       <Card className='flex w-full flex-col '>
//         <CardHeader>
//           <CardTitle>Feedback</CardTitle>
//           <CardDescription>Configure your workspace&apos;s feedback.</CardDescription>
//         </CardHeader>
//         <CardContent className='flex flex-col space-y-4'>
//           {/* Anonymous Feedback */}
//           <div className='space-y-1'>
//             <Label className='text-foreground/70 text-sm '>Anonymous Feedback Upvoting</Label>
//             <div className='flex h-10 w-full flex-row space-x-2'>
//               <Select
//                 defaultValue={workspaceConfig.feedback_allow_anon_upvoting ? 'true' : 'false'}
//                 onValueChange={(value) => {
//                   // Set the value
//                   setWorkspaceConfig((prev) => ({ ...prev, feedback_allow_anon_upvoting: value === 'true' }));
//                 }}>
//                 <SelectTrigger className='max-w-xs text-sm '>
//                   <SelectValue placeholder='Select a style' />
//                 </SelectTrigger>
//                 <SelectContent className=''>
//                   <SelectItem value='true'>Enabled</SelectItem>
//                   <SelectItem value='false'>Disabled</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <Label className='text-foreground/50 text-xs '>
//               Whether to allow anonymous feedback upvoting.
//             </Label>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button
//             className='w-32'
//             disabled={
//               // If the values are the same as the ones in the database or if they are empty
//               workspaceConfig.feedback_allow_anon_upvoting ===
//               workspaceConfigData.feedback_allow_anon_upvoting
//             }
//             onClick={handleSaveWorkspaceConfig}>
//             Save changes
//           </Button>
//         </CardFooter>
//       </Card>
//     </>
//   );
// }
