const plugins = [
  "@semantic-release/commit-analyzer",
  "@semantic-release/release-notes-generator",
  "@semantic-release/npm",
  [
    "@semantic-release/exec",
    {
      verifyReleaseCmd: "echo ${nextRelease.version} > .VERSION",
    },
  ],
  process.env.DRY_RUN === "true"
    ? null
    : [
        "@semantic-release-plus/docker",
        {
          name: process.env.IMAGE_NAME?.toLowerCase() || "tsp-web",
          registry: process.env.REGISTRY || "ghcr.io",
        },
      ],
  [
    "@semantic-release/github",
    {
      assets: [
        {
          path: "tsp-web*.deb",
          label: "Debian Package",
        },
      ],
    },
  ],
].filter(Boolean);

module.exports = {
  branches: [
    "+([0-9])?(.{+([0-9]),x}).x",
    "master",
    "next",
    "next-major",
    { name: "beta", prerelease: true },
    { name: "alpha", prerelease: true },
  ],
  plugins,
};
