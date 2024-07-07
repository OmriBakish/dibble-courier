import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../../src/constants/theme';

/**
 * CustomButton component used to display a button with optional background color and text size.
 * @param {string} backgroundColor - The background color for the button. Default is COLORS.dibbleYellow.
 * @param {function} onPress - Function to be called when the button is pressed.
 * @param {object} style - Additional styles to be applied to the button container.
 * @param {string} text - The text to be displayed on the button.
 * @param {boolean} small - If true, renders a smaller sized button. Default is false.
 * @param {object} inputValidation - Validation status object.
 */

const CustomButton = ({
  backgroundColor = null,
  borderColor,
  onPress,
  style,
  text,
  small,
  inputValidation,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles(backgroundColor, borderColor, small, inputValidation).container,
        style,
      ]}
      onPress={onPress}
      disabled={disabled ? !inputValidation : false}>
      <Text style={[styles(backgroundColor, borderColor).buttonText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = (backgroundColor, borderColor, small, inputValidation) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: small ? 32 : 56,
      backgroundColor: backgroundColor
        ? backgroundColor
        : inputValidation === false
        ? COLORS.UnclickableGray
        : COLORS.dibbleYellow,
      borderRadius: 2,
      borderWidth: 1.5,
      borderColor:
        borderColor ?? backgroundColor === COLORS.black
          ? COLORS.red
          : backgroundColor === COLORS.white
          ? COLORS.dibbleYellow
          : backgroundColor === COLORS.UnclickableGray
          ? COLORS.UnclickableGray
          : inputValidation === false
          ? COLORS.UnclickableGray
          : COLORS.dibbleYellow,
    },
    buttonText: {
      ...FONTS.h3,
      ...(small ? {...FONTS.h2} : {...FONTS.h3}),
      color: borderColor
        ? borderColor
        : backgroundColor === COLORS.black
        ? COLORS.white
        : backgroundColor === COLORS.white
        ? COLORS.dibbleYellow
        : COLORS.white,
    },
  });

export default CustomButton;
