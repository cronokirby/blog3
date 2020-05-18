import React from 'react';
import { Link } from 'gatsby';

const PostCard = ({ ttr, title, date, image, path, tags }) => (
  <li className="flex flex-col justify-between px-2 py-2 text-main rounded shadow-md bg-1">
    <div className="z-10">
      <div className="h-48">
        <img
          src={image}
          className="object-cover object-top w-full h-48"
          alt=""
        ></img>
      </div>
      <div className="flex items-baseline justify-between mx-3 mt-2 text-secondary">
        <span>{date}</span>
        <span>
          <span className="font-bold">{ttr}</span>
          {' '}
          <span className="italic">mins</span>
        </span>
      </div>
    </div>
    <h2 className="z-10 mx-2 text-xl font-bold hover:underline text-hover">
      <Link to={path}>{title}</Link>
    </h2>
    <ul className="z-10 flex flex-wrap items-baseline justify-start text-xs text-main rounded font-bold">
      {tags.map(t => (
        <li className="ml-2 my-1 px-1 bg-3 hover:underline rounded">
          <Link to={`/tag/${t}`}>{t}</Link>
        </li>
      ))}
    </ul>
  </li>
);

export default ({ data }) => {
  const edges = data.allMarkdownRemark.edges;

  const posts = (
    <ul className="grid w-11/12 gap-8 mx-auto sm:grid-cols-1 md:grid-cols-3 lg:w-2/3 xl:w-1/2">
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
