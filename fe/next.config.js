const path = require("node:path");

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;
