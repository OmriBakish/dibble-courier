import {getPerfectSize} from '../../resource/LanguageSupport';
import {StyleSheet} from 'react-native';
export const perfectSize = getPerfectSize();
export const DibbleHeaderStyle = StyleSheet.create({
  dibbleImageStyle: {
    width: perfectSize(237),
    height: perfectSize(65),
  },
  menuHamburgerImageStyle: {
    width: perfectSize(45),
    marginStart: perfectSize(20),
    height: perfectSize(36),
  },
  menuContainerStyle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: perfectSize(45),
    start: perfectSize(54),
  },
  touchableOpacityStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
