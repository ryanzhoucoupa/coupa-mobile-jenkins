import {
  FORM_CLEAR,
  FORM_GITHUB_LOGIN_UPDATE,
  FORM_GITHUB_LOGIN_SUCCESS,
  FORM_GITHUB_LOGIN_FAIL,
  FETCH_GITHUB_LOGIN,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from '../actions/types';

const INITIAL_FORM = {
  errorMessage: '',
  githubLogin: ''
};

export default function (state = INITIAL_FORM, action) {
  switch (action.type) {
    case FORM_CLEAR:
      return { ...state, githubLogin: '', errorMessage: '' };
    case REGISTER_SUCCESS:
      return { ...state, githubLogin: action.payload, errorMessage: '' };
    case REGISTER_FAIL:
      return { ...state, errorMessage: action.payload };
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
