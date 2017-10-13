import {
  JENKINS_UPDATE_RECEIVED,
  JENKINS_ASYNC_LOAD_FROM_STORAGE,
  JENKINS_DELETE,
  JENKINS_DELETE_ALL
} from '../actions/types';

const INITITAL_JENKINS = [];

export default function (state = INITITAL_JENKINS, action) {
  switch (action.type) {
    case JENKINS_DELETE_ALL:
      return INITITAL_JENKINS;
    case JENKINS_DELETE:
      return [...action.payload];
    case JENKINS_ASYNC_LOAD_FROM_STORAGE:
      return [...state, ...action.payload];
    case JENKINS_UPDATE_RECEIVED:
      return [...action.payload];
    default:
      return state;
  }
}
