/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  experimental: {
    serverActions: true,
  },
  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: function webpack(config) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...config.resolve.fallback,

      fs: false, // the solution
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default config;
