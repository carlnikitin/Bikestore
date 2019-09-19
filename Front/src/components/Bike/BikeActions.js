import { Link } from 'react-router-dom';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { DELETE_BIKE } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onClickDelete: payload =>
    dispatch({ type: DELETE_BIKE, payload })
});

const BikeActions = props => {
  const bike = props.bike;
  const del = () => {
    props.onClickDelete(agent.Bikes.del(bike.slug))
  };
  if (props.canModify) {
    return (
      <span>

        <Link
          to={`/editor/${bike.slug}`}
          className="btn btn-outline-secondary btn-sm">
          <i className="ion-edit"></i> Edit Bike
        </Link>

        <button className="btn btn-outline-danger btn-sm" onClick={del}>
          <i className="ion-trash-a"></i> Delete Bike
        </button>

      </span>
    );
  }

  return (
    <span>
    </span>
  );
};

export default connect(() => ({}), mapDispatchToProps)(BikeActions);
