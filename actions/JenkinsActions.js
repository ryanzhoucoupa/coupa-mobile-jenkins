import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import {
  JENKINS_UPDATE_RECEIVED,
  JENKINS_DELETE,
  JENKINS_DELETE_ALL,
  JENKINS_ASYNC_LOAD_FROM_STORAGE
} from './types';

const JENKINS_DATA = 'jenkinsData';

const fetchAndParseJenkinsData = async () => {
  let jenkinsData = await AsyncStorage.getItem(JENKINS_DATA) || '[]';
  return JSON.parse(jenkinsData);
};
// ====================================================
export const clearAll = () => async dispatch => {
  await AsyncStorage.setItem(JENKINS_DATA, '[]');
  dispatch({ type: JENKINS_DELETE_ALL });
};

export const deleteJenkinsData = (ghprbPullId) => async dispatch => {
  let jenkinsData = await fetchAndParseJenkinsData();
  _.remove(jenkinsData, { ghprbPullId });

  await AsyncStorage.setItem(JENKINS_DATA, JSON.stringify(jenkinsData));
  dispatch({ type: JENKINS_DELETE, payload: jenkinsData });
};

export const updateJenkinsReceived = ({ ghprbTargetBranch, comment, url, context, ghprbPullId, status }) => async dispatch => {
  let jenkinsData = await fetchAndParseJenkinsData();

  const index = _.findIndex(jenkinsData, { ghprbPullId });

  if (index > 0) {
    jenkinsData.splice(index, 1, { ghprbTargetBranch, comment, url, context, ghprbPullId, status });
  } else {
    jenkinsData.push({ ghprbTargetBranch, comment, url, context, ghprbPullId, status});
  }

  await AsyncStorage.setItem(JENKINS_DATA, JSON.stringify(jenkinsData));

  dispatch({
    type: JENKINS_UPDATE_RECEIVED,
    payload: jenkinsData
  });
};

export const asyncLoadJenkinsFromStorage = () => async dispatch => {
  let jenkinsData = await fetchAndParseJenkinsData();

  dispatch({
    type: JENKINS_ASYNC_LOAD_FROM_STORAGE,
    payload: jenkinsData
  });
};
