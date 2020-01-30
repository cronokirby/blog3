import React from 'react';
import { graphql } from 'gatsby';

export default function Template({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  return (
    <div className="bg-brown-400 my-4 sm:w-5/6 lg:w-1/2 mx-auto text-brown-900">
      <img
        src={frontmatter.image}
        alt=""
        className="h-128 w-full object-cover"
      ></img>
      <div className="px-4 sm:px-8 py-4">
        <h2 className="text-xl text-brown-800 mt-2">{frontmatter.date}</h2>
        <h1 className="text-5xl font-bold mb-4">{frontmatter.title}</h1>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        image
        path
        title
      }
    }
  }
`;
