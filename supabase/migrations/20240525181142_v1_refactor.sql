create type "public"."api_token_type" as enum ('full_access', 'public_access');

create type "public"."changelog_style_type" as enum ('summary', 'content');

create type "public"."icon_radius_type" as enum ('rounded-full', 'rounded-none', 'rounded-md');

create type "public"."notification_type" as enum ('comment', 'post');

create type "public"."status_type" as enum ('in review', 'planned', 'in progress', 'completed', 'rejected');

create type "public"."theme_type" as enum ('dark', 'light', 'custom');

create table "public"."changelog" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null default ''::text,
    "content" text,
    "workspace_id" uuid not null,
    "published" boolean not null,
    "summary" text,
    "thumbnail" text,
    "author_id" uuid not null,
    "slug" text not null default ''::text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."changelog" enable row level security;

create table "public"."changelog_subscriber" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "email" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."changelog_subscriber" enable row level security;

create table "public"."comment" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "feedback_id" uuid not null,
    "content" text not null,
    "created_at" timestamp with time zone not null default now(),
    "upvotes" bigint not null default '0'::bigint,
    "reply_to_id" uuid
);


alter table "public"."comment" enable row level security;

create table "public"."comment_upvoter" (
    "id" uuid not null default gen_random_uuid(),
    "comment_id" uuid not null,
    "profile_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."comment_upvoter" enable row level security;

create table "public"."feedback" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "status" status_type not null default 'in review'::status_type,
    "upvotes" bigint not null default '0'::bigint,
    "user_id" uuid not null,
    "raw_tags" json[],
    "comment_count" bigint not null default '0'::bigint,
    "content" text not null,
    "upvoters" uuid[],
    "workspace_id" uuid not null
);


alter table "public"."feedback" enable row level security;

create table "public"."feedback_tag" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "color" text not null,
    "created_at" timestamp with time zone not null default now(),
    "workspace_id" uuid not null
);


alter table "public"."feedback_tag" enable row level security;

create table "public"."feedback_upvoter" (
    "id" uuid not null default gen_random_uuid(),
    "feedback_id" uuid not null,
    "profile_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."feedback_upvoter" enable row level security;

create table "public"."notification" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "has_archived" uuid[],
    "created_at" timestamp with time zone not null default now(),
    "initiator_id" uuid not null,
    "type" notification_type not null,
    "feedback_id" uuid not null,
    "comment_id" uuid
);


alter table "public"."notification" enable row level security;

create table "public"."profile" (
    "id" uuid not null default gen_random_uuid(),
    "full_name" text not null,
    "avatar_url" text,
    "email" text not null
);


alter table "public"."profile" enable row level security;

create table "public"."workspace" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "slug" character varying not null,
    "icon" text,
    "icon_radius" icon_radius_type not null default 'rounded-md'::icon_radius_type,
    "opengraph_image" text,
    "custom_domain" text,
    "custom_domain_verified" boolean not null default false,
    "icon_redirect_url" text default ''::text,
    "sso_auth_enabled" boolean not null default false,
    "sso_auth_url" text
);


alter table "public"."workspace" enable row level security;

create table "public"."workspace_api_key" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "permission" api_token_type not null,
    "short_token" text,
    "created_at" timestamp with time zone not null default now(),
    "workspace_id" uuid not null,
    "creator_id" uuid not null default auth.uid(),
    "token_id" uuid
);


alter table "public"."workspace_api_key" enable row level security;

create table "public"."workspace_integration" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "workspace_id" uuid not null,
    "discord_enabled" boolean not null default false,
    "discord_webhook" text,
    "discord_role_id" bigint,
    "slack_enabled" boolean not null default false,
    "slack_webhook" text
);


alter table "public"."workspace_integration" enable row level security;

create table "public"."workspace_invite" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "creator_id" uuid not null,
    "email" text not null,
    "accepted" boolean not null default false,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."workspace_invite" enable row level security;

create table "public"."workspace_member" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "member_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."workspace_member" enable row level security;

create table "public"."workspace_module" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "changelog_enabled" boolean not null default true,
    "changelog_twitter_handle" character varying,
    "changelog_preview_style" changelog_style_type not null default 'summary'::changelog_style_type,
    "feedback_anon_upvoting" boolean not null default false
);


alter table "public"."workspace_module" enable row level security;

create table "public"."workspace_theme" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "theme" theme_type not null default 'light'::theme_type,
    "root" character varying,
    "background" character varying,
    "secondary_background" character varying,
    "foreground" character varying,
    "accent" character varying,
    "created_at" timestamp with time zone not null default now(),
    "border" character varying
);


alter table "public"."workspace_theme" enable row level security;

CREATE UNIQUE INDEX changelog_subscribers_pkey ON public.changelog_subscriber USING btree (id);

CREATE UNIQUE INDEX changelogs_pkey ON public.changelog USING btree (id);

CREATE UNIQUE INDEX comment_upvoter_pkey ON public.comment_upvoter USING btree (id);

CREATE UNIQUE INDEX feedback_comments_pkey ON public.comment USING btree (id);

CREATE UNIQUE INDEX feedback_pkey ON public.feedback USING btree (id);

CREATE UNIQUE INDEX feedback_tags_pkey ON public.feedback_tag USING btree (id);

CREATE UNIQUE INDEX feedback_upvoteres_pkey ON public.feedback_upvoter USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notification USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profile USING btree (id);

CREATE UNIQUE INDEX workspace_api_keys_pkey ON public.workspace_api_key USING btree (id);

CREATE UNIQUE INDEX workspace_invites_pkey ON public.workspace_invite USING btree (id);

CREATE UNIQUE INDEX workspace_members_pkey ON public.workspace_member USING btree (id);

CREATE UNIQUE INDEX workspaces_pkey ON public.workspace USING btree (id);

CREATE UNIQUE INDEX workspaces_slug_key ON public.workspace USING btree (slug);

CREATE UNIQUE INDEX workspace_custom_domain_key ON public.workspace USING btree (custom_domain);

CREATE UNIQUE INDEX workspace_integration_pkey ON public.workspace_integration USING btree (id);

