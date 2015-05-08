/**
 * Loading Indicator Component
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Component,
  ActivityIndicatorIOS,
} = React;

var styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

class Indicator extends Component {

  constructor(props) {
    super(props);
    this.props = {
    };
  }

  render() {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicatorIOS animating={true} size='large' />
        <Text style={styles.loadingText}>Loading ...</Text>
      </View>
    );
  }

}

module.exports = Indicator;
