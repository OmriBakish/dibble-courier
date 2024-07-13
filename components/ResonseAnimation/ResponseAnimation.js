import React, {useRef} from 'react';
import {Dimensions, View, Animated, Text} from 'react-native';
const screenWidth = Math.round(Dimensions.get('window').width);
import LottieView from 'lottie-react-native';
import {getPerfectSize} from '../../resource/LanguageSupport';
const screenHeight = Math.round(Dimensions.get('window').height);
let perfectSize = getPerfectSize();
export default function ResponseAnimation({
  animationType,
  playAnimation,
  setPlayAnimation,
}) {
  const LottieRef = useRef(null);
  const [progress] = React.useState(new Animated.Value(0));
  React.useEffect(() => {
    if (playAnimation) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        progress.setValue(0);

        setPlayAnimation(false);
      });
    } // < Don't forget to start!
  }, [playAnimation]); // < Run animation only when props.value changed
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: perfectSize(500),
        left: 0,
        top: 0,
        marginTop: screenHeight / 2 - perfectSize(700) / 2,
        marginLeft: screenWidth / 2 - perfectSize(500) / 2,
        zIndex: 2000,
        height: perfectSize(700),
      }}>
      <LottieView
        style={{
          display: playAnimation ? 'flex' : 'none',
        }}
        resizeMode="cover"
        ref={LottieRef}
        progress={progress}
        source={
          animationType == 1
            ? require('../../resource/animations/success.json')
            : require('../../resource/animations/failed.json')
        }
      />
    </View>
  );
}
