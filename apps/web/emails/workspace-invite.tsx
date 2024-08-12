import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { formatRootUrl } from '@/lib/utils';

interface WorkspaceInviteEmailProps {
  email: string;
  invitedByFullName: string;
  invitedByEmail: string;
  workspaceName: string;
  inviteLink: string;
}

export default function WorkspaceInviteEmail({
  email,
  invitedByFullName,
  invitedByEmail,
  workspaceName,
  inviteLink,
}: WorkspaceInviteEmailProps) {
  const previewText = `Join ${workspaceName} on Feedbase`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='mx-auto my-auto bg-white font-sans'>
          <Container className='mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]'>
            <Section className='mt-8'>
              <Img
                src={`${formatRootUrl()}/icon-512x512.png`}
                width='40'
                height='40'
                alt='Feedbase'
                className='mx-auto my-0 rounded-md'
              />
            </Section>
            <Heading className='mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black'>
              Join <strong>{workspaceName}</strong> on <strong>Feedbase</strong>
            </Heading>
            <Text className='text-[14px] leading-[24px] text-black'>
              <strong>{invitedByFullName}</strong> (
              <Link href={`mailto:${invitedByEmail}`} className='text-blue-600 no-underline'>
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{workspaceName}</strong> team on <strong>Feedbase</strong>.
            </Text>
            <Section className='mb-[32px] mt-[32px] text-center'>
              <Button
                className='rounded-md bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline'
                href={inviteLink}>
                Join the team
              </Button>
            </Section>
            <Text className='text-[14px] leading-[24px] text-black'>
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className='text-blue-600 no-underline'>
                {inviteLink}
              </Link>
            </Text>
            <Hr className='mx-0 my-[26px] w-full border border-solid border-[#eaeaea]' />
            <Text className='text-[12px] leading-[24px] text-[#666666]'>
              This invitation was intended for <span className='text-black'>{email}</span>. If you were not
              expecting this invitation, you can ignore this email. If you are concerned about your
              account&apos;s safety, please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
