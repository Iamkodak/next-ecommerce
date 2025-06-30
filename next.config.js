// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "media.istockphoto.com",
      "plus.unsplash.com",
      "static.wixstatic.com", // 👈 Add this line
    ],
  },
};

module.exports = nextConfig;
