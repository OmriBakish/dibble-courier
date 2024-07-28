import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {ThemeConsumer} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {create} from 'react-native-pixel-perfect';

const designResolution = {
  width: 1125,
  height: 1990,
};
let perfectSize = create(designResolution);
const screenWidth = Math.round(Dimensions.get('window').width);

class FloatingLabel extends Component {
  constructor(props) {
    super(props);

    let initialPadding = perfectSize(70);
    let initialFontSize = perfectSize(55);

    if (this.props.visible) {
      initialPadding = perfectSize(30);
    }
    this.state = {
      paddingAnim: new Animated.Value(initialPadding),
      fontSize: new Animated.Value(initialFontSize),
      visible: this.props.visible,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? perfectSize(30) : perfectSize(70),
      duration: 100,
      useNativeDriver: false,
    }).start();
    Animated.timing(this.state.fontSize, {
      toValue: newProps.visible ? perfectSize(35) : perfectSize(55),
      duration: 100,
      useNativeDriver: false,
    }).start();

    this.setState({visible: newProps.visible});
  }
  render() {
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            left: perfectSize(55),
            position: 'absolute',
            paddingTop: this.state.paddingAnim,
          },
          this.state.visible && {top: 0},
          !this.state.visible && {
            height: '100%',
            width: '100%',
            paddingTop: 'auto',
          },
        ]}>
        <TouchableOpacity
          style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}
          onPress={this.props.focus}>
          <Animated.Text
            style={[
              this.props.labelStyle(),
              {
                fontSize: this.state.fontSize,
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              !this.state.visible &&
                this.props.labelFontSize && {
                  fontSize: this.props.labelFontSize,
                },
            ]}>
            {this.props.label}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

class TextFieldHolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marginAnim: new Animated.Value(
        this.props.withValue ? perfectSize(40) : perfectSize(0),
      ),
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? perfectSize(40) : perfectSize(0),
      duration: 230,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.View style={[{marginTop: perfectSize(50)}]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

class FloatLabelTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      text: this.props.value,
      presented_text: this.props.value,
      has_error: false,
      errors: props.errors ? new Array(props.errors.length).fill(false) : [],
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      newProps.hasOwnProperty('value') &&
      newProps.value !== this.state.text
    ) {
      this.setText(newProps.value);
    }
  }

  isWithoutFloat() {
    return this.props.mode == 'without_float';
  }

  leftPadding() {
    return {width: this.props.leftPadding || 0};
  }

  withBorder() {
    if (!this.props.noBorder) {
      return styles.withBorder;
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={[this.containerStyle()]}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TextFieldHolder withValue={this.state.focused || this.state.text}>
              <TextInput
                {...this.props}
                ref="input"
                underlineColorAndroid="transparent"
                style={[
                  this.isWithoutFloat()
                    ? styles.valueTextWithoutFloat
                    : styles.valueText,
                ]}
                placeholderTextColor={'rgba(1,1,1,0.1)'}
                placeholder={
                  this.state.focused || this.isWithoutFloat()
                    ? this.props.placeholder
                    : ''
                }
                value={
                  this.state.focused
                    ? this.state.text
                    : this.state.presented_text
                }
                onFocus={() => this.setFocus()}
                onBlur={() => {
                  this.validateValue(this.state.text);
                  this.unsetFocus();
                }}
                onChangeText={value => {
                  this.setState({not_empty: value !== ''});
                  this.setText(value);
                }}
              />
            </TextFieldHolder>

            {this.state.focused ? (
              <TouchableOpacity
                keyboardShouldPersistTaps={'handled'}
                style={styles.clearButton}
                onPress={() => {
                  console.log('-------this.clear()--------');
                  this.clear();
                }}>
                <FastImage
                  source={
                    this.state.text
                      ? require('../../image/icons/clear-btn.png')
                      : require('../../image/icons/clear-btn2.png')
                  }
                  resizeMode="cover"
                  style={{
                    width: perfectSize(60),
                    height: perfectSize(60),
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          {!this.isWithoutFloat() ? (
            <FloatingLabel
              focus={this.focus.bind(this)}
              labelFontSize={this.props.labelFontSize}
              labelStyle={this.labelStyle.bind(this)}
              label={this.props.label}
              visible={this.state.text || this.state.focused}></FloatingLabel>
          ) : null}
        </View>

        {this.state.errors.map((err, index) =>
          err ? (
            <Text style={[styles.errMsgStyle]}>{this.props.errors[index]}</Text>
          ) : null,
        )}
      </View>
    );
  }

  inputRef() {
    return this.refs.input;
  }

  focus() {
    this.inputRef().focus();
  }

  blur() {
    this.inputRef().blur();
  }

  isFocused() {
    return this.inputRef().isFocused();
  }

  clear() {
    this.inputRef().clear();
    this.setText('');
  }

  setFocus() {
    this.setState({
      focused: true,
    });
  }

  unsetFocus() {
    this.setState({
      focused: false,
    });
    try {
      return this.props.onBlur();
    } catch (_error) {}
  }

  containerStyle() {
    if (this.state.has_error) {
      return [styles.container, styles.inputContainerError];
    }
    if (this.state.focused) {
      if (!this.props.focusedContainer) {
        return [styles.container, styles.inputContainerFocused];
      } else {
        return [styles.container, this.props.focusedContainer];
      }
    } else {
      if (!this.props.inputContainerNotFocused) {
        return [styles.container, styles.inputContainerNotFocused];
      } else {
        return [
          styles.container,
          styles.inputContainerNotFocused,
          this.props.inputContainerNotFocused,
        ];
      }
    }
  }

  labelStyle() {
    if (this.state.has_error) {
      return [styles.floatingLabelStyle, styles.floatingLabelStyleError];
    } else {
      return [styles.floatingLabelStyle, this.props.labelStyle];
    }
  }

  placeholderValue() {
    return this.props.placeholder;
  }

  validateValue(value) {
    let errors = this.state.errors;
    let has_error = false;
    if (this.props.validators) {
      this.props.validators.forEach((validator, index) => {
        let res = validator(value);
        errors[index] = res;
        has_error |= res;
      });
    }
    this.setState({has_error: has_error});
    if (this.props.setValidations) {
      this.props.setValidations(!has_error);
    }
  }
  setText(value) {
    console.log(this.props.label + ' -' + value);
    if (this.props.inputFilter) {
      let f = () => {};
      for (let i = 0; i < this.props.inputFilter.length; i++) {
        f = this.props.inputFilter[i];
        value = f(value);
      }
    }
    let presented_text = value;
    if (value && value.length > 22) {
      presented_text = value.substring(0, 22) + '...';
    }
    this.setState({
      presented_text: presented_text,
      text: value,
    });

    this.validateValue(value);

    try {
      return this.props.onChangeTextValue(value);
    } catch (_error) {}
  }
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.85,
    height: perfectSize(174),
    justifyContent: 'center',
  },
  clearButton: {
    alignItems: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
    justifyContent: 'center',
    padding: perfectSize(30),
    zIndex: 5,
    elevation: 5,
    position: 'absolute',
    right: 5,
    top: 10,
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  paddingView: {
    width: 15,
  },
  floatingLabelContainer: {
    position: 'absolute',
    top: 0,
  },
  fieldLabel: {
    height: 15,
    fontSize: 10,
    color: '#B1B1B1',
  },
  fieldContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  withBorder: {
    borderBottomWidth: 1 / 2,
    borderColor: '#C8C7CC',
  },
  valueText: {
    opacity: 1,
    fontFamily: 'AlmoniDLAAA-Bold',
    color: '#707070',
    fontSize: perfectSize(60),
    fontStyle: 'normal',
    letterSpacing: perfectSize(-3),
    textAlign: 'right',
    width: screenWidth * 0.6,
    height: perfectSize(140),
  },
  valueTextWithoutFloat: {
    opacity: 1,
    fontFamily: 'AlmoniDLAAA-Bold',
    color: '#707070',
    fontSize: perfectSize(60),
    fontStyle: 'normal',
    letterSpacing: perfectSize(-3),
    textAlign: 'right',
    width: screenWidth * 0.6,
    height: perfectSize(140),
  },
  focused: {
    color: '#1482fe',
  },
  inputContainerFocused: {
    borderRadius: perfectSize(25),
    borderStyle: 'solid',
    borderWidth: perfectSize(3),
    borderColor: '#ffca1a',
    paddingStart: perfectSize(55),
  },
  inputContainerError: {
    borderRadius: perfectSize(25),
    borderStyle: 'solid',
    borderWidth: perfectSize(3),
    borderColor: '#ff1600',
    paddingStart: perfectSize(55),
  },
  floatingLabelStyle: {
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(35),

    letterSpacing: perfectSize(-1.75),
    color: '#a6a6a8',
  },
  floatingLabelStyleError: {
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(35),

    letterSpacing: perfectSize(-1.75),
    color: '#ff1600',
  },
  inputContainerNotFocused: {
    height: perfectSize(174),
    borderRadius: perfectSize(25),
    borderStyle: 'solid',
    borderWidth: perfectSize(3),
    borderColor: '#e4e4e4',
    paddingStart: perfectSize(55),
  },
  errMsgStyle: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(50),
    alignSelf: 'flex-start',
    lineHeight: perfectSize(60),
    letterSpacing: perfectSize(-2.5),
    color: '#ff1600',
    left: perfectSize(50),
  },
  placeholderStyle: {
    opacity: 1,
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(55),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: perfectSize(55),
    letterSpacing: perfectSize(-3),
    textAlign: 'right',
    color: '#a6a6a8',
    width: screenWidth * 0.6,
    height: perfectSize(120),
  },
});

export default FloatLabelTextField;
