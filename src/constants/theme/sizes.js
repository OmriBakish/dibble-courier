import {Dimensions} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const SIZES = {
  // global sizes
  base: 8,
  radius: 2,
  buttonRadius: 2,

  space4: 4,
  space8: 8,
  space12: 12,
  space16: 16,
  space24: 24,
  space48: 48,
  space72: 72,

  iconSize: 16,
  // font sizes
  h1: 26,
  h2: 22,
  h3: 18,
  h4: 16,
  h5: 22,
  body1: 22,
  body2: 18,
  body3: 16,
  body4: 12,

  // app dimensions
  screenWidth,
  screenHeight,
};

export default SIZES;
