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
  await AsyncStorage.setItem(JENKINS_DATA, JSON.stringify(data));
  dispatch({
    type: JENKINS_UPDATE_RECEIVED,
    payload: data
  });
};

export const updateJenkinsReceived = (data) => async dispatch => {
  const { ghprbPullId, context } = data;
  let jenkinsData = await fetchAndParseJenkinsData();
  /*
  jenkinsData => [ {ghprbPullId, data...} ]
  */

  try {
    const index = _.findIndex(jenkinsData, { ghprbPullId });

    if (index >= 0) {
      const jdArray = jenkinsData[index].data;
      const dataIndex = _.findIndex(jdArray, { context });

      if (dataIndex >= 0) {
        jdArray.splice(dataIndex, 1, data);
      } else {
        jdArray.push(data);
      }
      //jenkinsData.splice(index, 1, jenkinsData[index]);
    } else {
      jenkinsData.push({ ghprbPullId, data: [data] });
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
