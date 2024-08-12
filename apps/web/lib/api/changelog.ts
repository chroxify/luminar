import { internal_runWithWaitUntil as waitUntil } from 'next/dist/server/web/internal-edge-wait-until';
import { sendBatchEmails } from '@/emails';
import ChangelogEmail from '@/emails/changelog-email';
import { PostgrestError } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import { withWorkspaceAuth } from '@/lib/auth';
import { ChangelogProps, ChangelogWithAuthorProps, ProfileProps, WorkspaceProps } from '@/lib/types';
import { formatRootUrl, isSlugValid } from '../utils';

// Create Changelog
export const createChangelog = (
  slug: string,
  data: ChangelogProps['Insert'],
  notifySubscribers: boolean,
  cType: 'server' | 'route'
) =>
  withWorkspaceAuth<ChangelogProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // If theres a thumbnail, which is a base64 string, upload it
    if (data.thumbnail && data.thumbnail.startsWith('data:image/')) {
      // Create unique image path
      const imagePath = `${workspace!.slug}/changelog/${Math.random().toString(36).substring(7)}`;

      const { error: uploadError } = await supabase.storage
        .from('workspace')
        // workspace.slug/changelog/random-string
        .upload(imagePath, decode(data.thumbnail.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('workspace').getPublicUrl(imagePath);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading image', status: 500 } };
      }

      // Set image to public URL
      data.thumbnail = publicUrlData.publicUrl;
    }

    // Convert title to slug
    if (data.title && !isSlugValid(data.title)) {
      // Remove invalid characters
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/ /g, '-');
    }

    // Create Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelog')
      .insert({
        workspace_id: workspace!.id,
        slug: data.slug,
        author_id: user!.id,
        title: data.title,
        summary: data.summary,
        content: data.content,
        image: data.thumbnail,
        published: data.published,
      })
      .select();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    }

    // Send email to subscribers
    if (data.published && notifySubscribers) {
      waitUntil(async () => {
        // Get subscribers
        const { data: subscribers, error: subscribersError } = await supabase
          .from('changelog_subscriber')
          .select('id, email')
          .eq('workspace_id', workspace!.id);

        // Check for errors
        if (subscribersError) {
          return { data: null, error: { message: subscribersError.message, status: 500 } };
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profile')
          .select()
          .eq('id', user!.id)
          .single();

        // Check for errors
        if (profileError) {
          return { data: null, error: { message: profileError.message, status: 500 } };
        }

        // Send email
        await sendChangelogEmail(subscribers, workspace!, changelog[0], profile);
      });
    }

    // Return workspace
    return { data: changelog[0], error: null };
  })(slug, cType);

// Get All Workspace Changelogs
export const getAllWorkspaceChangelogs = withWorkspaceAuth<ChangelogWithAuthorProps[]>(
  async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get Changelogs
    const { data: changelogs, error: changelogsError } = (await supabase
      .from('changelog')
      .select('*, author:profile (full_name, avatar_url)')
      .eq('workspace_id', workspace!.id)) as {
      data: ChangelogWithAuthorProps[];
      error: PostgrestError | null;
    };

    // Check for errors
    if (changelogsError) {
      return { data: null, error: { message: changelogsError.message, status: 500 } };
    }

    // Restructure data
    // const restructuredData = changelogs.map((changelog) => {
    //   // Destructure profiles from changelog
    //   const { profiles, ...restOfChangelog } = changelog;

    //   return {
    //     ...restOfChangelog,
    //     author: {
    //       id: changelog.profiles?.id,
    //       email: changelog.profiles?.email,
    //       full_name: changelog.profiles?.full_name,
    //       avatar_url: changelog.profiles?.avatar_url,
    //     },
    //   };
    // }) as ChangelogWithAuthorProps[];

    // Return changelogs
    return { data: changelogs, error: null };
  }
);

// Get Changelog by ID
export const getChangelogByID = (id: string, slug: string, cType: 'server' | 'route') =>
  withWorkspaceAuth<ChangelogWithAuthorProps>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get Changelog
    const { data: changelog, error: changelogError } = (await supabase
      .from('changelog')
      .select('*, author:profile (full_name, avatar_url)')
      .eq('id', id)
      .single()) as {
      data: ChangelogWithAuthorProps;
      error: PostgrestError | null;
    };

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    }

    // Destructure profiles from changelog
    // const { profiles, ...restOfChangelog } = changelog;

    // // Restructure data
    // const restructuredData = {
    //   ...restOfChangelog,
    //   author: {
    //     id: changelog.profiles?.id,
    //     email: changelog.profiles?.email,
    //     full_name: changelog.profiles?.full_name,
    //     avatar_url: changelog.profiles?.avatar_url,
    //   },
    // } as ChangelogWithAuthorProps;

    // Return changelog
    return { data: changelog, error: null };
  })(slug, cType);

