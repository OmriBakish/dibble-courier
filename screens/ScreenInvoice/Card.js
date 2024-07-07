import React from 'react';
import {View, Animated, Text, TouchableOpacity} from 'react-native';
export default class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: new Animated.Value(0),
      expanded: true,
      contentHeight: 0,
    };
    this._getMaxValue = this._getMaxValue.bind(this);
    this._getMinValue = this._getMinValue.bind(this);
  }

  _initContentHeight = (evt) => {
    if (this.state.contentHeight > 0) return;
    console.log('contentHeight', evt.nativeEvent.layout.height);
    this.setState({contentHeight: evt.nativeEvent.layout.height});
    this.state.height.setValue(
      this.state.expanded ? this._getMaxValue() : this._getMinValue(),
    );
  };

  _getMaxValue = () => {
    return this.state.contentHeight;
  };
  _getMinValue = () => {
    return 0;
  };

  toggle = () => {
    this.setState(
      {expanded: !this.state.expanded},

      () => {
        console.log(
          'toggle',
          this.state.expanded,
          this.state.height,
          this.state.contentHeight,
        );

        Animated.timing(this.state.height, {
          toValue: this.state.expanded
            ? this._getMaxValue()
            : this._getMinValue(),
          duration: 300,
        }).start();
      },
    );
  };

  render() {
    return (
      <View>
        <View>
          <TouchableOpacity underlayColor="transparent" onPress={this.toggle}>
            <Text>{this.props.title}</Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[{height: this.state.height}]}
          onLayout={this._initContentHeight}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}
