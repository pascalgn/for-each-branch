const { join } = require("path");
const { execSync } = require("child_process");

const { describe, it } = require("mocha");
const { expect } = require("chai");

const { mkdir, remove } = require("fs-extra");
const tmp = require("tmp-promise");

const { forEachBranch } = require("./index");

describe("for-each-branch", () => {
  it("should list all existing remote branches", async function() {
    const tmpdir = await tmp.dir();
    try {
      const stdio = "ignore";

      const remote = join(tmpdir.path, "remote");
      await mkdir(remote);
      execSync("git init", { cwd: remote, stdio });
      execSync("git commit --allow-empty -m C1", { cwd: remote, stdio });
      execSync("git checkout -b B1", { cwd: remote, stdio });
      execSync("git commit --allow-empty -m C2", { cwd: remote, stdio });
      execSync("git checkout -b B2", { cwd: remote, stdio });
      execSync("git commit --allow-empty -m C3", { cwd: remote, stdio });

      const local = join(tmpdir.path, "local");
      execSync(`git clone "${remote}" "${local}"`, {
        cwd: tmpdir.path,
        stdio
      });

      const callbackBranches = [];
      await forEachBranch({
        dir: local,
        reset: true,
        clean: true,
        callback: b => callbackBranches.push(b.branch)
      });
      expect(callbackBranches).to.deep.equal(["B1", "B2", "master"]);

      const refs = await forEachBranch({ dir: local });
      const branches = refs.map(ref => ref.branch);
      expect(branches).to.deep.equal(["B1", "B2", "master"]);
    } finally {
      await remove(tmpdir.path);
    }
  });
});
