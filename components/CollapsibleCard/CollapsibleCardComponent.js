import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import {
  StyleSheet,
  Easing,
  Text,
  View,
  Animated,
  FlatList,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import BezierEasing from 'bezier-easing';
import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import {globalStyles} from '../../resource/style/global';
import moment from 'moment';
let perfectSize = getPerfectSize();
let langObj = getLanguage();

const propTypes = {
  children: PropTypes.node,
  contentHeight: PropTypes.number,
  defaultCollapsed: PropTypes.bool,
  style: PropTypes.any,
  title: PropTypes.string,
  useBezier: PropTypes.bool,
};

const defaultProps = {
  contentHeight: 400,
  useBezier: true,
};

function CollapsibleCard({
  children,
  Header,
  contentHeight,
  defaultCollapsed,
  style,
  title,
  useBezier,
  ...props
}) {
  const [cHeight, setHeight] = useState(new Animated.Value(0));
  const [isCollapsed, setCollapsed] = useState(
    defaultCollapsed ? defaultCollapsed : true,
  );

  return (
    <View {...props} style={[styles.card, style]}>
      {/* Card Top */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setCollapsed(c => !c);
        }}
        style={styles.cardTop}>
        <Header></Header>
      </TouchableOpacity>
      {/* Card Content */}
      <View>
        <View
          style={{
            height: isCollapsed ? 0 : 'auto',
            marginBottom: 0,
            overflow: 'hidden',
          }}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});

CollapsibleCard.propTypes = propTypes;
CollapsibleCard.defaultProps = defaultProps;

export default pure(CollapsibleCard);
