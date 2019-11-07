import BikeMeta from './BikeMeta';
import CommentContainer from './CommentContainer';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import marked from 'marked';
import { BIKE_PAGE_LOADED, BIKE_PAGE_UNLOADED } from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.bike,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: BIKE_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: BIKE_PAGE_UNLOADED })
});

class Bike extends React.Component {
  componentWillMount() {
    this.props.onLoad(Promise.all([
      agent.Bikes.get(this.props.match.params.id),
      agent.Comments.forBike(this.props.match.params.id)
    ]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.bike) {
      return null;
    }

    const markup = { __html: marked(this.props.bike.body, { sanitize: true }) };
    const canModify = this.props.currentUser &&
      this.props.currentUser.username === this.props.bike.author.username;
    return (
      <div className="bike-page">

        <div className="banner">
          <div className="container">

            <h1>{this.props.bike.title}</h1>
            <h2>{this.props.bike.description} €</h2>
            <BikeMeta
              bike={this.props.bike}
              canModify={canModify} />

          </div>
        </div>

        <div className="container page">

          <div className="row bike-content">
            <div className="col-xs-12">

              <div dangerouslySetInnerHTML={markup}></div>

              <ul className="tag-list">
                {
                  this.props.bike.tagList.map(tag => {
                    return (
                      <li
                        className="tag-default tag-pill tag-outline"
                        key={tag}>
                        {tag}
                      </li>
                    );
                  })
                }
              </ul>

            </div>
          </div>

          <hr />

          <div className="bike-actions">
          </div>

          <div className="row">
            <CommentContainer
              comments={this.props.comments || []}
              errors={this.props.commentErrors}
              slug={this.props.match.params.id}
              currentUser={this.props.currentUser} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bike);
