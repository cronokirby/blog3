import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import PostList from '../../components/PostList';
import Layout from '../../components/Layout';

export default ({ data }) => (
  <>
    <Helmet>
      <title>Posts | Cronokirby</title>
      <meta
        name="description"
        content="This is where all of Cronokirby's blog posts can be found"
      ></meta>
    </Helmet>
    <Layout>
      <PostList data={data} />
    </Layout>
  </>
);

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { type: { eq: "post" } } }
    ) {
      edges {
        node {
          timeToRead
          frontmatter {
            path
            title
            image
            tags
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
