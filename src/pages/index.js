import React from 'react';
import { graphql } from 'gatsby';

const PostCard = ({ ttr, title, date, image }) => (
  <li className="flex flex-col justify-between w-64 mx-4 my-4 bg-brown-500">
    <div className="h-48">
      <img src={image} className="object-cover h-48 w-full" alt=""></img>
    </div>
    <div className="p-2">
      <h2 className="font-bold font-serif text-2xl">{title}</h2>
      <span className="text-lg text-brown-800">{date}</span>
    </div>
  </li>
);

export default ({ data }) => {
  const edges = data.allMarkdownRemark.edges;

  const posts = (
    <ul className="mx-auto lg:w-1/2 w-11/12 justify-center sm:justify-start flex flex-wrap">
      {edges.map(
        ({
          node: {
            timeToRead,
            frontmatter: { path, title, date, image },
          },
        }) => (
          <PostCard
            ttr={timeToRead}
            path={path}
            title={title}
            date={date}
            image={image}
          />
        )
      )}
    </ul>
  );

  return <div className="font-sans text-brown-900">{posts}</div>;
};

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark {
      edges {
        node {
          timeToRead
          frontmatter {
            path
            title
            image
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
