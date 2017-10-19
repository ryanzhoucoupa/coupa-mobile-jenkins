import {
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from '../actions/types';

const INITIAL_REGISTER = {
  errorMessage: '',
  githubLogin: ''
};

export default function (state = INITIAL_REGISTER, action) {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return { ...state, githubLogin: action.payload, errorMessage: '' };
    case REGISTER_FAIL:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
}
