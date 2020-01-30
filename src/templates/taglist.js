import React from 'react';
import { graphql } from 'gatsby';
import PostList from '../../components/PostList';
import Nav from '../../components/Nav';

export default ({ data }) => <><Nav/><PostList data={data} /></>;

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
