import React, { Component } from 'react';
import {
  Card,
  Text,
  Button
} from 'react-native-elements';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class CoupaCard extends Component {
  render() {
    const { id, title, message } = this.props;
    return (
      <Card title={title}>
        <Text>{message}</Text>
        <Button
          style={styles.buttonStyle}
          title='Close'
          backgroundColor='#e74c3c'
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
