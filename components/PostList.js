import React from 'react';
import { Link } from 'gatsby';

const PostCard = ({ ttr, title, date, image, path, tags }) => (
  <li className="flex flex-col justify-between w-11/12 sm:w-64 mx-4 my-4 px-2 py-2 bg-white rounded shadow-md text-gray-800">
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
    <h2 className="mx-2 font-serif text-2xl font-bold hover:underline">
      <Link to={path}>{title}</Link>
    </h2>
    <ul className="flex flex-wrap items-baseline text-xs justify-start mx-2 my-2 text-gray-700">
      {tags.map(t => (
        <li className="hover:underline border-gray-700 px-1 upper">
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
