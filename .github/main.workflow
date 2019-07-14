workflow "publish to npm on push" {
  on = "push"
  resolves = ["npm publish"]
}

action "npm publish" {
  uses = "pascalgn/npm-publish-action@fdca9152ddc3425105f68f85d495deb9433d2dbc"
  secrets = ["GITHUB_TOKEN", "NPM_AUTH_TOKEN"]
  env = {
    TAG_NAME = "%s"
    TAG_MESSAGE = "Release %s"
  }
}
