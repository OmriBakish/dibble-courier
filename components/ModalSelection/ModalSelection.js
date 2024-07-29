/*eslint prettier/prettier:0*/
/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Button,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  I18nManager,
  Keyboard,
} from 'react-native';
import {create} from 'react-native-pixel-perfect';
import FastImage from 'react-native-fast-image';
import getLanguage from '../../resource/LanguageSupport';
const designResolution = {
  width: 1125,
  height: 1990,
};
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let perfectSize = create(designResolution);
const langObj = getLanguage();

export default class ModalSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      selected: '',
      searchText: '',
      resultArray: [],
      temp: [],
      multi: false,
      multiSelected: [],
      onBlur: false,
    };
  }
  componentDidMount() {
    if (this.props.data.length != 0) {
      this.setState({resultArray: [...this.props.data]});
      this.setState({temp: this.props.data});
      this.setState({multi: this.props.multi});
      this.setState({onBlur: this.props.modalForceBlurValidate});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.data.length !== prevProps.data.length) {
      this.setState({resultArray: [...this.props.data]});
      this.setState({temp: this.props.data});
      this.setState({multi: this.props.multi});
    }
  }

  onSearch(text) {
    let filteredWords = [];
    if (text !== '') {
      let searchText = text.toLowerCase(),
        theArray = this.state.temp; // cache this too

      for (let i = 0, l = theArray.length; i < l; ++i) {
        if (theArray[i].label.toLowerCase().includes(searchText)) {
          filteredWords.push(theArray[i]);
        }
      }
      this.setState({searchText: text, resultArray: [...filteredWords]});
    } else {
      this.setState({searchText: text, resultArray: [...this.state.temp]});
    }
  }

  render() {
    const {
      placeholder,
      data,
      onChangeItem,
      value,
      setValidations,
      searchable,
      modalForceBlurValidate,
    } = this.props;
    const {onBlur} = this.state;
    const isValid = modalForceBlurValidate && !value;
    return (
      <View>
        <View>
          <View>
            {value ? (
              // Field With Values
              <TouchableOpacity
                style={{justifyContent: 'center', flex: 1}}
                onPress={() => {
                  this.setState({
                    visibleModal: !this.state.visibleModal,
                    onBlur: true,
                  });
                  Keyboard.dismiss();
                }}>
                <View style={[styles.mainContainer, isValid && styles.error]}>
                  <View>
                    <Text style={styles.placeholder}>{placeholder}</Text>
                    <Text style={styles.value}>
                      {this.state.multi
                        ? this.state.multiSelected.length > 0
                          ? value == langObj.allWeek
                            ? value
                            : this.state.multiSelected
                                .map(x => x.label)
                                .join(',')
                          : value
                        : this.state.selected
                        ? this.state.selected
                        : value}
                    </Text>
                  </View>

                  {/* Dropdown Icon */}
                  <Image
                    source={
                      langObj.isRTL
                        ? require('../image/icon_arrow_left_black.png')
                        : require('../image/icon_arrow_right_black.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: screenWidth * 0.05,
                      height: screenWidth * 0.05,
                      marginStart: 10,
                      opacity: 0.5,
                    }}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              //Field Without Values
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    visibleModal: !this.state.visibleModal,
                    onBlur: true,
                  });
                  Keyboard.dismiss();
                }}>
                <View style={[styles.mainContainer, isValid && styles.error]}>
                  <View>
                    <Text
                      style={[
                        styles.defaultPlaceholder,
                        isValid && styles.placeholderError,
                      ]}>
                      {placeholder}
                    </Text>
                  </View>
                  {/* Dropdown Icon */}
                  <Image
                    source={
                      langObj.isRTL
                        ? require('../image/icon_arrow_left_black.png')
                        : require('../image/icon_arrow_right_black.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: screenWidth * 0.05,
                      height: screenWidth * 0.05,
                      marginStart: 10,
                      opacity: 0.5,
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Modal  */}
          <Modal
            animationType="fade"
            transparent
            visible={this.state.visibleModal}>
            <KeyboardAvoidingView
              behavior="position"
              enabled
              keyboardVerticalOffset={-200}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({visibleModal: false});
                  }}
                  activeOpacity={1}
                  style={{flex: 1, width: screenWidth}}
                />
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    {/* Close Button  */}
                    <View style={styles.closeModalBtnWrapper}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({visibleModal: false});
                        }}
                        style={styles.closeModalBtn}>
                        <FastImage
                          source={require('../image/icon_close_black.png')}
                          resizeMode="contain"
                          style={{
                            width: screenWidth * 0.04,
                            height: screenWidth * 0.04,
                          }}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Modal Title  */}
                    <View style={styles.headerTitleWrapper}>
                      <Text
                        style={
                          placeholder === langObj.workingHourAvailable
                            ? styles.headerTitleSmaller
                            : styles.headerTitle
                        }>
                        {placeholder}
                      </Text>
                    </View>
                  </View>

                  {langObj.preferredDays === placeholder && (
                    <View style={styles.preferredDaysDescriptionWrapper}>
                      <Text style={styles.preferredDaysDescription}>
                        {langObj.preferredDaysDescription}
                      </Text>
                    </View>
                  )}

                  {searchable && (
                    <View style={styles.searchContainer}>
                      <TextInput
                        style={styles.textSearch}
                        placeholder={'השתמש בחיפוש לסנן את התוצאות'}
                        placeholderTextColor={'#8c8d866'}
                        value={this.state.searchText}
                        onChangeText={text => this.onSearch(text)}
                      />
                      <Image
                        source={require('../image/icon_search_static.png')}
                        resizeMode="contain"
                        style={{
                          width: perfectSize(60),
                          height: perfectSize(55),
                          marginEnd: 5,
                        }}
                      />
                    </View>
                  )}

                  <ScrollView style={styles.listContainer}>
                    {this.state.resultArray.map(item => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            // debugger
                            if (this.state.multi) {
                              if (
                                this.state.multiSelected.filter(
                                  x => x.value == item.value,
                                ).length > 0
                              ) {
                                this.state.multiSelected =
                                  this.state.multiSelected.filter(
                                    x => x.value !== item.value,
                                  );
                              } else {
                                this.state.multiSelected.push(item);
                              }
                              this.setState({
                                multiSelected: this.state.multiSelected,
                              });
                              setValidations(
                                this.state.multiSelected.length > 0,
                              );
                              onChangeItem(
                                this.state.multiSelected
                                  .map(x => x.value)
                                  .join(','),
                              );
                            } else {
                              this.setState({selected: item.label});
                              this.setState({visibleModal: false});
                              this.setState({
                                searchText: '',
                                resultArray: this.state.temp,
                              });
                              setValidations(item.value != '');
                              onChangeItem(item.value);
                            }
                          }}
                          style={styles.listItem}>
                          <Text
                            style={{
                              fontSize: perfectSize(50),
                            }}>
                            {item.label}
                          </Text>
                          {!this.state.multi && item.value === value && (
                            // <AntDesign name='check' size={perfectSize(40)} color={'#ffca1a'} />
                            <Image
                              source={require('../image/v_yellow.png')}
                              resizeMode="contain"
                              style={{
                                width: perfectSize(48),
                                height: perfectSize(38),
                              }}
                            />
                          )}
                          {this.state.multi &&
                            this.state.multiSelected.filter(
                              x => x.value == item.value,
                            ).length > 0 && (
                              // <AntDesign name='check' size={perfectSize(40)} color={'#ffca1a'} />
                              <Image
                                source={require('../image/v_yellow.png')}
                                resizeMode="contain"
                                style={{
                                  width: perfectSize(48),
                                  height: perfectSize(38),
                                }}
                              />
                            )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                  {this.state.multi && (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({visibleModal: false});
                      }}
                      style={[
                        styles.buttonDark,
                        {
                          margin: 20,
                          width: screenWidth * 0.9,
                          alignSelf: 'center',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.textBasicBoldStyle,
                          {fontSize: 20, color: 'white'},
                        ]}>
                        {langObj.approve}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </View>
        {isValid && (
          <Text style={[styles.errMsgStyle]}>{langObj.requiredField}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: perfectSize(25),
    height: perfectSize(174),
    width: screenWidth * 0.85,
    justifyContent: 'space-between',
    paddingHorizontal: perfectSize(50),
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    borderColor: 'red',
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
  placeholder: {
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(35),
    letterSpacing: perfectSize(-1.75),
    color: '#a6a6a8',
    textAlign: 'left',
  },
  placeholderError: {
    color: 'red',
  },
  defaultPlaceholder: {
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(55),
    color: '#a6a6a8',
  },
  value: {
    fontFamily: 'AlmoniDLAAA-Bold',
    color: '#707070',
    fontSize: perfectSize(55),
    fontStyle: 'normal',
    letterSpacing: perfectSize(-3),
    textAlign: 'left',
  },
  modalContainer: {
    width: '100%',
    padding: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    // paddingHorizontal: 30,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    minHeight: screenWidth * 0.5,
    maxHeight: screenHeight * 0.6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeModalBtnWrapper: {
    position: 'absolute',
    left: 6,
    top: 6,
  },
  closeModalBtn: {
    padding: 10,
    opacity: 0.5,
    alignSelf: 'flex-start',
  },
  modalContent: {
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(189, 189, 189, 0.64)',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferredDaysDescriptionWrapper: {
    alignItems: 'center',
    paddingTop: 9,
    width: '55%',
  },
  preferredDaysDescription: {
    fontSize: perfectSize(45),
    color: '#858586',
    fontFamily: 'AlmoniDLAAA',
    textAlign: 'center',
  },
  headerTitle: {
    color: '#707070',
    fontSize: perfectSize(65),
    fontFamily: 'OscarFM-Regular',
    marginTop: perfectSize(40),
  },
  headerTitleWrapper: {
    borderBottomWidth: 4,
    borderBottomColor: '#ffca1a',
    alignSelf: 'center',
  },
  listContainer: {
    alignSelf: 'stretch',
    marginTop: perfectSize(60),
    paddingBottom: perfectSize(50),
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: perfectSize(20),
    paddingHorizontal: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ededed',
    paddingHorizontal: perfectSize(40),
    marginHorizontal: perfectSize(60),
    marginTop: perfectSize(30),
  },
  textSearch: {
    textAlign: 'center',
    fontFamily: 'AlmoniDLAAA',
    fontSize: 18,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    flex: 1,
    height: 40,
    letterSpacing: -1.0,
    justifyContent: 'center',
  },
  headerTitleSmaller: {
    color: '#707070',
    fontSize: perfectSize(55),
    fontFamily: 'OscarFM-Regular',
    marginTop: perfectSize(40),
  },
  buttonDark: {
    borderRadius: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  textBasicBoldStyle: {
    fontFamily: 'OscarFM-Regular',
  },
});
