# Fleet CLI and agent

The fleet CLI manages local server installations and the optional Unix socket
agent exposes fleet operations to the operator's service account. The
open-source web app refuses the fleet management API.

```sh
pnpm exec vitest run server/fleet-agent.test.ts server/fleet-cli.test.ts server/fleet-cli-filesystem.test.ts server/fleet.test.ts server/request-auth.test.ts
```

The agent test uses a temporary socket and filesystem root to drive create,
list, users, suspend and delete and to check the audit log and error responses.
The filesystem suite checks that unsafe ledger inputs are refused without
exposing paths or contents to callers. Both use disposable data.

The live fleet setup needs Linux, root, systemd, nftables and Caddy. The
[self-hosting guide](../self-hosting.md#many-client-workspaces-on-one-server)
describes the fleet CLI commands.
