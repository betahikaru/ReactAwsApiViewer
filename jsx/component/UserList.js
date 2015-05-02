/**
 * AWS IAM User List Component
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component,

  ActivityIndicatorIOS,
  AlertIOS,
} = React;

var EventEmitter = require('EventEmitter');

var BasicAuthUtil = require('../util/BasicAuthUtil');
var SettingBudleModule = require('NativeModules').SettingBudleModule;

var styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Hiragino Kaku Gothic ProN',
    color: '#48BBEC'
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

// FIXME:
var GroupList = require('./GroupList');
var ServerConfig = require('../../config/ServerConfig');

class UserList extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.UserId !== r2.UserId});
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      loaded: false,
    };
    this.props = {
      url: ""
    };
  }

  onItemPressed(item) {
    var url = ServerConfig.aws_iam_user_groups_url.replace("${user_name}", item.UserName);
    this.props.navigator.push({
      title: item.UserName,
      component: GroupList,
      passProps: {
        url: url,
      },
    });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight
          onPress={() => this.onItemPressed(rowData)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.username}>{rowData.UserName}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicatorIOS animating={true} size='large' />
        <Text style={styles.loadingText}>Loading ...</Text>
      </View>
    );
  }

  componentDidMount() {
    var readSettingEmitter = new EventEmitter();
    readSettingEmitter.once('ReadSuccessEvent', (valueMap) => {
      this.fetchData(valueMap);
    });
    readSettingEmitter.once('ReadFailedEvent', (errorMessage) => {
      var okButton = {
        text: 'OK',
        onPress: () => this.props.navigator.pop(),
      };
      AlertIOS.alert('Setting Error',
        errorMessage,
        [
          okButton,
        ]
      );
    });

    SettingBudleModule.readApiSetting(
      (valueMap) => {
        readSettingEmitter.emit('ReadSuccessEvent', valueMap);
      },
      (errorMessage) => {
        readSettingEmitter.emit('ReadFailedEvent', errorMessage);
      }
    );
  }

  fetchData(valueMap) {
    var encodedRelm = BasicAuthUtil.generateBasicAuthHeader();
    fetch(this.props.url, {
      headers: {
        Authorization: encodedRelm
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(responseData.Users),
        loaded: true
      });
    })
    .done();
  }
}

module.exports = UserList;