// Update Changelog
export const updateChangelog = (
  id: string,
  slug: string,
  data: ChangelogProps['Update'],
  cType: 'server' | 'route'
) =>
  withWorkspaceAuth<ChangelogProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // If theres an image, which is a base64 string, upload it
    if (data.thumbnail && data.thumbnail.startsWith('data:image/')) {
      // Create unique image path
      const imagePath = `${workspace!.slug}/changelog/${Math.random().toString(36).substring(7)}`;

      const { error: uploadError } = await supabase.storage
        .from('workspace')
        .upload(imagePath, decode(data.thumbnail.replace(/^data:image\/\w+;base64,/, '')), {
          contentType: 'image/png',
        });

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('workspace').getPublicUrl(imagePath);

      // Check for errors
      if (!publicUrlData) {
        return { data: null, error: { message: 'issue uploading image', status: 500 } };
      }

      // Set image to public URL
      data.thumbnail = publicUrlData.publicUrl;
    }

    // Convert title to slug
    if (data.title && !isSlugValid(data.title)) {
      // Remove invalid characters
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/ /g, '-');
    }

    // Get current changelog
    const { data: currentChangelog, error: currentChangelogError } = await supabase
      .from('changelog')
      .select()
      .eq('id', id)
      .single();

    // Check for errors
    if (currentChangelogError) {
      return { data: null, error: { message: currentChangelogError.message, status: 500 } };
    } else if (!currentChangelog) {
      return { data: null, error: { message: 'changelog not found', status: 404 } };
    }

    // Check if status has changed to published
    if (data.published && !currentChangelog.published) {
      // Send email to subscribers
      waitUntil(async () => {
        // Get subscribers
        const { data: subscribers, error: subscribersError } = await supabase
          .from('changelog_subscriber')
          .select('id, email')
          .eq('workspace_id', workspace!.id);

        // Check for errors
        if (subscribersError) {
          return { data: null, error: { message: subscribersError.message, status: 500 } };
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profile')
          .select()
          .eq('id', user!.id)
          .single();

        // Check for errors
        if (profileError) {
          return { data: null, error: { message: profileError.message, status: 500 } };
        }

        // Send email
        await sendChangelogEmail(subscribers, workspace!, currentChangelog, profile);
      });
    }

    // Update Changelog
    const { data: changelog, error: changelogError } = await supabase
      .from('changelog')
      .update({
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        image: data.thumbnail,
        published: data.published,
      })
      .eq('id', id)
      .select();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    } else if (!changelog || changelog.length === 0) {
      return { data: null, error: { message: 'changelog not found', status: 404 } };
    }

    // Return changelog
    return { data: changelog[0], error: null };
  })(slug, cType);

// Delete Changelog by ID
export const deleteChangelog = (id: string, slug: string, cType: 'server' | 'route') =>
  withWorkspaceAuth<ChangelogProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Delete Changelog
    const { data: deletedChangelog, error: changelogError } = await supabase
      .from('changelog')
      .delete()
      .eq('id', id)
      .select();

    // Check for errors
    if (changelogError) {
      return { data: null, error: { message: changelogError.message, status: 500 } };
    } else if (!deletedChangelog || deletedChangelog.length === 0) {
      return { data: null, error: { message: 'changelog not found', status: 404 } };
    }

    // Return changelog
    return { data: deletedChangelog[0], error: null };
  })(slug, cType);

// Send changelog email
const sendChangelogEmail = async (
  subscribers: { id: string; email: string }[],
  workspace: WorkspaceProps['Row'],
  data: ChangelogProps['Row'],
  user: ProfileProps['Row']
) => {
  // If no subscribers, return
  if (subscribers.length === 0) {
    return { data: null, error: null };
  }

  // Split subscribers into groups of max. 100
  const subscriberGroups = subscribers.reduce<string[][]>((resultArray, item, index): string[][] => {
    const chunkIndex = Math.floor(index / 100);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item.email);

    return resultArray;
  }, []);

  // Send email to each group
  subscriberGroups.forEach(async (group) => {
    // For each group, create react emails
    const emails = group.map((email) =>
      ChangelogEmail({
        subId: subscribers.find((subscriber) => subscriber.email === email)!.id,
        workspaceSlug: workspace.slug,
        changelog: {
          title: data.title,
          summary: data.summary!,
          content: data.content!,
          thumbnail: data.thumbnail!,
          publish_date: data.created_at,
          slug: data.slug,
          author: {
            full_name: user.full_name,
            avatar_url: user.avatar_url!,
          },
        },
      })
    );

    // Send emails
    const { error: emailError } = await sendBatchEmails({
      emails: group,
      subject: `${workspace.name} Update: ${data.title}`,
      headers: group.map((email) => ({
        'List-Unsubscribe': formatRootUrl(
          workspace.slug,
          `/changelogs/unsubscribe?subId=${subscribers.find((subscriber) => subscriber.email === email)!.id}`
        ),
      })),
      reactEmails: emails,
    }).then((data) => {
      if (data.error) {
        return { data: null, error: { message: data.error.message, status: 500 } };
      }

      return { data, error: null };
    });

    // Check for errors
    if (emailError) {
      return { data: null, error: { message: emailError.message, status: 500 } };
    }
  });
};

// Get changelog subscribers
export const getChangelogSubscribers = (slug: string, cType: 'server' | 'route') =>
  withWorkspaceAuth<{ id: string; email: string }[]>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('changelog_subscriber')
      .select('id, email')
      .eq('workspace_id', workspace!.id);

    // Check for errors
    if (subscribersError) {
      return { data: null, error: { message: subscribersError.message, status: 500 } };
    }

    // Return subscribers
    return { data: subscribers, error: null };
  })(slug, cType);
