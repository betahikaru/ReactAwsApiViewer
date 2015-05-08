/**
 * AWS IAM Group Item Component
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
  groupname: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Hiragino Kaku Gothic ProN',
    color: '#48BBEC'
  },
});

class GroupItem extends Component {

  constructor(props) {
    super(props);
    this.props = {
      onPress: props.onPress,
      groupName: props.groupName,
    };
  }

  render() {
    var groupName = this.props.groupName;
    return (
      <TouchableHighlight
          onPress={() => this.props.onPress(groupName)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.groupname}>{groupName}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

}

module.exports = GroupItem;
