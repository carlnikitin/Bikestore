import BikeActions from './BikeActions';
import { Link } from 'react-router-dom';
import React from 'react';

const BikeMeta = props => {
  const bike = props.bike;
  return (
    <div className="bike-meta">
      <Link to={`/@${bike.author.username}`}>
        <img src={bike.author.image} alt={bike.author.username} />
      </Link>

      <div className="info">
        <Link to={`/@${bike.author.username}`} className="author">
          {bike.author.username}
        </Link>
        <span className="date">
          {new Date(bike.createdAt).toDateString()}
        </span>
      </div>

      <BikeActions canModify={props.canModify} bike={bike} />
    </div>
  );
};

export default BikeMeta;
