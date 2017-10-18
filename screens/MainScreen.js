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
      const { data, origin } = notification;
      console.log(`DATA ${data.ghprbPullId}  ${origin}`);
      console.log(notification);

      if (origin === 'received') {
        this.props.updateJenkinsReceived(data);
        Alert.alert(
          'You have a new notification',
          data.ghprbPullId,
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
    const data = jenkin.data;

    return (
      <CoupaCard
        title={jenkin.ghprbPullId}
        id={jenkin.ghprbPullId}
      >
        <View>
          { data.map((row, idx) => <Text key={idx}>{row.context} - {row.status}</Text>) }
        </View>
      </CoupaCard>
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
      ghprbTargetBranch: 'master',
      comment: 'Unit tests running',
      url: 'https://jenkins2.coupadev.com/job/trigger-build-manually/10833/console',
      context: 'ci/jenkins-unit',
      ghprbPullId: '44687',
    //  ghprbPullId: `${new Date().getTime()}`,
      status: 'pending'
    };
    this.props.updateJenkinsReceived(data);
  }

  createNotification2() {
    const data = {
      ghprbTargetBranch: 'master',
      comment: 'Unit tests running',
      url: 'https://jenkins2.coupadev.com/job/trigger-build-manually/10833/console',
      context: 'ci/jenkins-nodejs',
      ghprbPullId: '44687',
    //  ghprbPullId: `${new Date().getTime()}`,
      status: 'success'
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
        <Button
          style={styles.clearButton}
          backgroundColor='#9b59b6'
          title='Create notification - succ'
          onPress={() => this.createNotification2()}
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
