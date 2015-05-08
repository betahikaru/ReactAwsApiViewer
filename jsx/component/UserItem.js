/**
 * AWS IAM User Item Component
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Component,
} = React;

var styles = StyleSheet.create({
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
});

class UserItem extends Component {

  constructor(props) {
    super(props);
    this.props = {
      onPress: props.onPress,
      userName: props.userName,
    };
  }

  render() {
    return (
      <TouchableHighlight
          onPress={() => this.props.onPress(this.props.userName)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.username}>{this.props.userName}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

}

module.exports = UserItem;
