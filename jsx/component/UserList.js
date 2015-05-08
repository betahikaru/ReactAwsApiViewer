/**
 * AWS IAM User List Component
 */
'use strict';

var React = require('react-native');
var {
  ListView,
  Component,
  AlertIOS,
} = React;

var EventEmitter = require('EventEmitter');

var ServerConfig = require('../../config/ServerConfig');
var BasicAuthUtil = require('../util/BasicAuthUtil');
var SettingBudleModule = require('NativeModules').SettingBudleModule;
var Indicator = require('./Indicator');
var UserItem = require('./UserItem');
var GroupList = require('./GroupList'); // FIXME:
var PolicyList = require('./PolicyList'); // FIXME:

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

  onPolicyPressed(userName) {
    var url = ServerConfig.aws_iam_user_policies_url.replace("${user_name}", userName);
    this.props.navigator.push({
      title: userName + "'s Policies",
      component: PolicyList,
      passProps: {
        url: url,
      },
    });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <UserItem
        onPress={this.onPolicyPressed.bind(this)}
        userName={rowData.UserName}/>
    );
  }

  render() {
    if (!this.state.loaded) {
      return (
        <Indicator />
      );
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }

  showAlertAndPop(alertTitle, errorMessage) {
    AlertIOS.alert(alertTitle, errorMessage, [{
      text: 'OK',
      onPress: () => this.props.navigator.pop(),
    }]);
  }

  componentDidMount() {
    var readSettingEmitter = new EventEmitter();
    readSettingEmitter.once('ReadSuccessEvent', (keyValues) => {
      this.fetchData(keyValues);
    });
    readSettingEmitter.once('ReadFailedEvent', (alertTitle, errorMessage) => {
      this.showAlertAndPop(alertTitle, errorMessage)
    });
    this._readApiSetting(readSettingEmitter);
  }

  _readApiSetting(readSettingEmitter) {
    SettingBudleModule.readApiSetting(
      (keyValues) => {
        readSettingEmitter.emit('ReadSuccessEvent', keyValues);
      },
      (errorMessage) => {
        readSettingEmitter.emit('ReadFailedEvent', 'Setting Error', errorMessage);
      }
    );
  }

  fetchData(keyValues) {
    /* Register _updateList() */
    var getDataEmitter = new EventEmitter();
    getDataEmitter.once('GetSuccessEvent', (responseData) => {
      if (!responseData.Users) {
        console.log(responseData);
        this.showAlertAndPop('Fetch data Error', responseData.Error)
      } else {
        this._updateList(responseData);
      }
    });
    getDataEmitter.once('GetFailedEvent', (alertTitle, errorMessage) => {
      this.showAlertAndPop(alertTitle, errorMessage)
    });

    /* Register _fetchList */
    var pushSettingEmitter = new EventEmitter();
    pushSettingEmitter.once('PushSuccessEvent', () => {
      this._fetchList(getDataEmitter);
    });
    pushSettingEmitter.once('PushFailedEvent', (alertTitle, errorMessage) => {
      this.showAlertAndPop(alertTitle, errorMessage);
    });

    this._updateApiKeyOnServer(pushSettingEmitter, keyValues);
  }

  _updateApiKeyOnServer(pushSettingEmitter, keyValues) {
    var apiKey = "AWS_ACCESS_KEY_ID=" + encodeURIComponent(keyValues.textAwsAccessKeyId)
      + "&AWS_SECRET_ACCESS_KEY=" + encodeURIComponent(keyValues.textAwsSecretAccessKey);
    fetch(ServerConfig.aws_setting_url, {
      method: 'POST',
      headers: {
        Authorization: BasicAuthUtil.generateBasicAuthHeader()
      },
      body: apiKey
    })
    .then((response) => {
      console.log(response);
      if (!response) {
        throw ({
          message: "Internal error",
        });
      } else if(response.status != 200) {
        throw ({
          message: "Responce status = " + response.status + ". " + ServerConfig.contact_support,
        });
      } else {
        return response.json();
      }
    })
    .then((responseData) => {
      pushSettingEmitter.emit('PushSuccessEvent');
    })
    .catch((error) => {
      var title = 'Internal auth Error';
      var message = "";
      if (error == null) {
        message = "[Fetch] Internal Error";
      } else if (!error.message) {
        message = "[Fetch] " + error;
      } else {
        message = "[Fetch] " + error.message;
      }
      console.log(title + ":" + message);
      pushSettingEmitter.emit('PushFailedEvent', title, message);
    })
    .done();
  }

  _fetchList(getDataEmitter) {
    var getUsersUrl = this.props.url;
    fetch(getUsersUrl, {
      headers: {
        Authorization: BasicAuthUtil.generateBasicAuthHeader()
      }
    })
    .then((response) => {
      console.log(response);
      if (!response) {
        throw ({
          message: "Internal error",
        });
      } else if(response.status != 200) {
        throw ({
          message: "Network error : Responce status = " + response.status + ". " + ServerConfig.contact_support,
        });
      } else {
        return response.json();
      }
    })
    .then((responseData) => {
      getDataEmitter.emit('GetSuccessEvent', responseData);
    })
    .catch((error) => {
      var title = 'Fetch data Error';
      var message = "";
      if (error == null) {
        message = "[Fetch] Fatal Error";
      } else if (!error.message) {
        message = "[Fetch] " + error;
      } else {
        message = "[Fetch] " + error.message;
      }
      console.log(title + ":" + message);
      getDataEmitter.emit('GetFailedEvent', title, message);
    })
    .done();
  }

  _updateList(responseData) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      dataSource: ds.cloneWithRows(responseData.Users),
      loaded: true
    });
  }
}

module.exports = UserList;
