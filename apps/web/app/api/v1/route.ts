import { NextResponse } from 'next/server';
import { OpenAPIV3 } from 'openapi-types';

/*
  OpenAPI Documentation
*/
export function GET(): NextResponse<OpenAPIV3.Document> {
  return NextResponse.json({
    openapi: '3.0.0',
    info: {
      title: 'Feedbase API',
      description: 'Feedbase API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://api.feedbase.app/v1',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/{workspaceSlug}/atom': {
        get: {
          description: 'Generate atom feed for workspace changelog',
          operationId: 'getWorkspaceChangelogsAtom',
          security: [],
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/atom+xml': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/{workspaceSlug}/changelogs': {
        get: {
          description: 'Get public workspace changelogs',
          operationId: 'getPublicWorkspaceChangelogs',
          security: [],
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Changelog',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}': {
        get: {
          description: 'Get a workspace by slug',
          operationId: 'getWorkspaceBySlug',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Workspace',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        patch: {
          description: 'Update a workspace by slug',
          operationId: 'updateWorkspaceBySlug',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Workspace object that needs to be updated',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/WorkspaceUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Workspace',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          description: 'Delete a workspace by slug',
          operationId: 'deleteWorkspaceBySlug',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Workspace',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/changelogs': {
        get: {
          description: 'Get all workspace changelogs',
          operationId: 'getWorkspaceChangelogs',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ChangelogWithAuthor',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          description: 'Create workspace changelog',
          operationId: 'createWorkspaceChangelog',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Changelog object that needs to be created',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChangelogCreate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Changelog',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/changelogs/{changelogId}': {
        put: {
          description: 'Update workspace changelog by id',
          operationId: 'updateWorkspaceChangelogById',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'changelogId',
              in: 'path',
              description: 'Changelog id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Changelog object that needs to be updated',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChangelogUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Changelog',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug or changelog id supplied',
            },
            404: {
              description: 'Workspace or changelog not found',
            },
          },
        },
        delete: {
          description: 'Delete workspace changelog by id',
          operationId: 'deleteWorkspaceChangelogById',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'changelogId',
              in: 'path',
              description: 'Changelog id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Changelog',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug or changelog id supplied',
            },
            404: {
              description: 'Workspace or changelog not found',
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/config': {
        get: {
          description: 'Get workspace config',
          operationId: 'getWorkspaceConfig',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/WorkspaceConfig',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        patch: {
          description: 'Update workspace config',
          operationId: 'updateWorkspaceConfig',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Workspace config object that needs to be updated',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/WorkspaceConfigUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    $ref: '#/components/schemas/WorkspaceConfig',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/feedback': {
        get: {
          description: 'Get all workspace feedback',
          operationId: 'getWorkspaceFeedback',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/FeedbackWithUser',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          description: 'Create workspace feedback',
          operationId: 'createWorkspaceFeedback',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Feedback object that needs to be created',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FeedbackCreate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Feedback',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/feedback/{feedbackId}': {
        get: {
          description: 'Get workspace feedback by id',
          operationId: 'getWorkspaceFeedbackById',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/FeedbackWithUser',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        patch: {
          description: 'Update workspace feedback by id',
          operationId: 'updateWorkspaceFeedbackById',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Feedback object that needs to be updated',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FeedbackUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Feedback',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          description: 'Delete workspace feedback by id',
          operationId: 'deleteWorkspaceFeedbackById',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Feedback',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/feedback/{feedbackId}/comments': {
        get: {
          description: 'Get feedback comments',
          operationId: 'getFeedbackComments',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/FeedbackCommentWithUser',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace or feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/feedback/{feedbackId}/comments/{commentId}': {
        delete: {
          description: 'Delete workspace feedback comment by id',
          operationId: 'deleteWorkspaceFeedbackCommentById',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'commentId',
              in: 'path',
              description: 'Comment id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/FeedbackComment',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace or feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/feedback/{feedbackId}/upvotes': {
        get: {
          description: 'Get feedback upvoters',
          operationId: 'getFeedbackUpvoters',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'feedbackId',
              in: 'path',
              description: 'Feedback id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/FeedbackUpvotes',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug or feedback id supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Feedback not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/feedback/tags': {
        get: {
          description: 'Get feedback tags',
          operationId: 'getFeedbackTags',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/FeedbackTag',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          description: 'Create feedback tag',
          operationId: 'createFeedbackTag',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Feedback tag object that needs to be created',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FeedbackTagCreate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/FeedbackTag',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/feedback/tags/{tagName}': {
        delete: {
          description: 'Delete feedback tag by name',
          operationId: 'deleteFeedbackTagByName',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'tagName',
              in: 'path',
              description: 'Tag name',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/FeedbackTag',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug or tag name supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace or tag not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/invites': {
        get: {
          description: 'List workspace team invites',
          operationId: 'getWorkspaceInvites',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ExtendedWorkspaceInvite',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          description: 'Create a workspace invite',
          operationId: 'createWorkspaceInvite',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'Workspace invite object that needs to be created',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/WorkspaceInvite',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/invites/{inviteId}': {
        delete: {
          description: 'Delete workspace invite by id',
          operationId: 'deleteWorkspaceInviteById',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'inviteId',
              in: 'path',
              description: 'Invite id',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/WorkspaceInvite',
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/workspaces/{workspaceSlug}/members': {
        get: {
          description: 'Get workspace members',
          operationId: 'getWorkspaceMembers',
          parameters: [
            {
              name: 'workspaceSlug',
              in: 'path',
              description: 'Workspace slug',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/WorkspaceMember',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid workspace slug supplied',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Workspace not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Workspace: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            icon: {
              type: 'string',
            },
            icon_radius: {
              type: 'string',
            },
            og_image: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        WorkspaceUpdate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            icon: {
              type: 'string',
            },
            icon_radius: {
              type: 'string',
            },
            og_image: {
              type: 'string',
            },
          },
        },
        Changelog: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            workspace_id: {
              type: 'string',
              format: 'uuid',
            },
            author_id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            publish_date: {
              type: 'string',
              format: 'date-time',
            },
            published: {
              type: 'boolean',
            },
          },
        },
        ChangelogWithAuthor: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            workspace_id: {
              type: 'string',
              format: 'uuid',
            },
            author_id: {
              type: 'string',
              format: 'uuid',
            },
            author: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                email: {
                  type: 'string',
                },
                full_name: {
                  type: 'string',
                },
                avatar_url: {
                  type: 'string',
                },
              },
            },
            title: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            publish_date: {
              type: 'string',
              format: 'date-time',
            },
            published: {
              type: 'boolean',
            },
          },
        },
        ChangelogCreate: {
          type: 'object',
          required: ['title', 'summary', 'content', 'published'],
          properties: {
            title: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            publish_date: {
              type: 'string',
              format: 'date-time',
            },
            published: {
              type: 'boolean',
            },
          },
        },
        ChangelogUpdate: {
          type: 'object',
          required: ['title', 'summary', 'content', 'published'],
          properties: {
            title: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            publish_date: {
              type: 'string',
              format: 'date-time',
            },
            published: {
              type: 'boolean',
            },
          },
        },
        WorkspaceConfig: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            workspace_id: {
              type: 'string',
              format: 'uuid',
            },
            changelog_preview_style: {
              type: 'string',
            },
            changelog_twitter_handle: {
              type: 'string',
            },
            custom_domain: {
              type: 'string',
            },
            custom_domain_verified: {
              type: 'boolean',
            },
            integration_discord_role_id: {
              type: 'string',
            },
            integration_discord_status: {
              type: 'boolean',
            },
            integration_discord_webhook: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        WorkspaceConfigUpdate: {
          type: 'object',
          properties: {
            changelog_preview_style: {
              type: 'string',
            },
            changelog_twitter_handle: {
              type: 'string',
            },
          },
        },
        Feedback: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            workspace_id: {
              type: 'string',
              format: 'uuid',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            upvotes: {
              type: 'number',
            },
            comment_count: {
              type: 'number',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackWithUser: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            workspace_id: {
              type: 'string',
              format: 'uuid',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                email: {
                  type: 'string',
                },
                full_name: {
                  type: 'string',
                },
                avatar_url: {
                  type: 'string',
                },
              },
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  color: {
                    type: 'string',
                  },
                },
              },
            },
            status: {
              type: 'string',
            },
            upvotes: {
              type: 'number',
            },
            comment_count: {
              type: 'number',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackCreate: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        FeedbackUpdate: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        FeedbackComment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            feedback_id: {
              type: 'string',
              format: 'uuid',
            },
            reply_to_id: {
              type: 'string',
              format: 'uuid',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
            },
            content: {
              type: 'string',
            },
            upvotes: {
              type: 'number',
            },
            upvoters: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackCommentWithUser: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            feedback_id: {
              type: 'string',
              format: 'uuid',
            },
            reply_to_id: {
              type: 'string',
              format: 'uuid',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                email: {
                  type: 'string',
                },
                full_name: {
                  type: 'string',
                },
                avatar_url: {
                  type: 'string',
                },
              },
            },
            has_upvoted: {
              type: 'boolean',
            },
            content: {
              type: 'string',
            },
            upvotes: {
              type: 'number',
            },
            upvoters: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            replies: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackUpvotes: {
          type: 'object',
          properties: {
            upvotes: {
              type: 'number',
            },
            upvoters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                  },
                  email: {
                    type: 'string',
                  },
                  full_name: {
                    type: 'string',
                  },
                  avatar_url: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        FeedbackTag: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            workspace_id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            color: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FeedbackTagCreate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            color: {
              type: 'string',
            },
          },
        },
        WorkspaceInvite: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            workspace_id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
            },
            accepted: {
              type: 'boolean',
            },
            creator_id: {
              type: 'string',
              format: 'uuid',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ExtendedWorkspaceInvite: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            workspace_id: {
              type: 'string',
              format: 'uuid',
            },
            workspace: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                slug: {
                  type: 'string',
                },
                icon: {
                  type: 'string',
                },
              },
            },
            email: {
              type: 'string',
            },
            accepted: {
              type: 'boolean',
            },
            creator_id: {
              type: 'string',
              format: 'uuid',
            },
            creator: {
              type: 'object',
              properties: {
                full_name: {
                  type: 'string',
                },
              },
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        WorkspaceMember: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
            },
            full_name: {
              type: 'string',
            },
            avatar_url: {
              type: 'string',
            },
            joined_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  });
}
