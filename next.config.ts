import type { NextConfig } from "next";
import { webpack } from "next/dist/compiled/webpack/webpack";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  compiler: {
    // removeConsole: process.env.NODE_ENV !== "development",
  },
  webpack(config) {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer"),
      encoding: false,
      path: false,
      fs: false,
      stream: false,
    };

    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ];

    return config;
  },
};

export default nextConfig;
