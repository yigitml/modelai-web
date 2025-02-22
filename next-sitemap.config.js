/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://takeaiphotos.com',
  generateRobotsTxt: true,
  exclude: [
    '/404',
    '/api/*',
    '/admin',
    '/home',
    '/new-model',
    '/onboarding',
    '/onboarding-freemium',
    '/profile',
    '/credits',   
    '/unauthorized',
    '/legal/*',
  ],
  changefreq: 'daily',
  priority: 0.7,
  
  additionalPaths: async (config) => {
    const dynamicPaths = [
      '/',
      '/auth/signin',
      '/features',
    ];

    return dynamicPaths.map((path) => ({
      loc: path,
      lastmod: new Date().toISOString(),
      priority: 0.8,
    }));
  },
};