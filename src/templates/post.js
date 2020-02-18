import React from 'react';
import { graphql } from 'gatsby';
import Nav from '../../components/Nav';
import Helmet from 'react-helmet';

export default function Template({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  return (
    <>
      <Helmet>
        <title>{frontmatter.title} | Cronokirby</title>
        <meta name="description" content={frontmatter.description} />
      </Helmet>
      <Nav />
      <div className="px-2 py-2 mx-auto my-4 text-gray-800 bg-white rounded shadow-md sm:w-5/6 lg:w-2/5">
        <img
          src={frontmatter.image}
          alt=""
          className="w-full"
        ></img>
        <div className="px-4 py-4 sm:px-8">
          <h2 className="mt-2 text-xl text-brown-800">{frontmatter.date}</h2>
          <h1 className="mb-4 text-6xl font-bold">{frontmatter.title}</h1>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      </div>
    </>
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
        description
      }
    }
  }
`;
