import { Link } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';
import Nav from '../../components/Nav'

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
    width="100%"
    height="100%"
    viewBox="0 0 433.87839 400.13974"
    className="absolute"
    preserveAspectRatio="none"
    overflow="visible"
  >
    <g transform="translate(110,200) scale(1.4, 1.1)">
      <path
        d="m 140.2,-197.3 c 44,7.4 83.8,42.1 108.7,86.6 25,44.5 35,98.7 16.9,141.2 C 247.6,72.9 201.3,103.6 164,136.4 126.7,169.1 98.4,204 66.9,201 35.4,198 0.7,157 -30.3,133.9 c -31,-23.1 -58.1,-28.4 -77.5,-44.1 -19.4,-15.8 -31,-42 -39.1,-71.1 -8,-29.2 -12.4,-61.3 -11.9,-103.2 0.4,-41.9 5.8,-93.5 33.1,-108.6 27.3,-15 76.5,6.5 125.2,7.4 48.6,0.8 96.7,-19 140.7,-11.6 z"
        fill="white"
      />
    </g>
  </svg>
);

const Blob3 = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 493.62344 408.27905"
    className="absolute"
    preserveAspectRatio="none"
    overflow="visible"
  >
    <g transform="translate(320, 140) scale(1.6, 1.1)">
      <path
        d="m 88.9,-129.4 c 43.5,19 107.8,14.6 134.1,37.7 26.3,23 14.5,73.6 -13.8,106.7 C 180.9,48 136.2,63.6 105,80.1 73.8,96.6 56.2,114 29.1,141.3 2,168.6 -34.7,205.7 -73.6,211.9 c -38.9,6.3 -80.1,-18.3 -112.2,-52.5 -32,-34.1 -54.7,-77.8 -64.8,-125.5 -10.1,-47.6 -7.6,-99.1 22.2,-127.4 29.7,-28.3 86.6,-33.5 129.2,-52.8 42.6,-19.4 70.9,-53.1 96.4,-48.7 25.5,4.3 48.2,46.7 91.7,65.6 z"
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
    <Nav />
    <div className="flex flex-col items-center w-full mt-12 md:mt-24">
      <div className="relative inline-block">
        <Blob1 />
        <h1 className="relative z-10 text-4xl font-bold sm:text-5xl md:text-8xl text-main-600">
          Lúcás Meier
        </h1>
        <h2 className="relative z-10 text-2xl sm:text-3xl md:text-6xl text-main-600">
          Fullstack Developer
        </h2>
      </div>
      <div className="flex flex-wrap items-center justify-center mt-16 md:mt-32">
        <img
          src="/fluff/1.png"
          className="z-10 w-10/12 rounded-lg shadow-lg sm:w-5/12"
        ></img>
        <div className="relative inline-block h-64 mx-8">
          <Blob2 />
          <div className="relative z-10 flex flex-wrap items-center justify-center py-4">
            <div className="relative z-10 mx-4 text-main-600">
              <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl text-main-600">
                I make websites
              </h1>
              <p className="text-sm">
                But not{' '}
                <a href="https://icons8.com/ouch" className="underline">
                  these illustrations
                </a>
                .
              </p>
              <p className="w-64 text-lg">
                From what you see, to what goes on behind the curtains, I like
                making great products.
              </p>
              <Link to="/projects" className="mt-4 text-xl font-bold underline">
                See My Work!
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap-reverse items-center justify-center mt-16 md:mt-32">
        <div className="relative inline-block h-64 mx-8">
          <Blob3 />
          <div className="relative z-10 flex flex-wrap items-center justify-center py-6">
            <div className="relative z-10 mx-4 text-main-600">
              <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl text-main-600">
                I write posts
              </h1>
              <p className="w-64 text-lg">
                I write about programming, technology, and whatever else is on
                my mind.
              </p>
              <Link to="/posts" className="mt-4 text-xl font-bold underline">
                See My Posts!
              </Link>
            </div>
          </div>
        </div>
        <img
          src="/fluff/2.png"
          className="z-10 w-10/12 rounded-lg shadow-lg sm:w-5/12 md:w-5/12 lg:w-3/12"
        ></img>
      </div>
    </div>
  </>
);
