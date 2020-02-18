import React from 'react';
import { Helmet } from 'react-helmet';

const Blob1 = () => (
  <svg
  width="130%"
    height="180%"
    viewBox="0 0 400 400"
    className="absolute top-0 left-0"
    preserveAspectRatio="none"
    overflow="visible"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(130,120)">
      <path
        d="M145.5,-167.6C179.1,-145.2,190.5,-90.4,205.3,-32.4C220,25.6,238.2,86.8,214.1,118.9C189.9,151,123.5,154,75,145.3C26.4,136.6,-4.2,116.2,-51.4,111.8C-98.6,107.4,-162.3,118.9,-185.6,97.9C-208.8,76.8,-191.6,23,-173.1,-21.6C-154.6,-66.2,-134.8,-101.7,-105.8,-124.9C-76.7,-148.1,-38.4,-159,8.8,-169.5C55.9,-180,111.8,-190,145.5,-167.6Z"
        fill="white"
      />
    </g>
  </svg>
);

export default () => (
  <>
    <Helmet>
      <title>About | Cronokirby</title>
      <meta
        name="description"
        content="This is Lúcás Meier's personal website."
      ></meta>
    </Helmet>
    <nav>
        <ul className="flex justify-around text-2xl font-bold text-white md:mx-8 py-2">
            <li>Posts</li>
            <li>About</li>
            <li>Projects</li>
        </ul>
    </nav>
    <div className="flex flex-col items-center w-full mt-24">
      <div className="relative inline-block">
        <Blob1 />
        <h1 className="relative z-10 font-bold text-4xl sm:text-5xl md:text-8xl text-main-600">Lúcás Meier</h1>
        <h2 className="relative z-10 text-2xl sm:text-3xl md:text-6xl text-main-600">Fullstack Developer</h2>
      </div>
    </div>
  </>
);
