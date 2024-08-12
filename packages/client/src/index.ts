import { _request, AuthError } from '../lib/fetch';
import { ChangelogsResponse } from '../lib/types';

/**
 * Represents the Feedbase class for interacting with the Feedbase API.
 */
export class Feedbase {
  public readonly baseUrl: string;
  public readonly slug: string;
  private readonly token: string;

  /**
   * @param slug - The slug of the workspace to access.
   * @param token - The authentication token for accessing the Feedbase API.
   * @param baseUrl - (Optional) The base URL of the Feedbase API. Defaults to 'https://dash.feedbase.app'.
   */
  constructor(slug: string, token: string, baseUrl?: string) {
    this.slug = slug;
    this.baseUrl = baseUrl ?? 'https://dash.feedbase.app';

    // Make sure the token is not empty
    if (!token) {
      throw new Error('Feedbase token must not be empty');
    }
    this.token = token;
  }

  /**
   * Gets the public changelogs for the workspace.
   *
   * @returns A promise that resolves to the changelogs for the workspace.
   */
  public async getChangelogs(): Promise<ChangelogsResponse> {
    try {
      const res = await _request(`${this.baseUrl}/api/v1/${this.slug}/changelogs`, 'GET');

      if (res.status !== 200) {
        if (res.status === 401 || res.status === 403) {
          throw new AuthError(res.data.error);
        }
        console.error(res);
        throw new Error(res.data.error);
      }

      return { data: { changelogs: res.data }, error: null };
    } catch (err: any) {
      console.error(err);

      return { data: { changelogs: null }, error: { name: err.name, message: err.message } };
    }
  }

  /**
   * Submit feedback for the workspace.
   *
   * @param title - The title of the feedback.
   * @param content - The feedback content.
   * @param email - The email of the user submitting the feedback.
   * @param fullName - The full name of the user submitting the feedback.
   * @param avatarUrl - The avatar URL of the user submitting the feedback.
   * @returns A promise that resolves to the feedback.
   */
  public async submitFeedback(
    title: string,
    content: string,
    email: string,
    fullName?: string,
    avatarUrl?: string
  ) {
    try {
      const res = await _request(
        `${this.baseUrl}/api/v1/workspaces/${this.slug}/feedback`,
        'POST',
        this.token,
        {
          title,
          content,
          user: {
            email,
            full_name: fullName,
            avatar_url: avatarUrl,
          },
        }
      );

      if (res.status !== 200) {
        if (res.status === 401 || res.status === 403) {
          throw new AuthError(res.data.error);
        }
        console.error(res);
        throw new Error(res.data.error);
      }

      return { data: { feedback: res.data }, error: null };
    } catch (err: any) {
      console.error(err);

      return { data: { feedback: null }, error: { name: err.name, message: err.message } };
    }
  }
}
