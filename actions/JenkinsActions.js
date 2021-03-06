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

export const updateJenkinsFetched = (data) => async dispatch => {
  const updates = data;
  const updatedAt = new Date();

  for (let i = 0; i < updates.length; i++) {
    updates[i].updatedAt = updatedAt;
  }
  await AsyncStorage.setItem(JENKINS_DATA, JSON.stringify(updates));
  dispatch({
    type: JENKINS_UPDATE_RECEIVED,
    payload: updates
  });
};

export const updateJenkinsReceived = ({ ghprbPullId, data }) => async dispatch => {
  let jenkinsData = await fetchAndParseJenkinsData();
  const updatedAt = new Date();
  /*
  jenkinsData => [ {ghprbPullId, data...} ]
  */

  try {
    const index = _.findIndex(jenkinsData, { ghprbPullId });

    if (index >= 0) {
      jenkinsData[index].data = data;
      jenkinsData[index].updatedAt = updatedAt;
    } else {
      jenkinsData.push({ ghprbPullId, data, updatedAt });
    }

    await AsyncStorage.setItem(JENKINS_DATA, JSON.stringify(jenkinsData));
  } catch (error) {
    console.log(error);
  }

  dispatch({
    type: JENKINS_UPDATE_RECEIVED,
    payload: jenkinsData
  });
};

export const asyncLoadJenkinsFromStorage = () => async dispatch => {
//  await AsyncStorage.setItem(JENKINS_DATA, '[]');
  let jenkinsData = await fetchAndParseJenkinsData();

  dispatch({
    type: JENKINS_ASYNC_LOAD_FROM_STORAGE,
    payload: jenkinsData
  });
};
