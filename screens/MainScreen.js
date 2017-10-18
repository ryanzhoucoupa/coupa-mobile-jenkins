import React, { Component } from 'react';
import { Notifications } from 'expo';
import {
  Alert,
  Text,
  ScrollView,
  View,
  ListView
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

    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component will be rendered with
    // this.props is still the old set of props
    this.createDataSource(nextProps);
  }

  createDataSource({ jenkins }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(jenkins);
  }

  componentDidMount() {
    registerForNotifications();
    Notifications.addListener((notification) => {
      const {
        data: {
          ghprbTargetBranch,
          ghprbPullId,
          comment,
          url,
          context,
          status
        },
        origin } = notification;
      console.log(`DATA ${ghprbPullId}  ${origin}`);
      console.log(notification);

      if (origin === 'received') {
        this.props.updateJenkinsReceived({ ghprbTargetBranch, comment, url, context, ghprbPullId, status });
        Alert.alert(
          'You have a new notification',
          ghprbPullId,
          [{ text: 'Ok' }]
        );
      }
    });
  }

  closeNotification(ghprbPullId) {
    this.props.deleteJenkinsData(ghprbPullId);
  }

  clearAll() {
    this.props.clearAll();
  }

  renderRow(jenkin) {
    return (
      <CoupaCard
        title={jenkin.ghprbPullId}
        message={`${jenkin.status} - ${jenkin.context}`}
        id={jenkin.ghprbPullId}
      //  onButtonPress={() => this.closeNotification.bind(this) }
      />
    );
  }

  renderNotifications() {
    if (this.props.jenkins.length === 0) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.emptyLabel}>No notifications</Text>
        </View>
      );
    }

    return (
      <ListView
        enableEmptySections
        dataSource={this.dataSource}
        renderRow={this.renderRow}
      />
    );
  }

  // for testing purposes
  createNotification() {
    const data = {
      url: 'http://somehwere',
      context: 'something happened',
      ghprbPullId: `${new Date().getTime()}`,
      status: 'green'
    };
    this.props.updateJenkinsReceived(data);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        { this.renderNotifications() }

        <Button
          style={styles.clearButton}
          backgroundColor='#3498db'
          title={`Clear all notifications (${this.props.jenkins.length})`}
          onPress={() => this.clearAll()}
        />
        <Button
          style={styles.clearButton}
          backgroundColor='#9b59b6'
          title='Create notification'
          onPress={() => this.createNotification()}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    marginTop: 20,
    flex: 1
  },
  emptyLabel: {
    marginTop: 20,
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