CREATE UNIQUE INDEX workspace_integration_workspace_id_key ON public.workspace_integration USING btree (workspace_id);

CREATE UNIQUE INDEX workspace_module_pkey ON public.workspace_module USING btree (id);

CREATE UNIQUE INDEX workspace_module_workspace_id_key ON public.workspace_module USING btree (workspace_id);

CREATE UNIQUE INDEX workspace_sso_auth_url_key ON public.workspace USING btree (sso_auth_url);

CREATE UNIQUE INDEX workspace_theme_pkey ON public.workspace_theme USING btree (id);

CREATE UNIQUE INDEX workspace_theme_workspace_id_key ON public.workspace_theme USING btree (workspace_id);

alter table "public"."changelog" add constraint "changelogs_pkey" PRIMARY KEY using index "changelogs_pkey";

alter table "public"."changelog_subscriber" add constraint "changelog_subscribers_pkey" PRIMARY KEY using index "changelog_subscribers_pkey";

alter table "public"."comment" add constraint "feedback_comments_pkey" PRIMARY KEY using index "feedback_comments_pkey";

alter table "public"."comment_upvoter" add constraint "comment_upvoter_pkey" PRIMARY KEY using index "comment_upvoter_pkey";

alter table "public"."feedback" add constraint "feedback_pkey" PRIMARY KEY using index "feedback_pkey";

alter table "public"."feedback_tag" add constraint "feedback_tags_pkey" PRIMARY KEY using index "feedback_tags_pkey";

alter table "public"."feedback_upvoter" add constraint "feedback_upvoteres_pkey" PRIMARY KEY using index "feedback_upvoteres_pkey";

alter table "public"."notification" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."profile" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."workspace" add constraint "workspaces_pkey" PRIMARY KEY using index "workspaces_pkey";

alter table "public"."workspace_api_key" add constraint "workspace_api_keys_pkey" PRIMARY KEY using index "workspace_api_keys_pkey";

alter table "public"."workspace_integration" add constraint "workspace_integration_pkey" PRIMARY KEY using index "workspace_integration_pkey";

alter table "public"."workspace_invite" add constraint "workspace_invites_pkey" PRIMARY KEY using index "workspace_invites_pkey";

alter table "public"."workspace_member" add constraint "workspace_members_pkey" PRIMARY KEY using index "workspace_members_pkey";

alter table "public"."workspace_module" add constraint "workspace_module_pkey" PRIMARY KEY using index "workspace_module_pkey";

alter table "public"."workspace_theme" add constraint "workspace_theme_pkey" PRIMARY KEY using index "workspace_theme_pkey";

