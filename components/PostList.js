import React from 'react';
import { Link } from 'gatsby';

const PostCard = ({ ttr, title, date, image, path, tags }) => (
  <li className="flex flex-col justify-between w-11/12 px-2 py-2 mx-4 my-4 text-gray-800 bg-white rounded shadow-md sm:w-64">
    <div>
      <div className="h-48">
        <img
          src={image}
          className="object-cover object-top w-full h-48"
          alt=""
        ></img>
      </div>
      <div className="flex items-baseline justify-between mx-3 mt-2 text-gray-700">
        <span>{date}</span>
        <span>
          {ttr} <span className="italic">mins</span>
        </span>
      </div>
    </div>
    <h2 className="mx-2 text-xl font-bold hover:underline hover:text-blue-600">
      <Link to={path}>{title}</Link>
    </h2>
    <ul className="flex flex-wrap items-baseline justify-start mx-2 my-2 text-xs text-gray-700">
      {tags.map(t => (
        <li className="px-1 border-gray-700 hover:underline upper">
          <Link to={`/tag/${t}`}>{t}</Link>
        </li>
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
