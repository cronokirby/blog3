import React from 'react';
import Nav from './Nav';

export default props => (
  <div className="relative">
    <div className="relative z-20">
      <Nav />
      {props.children}
    </div>
  </div>
);
