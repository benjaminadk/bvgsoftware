const withVideos = require('next-videos')

module.exports = withVideos({
  webpack: (config, { isServer }) => {
    if (isServer) {
      require('./lib/generate-sitemap')()
    }

    return config
  }
})
