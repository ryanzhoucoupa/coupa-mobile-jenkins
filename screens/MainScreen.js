import React, { Component } from 'react';
import { Notifications } from 'expo';
import {
  Alert,
  Text,
  View,
  ListView,
  ScrollView,
  AsyncStorage,
  AppState,
  RefreshControl,
  Platform,
  TouchableOpacity
} from 'react-native';
import {
  Button,
  Icon
} from 'react-native-elements';
import { connect } from 'react-redux';
import axios from 'axios';
import registerForNotifications from '../services/PushNotifications';
import CoupaCard from '../src/components/CoupaCard';
import * as actions from '../actions';

import {
  GITHUB_LOGIN,
  LIST_NOTIFICATION_ENDPOINT,
  COLOR_BLUE,
  COLOR_ORANGE,
  COLOR_RED,
  COLOR_GREEN
} from '../src/constants';

const STATUS_COLORS = {
  success: COLOR_GREEN,
  pending: COLOR_ORANGE,
  failure: COLOR_RED
};

class MainScreen extends Component {
  static navigationOptions = {
    title: 'Notifications',
    headerLeft: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='notifications'
        size={30}
        color={tintColor}
      />)
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  async _onRefresh() {
    this.setState({ refreshing: true });
    let githubLogin = await AsyncStorage.getItem(GITHUB_LOGIN);
    axios.get(`${LIST_NOTIFICATION_ENDPOINT}?github_login=${githubLogin}`)
      .then(response => {
        const data = response.data;
        if (data.length > 0) {
          this.props.updateJenkinsFetched(data);
        }
        this.setState({ refreshing: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ refreshing: false });
      });
  }

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
      const ghprbPullId = data.ghprbPullId;
      //console.log(`DATA ${data.ghprbPullId}  ${data.data}`);
      console.log(notification);
      if (origin === 'received') {
        this.props.updateJenkinsReceived(data);

        if (AppState.currentState === 'background') {
          Alert.alert(
            'Jenkins Status',
            `Status change for PR: ${ghprbPullId}`,
            [{ text: 'Ok' }]
          );
        }
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
        title={`PR ID - ${jenkin.ghprbPullId}`}
        id={jenkin.ghprbPullId}
        timeAgo={jenkin.updatedAt}
      >
        <View>
          {
            data.map((row, idx) =>
              <Text
                style={
                  {
                    color: STATUS_COLORS[row.status],
                    fontWeight: 'bold',
                    fontSize: 16
                  }
                }
                key={idx}
              >
                {row.context} - {row.status}
              </Text>
            )
          }
        </View>
      </CoupaCard>
    );
  }

  renderNotifications() {
    if (this.props.jenkins.length === 0) {
      return (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <Text style={styles.emptyLabel}>No notifications</Text>
        </ScrollView>
      );
    }

    return (
      <ListView
        enableEmptySections
        dataSource={this.dataSource}
        renderRow={this.renderRow}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      />
    );
  }

  // for testing purposes
  createNotification() {
    const count = this.props.jenkins.length + 1;

    const data = {
      ghprbPullId: count,
      data: [
        {
          ghprbTargetBranch: 'master',
          comment: 'First run: 43/37,007 failed. 0 on retry. FLAKY TESTS. Full unit test run',
          url: 'https://jenkins2.coupadev.com/job/trigger-build-manually/10981/console',
          context: 'ci/jenkins-unit',
          ghprbPullId: count,
          status: 'success'
        },
        {
          ghprbTargetBranch: 'master',
          comment: 'API tests pending',
          url: 'https://jenkins2.coupadev.com/job/trigger-build-manually/10981/console',
          context: 'ci/api-test',
          ghprbPullId: count,
          status: 'pending'
        },
        {
          ghprbTargetBranch: 'master',
          comment: '1347 passed in 4.537 secs',
          url: 'https://jenkins2.coupadev.com/job/trigger-build-manually/10981/artifact/tmp/node-test-ci.log',
          context: 'ci/jenkins-nodejs',
          ghprbPullId: count,
          status: 'success'
        }
      ]
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
      <View style={{ flex: 1, marginTop: 30 }}>
        { this.renderNotifications() }
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => this.clearAll()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            {`Clear all (${this.props.jenkins.length})`}
          </Text>
        </TouchableOpacity>
        </View>
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
    backgroundColor: COLOR_BLUE,
    borderWidth: 0,
    borderRadius: 100,
    height: 50,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  }
};

const mapStateToProps = ({ jenkins }) => {
  return {
    jenkins: jenkins || []
  };
};

export default connect(mapStateToProps, actions)(MainScreen);
