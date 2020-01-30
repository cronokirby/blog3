import React from 'react';
import { graphql } from 'gatsby';
import PostList from '../../components/PostList';

export default ({ data }) => <PostList data={data} />;

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
