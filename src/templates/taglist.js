import React from 'react';
import { graphql } from 'gatsby';
import PostList from '../../components/PostList';
import Helmet from 'react-helmet';
import Layout from '../../components/Layout';

export default ({ data, pageContext }) => (
  <>
    <Helmet>
      <title>Posts under "{pageContext.tag}" | Cronokirby</title>
      <meta
        name="description"
        content={`These are all of Cronokirby's blogposts under "${pageContext.tag}"`}
      />
    </Helmet>
    <Layout>
      <PostList data={data} />
    </Layout>
  </>
);

export const pageQuery = graphql`
  query($tag: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$tag] }, type: { eq: "post" } } }
      sort: { fields: [frontmatter___date], order: DESC }
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
