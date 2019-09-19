import BikePreview from './BikePreview';
import ListPagination from './ListPagination';
import React from 'react';

const BikeList = props => {
  if (!props.bikes) {
    return (
      <div className="bike-preview">Loading...</div>
    );
  }

  if (props.bikes.length === 0) {
    return (
      <div className="bike-preview">
        No bikes are here... yet.
      </div>
    );
  }

  return (
    <div>
      {
        props.bikes.map(bike => {
          return (
            <BikePreview bike={bike} key={bike.slug} />
          );
        })
      }

      <ListPagination
        pager={props.pager}
        bikesCount={props.bikesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

export default BikeList;
