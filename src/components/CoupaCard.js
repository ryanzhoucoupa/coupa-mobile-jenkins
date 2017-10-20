import React, { Component } from 'react';
import {
  Card,
  Text,
  Button
} from 'react-native-elements';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import {
  COLOR_RED
} from '../constants';

class CoupaCard extends Component {
  render() {
    const { id, title, message } = this.props;
    return (
      <Card title={title}>
        { this.props.children }
        <Button
          icon={{ name: 'close' }}
          style={styles.buttonStyle}
          title='Close'
          backgroundColor={COLOR_RED}
          onPress={() => this.props.deleteJenkinsData(id)}
        />
      </Card>
    );
  }
}

const styles = {
  buttonStyle: {
    marginTop: 20
  }
};

export default connect(null, actions)(CoupaCard);
