import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SHADOWS, SIZES} from '../../src/constants/theme';
import getLanguage from '../../resource/LanguageSupport';

let langObj = getLanguage();

const ReadyOrderCard = ({item, showModalBox}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        showModalBox(item, 3);
      }}
      style={styles.container}>
      <Text style={styles.readyOrderIdTextStyle}>
        {langObj.order + ' ' + item.order_id}
      </Text>
      <Text style={styles.readyOrderWaitingForTextStyle}>
        {langObj.waitForCourier}
      </Text>
    </TouchableOpacity>
  );
};

export default ReadyOrderCard;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    marginVertical: SIZES.space4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    ...SHADOWS.cardsAndButtons,
  },
  readyOrderIdTextStyle: {
    ...FONTS.body1,
    color: COLORS.ParagraphGray,
  },
  readyOrderWaitingForTextStyle: {
    ...FONTS.h3,
    color: COLORS.ParagraphGray,
  },
});
//
