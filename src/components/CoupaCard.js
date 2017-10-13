import React, { Component } from 'react';
import {
  Card,
  Text,
  Button
} from 'react-native-elements';

class CoupaCard extends Component {
  render() {
    const { id, title, message, onPress } = this.props;
    return (
      <Card title={title}>
        <Text>{message}</Text>
        <Button
          style={styles.buttonStyle}
          title='Close'
          onPress={() => onPress(id)}
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

export default CoupaCard;
