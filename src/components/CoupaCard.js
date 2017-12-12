import React, { Component } from 'react';
import {
  Card,
  Text,
  Button,
  Icon
} from 'react-native-elements';
import {
  View,
  TouchableOpacity
} from 'react-native';
import TimeAgo from 'react-native-timeago';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import {
  COLOR_RED
} from '../constants';

class CoupaCard extends Component {
  render() {
    const { id, title, message, timeAgo } = this.props;

    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
            <Text>{`Updated `}<TimeAgo time={timeAgo} />  </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.props.deleteJenkinsData(id)}
            >
              <Icon name='close' />
            </TouchableOpacity>
          </View>
        </View>
        { this.props.children }
      </View>
    );
  }
}

const styles = {
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d6d7da',
    padding: 10
  },
  buttonStyle: {
    backgroundColor: COLOR_RED,
    borderWidth: 0,
    borderRadius: 100,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default connect(null, actions)(CoupaCard);
