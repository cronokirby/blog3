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

const Blob2 = () => (
  <svg
    width="93%"
    height="215%"
    viewBox="0 0 400 400"
    className="absolute"
    preserveAspectRatio="none"
    overflow="visible"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(210,100)">
      <path
        d="M121.9,-124.6C161.9,-111.7,201.1,-77,212.7,-34.1C224.3,8.8,208.3,59.9,178.2,94.3C148.1,128.8,104,146.6,66.6,142.9C29.2,139.1,-1.5,113.7,-46,106.2C-90.4,98.7,-148.7,109.1,-181.9,87.6C-215.1,66.1,-223.3,12.6,-211.6,-34.5C-199.9,-81.6,-168.4,-122.4,-129.8,-135.6C-91.3,-148.8,-45.6,-134.4,-2.4,-131.6C40.9,-128.8,81.8,-137.5,121.9,-124.6Z"
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
        <li>Contact</li>
        <li>Projects</li>
      </ul>
    </nav>
    <div className="flex flex-col items-center w-full mt-12 md:mt-24">
      <div className="relative inline-block">
        <Blob1 />
        <h1 className="relative z-10 font-bold text-4xl sm:text-5xl md:text-8xl text-main-600">
          Lúcás Meier
        </h1>
        <h2 className="relative z-10 text-2xl sm:text-3xl md:text-6xl text-main-600">
          Fullstack Developer
        </h2>
      </div>
      <div className="relative inline-block h-64 mt-24 md:mt-32 mx-8">
        <Blob2 />
        <div className="relative z-10 flex flex-wrap items-center justify-center py-4">
          <img src="/fluff/1.png" className="rounded-lg w-4/5 sm:w-1/2"></img>
          <div className="relative z-10 text-main-600 mx-4">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-main-600">
              I make websites
            </h1>
            <p className="text-sm">
              But not{' '}
              <a href="https://icons8.com/ouch" className="underline">
                these illustrations
              </a>
              .
            </p>
            <p className="text-lg w-64">
              From what you see, to what goes on behind the curtains, I like
              making great products.
            </p>
            <a href="foo" className="font-bold text-xl underline mt-4">See My Work!</a>
          </div>
        </div>
      </div>
    </div>
  </>
);
