module.exports = {
  siteMetadata: {
    title: "Cronokirby's Blog",
    description: 'A blog about programming and other things',
    siteUrl: `https://cronokirby.github.io`,
  },
  plugins: [
    'gatsby-plugin-feed',
    'gatsby-plugin-postcss',
    'gatsby-transformer-remark',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'content', path: `${__dirname}/src/content` },
    },
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        tailwind: true,
      },
    },
  ],
};
