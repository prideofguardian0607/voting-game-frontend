const dev = process.env.NODE_ENV !== 'production'
module.exports = {
    env: {
        API_URL: dev ? 'http://localhost:5000' : 'http://localhost:5000'
    },
    trailingSlash: true,
};