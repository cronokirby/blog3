import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../../components/Layout';
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
      <Layout>
        <div className="w-11/12 px-2 py-2 mx-auto my-4 rounded shadow-md text-nord6 bg-nord0 sm:w-5/6 lg:w-6/12">
          <img
            src={frontmatter.image}
            alt=""
            className="object-contain mx-auto md:object-cover h-128"
          ></img>
          <div className="px-4 py-4 sm:px-8">
            <h2 className="mt-2 text-xl text-brown-800">{frontmatter.date}</h2>
            <h1 className="mb-4 text-3xl font-bold md:text-6xl">
              {frontmatter.title}
            </h1>
            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
          </div>
        </div>
      </Layout>
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
