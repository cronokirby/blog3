import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import Nav from '../../components/Nav';

const ProjectCard = ({ html, description, title, tech, link, image, even }) => {
  return (
    <div
      className={`flex items-center justify-center mx-auto my-2 ${
        even ? 'flex-wrap' : 'flex-wrap-reverse'
      }`}
    >
      {!even ? null : (
        <div className="w-3/4 sm:w-1/3">
          <img src={image} className="object-contain rounded shadow-md"></img>
        </div>
      )}

      <div className="px-4 py-2 mx-4 my-4 text-gray-800 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold hover:underline">
          <a href={link}>{title}</a>
        </h1>
        <h2 className="w-64 text-lg text-brown-800">{description}</h2>
        <ul className="flex flex-wrap w-64 my-2 italic text-brown-700">
          {tech.map(t => (
            <li className="mr-3">{t}</li>
          ))}
        </ul>
        <div
          className="w-64 text-sm project"
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </div>
      {even ? null : (
        <div className="w-3/4 sm:w-1/3">
          <img src={image} className="object-contain rounded shadow-md"></img>
        </div>
      )}
    </div>
  );
};

export default ({ data }) => {
  const nodes = data.allMarkdownRemark.edges;

  const projects = nodes.map(
    (
      {
        node: {
          html,
          frontmatter: { title, description, tech, link, image },
        },
      },
      i
    ) => (
      <ProjectCard
        title={title}
        html={html}
        description={description}
        tech={tech}
        link={link}
        image={image}
        even={i % 2 === 0}
      />
    )
  );

  return (
    <>
      <Helmet>
        <title>Projects | Cronokirby</title>
        <meta
          name="description"
          content="This is where all of Cronokirby's projects can be found"
        />
      </Helmet>
      <Nav />
      <ul className="flex flex-wrap justify-center mx-auto lg:w-1/2">
        {projects}
      </ul>
    </>
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
            image
          }
        }
      }
    }
  }
`;
