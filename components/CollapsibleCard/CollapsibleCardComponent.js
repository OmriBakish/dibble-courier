import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import {
  StyleSheet,
  LayoutAnimation,
  TouchableOpacity,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

const propTypes = {
  children: PropTypes.node,
  Header: PropTypes.node.isRequired,
  contentHeight: PropTypes.number,
  defaultCollapsed: PropTypes.bool,
  style: PropTypes.any,
};

function CollapsibleCard({
  children,
  Header,
  contentHeight = 400, // Default parameter
  defaultCollapsed = true, // Default parameter
  style,
  ...props
}) {
  const [isCollapsed, setCollapsed] = useState(defaultCollapsed);
  const [height] = useState(
    new Animated.Value(defaultCollapsed ? 0 : contentHeight),
  );

  useEffect(() => {
    if (isCollapsed) {
      Animated.timing(height, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(height, {
        toValue: contentHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isCollapsed, contentHeight]);

  return (
    <View {...props}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setCollapsed(!isCollapsed);
        }}
        style={styles.header}>
        {Header}
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => setCollapsed(!isCollapsed)}>
        <Animated.View style={{height}}>{children}</Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    backgroundColor: 'red',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

CollapsibleCard.propTypes = propTypes;

export default pure(CollapsibleCard);