alter table "public"."changelog" add constraint "changelogs_author_id_fkey" FOREIGN KEY (author_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."changelog" validate constraint "changelogs_author_id_fkey";

alter table "public"."changelog" add constraint "changelogs_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON DELETE CASCADE not valid;

alter table "public"."changelog" validate constraint "changelogs_workspace_id_fkey";

alter table "public"."changelog_subscriber" add constraint "changelog_subscribers_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."changelog_subscriber" validate constraint "changelog_subscribers_workspace_id_fkey";

alter table "public"."comment" add constraint "feedback_comments_feedback_id_fkey" FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comment" validate constraint "feedback_comments_feedback_id_fkey";

alter table "public"."comment" add constraint "feedback_comments_reply_to_id_fkey" FOREIGN KEY (reply_to_id) REFERENCES comment(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comment" validate constraint "feedback_comments_reply_to_id_fkey";

alter table "public"."comment" add constraint "feedback_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comment" validate constraint "feedback_comments_user_id_fkey";

alter table "public"."comment_upvoter" add constraint "public_comment_upvoter_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comment(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comment_upvoter" validate constraint "public_comment_upvoter_comment_id_fkey";

alter table "public"."comment_upvoter" add constraint "public_comment_upvoter_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comment_upvoter" validate constraint "public_comment_upvoter_profile_id_fkey";

alter table "public"."feedback" add constraint "feedback_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) not valid;

alter table "public"."feedback" validate constraint "feedback_workspace_id_fkey";

alter table "public"."feedback" add constraint "feedback_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profile(id) not valid;

alter table "public"."feedback" validate constraint "feedback_user_id_fkey";

alter table "public"."feedback_tag" add constraint "feedback_tags_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_tag" validate constraint "feedback_tags_workspace_id_fkey";

alter table "public"."feedback_upvoter" add constraint "feedback_upvoters_feedback_id_fkey" FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_upvoter" validate constraint "feedback_upvoters_feedback_id_fkey";

alter table "public"."feedback_upvoter" add constraint "feedback_upvoters_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_upvoter" validate constraint "feedback_upvoters_profile_id_fkey";

alter table "public"."notification" add constraint "notifications_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comment(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notifications_comment_id_fkey";

alter table "public"."notification" add constraint "notifications_feedback_id_fkey" FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notifications_feedback_id_fkey";

alter table "public"."notification" add constraint "notifications_initiator_id_fkey" FOREIGN KEY (initiator_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notifications_initiator_id_fkey";

alter table "public"."notification" add constraint "notifications_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notifications_workspace_id_fkey";

alter table "public"."workspace" add constraint "workspaces_slug_key" UNIQUE using index "workspaces_slug_key";

alter table "public"."workspace" add constraint "workspace_custom_domain_key" UNIQUE using index "workspace_custom_domain_key";

alter table "public"."workspace" add constraint "workspace_sso_auth_url_key" UNIQUE using index "workspace_sso_auth_url_key";

alter table "public"."workspace_api_key" add constraint "workspace_api_keys_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_api_key" validate constraint "workspace_api_keys_creator_id_fkey";

alter table "public"."workspace_api_key" add constraint "workspace_api_keys_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_api_key" validate constraint "workspace_api_keys_workspace_id_fkey";

alter table "public"."workspace_integration" add constraint "public_workspace_integration_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_integration" validate constraint "public_workspace_integration_workspace_id_fkey";

alter table "public"."workspace_integration" add constraint "workspace_integration_workspace_id_key" UNIQUE using index "workspace_integration_workspace_id_key";

alter table "public"."workspace_invite" add constraint "workspace_invites_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profile(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_invite" validate constraint "workspace_invites_creator_id_fkey";

alter table "public"."workspace_invite" add constraint "workspace_invites_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_invite" validate constraint "workspace_invites_workspace_id_fkey";

alter table "public"."workspace_member" add constraint "workspace_members_member_id_fkey" FOREIGN KEY (member_id) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_member" validate constraint "workspace_members_member_id_fkey";

alter table "public"."workspace_member" add constraint "workspace_members_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_member" validate constraint "workspace_members_workspace_id_fkey";

alter table "public"."workspace_module" add constraint "public_workspace_module_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_module" validate constraint "public_workspace_module_workspace_id_fkey";

alter table "public"."workspace_module" add constraint "workspace_module_workspace_id_key" UNIQUE using index "workspace_module_workspace_id_key";

alter table "public"."workspace_theme" add constraint "public_workspace_theme_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_theme" validate constraint "public_workspace_theme_workspace_id_fkey";

alter table "public"."workspace_theme" add constraint "workspace_theme_workspace_id_key" UNIQUE using index "workspace_theme_workspace_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_workspace_api_key(api_key_secret text)
 RETURNS workspace_api_key
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    workspace_api_key_row public.workspace_api_key%ROWTYPE;
BEGIN
    -- Find the workspace_api_key row that matches the provided API key secret
    SELECT wak.*
    INTO workspace_api_key_row
    FROM public.workspace_api_key wak
    JOIN vault.decrypted_secrets ds ON wak.token_id = ds.id
    WHERE ds.decrypted_secret = api_key_secret
    LIMIT 1;

    -- If no API key is found, return NULL
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    RETURN workspace_api_key_row;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_workspace_api_key_secret(api_key_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    generated_secret TEXT;
BEGIN
    SELECT s.decrypted_secret
    INTO generated_secret
    FROM vault.decrypted_secrets s
    JOIN workspace_api_key wak ON s.id = wak.token_id
    WHERE wak.id = get_workspace_api_key_secret.api_key_id;

    RETURN generated_secret;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_api_key()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
  new_secret uuid;
  generated_secret text;
  short_token_value text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Generate a new secret, half the size, and prefixed with 'fb_'
    new_secret := gen_random_uuid();
    generated_secret := 'fb_' || encode(gen_random_bytes(16), 'hex');
    INSERT INTO vault.secrets (id, secret)
    VALUES (new_secret, generated_secret);

    -- Create a short token (last 8 characters of the UUID)
    short_token_value := substr(new_secret::text, length(new_secret::text) - 7, 8);

    -- Update the new row with the generated secret and short token
    UPDATE public.workspace_api_key
    SET token_id = new_secret, short_token = short_token_value
    WHERE id = NEW.id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Delete the corresponding entry from the Supabase Vault
    DELETE FROM vault.secrets
    WHERE id = OLD.token_id;

    RETURN OLD;
  END IF;
  RETURN NULL;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_comment_upvote_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE comment
        SET upvotes = upvotes + 1
        WHERE id = NEW.comment_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE comment
        SET upvotes = upvotes - 1
        WHERE id = OLD.comment_id;
    END IF;

    RETURN NULL;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_feedback_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE feedback
        SET comment_count = comment_count + 1
        WHERE id = NEW.feedback_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE feedback
        SET comment_count = comment_count - 1
        WHERE id = OLD.feedback_id;
    END IF;

    RETURN NULL;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_feedback_upvote_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE feedback
        SET upvotes = upvotes + 1
        WHERE id = NEW.feedback_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE feedback
        SET upvotes = upvotes - 1
        WHERE id = OLD.feedback_id;
    END IF;

    RETURN NULL;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  -- Check if the user is anonymous
  if new.is_anonymous then
    -- If the user is anonymous, insert dummy data
    insert into public.profile (id, full_name, email, is_anonymous)
    values (new.id, 'Anonymous User', 'anonymous@fb.app', true);

    return new;
  end if;

  -- If the user is not anonymous, proceed with the insertion
  insert into public.profile (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);

  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.handle_workspace_setup()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    current_user_id UUID;
    new_board_id UUID;
BEGIN
    -- Get the authenticated user's ID from Supabase
    SELECT auth.uid() INTO current_user_id;

    -- Insert the new workspace and the associated user into the workspace_member table
    INSERT INTO public.workspace_member (workspace_id, member_id)
    VALUES (NEW.id, current_user_id);

    -- Insert into workspace_integration table
    INSERT INTO public.workspace_integration (workspace_id)
    VALUES (NEW.id);

    -- Insert into feedback_board table with default name 'Feature Requests'
    INSERT INTO public.feedback_board (workspace_id, name)
    VALUES (NEW.id, 'Feature Requests')
    RETURNING id INTO new_board_id;

    -- Insert into workspace_module table
    INSERT INTO public.workspace_module (workspace_id, feedback_default_board_id)
    VALUES (NEW.id, new_board_id);

    -- Insert into workspace_theme table
    INSERT INTO public.workspace_theme (workspace_id)
    VALUES (NEW.id);

    -- Insert default tags for the new workspace
    INSERT INTO public.feedback_tag (name, color, workspace_id)
    VALUES
        ('High Priority', '#E57373', NEW.id),
        ('Medium Priority', '#FFECB3', NEW.id),
        ('Low Priority', '#C8E6C9', NEW.id);    

    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.is_allowed_api_token(apitoken text, tokentype api_token_type[], workspace_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    valid_token BOOLEAN;
    valid_workspace BOOLEAN;
    workspace_api_key_row public.workspace_api_key%ROWTYPE;
BEGIN
    -- Get the workspace_api_key row for the provided API token
    SELECT * INTO workspace_api_key_row FROM get_workspace_api_key(apitoken);

    -- Check if the API token exists and has the required permissions
    valid_token := COALESCE(workspace_api_key_row.permission = ANY(tokentype), FALSE);

    -- Check if the API token has access to the specified workspace
    valid_workspace := (
        SELECT EXISTS (
            SELECT 1
            FROM public.workspace_member wm
            WHERE wm.workspace_id = is_allowed_api_token.workspace_id
            AND wm.workspace_id = workspace_api_key_row.workspace_id
        )
    );

    RETURN (valid_token AND valid_workspace);
END;$function$
;

CREATE OR REPLACE FUNCTION public.is_workspace_member(p_workspace_id uuid, p_user_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_count INTEGER;
    current_user_id UUID;
BEGIN
    -- If p_user_id is not provided, use the authenticated user's ID
    IF p_user_id IS NULL THEN
        SELECT auth.uid() INTO current_user_id;
        p_user_id := current_user_id;
    END IF;

    SELECT COUNT(*) INTO user_count
    FROM public.workspace_member
    WHERE workspace_id = p_workspace_id
        AND member_id = p_user_id;

    RETURN (user_count > 0);
END;
$function$
;

create or replace view "public"."workspace_view" as  SELECT workspace.id,
    workspace.name,
    workspace.slug,
    workspace.icon,
    workspace.icon_radius,
    workspace.opengraph_image
   FROM workspace;


grant delete on table "public"."changelog" to "anon";

grant insert on table "public"."changelog" to "anon";

grant references on table "public"."changelog" to "anon";

grant select on table "public"."changelog" to "anon";

grant trigger on table "public"."changelog" to "anon";

grant truncate on table "public"."changelog" to "anon";

grant update on table "public"."changelog" to "anon";

grant delete on table "public"."changelog" to "authenticated";

grant insert on table "public"."changelog" to "authenticated";

grant references on table "public"."changelog" to "authenticated";

grant select on table "public"."changelog" to "authenticated";

grant trigger on table "public"."changelog" to "authenticated";

grant truncate on table "public"."changelog" to "authenticated";

grant update on table "public"."changelog" to "authenticated";

grant delete on table "public"."changelog" to "service_role";

grant insert on table "public"."changelog" to "service_role";

grant references on table "public"."changelog" to "service_role";

grant select on table "public"."changelog" to "service_role";

grant trigger on table "public"."changelog" to "service_role";

grant truncate on table "public"."changelog" to "service_role";

grant update on table "public"."changelog" to "service_role";

grant delete on table "public"."changelog_subscriber" to "anon";

grant insert on table "public"."changelog_subscriber" to "anon";

grant references on table "public"."changelog_subscriber" to "anon";

grant select on table "public"."changelog_subscriber" to "anon";

grant trigger on table "public"."changelog_subscriber" to "anon";

grant truncate on table "public"."changelog_subscriber" to "anon";

grant update on table "public"."changelog_subscriber" to "anon";

grant delete on table "public"."changelog_subscriber" to "authenticated";

grant insert on table "public"."changelog_subscriber" to "authenticated";

grant references on table "public"."changelog_subscriber" to "authenticated";

grant select on table "public"."changelog_subscriber" to "authenticated";

grant trigger on table "public"."changelog_subscriber" to "authenticated";

grant truncate on table "public"."changelog_subscriber" to "authenticated";

grant update on table "public"."changelog_subscriber" to "authenticated";

grant delete on table "public"."changelog_subscriber" to "service_role";

grant insert on table "public"."changelog_subscriber" to "service_role";

grant references on table "public"."changelog_subscriber" to "service_role";

grant select on table "public"."changelog_subscriber" to "service_role";

grant trigger on table "public"."changelog_subscriber" to "service_role";

grant truncate on table "public"."changelog_subscriber" to "service_role";

grant update on table "public"."changelog_subscriber" to "service_role";

grant delete on table "public"."comment" to "anon";

grant insert on table "public"."comment" to "anon";

grant references on table "public"."comment" to "anon";

grant select on table "public"."comment" to "anon";

grant trigger on table "public"."comment" to "anon";

grant truncate on table "public"."comment" to "anon";

grant update on table "public"."comment" to "anon";

grant delete on table "public"."comment" to "authenticated";

grant insert on table "public"."comment" to "authenticated";

grant references on table "public"."comment" to "authenticated";

grant select on table "public"."comment" to "authenticated";

grant trigger on table "public"."comment" to "authenticated";

grant truncate on table "public"."comment" to "authenticated";

grant update on table "public"."comment" to "authenticated";

grant delete on table "public"."comment" to "service_role";

grant insert on table "public"."comment" to "service_role";

grant references on table "public"."comment" to "service_role";

grant select on table "public"."comment" to "service_role";

grant trigger on table "public"."comment" to "service_role";

grant truncate on table "public"."comment" to "service_role";

grant update on table "public"."comment" to "service_role";

grant delete on table "public"."comment_upvoter" to "anon";

grant insert on table "public"."comment_upvoter" to "anon";

grant references on table "public"."comment_upvoter" to "anon";

grant select on table "public"."comment_upvoter" to "anon";

grant trigger on table "public"."comment_upvoter" to "anon";

grant truncate on table "public"."comment_upvoter" to "anon";

grant update on table "public"."comment_upvoter" to "anon";

grant delete on table "public"."comment_upvoter" to "authenticated";

grant insert on table "public"."comment_upvoter" to "authenticated";

grant references on table "public"."comment_upvoter" to "authenticated";

grant select on table "public"."comment_upvoter" to "authenticated";

grant trigger on table "public"."comment_upvoter" to "authenticated";

grant truncate on table "public"."comment_upvoter" to "authenticated";

grant update on table "public"."comment_upvoter" to "authenticated";

grant delete on table "public"."comment_upvoter" to "service_role";

grant insert on table "public"."comment_upvoter" to "service_role";

grant references on table "public"."comment_upvoter" to "service_role";

grant select on table "public"."comment_upvoter" to "service_role";

grant trigger on table "public"."comment_upvoter" to "service_role";

grant truncate on table "public"."comment_upvoter" to "service_role";

grant update on table "public"."comment_upvoter" to "service_role";

grant delete on table "public"."feedback" to "anon";

grant insert on table "public"."feedback" to "anon";

grant references on table "public"."feedback" to "anon";

grant select on table "public"."feedback" to "anon";

grant trigger on table "public"."feedback" to "anon";

grant truncate on table "public"."feedback" to "anon";

grant update on table "public"."feedback" to "anon";

grant delete on table "public"."feedback" to "authenticated";

grant insert on table "public"."feedback" to "authenticated";

grant references on table "public"."feedback" to "authenticated";

grant select on table "public"."feedback" to "authenticated";

grant trigger on table "public"."feedback" to "authenticated";

grant truncate on table "public"."feedback" to "authenticated";

grant update on table "public"."feedback" to "authenticated";

grant delete on table "public"."feedback" to "service_role";

grant insert on table "public"."feedback" to "service_role";

grant references on table "public"."feedback" to "service_role";

grant select on table "public"."feedback" to "service_role";

grant trigger on table "public"."feedback" to "service_role";

grant truncate on table "public"."feedback" to "service_role";

grant update on table "public"."feedback" to "service_role";

grant delete on table "public"."feedback_tag" to "anon";

grant insert on table "public"."feedback_tag" to "anon";

grant references on table "public"."feedback_tag" to "anon";

grant select on table "public"."feedback_tag" to "anon";

grant trigger on table "public"."feedback_tag" to "anon";

grant truncate on table "public"."feedback_tag" to "anon";

grant update on table "public"."feedback_tag" to "anon";

grant delete on table "public"."feedback_tag" to "authenticated";

grant insert on table "public"."feedback_tag" to "authenticated";

grant references on table "public"."feedback_tag" to "authenticated";

grant select on table "public"."feedback_tag" to "authenticated";

grant trigger on table "public"."feedback_tag" to "authenticated";

grant truncate on table "public"."feedback_tag" to "authenticated";

grant update on table "public"."feedback_tag" to "authenticated";

grant delete on table "public"."feedback_tag" to "service_role";

grant insert on table "public"."feedback_tag" to "service_role";

grant references on table "public"."feedback_tag" to "service_role";

grant select on table "public"."feedback_tag" to "service_role";

grant trigger on table "public"."feedback_tag" to "service_role";

grant truncate on table "public"."feedback_tag" to "service_role";

grant update on table "public"."feedback_tag" to "service_role";

grant delete on table "public"."feedback_upvoter" to "anon";

grant insert on table "public"."feedback_upvoter" to "anon";

grant references on table "public"."feedback_upvoter" to "anon";

grant select on table "public"."feedback_upvoter" to "anon";

grant trigger on table "public"."feedback_upvoter" to "anon";

grant truncate on table "public"."feedback_upvoter" to "anon";

grant update on table "public"."feedback_upvoter" to "anon";

grant delete on table "public"."feedback_upvoter" to "authenticated";

grant insert on table "public"."feedback_upvoter" to "authenticated";

grant references on table "public"."feedback_upvoter" to "authenticated";

grant select on table "public"."feedback_upvoter" to "authenticated";

grant trigger on table "public"."feedback_upvoter" to "authenticated";

grant truncate on table "public"."feedback_upvoter" to "authenticated";

grant update on table "public"."feedback_upvoter" to "authenticated";

grant delete on table "public"."feedback_upvoter" to "service_role";

grant insert on table "public"."feedback_upvoter" to "service_role";

grant references on table "public"."feedback_upvoter" to "service_role";

grant select on table "public"."feedback_upvoter" to "service_role";

grant trigger on table "public"."feedback_upvoter" to "service_role";

grant truncate on table "public"."feedback_upvoter" to "service_role";

grant update on table "public"."feedback_upvoter" to "service_role";

grant delete on table "public"."notification" to "anon";

grant insert on table "public"."notification" to "anon";

grant references on table "public"."notification" to "anon";

grant select on table "public"."notification" to "anon";

grant trigger on table "public"."notification" to "anon";

grant truncate on table "public"."notification" to "anon";

grant update on table "public"."notification" to "anon";

grant delete on table "public"."notification" to "authenticated";

grant insert on table "public"."notification" to "authenticated";

grant references on table "public"."notification" to "authenticated";

grant select on table "public"."notification" to "authenticated";

grant trigger on table "public"."notification" to "authenticated";

grant truncate on table "public"."notification" to "authenticated";

grant update on table "public"."notification" to "authenticated";

grant delete on table "public"."notification" to "service_role";

grant insert on table "public"."notification" to "service_role";

grant references on table "public"."notification" to "service_role";

grant select on table "public"."notification" to "service_role";

grant trigger on table "public"."notification" to "service_role";

grant truncate on table "public"."notification" to "service_role";

grant update on table "public"."notification" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

grant delete on table "public"."workspace" to "anon";

grant insert on table "public"."workspace" to "anon";

grant references on table "public"."workspace" to "anon";

grant select on table "public"."workspace" to "anon";

grant trigger on table "public"."workspace" to "anon";

grant truncate on table "public"."workspace" to "anon";

grant update on table "public"."workspace" to "anon";

grant delete on table "public"."workspace" to "authenticated";

grant insert on table "public"."workspace" to "authenticated";

grant references on table "public"."workspace" to "authenticated";

grant select on table "public"."workspace" to "authenticated";

grant trigger on table "public"."workspace" to "authenticated";

grant truncate on table "public"."workspace" to "authenticated";

grant update on table "public"."workspace" to "authenticated";

grant delete on table "public"."workspace" to "service_role";

grant insert on table "public"."workspace" to "service_role";

grant references on table "public"."workspace" to "service_role";

grant select on table "public"."workspace" to "service_role";

grant trigger on table "public"."workspace" to "service_role";

grant truncate on table "public"."workspace" to "service_role";

grant update on table "public"."workspace" to "service_role";

grant delete on table "public"."workspace_api_key" to "anon";

grant insert on table "public"."workspace_api_key" to "anon";

grant references on table "public"."workspace_api_key" to "anon";

grant select on table "public"."workspace_api_key" to "anon";

grant trigger on table "public"."workspace_api_key" to "anon";

grant truncate on table "public"."workspace_api_key" to "anon";

grant update on table "public"."workspace_api_key" to "anon";

grant delete on table "public"."workspace_api_key" to "authenticated";

grant insert on table "public"."workspace_api_key" to "authenticated";

grant references on table "public"."workspace_api_key" to "authenticated";

grant select on table "public"."workspace_api_key" to "authenticated";

grant trigger on table "public"."workspace_api_key" to "authenticated";

grant truncate on table "public"."workspace_api_key" to "authenticated";

grant update on table "public"."workspace_api_key" to "authenticated";

grant delete on table "public"."workspace_api_key" to "service_role";

grant insert on table "public"."workspace_api_key" to "service_role";

grant references on table "public"."workspace_api_key" to "service_role";

grant select on table "public"."workspace_api_key" to "service_role";

grant trigger on table "public"."workspace_api_key" to "service_role";

grant truncate on table "public"."workspace_api_key" to "service_role";

grant update on table "public"."workspace_api_key" to "service_role";

grant delete on table "public"."workspace_integration" to "anon";

grant insert on table "public"."workspace_integration" to "anon";

grant references on table "public"."workspace_integration" to "anon";

grant select on table "public"."workspace_integration" to "anon";

grant trigger on table "public"."workspace_integration" to "anon";

grant truncate on table "public"."workspace_integration" to "anon";

grant update on table "public"."workspace_integration" to "anon";

grant delete on table "public"."workspace_integration" to "authenticated";

grant insert on table "public"."workspace_integration" to "authenticated";

grant references on table "public"."workspace_integration" to "authenticated";

grant select on table "public"."workspace_integration" to "authenticated";

grant trigger on table "public"."workspace_integration" to "authenticated";

grant truncate on table "public"."workspace_integration" to "authenticated";

grant update on table "public"."workspace_integration" to "authenticated";

grant delete on table "public"."workspace_integration" to "service_role";

grant insert on table "public"."workspace_integration" to "service_role";

grant references on table "public"."workspace_integration" to "service_role";

grant select on table "public"."workspace_integration" to "service_role";

grant trigger on table "public"."workspace_integration" to "service_role";

grant truncate on table "public"."workspace_integration" to "service_role";

grant update on table "public"."workspace_integration" to "service_role";

grant delete on table "public"."workspace_invite" to "anon";

grant insert on table "public"."workspace_invite" to "anon";

grant references on table "public"."workspace_invite" to "anon";

grant select on table "public"."workspace_invite" to "anon";

grant trigger on table "public"."workspace_invite" to "anon";

grant truncate on table "public"."workspace_invite" to "anon";

grant update on table "public"."workspace_invite" to "anon";

grant delete on table "public"."workspace_invite" to "authenticated";

grant insert on table "public"."workspace_invite" to "authenticated";

grant references on table "public"."workspace_invite" to "authenticated";

grant select on table "public"."workspace_invite" to "authenticated";

grant trigger on table "public"."workspace_invite" to "authenticated";

grant truncate on table "public"."workspace_invite" to "authenticated";

grant update on table "public"."workspace_invite" to "authenticated";

grant delete on table "public"."workspace_invite" to "service_role";

grant insert on table "public"."workspace_invite" to "service_role";

grant references on table "public"."workspace_invite" to "service_role";

grant select on table "public"."workspace_invite" to "service_role";

grant trigger on table "public"."workspace_invite" to "service_role";

grant truncate on table "public"."workspace_invite" to "service_role";

grant update on table "public"."workspace_invite" to "service_role";

grant delete on table "public"."workspace_member" to "anon";

grant insert on table "public"."workspace_member" to "anon";

grant references on table "public"."workspace_member" to "anon";

grant select on table "public"."workspace_member" to "anon";

grant trigger on table "public"."workspace_member" to "anon";

grant truncate on table "public"."workspace_member" to "anon";

grant update on table "public"."workspace_member" to "anon";

grant delete on table "public"."workspace_member" to "authenticated";

grant insert on table "public"."workspace_member" to "authenticated";

grant references on table "public"."workspace_member" to "authenticated";

grant select on table "public"."workspace_member" to "authenticated";

grant trigger on table "public"."workspace_member" to "authenticated";

grant truncate on table "public"."workspace_member" to "authenticated";

grant update on table "public"."workspace_member" to "authenticated";

grant delete on table "public"."workspace_member" to "service_role";

grant insert on table "public"."workspace_member" to "service_role";

grant references on table "public"."workspace_member" to "service_role";

grant select on table "public"."workspace_member" to "service_role";

grant trigger on table "public"."workspace_member" to "service_role";

grant truncate on table "public"."workspace_member" to "service_role";

grant update on table "public"."workspace_member" to "service_role";

grant delete on table "public"."workspace_module" to "anon";

grant insert on table "public"."workspace_module" to "anon";

grant references on table "public"."workspace_module" to "anon";

grant select on table "public"."workspace_module" to "anon";

grant trigger on table "public"."workspace_module" to "anon";

grant truncate on table "public"."workspace_module" to "anon";

grant update on table "public"."workspace_module" to "anon";

grant delete on table "public"."workspace_module" to "authenticated";

grant insert on table "public"."workspace_module" to "authenticated";

grant references on table "public"."workspace_module" to "authenticated";

grant select on table "public"."workspace_module" to "authenticated";

grant trigger on table "public"."workspace_module" to "authenticated";

grant truncate on table "public"."workspace_module" to "authenticated";

grant update on table "public"."workspace_module" to "authenticated";

grant delete on table "public"."workspace_module" to "service_role";

grant insert on table "public"."workspace_module" to "service_role";

grant references on table "public"."workspace_module" to "service_role";

grant select on table "public"."workspace_module" to "service_role";

grant trigger on table "public"."workspace_module" to "service_role";

grant truncate on table "public"."workspace_module" to "service_role";

grant update on table "public"."workspace_module" to "service_role";

grant delete on table "public"."workspace_theme" to "anon";

grant insert on table "public"."workspace_theme" to "anon";

grant references on table "public"."workspace_theme" to "anon";

grant select on table "public"."workspace_theme" to "anon";

grant trigger on table "public"."workspace_theme" to "anon";

grant truncate on table "public"."workspace_theme" to "anon";

grant update on table "public"."workspace_theme" to "anon";

grant delete on table "public"."workspace_theme" to "authenticated";

grant insert on table "public"."workspace_theme" to "authenticated";

grant references on table "public"."workspace_theme" to "authenticated";

grant select on table "public"."workspace_theme" to "authenticated";

grant trigger on table "public"."workspace_theme" to "authenticated";

grant truncate on table "public"."workspace_theme" to "authenticated";

grant update on table "public"."workspace_theme" to "authenticated";

grant delete on table "public"."workspace_theme" to "service_role";

grant insert on table "public"."workspace_theme" to "service_role";

grant references on table "public"."workspace_theme" to "service_role";

grant select on table "public"."workspace_theme" to "service_role";

grant trigger on table "public"."workspace_theme" to "service_role";

grant truncate on table "public"."workspace_theme" to "service_role";

grant update on table "public"."workspace_theme" to "service_role";

create policy "Allow API Access"
on "public"."changelog"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], workspace_id))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], workspace_id));


