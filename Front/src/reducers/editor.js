import {
  EDITOR_PAGE_LOADED,
  EDITOR_PAGE_UNLOADED,
  BIKE_SUBMITTED,
  ASYNC_START,
  ADD_TAG,
  REMOVE_TAG,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case EDITOR_PAGE_LOADED:
      return {
        ...state,
        bikeSlug: action.payload ? action.payload.bike.slug : '',
        title: action.payload ? action.payload.bike.title : '',
        description: action.payload ? action.payload.bike.description : '',
        body: action.payload ? action.payload.bike.body : '',
        tagInput: '',
        tagList: action.payload ? action.payload.bike.tagList : []
      };
    case EDITOR_PAGE_UNLOADED:
      return {};
    case BIKE_SUBMITTED:
      return {
        ...state,
        inProgress: null,
        errors: action.error ? action.payload.errors : null
      };
    case ASYNC_START:
      if (action.subtype === BIKE_SUBMITTED) {
        return { ...state, inProgress: true };
      }
      break;
    case ADD_TAG:
      return {
        ...state,
        tagList: state.tagList.concat([state.tagInput]),
        tagInput: ''
      };
    case REMOVE_TAG:
      return {
        ...state,
        tagList: state.tagList.filter(tag => tag !== action.tag)
      };
    case UPDATE_FIELD_EDITOR:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }

  return state;
};
