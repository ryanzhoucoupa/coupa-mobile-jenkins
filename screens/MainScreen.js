import React, { Component } from 'react';
import { Notifications } from 'expo';
import {
  Alert,
  Text,
  ScrollView,
  View
} from 'react-native';
import {
  Button
} from 'react-native-elements';
import { connect } from 'react-redux';
import registerForNotifications from '../services/PushNotifications';
import CoupaCard from '../src/components/CoupaCard';
import * as actions from '../actions';

class MainScreen extends Component {
  static navigationOptions = {
    title: 'CJN',
    headerLeft: null
  };

  async componentWillMount() {
    this.props.asyncLoadJenkinsFromStorage();
  }

  componentDidMount() {
    registerForNotifications();
    Notifications.addListener((notification) => {
      const { data: { url, context, prId, status }, origin } = notification;
      console.log(`DATA ${prId}  ${origin}`);
      console.log(notification);
      if (origin === 'received') {
        this.props.updateJenkinsRecived({ url, context, prId, status });
        Alert.alert(
          'You have a new notification',
          prId,
          [{ text: 'Ok' }]
        );
      }
    });
  }

  closeNotification(prId) {
    this.props.deleteJenkinsData(prId);
  }

  clearAll() {
    this.props.clearAll();
  }

  renderNotifications() {
    if (this.props.jenkins.length === 0) {
      return (
        <Text style={styles.emptyLabel}>No notifications</Text>
      );
    }

    return this.props.jenkins.map((data, index) => {
      return (
        <CoupaCard
          title={data.prId}
          message={`${data.status} - ${data.context}`}
          key={index}
          onPress={() => this.closeNotification(data.prId)}
          //onPress={this.closeNotification.bind(this)}
        />
      );
    });
  }

  // for testing purposes
  createNotification() {
    const data = {
      url: 'http://somehwere',
      context: 'something happened',
      prId: `${new Date().getTime()}`,
      status: 'green'
    };
    this.props.updateJenkinsReceived(data);
  }

  render() {
    return (
    //  <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          { this.renderNotifications() }
        </ScrollView>
        /*
        <Button
          style={styles.clearButton}
          backgroundColor='#3498db'
          title='Clear all notifications'
          onPress={() => this.clearAll()}
        />
        <Button
          style={styles.clearButton}
          backgroundColor='#9b59b6'
          title='Create notification'
          onPress={() => this.createNotification()}
        />
        */
    //  </View>
    );
  }
}

const styles = {
  container: {
    marginTop: 20,
    flex: 1
  },
  emptyLabel: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold'
  },
  clearButton: {
    marginBottom: 20,
    height: 40
  }
};

const mapStateToProps = ({ jenkins }) => {
  return {
    jenkins: jenkins || []
  };
};

export default connect(mapStateToProps, actions)(MainScreen);
