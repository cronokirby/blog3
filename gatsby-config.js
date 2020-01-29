module.exports = {
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'content', path: `${__dirname}/src/content` },
    },
  ],
};
