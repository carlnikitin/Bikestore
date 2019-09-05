import React from 'react';

const Banner = ({ appName, token }) => {
  if (token) {
    return null;
  }
  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">
          Bikestore
        </h1>
        <p>A place for bikes.</p>
      </div>
    </div>
  );
};

export default Banner;
