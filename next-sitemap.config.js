/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://psychedelicbeacon.com',
  generateRobotsTxt: false,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*'],

  transform: async (config, path) => {
    // Provider pages — highest SEO priority
    if (path.startsWith('/provider/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    // City pages
    if (/^\/clinics\/[^/]+\/[^/]+$/.test(path)) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.85,
        lastmod: new Date().toISOString(),
      }
    }
    // State hub pages
    if (/^\/clinics\/[^/]+$/.test(path)) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    // Homepage
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
