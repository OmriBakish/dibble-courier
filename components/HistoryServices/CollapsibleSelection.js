import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Easing,
  Text,
  View,
  Animated,
  FlatList,
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
  defaultCollapsed = true,
  style,
  title,
  useBezier,
  toggleAnimation,
  ...props
}) {
  render_option = (option, onChangeStatus, status, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onChangeStatus(option);
          props.set_is_opened(c => !c);
        }}>
        <View
          style={{
            flex: 1,
            paddingStart: 10,
            flexDirection: 'row',
            height: perfectSize(82),
            alignItems: 'center',
            padding: 5,
            backgroundColor: status == option ? '#ffe8bc' : 'white',
            justifyContent: 'flex-start',
          }}>
          <Text
            style={{
              fontFamily: 'AlmoniDLAAA',
              fontSize: perfectSize(60),
              letterSpacing: perfectSize(-1.2),
              textAlign: 'right',
              color: '#46474b',
            }}>
            {option}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [cHeight, setHeight] = useState(new Animated.Value(0));
  const [isCollapsed, setCollapsed] = useState(
    defaultCollapsed ? defaultCollapsed : true,
  );

  React.useEffect(() => {
    Animated.timing(cHeight, {
      toValue: props.is_opened ? contentHeight : 0,
      easing: Easing.bezier(0, 0, 1, 1),
      duration: 300,
      useNativeDriver: false, // <-- Add this
    }).start();
    toggleAnimation();
  }, [props.is_opened]);

  return (
    <View {...props} style={[styles.card, style]}>
      {/* Card Top */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          props.set_is_opened(c => !c);
        }}
        style={styles.cardTop}>
        {Header}
      </TouchableOpacity>
      {/* Card Content */}
      <Animated.View
        style={{
          height: cHeight,
          borderRadius: perfectSize(20),
          backgroundColor: '#ffffff',
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowRadius: perfectSize(15),
          shadowOpacity: 1,
          borderStyle: 'solid',
          borderWidth: perfectSize(1),
          borderColor: '#f1f1f3',
        }}>
        <FlatList
          vertical={true}
          listKey={moment().valueOf().toString()}
          data={Object.values(props.statuses)}
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={true}
          renderItem={({item, index}) =>
            render_option(item, props.onChangeStatus, props.status, index)
          }
          keyExtractor={item => item.product_id}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: perfectSize(6),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    borderColor: '#ddd',
  },
});

CollapsibleCard.propTypes = propTypes;
CollapsibleCard.defaultProps = defaultProps;

export default CollapsibleCard;
