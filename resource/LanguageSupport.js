/*eslint prettier/prettier:0*/
/**
 * @format
 * @flow
 */

import * as React from 'react';
import {Platform, NativeModules} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {isForceRTL} from './BaseValue';
import {create} from 'react-native-pixel-perfect';

function getLanguage() {
  let langObj = require('../resource/en.json');
  let langCode = RNLocalize.getCountry();
  if (Platform.OS == 'ios') {
    langCode =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;
    if (langCode.includes('_')) {
      langCode = langCode.split('_')[0];
    }
  }
  if (
    langCode.toLocaleLowerCase() == 'he' ||
    langCode.toLocaleLowerCase() == 'il' ||
    isForceRTL
  ) {
    langObj = require('../resource/he.json');
  }
  return langObj;
}

export function getPerfectSize() {
  const designResolution = {
    width: 2047,
     height: 1833,
 
  };
  const perfectSize = create(designResolution);
  return perfectSize;
}

export default getLanguage;
