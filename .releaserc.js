// @ts-check

const plugins = [
  "@semantic-release/commit-analyzer",
  "@semantic-release/release-notes-generator",
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
        // Windows
        {
          path: "tsp-web.exe",
          label: "TSP Web (windows/amd64)",
        },
        // Linux
        {
          path: "tsp-web_linux_amd64",
          label: "TSP Web (linux/amd64)",
        },
        {
          path: "tsp-web_linux_arm64",
          label: "TSP Web (linux/arm64)",
        },
        {
          path: "tsp-web_linux_armv5",
          label: "TSP Web (linux/armv5)",
        },
        {
          path: "tsp-web_linux_armv7",
          label: "TSP Web (linux/armv7)",
        },
        // Mac
        {
          path: "tsp-web_darwin_arm64",
          label: "TSP Web (darwin/arm64)",
        },
        {
          path: "tsp-web_darwin_amd64",
          label: "TSP Web (darwin/amd64)",
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
