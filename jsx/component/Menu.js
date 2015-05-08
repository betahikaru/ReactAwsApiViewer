/**
 * Menu Component
 */
'use strict';

var React = require('react-native');
var {
  ListView,
  Component
} = React;

var MenuItem = require('./MenuItem');

class Menu extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.ItemName !== r2.ItemName});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.listings)
    };
    this.props = {
    };
  }

  onItemPressed(itemName) {
    var property = this.props.listings.filter(prop => prop.ItemName === itemName)[0];
    this.props.navigator.push({
      title: property.ItemTitle,
      component: property.ItemComponent,
      passProps: {
        url: property.ItemUrl,
      },
    });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <MenuItem
        onPress={this.onItemPressed.bind(this)}
        itemName={rowData.ItemName}
        imageIcon={require('image!aws_icon_iam')}/>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }

}

module.exports = Menu;
