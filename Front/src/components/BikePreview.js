import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import { BIKE_FAVORITED, BIKE_UNFAVORITED } from '../constants/actionTypes';

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

const mapDispatchToProps = dispatch => ({
  favorite: slug => dispatch({
    type: BIKE_FAVORITED,
    payload: agent.Bikes.favorite(slug)
  }),
  unfavorite: slug => dispatch({
    type: BIKE_UNFAVORITED,
    payload: agent.Bikes.unfavorite(slug)
  })
});

const BikePreview = props => {
  const bike = props.bike;


  const handleClick = ev => {
    ev.preventDefault();
    if (bike.favorited) {
      props.unfavorite(bike.slug);
    } else {
      props.favorite(bike.slug);
    }
  };

  return (
    <div className="bike-preview">
      <div className="bike-meta">
        <Link to={`/@${bike.author.username}`}>
          <img src={bike.author.image} alt={bike.author.username} />
        </Link>

        <div className="info">
          <Link className="author" to={`/@${bike.author.username}`}>
            {bike.author.username}
          </Link>
          <span className="date">
            {new Date(bike.createdAt).toDateString()}
          </span>
        </div>

      </div>

      <Link to={`/bike/${bike.slug}`} className="preview-link">
        <h1>{bike.title}</h1>
        <p>{bike.description}</p>
        <span>Read more about this bike...</span>
        <ul className="tag-list">
          {
            bike.tagList.map(tag => {
              return (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              )
            })
          }
        </ul>
      </Link>
    </div>
  );
}

export default connect(() => ({}), mapDispatchToProps)(BikePreview);