create policy "Enable delete for authenticated users only"
on "public"."changelog"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."changelog"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."changelog"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."changelog"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable delete access for all users"
on "public"."changelog_subscriber"
as permissive
for delete
to public
using (true);


create policy "Enable insert for everyone"
on "public"."changelog_subscriber"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for all users"
on "public"."changelog_subscriber"
as permissive
for select
to public
using (true);


create policy "Enable delete for authenticated users only"
on "public"."comment"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."comment"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."comment"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."comment"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "API Access for Insert"
on "public"."feedback"
as permissive
for insert
to public
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{public_access,full_access}'::api_token_type[], workspace_id));


create policy "Enable delete access for auth users"
on "public"."feedback"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."feedback"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all"
on "public"."feedback"
as permissive
for select
to public
using (true);


create policy "Enable update for all users only"
on "public"."feedback"
as permissive
for update
to anon, authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."feedback_tag"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."feedback_tag"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."feedback_tag"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable delete for authenticated users only"
on "public"."feedback_upvoter"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."feedback_upvoter"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."feedback_upvoter"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."notification"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for authenticated users only"
on "public"."notification"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."notification"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Public profiles are viewable by everyone."
on "public"."profile"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profile"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profile"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Allow API Access"
on "public"."workspace"
as permissive
for all
to anon
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], id))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], id));


