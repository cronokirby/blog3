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
        <div>
          <div className="mx-2 px-2 py-2 sm:mx-auto my-4 text-main rounded shadow-md bg-1 sm:w-11/12 lg:w-6/12 medium-container">
            <img
              src={frontmatter.image}
              alt=""
              className="object-contain mx-auto md:object-cover h-128"
            ></img>
            <div className="py-4 px-2 sm:px-4">
              <h2 className="mt-2 text-xl text-secondary">{frontmatter.date}</h2>
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                {frontmatter.title}
              </h1>
              <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: html }}
              ></div>
            </div>
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
