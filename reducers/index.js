import { combineReducers } from 'redux';
import jenkins from './JenkinsReducer';
import forms from './FormReducer';

export default combineReducers({
  jenkins, forms
});
