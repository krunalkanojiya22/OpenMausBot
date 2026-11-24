# Hosted workspace sign-in refusal

The open-source server retains the hosted configuration check for existing
deployments. Any of `OMB_ADMIN_URL`, `OMB_ADMIN_WORKSPACE`, or
`OMB_ADMIN_MEMBERSHIP` marks a workspace as requiring its configured sign-in
authority, including when only part of the configuration is present.

The server returns 503 for hosted sign-in and for sessions on that workspace.
It refuses email and pairing requests with 403. A valid standalone install
uses its usual local or paired access. Hosted loopback trust continues to
follow the existing owner or service policy.

Run the isolated fixture with:

```sh
pnpm exec vitest run server/hosted-access.test.ts server/request-auth.test.ts
```

The fixture creates a temporary home and data directory, uses a fake engine,
and records the local health response and refused Full access request.