create policy "Enable delete for workspace member"
on "public"."workspace"
as permissive
for delete
to public
using (is_workspace_member(id));


create policy "Enable insert for authenticated users only"
on "public"."workspace"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for workspace member"
on "public"."workspace"
as permissive
for select
to public
using (is_workspace_member(id));


create policy "Enable update for workspace members"
on "public"."workspace"
as permissive
for update
to public
using (is_workspace_member(id));


create policy "Allow API Access"
on "public"."workspace_api_key"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], workspace_id))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], workspace_id));


create policy "Enable delete for workspace member"
on "public"."workspace_api_key"
as permissive
for delete
to public
using (is_workspace_member(workspace_id));


create policy "Enable insert for workspace member"
on "public"."workspace_api_key"
as permissive
for insert
to public
with check (is_workspace_member(workspace_id));


create policy "Enable select for workspace member"
on "public"."workspace_api_key"
as permissive
for select
to public
using (is_workspace_member(workspace_id));


create policy "Enable insert for workspace members"
on "public"."workspace_integration"
as permissive
for insert
to public
with check (is_workspace_member(workspace_id));


create policy "Enable read for workspace member"
on "public"."workspace_integration"
as permissive
for select
to public
using (is_workspace_member(workspace_id));


create policy "Enable update for workspace members"
on "public"."workspace_integration"
as permissive
for update
to public
using (is_workspace_member(workspace_id));


