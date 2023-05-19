module.exports = {
  release: {
    branches: [
      "+([0-9])?(.{+([0-9]),x}).x",
      "master",
      "next",
      "next-major",
      { name: "beta", prerelease: true },
      { name: "alpha", prerelease: true },
    ],
    plugins: [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/npm",
      [
        "@semantic-release-plus/docker",
        {
          name: process.env.IMAGE_NAME,
          registry: process.env.REGISTRY,
        },
      ],
    ],
  },
  publish: [
    {
      path: "@semantic-release/github",
      assets: [
        {
          path: "tsp-web*.deb",
          label: "Debian Package",
        },
      ],
    },
  ],
};
