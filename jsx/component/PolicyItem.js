/**
 * AWS IAM Policy Item Component
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
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Hiragino Kaku Gothic ProN',
    color: '#48BBEC'
  },
});

class PolicyItem extends Component {

  constructor(props) {
    super(props);
    this.props = {
      onPress: props.onPress,
      policyName: props.policyName,
    };
  }

  render() {
    var policyName = this.props.policyName;
    return (
      <TouchableHighlight
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{policyName}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

}

module.exports = PolicyItem;