create policy "Allow API Access"
on "public"."workspace_invite"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], workspace_id))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], workspace_id));


create policy "Enable delete for authenticated users only"
on "public"."workspace_invite"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."workspace_invite"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."workspace_invite"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."workspace_invite"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Allow API Access"
on "public"."workspace_member"
as permissive
for all
to public
using (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], workspace_id))
with check (is_allowed_api_token(((current_setting('request.headers'::text, true))::json ->> 'fbkey'::text), '{full_access}'::api_token_type[], workspace_id));


create policy "Enable insert for workspace member"
on "public"."workspace_member"
as permissive
for insert
to public
with check (true);


create policy "Enable read for workspace member"
on "public"."workspace_member"
as permissive
for select
to public
using (is_workspace_member(workspace_id));


create policy "Enable insert for workspace member"
on "public"."workspace_module"
as permissive
for insert
to public
with check (is_workspace_member(workspace_id));


create policy "Enable select access for workspace member"
on "public"."workspace_module"
as permissive
for select
to public
using (is_workspace_member(workspace_id));


create policy "Enable update for workspace member"
on "public"."workspace_module"
as permissive
for update
to public
using (is_workspace_member(workspace_id));


create policy "Enable insert for workspace member"
on "public"."workspace_theme"
as permissive
for insert
to public
with check (is_workspace_member(workspace_id));


