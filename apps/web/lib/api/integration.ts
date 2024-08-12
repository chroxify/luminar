import { withWorkspaceAuth } from '../auth';
import { WorkspaceIntegrationProps } from '../types';

// Get workspace integrations by slug
export const getWorkspaceIntegrations = withWorkspaceAuth<WorkspaceIntegrationProps['Row']>(
  async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get workspace config
    const { data: integrations, error: integrationsError } = await supabase
      .from('workspace_integration')
      .select()
      .eq('workspace_id', workspace!.id)
      .single();

    // Check for errors
    if (integrationsError) {
      return { data: null, error: { message: integrationsError.message, status: 500 } };
    }

    // Return integrations
    return { data: integrations, error: null };
  }
);

// Update workspace integrations by slug
export const updateWorkspaceIntegrations = (
  slug: string,
  data: WorkspaceIntegrationProps['Update'],
  cType: 'server' | 'route'
) =>
  withWorkspaceAuth<WorkspaceIntegrationProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Update workspace integrations
    const { data: updatedIntegrations, error: updateError } = await supabase
      .from('workspace_integration')
      .update(data)
      .eq('workspace_id', workspace!.id)
      .single();

    // Check for errors
    if (updateError) {
      return { data: null, error: { message: updateError.message, status: 500 } };
    }

    // Return updated integrations
    return { data: updatedIntegrations, error: null };
  })(slug, cType);

// TODO: Move this to trigger.dev
// // Helper function to send a Discord notification
// export const sendDiscordNotification = async (
//   feedback: FeedbackWithUserProps,
//   workspace: WorkspaceProps['Row'],
//   workspaceConfig: WorkspaceConfigWithoutSecretProps
// ) => {
//   // Convert html syntax to markdown
//   const markdownString = formatHtmlToMd(feedback.content);

//   // Use an HTTP library or a Discord library to send the notification
//   const response = await fetch(workspaceConfig.integration_discord_webhook!, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       username: `${workspace.name} | Feedback`,
//       // TODO!!!: Currently borken cz .icon not on workspace naymore but rather on workspace_config
//       // avatar_url: workspace.icon ? workspace.icon : 'https://feedbase.app/icon-512x512.png',
//       content: workspaceConfig.integration_discord_role_id
//         ? `<@&${workspaceConfig.integration_discord_role_id}>`
//         : '',
//       embeds: [
//         {
//           title: 'New Feedback Submission!',
//           description: "You've received a new feedback submission.",
//           url: formatRootUrl(workspace.slug, `/feedback/${feedback.id}`),
//           color: 0x05060a,
//           fields: [
//             {
//               name: 'Title',
//               value: `\`\`\`${feedback.title}\`\`\``,
//               inline: true,
//             },
//             {
//               name: 'Description',
//               value: `\`\`\`markdown\n${markdownString}\`\`\``,
//               inline: false,
//             },
//           ],
//           author: {
//             name: feedback.user.full_name,
//             icon_url: feedback.user.avatar_url,
//           },
//           footer: {
//             text: 'Powered By Feedbase',
//             icon_url: 'https://feedbase.app/icon-512x512.png',
//           },
//         },
//       ],
//     }),
//   });

//   // Return response
//   return response;
// };

// // Helper function to send a Discord confirmation
// export const sendDiscordConfirmation = async (
//   workspaceSlug: string,
//   webhook: string,
//   roleId: string | undefined
// ) => {
//   // Use an HTTP library or a Discord library to send the notification
//   const response = await fetch(webhook, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       username: `Feedbase | Feedback`,
//       avatar_url: 'https://feedbase.app/icon-512x512.png',
//       content: roleId ? `<@&${roleId}>` : '',
//       embeds: [
//         {
//           title: 'Discord Integration Enabled',
//           description: "If you're seeing this, it means that your Discord integration is working correctly.",
//           url: formatRootUrl('dash', `/${workspaceSlug}`),
//           color: 0x05060a,
//         },
//       ],
//     }),
//   });

//   // Return response
//   return response;
// };

// // Helper function to send a Slack notification
// export const sendSlackNotification = async (
//   feedback: FeedbackWithUserProps,
//   workspace: WorkspaceProps['Row'],
//   workspaceConfig: WorkspaceConfigWithoutSecretProps
// ) => {
//   // Convert html syntax to markdown
//   const markdownString = formatHtmlToMd(feedback.content);

//   // Use an HTTP library or a Slack library to send the notification
//   const response = await fetch(workspaceConfig.integration_slack_webhook!, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       attachments: [
//         {
//           title: 'New Feedback Submission!',
//           text: "You've received a new feedback submission.",
//           color: '#05060a',
//           title_link: formatRootUrl(workspace.slug, `/feedback/${feedback.id}`),
//           fields: [
//             {
//               title: 'Title',
//               value: `\`\`\`${feedback.title}\`\`\``,
//               short: true,
//             },
//             {
//               title: 'Description',
//               value: `\`\`\`${markdownString}\`\`\``,
//               short: false,
//             },
//           ],
//           author_name: feedback.user.full_name,
//           author_icon: feedback.user.avatar_url,
//           footer: 'Powered By Feedbase',
//           footer_icon: 'https://feedbase.app/icon-512x512.png',
//           ts: Math.floor(Date.now() / 1000),
//         },
//       ],
//     }),
//   });

//   // Return response
//   return response;
// };

// // Helper function to send a Slack confirmation
// export const sendSlackConfirmation = async (workspaceSlug: string, webhook: string) => {
//   // Use an HTTP library or a Slack library to send the notification
//   const response = await fetch(webhook, {
//     method: 'POST',
//     body: JSON.stringify({
//       attachments: [
//         {
//           title: 'Slack Integration Enabled',
//           text: "If you're seeing this, it means that your Slack integration is working correctly.",
//           color: '#05060a',
//           title_link: formatRootUrl('dash', `/${workspaceSlug}`),
//           footer: 'Powered By Feedbase',
//           footer_icon: 'https://feedbase.app/icon-512x512.png',
//           ts: Math.floor(Date.now() / 1000),
//         },
//       ],
//     }),
//   });

//   // Return response
//   return response;
// };
