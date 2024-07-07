import {WebView} from 'react-native-webview';
import React, {Component} from 'react';
import {View, Image, Text, Dimensions, TouchableOpacity} from 'react-native';
import {getPerfectSize} from '../resource/LanguageSupport';
 import {UserContext} from '../resource/auth/UserContext';
 

export default function ScreenTermsOfService(props) {
  let perfectSize = getPerfectSize();
  const screenWidth = Math.round(Dimensions.get('window').width);
  const uri = 'https://dibble.co.il/common/terms.html';
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        borderTopLeftRadius: perfectSize(60),
        borderTopRightRadius: perfectSize(60),
        top: perfectSize(100),
        left: perfectSize(-102),
        width: screenWidth,
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          height: '90%',
          width: '100%',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 30,
        }}>
        <TouchableOpacity
          onPress={() => props.setModalVisible(false)}
          style={{
            width: perfectSize(40),
            height: perfectSize(40),
            alignSelf: 'flex-end',
            marginEnd: 20,
          }}>
          <Image
            source={require('../image/quantity_icon.png')}
            resizeMode="contain"
            style={{
              padding: 10,
              width: perfectSize(40),
              height: perfectSize(40),
            }}
          />
        </TouchableOpacity>
        <View style={{flex: 1, paddingHorizontal: 40, paddingVertical: 10}}>
          <WebView
            ref={(ref) => {
              this.webview = ref;
            }}
            source={{uri}}
            // onNavigationStateChange={(event) => {
            //   if (event.url !== uri) {
            //     this.webview.stopLoading();
            //     Linking.openURL(event.url);
            //   }
            // }}
          />
        </View>
      </View>
    </View>
  );
}