create policy "Enable select for workspace member"
on "public"."workspace_theme"
as permissive
for select
to public
using (is_workspace_member(workspace_id));


CREATE TRIGGER handle_feedback_comment_count AFTER INSERT OR DELETE ON public.comment FOR EACH ROW EXECUTE FUNCTION handle_feedback_comment_count();

CREATE TRIGGER handle_comment_upvote_count AFTER INSERT OR DELETE ON public.comment_upvoter FOR EACH ROW EXECUTE FUNCTION handle_comment_upvote_count();

CREATE TRIGGER handle_feedback_upvote_count AFTER INSERT OR DELETE ON public.feedback_upvoter FOR EACH ROW EXECUTE FUNCTION handle_feedback_upvote_count();

CREATE TRIGGER workspace_setup AFTER INSERT ON public.workspace FOR EACH ROW EXECUTE FUNCTION handle_workspace_setup();

CREATE TRIGGER create_api_key AFTER INSERT OR DELETE ON public.workspace_api_key FOR EACH ROW EXECUTE FUNCTION handle_api_key();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

create policy "Anyone can insert 1oj01fe_0"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Anyone can select 1oj01fe_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));

create policy "Only authenticated users can select and insert 1iiiika_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'workspaces'::text));


create policy "Only authenticated users can select and insert 1iiiika_1"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'workspaces'::text));

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES('workspaces', 'workspaces', TRUE, FALSE);

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES('avatars', 'avatars', TRUE, FALSE);

