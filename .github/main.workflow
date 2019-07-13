workflow "publish to npm on push" {
  on = "push"
  resolves = ["npm publish"]
}

action "npm publish" {
  uses = "pascalgn/npm-publish-action@30a7f54b1e50359f172082b935a0e7a1c6d887be"
  secrets = ["GITHUB_TOKEN", "NPM_AUTH_TOKEN"]
  env = {
    TAG_NAME = "%s"
    TAG_MESSAGE = "Release %s"
  }
}
