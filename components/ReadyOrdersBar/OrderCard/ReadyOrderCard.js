import React from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import getLanguage, {getPerfectSize} from '../../../resource/LanguageSupport';
import {
  bg_white,
  c_orange,
  c_text_order_ready_status,
} from '../../../resource/BaseValue';
import {globalStyles} from '../../../resource/style/global';
import pure from 'recompose/pure';
import {mStyle} from './style';

let perfectSize = getPerfectSize();
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let langObj = getLanguage();

function ReadyOrderCard({item, showModalBox}) {
  return (
    <TouchableOpacity
      onPress={() => {
        showModalBox(item, 3);
      }}
      style={mStyle.readyOrderCardMainContainer}>
      <View style={mStyle.readyOrderContentContainer}>
        <Text style={[mStyle.readyOrderIdTextStyle]}>
          {langObj.order + ' ' + item.order_id}
        </Text>
        <Text style={mStyle.readyOrderWaitingForTextStyle}>
          {item.order_type == 2
            ? langObj.waitingForCollection
            : langObj.waitForCourier}
        </Text>

        <View style={mStyle.readyOrderMinutesLeftContainer}>
          <Text style={mStyle.readyOrderMinutesNumericTextStyle}>12:32</Text>
          <Text
            style={[
              globalStyles.textOscarFmRegular_70,
              {
                textAlign: 'center',
                marginStart: 5,
                color: '#000000',
              },
            ]}>
            {langObj.minutes}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
export default pure(ReadyOrderCard);
