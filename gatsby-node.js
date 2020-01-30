const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);

async function markdownpages(createPage, graphql) {
  const result = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: { type: { eq: "post" } } }) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    console.error(result.errors);
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: path.resolve('src/templates/post.js'),
    });
  });
}

async function tagPages(createPage, graphql) {
  const result = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: { type: { eq: "post" } } }) {
        edges {
          node {
            frontmatter {
              tags
            }
          }
        }
      }
    }
  `);
  const tags = [];
  for (const edge of result.data.allMarkdownRemark.edges) {
    tags.push(...edge.node.frontmatter.tags);
  }
  tags.forEach(tag => {
    createPage({
      path: `/tag/${tag}`,
      component: path.resolve('src/templates/taglist.js'),
      context: { tag },
    });
  });
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  await markdownpages(createPage, graphql);
  await tagPages(createPage, graphql);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
