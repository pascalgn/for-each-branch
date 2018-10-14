# for-each-branch

Iterate over all branches in a repository.

## Requirements

This library requires `git` to be available in your PATH!

## Installation

```shell
npm install for-each-branch
```

or

```shell
yarn add for-each-branch
```

## Usage

```js
const { forEachBranch } = require("for-each-branch");

forEachBranch({
  dir: "./a-local-git-workspace",
  callback: obj => console.log(obj.branch)
});
```

## API

### forEachBranch(options)

Calls `git checkout` for each remote branch and calls the callback. The _options_ argument is an object with the following recognized keys:

- `dir` - The directory of the Git workspace
- `branches` (default `/.+/`) - Regular expression or string, branches not matching will be ignored
- `remote` (default `origin`) - Name of the Git remote
- `force` (default `false`) - Use `--force` when calling `git checkout`
- `reset` (default `false`) - Reset the branch to the head of the remote branch after checkout
- `clean` (default `false`) - Run `git clean` after checkout
- `callback` (default `() => {}`) - The callback to call after each branch has been checked out. When the callback returns a _Promise_, execution will halt until it is resolved

> To prevent accidental deletions, `force`, `reset` and `clean` all default to `false`.
> However, they should probably be set to `true` for almost all use cases. Otherwise,
> switches between branches might not work or build results will be unreproducible.

The callback will receive an object of the form `{ dir, branch, head, branches, refs }`, where `dir` is
the directory of the Git workspace, `branch` is the currently checked-out branch, `head` is the SHA of
the current HEAD of the branch, `branches` is a list of all (filtered) branches in the repository
and `refs` is a list of `{ branch, head }` items.

Returns a _Promise_ that resolves to a list of `{ branch, head }` items.

## License

MIT
