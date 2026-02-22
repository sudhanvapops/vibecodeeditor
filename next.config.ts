import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: '',
        pathname: "/**"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
            // value: "unsafe-none",
          },
        ],
      },

    //   {
    //     source: "/((?!playground).*)",
    //     headers: [
    //       {
    //         key: "Cross-Origin-Opener-Policy",
    //         value: "same-origin-allow-popups",
    //       },
    //       {
    //         key: "Cross-Origin-Embedder-Policy",
    //         value: "unsafe-none",
    //       },
    //     ],
    //   },
    ];
  },
  reactStrictMode: false
};

export default nextConfig;
