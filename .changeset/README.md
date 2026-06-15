# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets).
It records, in version-control, the not-yet-released changes to the package.

## Adding a changeset

When you make a change worth releasing, run:

```bash
pnpm changeset
```

Pick the bump type (patch / minor / major) and write a one-line summary. This
creates a markdown file in this folder — commit it with your change.

## Releasing (maintainers)

```bash
pnpm changeset:version    # consume changesets: bump version, update CHANGELOG.md
pnpm changeset:publish     # publish to npm (prepublishOnly builds the package first)
```

`changeset:publish` runs `changeset publish`, which invokes `npm publish`; the
package's `prepublishOnly` script builds `dist/` before the tarball is pushed.
(The scripts are named `changeset:*` rather than `version`/`release` to avoid
colliding with pnpm's built-in `version` command.)
