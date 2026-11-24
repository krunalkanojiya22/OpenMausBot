# Deploy the web app with Dokploy

Deploy this repository as a **Docker Compose** service using
[`compose.dokploy.yaml`](../compose.dokploy.yaml). It builds the `server` target
of the root Dockerfile and runs the Node harness and built React UI together.
Use one container per workspace. The named `data` volume at `/data` holds the
workspace, SQLite databases, attachments, browser profiles and engine sign-ins.

1. Create a **Docker Compose** service, select this fork as its Git source, and
   set the Compose path to `compose.dokploy.yaml`. Use Compose mode so Dokploy
   can build the image from source. Deploy manually when the branch is ready.
   [Dokploy Compose settings](https://docs.dokploy.com/docs/core/docker-compose)
2. Add a DNS record for the app's hostname pointing at your Dokploy server. In
   the Compose service's **Domains** tab, add the hostname, choose service
   `omb`, set container port **8799**, and enable HTTPS. Use the whole hostname
   at path `/`. Traefik reaches the app over a private container network. The
   Compose file leaves the harness port unpublished.
   [Dokploy Compose domains](https://docs.dokploy.com/docs/core/docker-compose/domains)

3. Set these values in the service's **Environment** tab before deploying.

   ```dotenv
   OMB_PUBLIC_URL=https://maus.example.com
   OMB_SIGNIN_EMAILS=admin@example.com
   ```

   Set `OMB_SIGNIN_MEMBER_EMAILS` for chat-only members. Without SMTP settings,
   sign-in codes use the upstream account service. To send them through your
   own mail server, set `OMB_SIGNIN_SMTP_URL` and `OMB_SIGNIN_SMTP_FROM` in
   Dokploy. See [email sign-in](self-hosting.md#sign-in-with-your-email).

   The container starts with service loopback trust. Bootstrap through email
   sign-in. A shell in the running container cannot mint pairing codes. Leave
   the enterprise portal environment variables unset.

4. Deploy, open `https://maus.example.com/api/health`, then open the app's root
   URL and sign in as the admin. Configure a model provider in Settings and
   send a test message. Reload to check that the conversation survives. The
   optional `OMB_DOKPLOY_ENGINES` build argument is a space-separated list of
   CLI packages to install in the image, such as
   `@anthropic-ai/claude-code @openai/codex`. Leave it empty for an API-key provider.

Keep the `data` volume across redeployments and back it up. Use a separate
volume for each workspace. The configuration exposes the web UI and API.
Incoming webhooks that use the separate listener require their own routing.
[Dokploy named volumes](https://docs.dokploy.com/docs/core/docker-compose#method-2-docker-named-volumes)
