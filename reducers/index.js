import { combineReducers } from 'redux';
import jenkins from './JenkinsReducer';
import forms from './FormReducer';
import register from './CameraReducer';

export default combineReducers({
  jenkins, forms, register
});
