# Local builds and releases

For a web deployment, build the Node harness and React app from this checkout.
Use the root [Dockerfile](../Dockerfile) for a container image and see the
[self-hosting guide](self-hosting.md) for configuration.

```sh
pnpm build
pnpm build:server
node scripts/smoke-packaged-server.mjs
```

To assemble an npm tarball locally, run
`node scripts/build-npm-package.mjs` and then `npm pack ./release/npm`.

Desktop builds use `pnpm package:mac`, `pnpm package:win`, or
`pnpm package:linux` on the target platform. See [browser packaging](browser-packaging.md)
for the bundled browser and platform checks.

When changing the stored data format, keep the compatibility checks in
`server/data-format.test.ts` passing. Run `node scripts/record-data-format.mjs`
with the release version bump to record the formats the release reads and writes.

The [verification guide](verification/README.md) describes the disposable
server and fake-engine fixtures for testing workflows.
