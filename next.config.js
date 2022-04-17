const dev = process.env.NODE_ENV !== 'production'
module.exports = {
    env: {
        API_URL: dev ? 'https://localhost:5000' : 'https://gammonist.com'
    },
    trailingSlash: true,
    eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
    },
    swcMinify: false    
};