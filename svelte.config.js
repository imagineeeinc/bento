import adapter from '@sveltejs/adapter-node'

export default {
  kit: {
    adapter: adapter(),
    version: {
      name: process.env.npm_package_version
    }
  }
}
