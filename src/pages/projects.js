import React from 'react';
import { graphql } from 'gatsby';

const ProjectCard = ({ html, description, title, tech, link }) => {
  return (
    <div className="bg-brown-500 text-brown-900 mx-4 my-4 px-4 py-2">
      <h1 className="text-3xl font-bold">
        <a href={link}>{title}</a>
      </h1>
      <h2 className="w-64 text-lg text-brown-800">{description}</h2>
      <ul className="my-2 w-64 flex text-brown-700 underline flex-wrap">
        {tech.map(t => (
          <li className="mr-1">{t}</li>
        ))}
      </ul>
      <div
        className="w-64 text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
};

export default ({ data }) => {
  const nodes = data.allMarkdownRemark.edges;

  const projects = nodes.map(
    ({
      node: {
        html,
        frontmatter: { title, description, tech, link },
      },
    }) => (
      <ProjectCard
        title={title}
        html={html}
        description={description}
        tech={tech}
        link={link}
      />
    )
  );

  return (
    <ul className="flex flex-wrap justify-center items-stretch lg:w-1/2 mx-auto">
      {projects}
    </ul>
  );
};

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "project" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          html
          frontmatter {
            title
            description
            tech
            link
          }
        }
      }
    }
  }
`;
