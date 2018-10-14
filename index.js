"use strict";

const { spawn } = require("child_process");

async function forEachBranch({
  dir,
  branches = /.+/,
  remote = "origin",
  force = false,
  reset = false,
  clean = false,
  callback = () => {}
} = {}) {
  const allRefs = await git(dir, [
    "for-each-ref",
    "--format=%(objectname) %(refname:lstrip=3)",
    `refs/remotes/${remote}/`
  ]);
  const filteredRefs = allRefs
    .split("\n")
    .map(str => str.trim())
    .map(str => {
      const split = str.split(" ", 2);
      return split.length === 2 ? { head: split[0], branch: split[1] } : null;
    })
    .filter(ref => ref && ref.branch.length > 0 && ref.branch !== "HEAD")
    .filter(ref => ref.branch.match(branches));
  const filteredBranches = filteredRefs.map(ref => ref.branch);
  for (const ref of filteredRefs) {
    const { branch, head } = ref;
    if (force) {
      await git(dir, ["checkout", "--quiet", "--force", branch]);
    } else {
      await git(dir, ["checkout", "--quiet", branch]);
    }
    if (reset) {
      await git(dir, ["reset", "--quiet", "--hard", `${remote}/${branch}`]);
    }
    if (clean) {
      await git(dir, ["clean", "--quiet", "-d", "--force", "--force"]);
    }
    await Promise.resolve(
      callback({
        dir,
        branch,
        head,
        branches: filteredBranches,
        refs: filteredRefs
      })
    );
  }
  return filteredRefs;
}

function git(cwd, args = []) {
  const stdio = ["ignore", "pipe", "inherit"];
  return new Promise((resolve, reject) => {
    const proc = spawn("git", args, { cwd, stdio });
    const buffers = [];
    proc.stdout.on("data", data => buffers.push(data));
    proc.on("exit", code => {
      if (code === 0) {
        const data = Buffer.concat(buffers);
        resolve(data.toString("utf8"));
      } else {
        reject({ code });
      }
    });
  });
}

module.exports = { forEachBranch };