create table "public"."feedback_board" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "workspace_id" uuid not null,
    "private" boolean not null default false
);

alter table "public"."feedback_board" enable row level security;

create policy "Enable insert for workspace member"
on "public"."feedback_board"
as permissive
for insert
to authenticated
with check (is_workspace_member(workspace_id));


create policy "Enable read access to public boards for all users"
on "public"."feedback_board"
as permissive
for select
to public
using ((private = false));

create policy "Enable insert for authenticated users only"
on "public"."comment_upvoter"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."comment_upvoter"
as permissive
for select
to public
using (true);

grant delete on table "public"."feedback_board" to "anon";

grant insert on table "public"."feedback_board" to "anon";

grant references on table "public"."feedback_board" to "anon";

grant select on table "public"."feedback_board" to "anon";

grant trigger on table "public"."feedback_board" to "anon";

grant truncate on table "public"."feedback_board" to "anon";

grant update on table "public"."feedback_board" to "anon";

grant delete on table "public"."feedback_board" to "authenticated";

grant insert on table "public"."feedback_board" to "authenticated";

grant references on table "public"."feedback_board" to "authenticated";

grant select on table "public"."feedback_board" to "authenticated";

grant trigger on table "public"."feedback_board" to "authenticated";

grant truncate on table "public"."feedback_board" to "authenticated";

grant update on table "public"."feedback_board" to "authenticated";

grant delete on table "public"."feedback_board" to "service_role";

grant insert on table "public"."feedback_board" to "service_role";

grant references on table "public"."feedback_board" to "service_role";

grant select on table "public"."feedback_board" to "service_role";

grant trigger on table "public"."feedback_board" to "service_role";

grant truncate on table "public"."feedback_board" to "service_role";

grant update on table "public"."feedback_board" to "service_role";

alter table "public"."changelog" add column "publish_date" timestamp with time zone;

alter table "public"."feedback" drop column "upvoters";

alter table "public"."feedback" add column "board_id" uuid not null;

alter table "public"."workspace" add column "default_board_id" uuid;

drop policy "Enable read for workspace member" on "public"."workspace";

drop policy "Enable select access for workspace member" on "public"."workspace_module";

drop policy "Enable select for workspace member" on "public"."workspace_theme";

create policy "Enable read access for all users"
on "public"."workspace"
as permissive
for select
to public
using (true);

create policy "Enable read access for all users"
on "public"."workspace_module"
as permissive
for select
to public
using (true);

create policy "Enable read access for all users"
on "public"."workspace_theme"
as permissive
for select
to public
using (true);

drop view if exists "public"."workspace_view";

alter table "public"."workspace" drop column "default_board_id";

alter table "public"."workspace_module" add column "feedback_default_board_id" uuid not null;

CREATE UNIQUE INDEX feedback_board_pkey ON public.feedback_board USING btree (id);

CREATE UNIQUE INDEX workspace_module_feedback_default_board_id_key ON public.workspace_module USING btree (feedback_default_board_id);

alter table "public"."feedback_board" add constraint "feedback_board_pkey" PRIMARY KEY using index "feedback_board_pkey";

alter table "public"."feedback_board" add constraint "public_feedback_board_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_board" validate constraint "public_feedback_board_workspace_id_fkey";

alter table "public"."workspace_module" add constraint "public_workspace_module_feedback_default_board_id_fkey" FOREIGN KEY (feedback_default_board_id) REFERENCES feedback_board(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_module" validate constraint "public_workspace_module_feedback_default_board_id_fkey";

alter table "public"."workspace_module" add constraint "workspace_module_feedback_default_board_id_key" UNIQUE using index "workspace_module_feedback_default_board_id_key";

create or replace view "public"."workspace_view" as  SELECT workspace.id,
    workspace.name,
    workspace.slug,
    workspace.icon,
    workspace.icon_radius,
    workspace.opengraph_image
   FROM workspace;

create policy "All access for authenticated users 8ykxq_0"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'workspaces'::text));


create policy "All access for authenticated users 8ykxq_1"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'workspaces'::text));


create policy "All access for authenticated users 8ykxq_2"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'workspaces'::text));


create policy "All access for authenticated users 8ykxq_3"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'workspaces'::text));

create type "public"."domain_redirect_type" as enum ('no_redirect', 'direct_redirect', 'root_redirect');

drop policy "Enable update for workspace members" on "public"."workspace";

alter table "public"."profile" add column "is_anonymous" boolean not null default false;

alter table "public"."workspace" add column "custom_domain_redirect" domain_redirect_type not null default 'root_redirect'::domain_redirect_type;

alter table "public"."workspace" add column "sso_auth_secret_id" uuid;

alter table "public"."workspace_module" add column "feedback_anon_posting" boolean not null default false;

alter table "public"."feedback" add constraint "public_feedback_board_id_fkey" FOREIGN KEY (board_id) REFERENCES feedback_board(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback" validate constraint "public_feedback_board_id_fkey";

CREATE OR REPLACE FUNCTION public.get_secret_by_id(secret_id uuid)
 RETURNS TABLE(id uuid, name text, decrypted_secret text, description text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.name,
        ds.decrypted_secret,
        s.description,
        s.created_at,
        s.updated_at
    FROM vault.secrets s
    JOIN vault.decrypted_secrets ds ON s.id = ds.id
    WHERE s.id = get_secret_by_id.secret_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_secret(secret_value text, secret_name text DEFAULT NULL::text, description text DEFAULT ''::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    secret_id UUID;
BEGIN
    -- Insert the secret into the vault.secrets table
    SELECT vault.create_secret(secret_value, secret_name, COALESCE(description, '')) INTO secret_id;
    RETURN secret_id;
END;
$function$
;

create policy "Enable delete for own comment upvotes only"
on "public"."comment_upvoter"
as permissive
for all
to authenticated
using ((auth.uid() = profile_id));


create policy "Enable updpate for workspace member"
on "public"."workspace_theme"
as permissive
for update
to authenticated
using (is_workspace_member(workspace_id));


create policy "Enable update for workspace members"
on "public"."workspace"
as permissive
for update
to authenticated
using (is_workspace_member(id));