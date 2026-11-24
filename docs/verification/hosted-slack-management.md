# Hosted Slack management entry point

In the open-source server, `GET /api/bots/:id/slack-management` returns
`{ "available": false }` for a visible bot. Missing and hidden bots return 404.
The bot settings rail omits the Slack row when the server reports it unavailable.

```sh
pnpm exec vitest run server/routes/hosted-slack.test.ts server/hosted-access.test.ts
pnpm exec vitest run src/components/bot-settings/SlackSection.test.ts
```

The optional UI fixture in `scripts/testing/slack-management-ui.e2e.test.ts`
checks the unavailable response in a disposable renderer and uses synthetic API
responses to check compatibility with a remote server that supplies a link.
