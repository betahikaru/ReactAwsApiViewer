/**
 * AWS IAM Policy Detail Component
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  TextInput,
  Component,
} = React;

var styles = StyleSheet.create({
  rootContainer: {
    paddingTop: 80,
  },
  textContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#AAAAAA'
  },
  doc: {
    fontSize: 12,
    color: '#222222',
  },
});

class PolicyDetail extends Component {

  constructor(props) {
    super(props);
    this.props = {
      policyName: props.policyName,
      policyArn: props.policyArn,
      policyDocument: props.policyDocument,
    };
  }

  render() {
    var policyName = this.props.policyName;
    var doc = this.props.policyDocument;
    if (doc) {
      var decodedDoc = decodeURIComponent(doc);
      return (
        <View style={styles.rootContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.doc}>{decodedDoc}</Text>
          </View>
        </View>
      );
    }
  }

}

module.exports = PolicyDetail;
