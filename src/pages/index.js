import React from 'react';
import { graphql } from 'gatsby';

const PostCard = ({ ttr, title, date, image, path, tags }) => (
  <li className="flex flex-col justify-between w-11/12 sm:w-64 mx-4 my-4 bg-brown-500">
    <div>
      <div className="h-48">
        <img
          src={image}
          className="object-cover object-top w-full h-48"
          alt=""
        ></img>
      </div>
      <div className="flex items-baseline justify-between mx-3 mt-2 text-brown-800">
        <span>{date}</span>
        <span>
          {ttr} <span className="italic">mins</span>
        </span>
      </div>
    </div>
    <h2 className="mx-2 font-serif text-2xl font-bold hover:underline">
      <a href={path}>{title}</a>
    </h2>
    <ul className="flex flex-wrap items-baseline text-xs justify-start mx-2 my-2 text-brown-800">
      {tags.map(t => (
        <li className="hover:underline border-brown-800 px-1 upper">{t}</li>
      ))}
    </ul>
  </li>
);

export default ({ data }) => {
  const edges = data.allMarkdownRemark.edges;

  const posts = (
    <ul className="flex flex-wrap justify-center w-11/12 mx-auto lg:w-1/2 sm:justify-start">
      {edges.map(
        ({
          node: {
            timeToRead,
            frontmatter: { path, title, date, image, tags },
          },
        }) => (
          <PostCard
            ttr={timeToRead}
            path={path}
            title={title}
            date={date}
            image={image}
            tags={tags}
          />
        )
      )}
    </ul>
  );

  return <div className="font-sans text-brown-900">{posts}</div>;
};

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
