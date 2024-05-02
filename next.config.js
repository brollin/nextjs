/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    // Use glslify-loader for GLSL files
    config.module.rules.push({ test: /\.(glsl|vs|fs|vert|frag)$/, use: ["raw-loader", "glslify-loader"] });
    // Use raw-loader for Markdown files
    config.module.rules.push({ test: /\.md$/, use: "raw-loader" });
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

module.exports = nextConfig;
