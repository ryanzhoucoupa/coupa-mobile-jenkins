import {
  FORM_GITHUB_LOGIN_UPDATE,
  FORM_GITHUB_LOGIN_SUCCESS,
  FORM_GITHUB_LOGIN_FAIL,
  FETCH_GITHUB_LOGIN
} from '../actions/types';

const INITIAL_FORM = {
  errorMessage: ''
};

export default function (state = INITIAL_FORM, action) {
  switch (action.type) {
    case FETCH_GITHUB_LOGIN:
      return { ...state, ...action.payload };
    case FORM_GITHUB_LOGIN_UPDATE:
      return { ...action.payload, [action.payload.prop]: action.payload.value };
    case FORM_GITHUB_LOGIN_SUCCESS:
      return { ...state, errorMessage: '' };
    case FORM_GITHUB_LOGIN_FAIL:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
}
