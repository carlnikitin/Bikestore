import {
  BIKE_FAVORITED,
  BIKE_UNFAVORITED,
  SET_PAGE,
  APPLY_TAG_FILTER,
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  CHANGE_TAB,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_LOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case BIKE_FAVORITED:
    case BIKE_UNFAVORITED:
      return {
        ...state,
        bikes: state.bikes.map(bike => {
          if (bike.slug === action.payload.bike.slug) {
            return {
              ...bike,
              favorited: action.payload.bike.favorited,
              favoritesCount: action.payload.bike.favoritesCount
            };
          }
          return bike;
        })
      };
    case SET_PAGE:
      return {
        ...state,
        bikes: action.payload.bikes,
        bikesCount: action.payload.bikesCount,
        currentPage: action.page
      };
    case APPLY_TAG_FILTER:
      return {
        ...state,
        pager: action.pager,
        bikes: action.payload.bikes,
        bikesCount: action.payload.bikesCount,
        tab: null,
        tag: action.tag,
        currentPage: 0
      };
    case HOME_PAGE_LOADED:
      return {
        ...state,
        pager: action.pager,
        tags: action.payload[0].tags,
        bikes: action.payload[1].bikes,
        bikesCount: action.payload[1].bikesCount,
        currentPage: 0,
        tab: action.tab
      };
    case HOME_PAGE_UNLOADED:
      return {};
    case CHANGE_TAB:
      return {
        ...state,
        pager: action.pager,
        bikes: action.payload.bikes,
        bikesCount: action.payload.bikesCount,
        tab: action.tab,
        currentPage: 0,
        tag: null
      };
    case PROFILE_PAGE_LOADED:
    case PROFILE_FAVORITES_PAGE_LOADED:
      return {
        ...state,
        pager: action.pager,
        bikes: action.payload[1].bikes,
        bikesCount: action.payload[1].bikesCount,
        currentPage: 0
      };
    case PROFILE_PAGE_UNLOADED:
    case PROFILE_FAVORITES_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
