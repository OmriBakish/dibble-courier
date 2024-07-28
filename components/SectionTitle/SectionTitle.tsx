import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../src/constants/theme';

interface SectionTitleProps {
  filteredOrders: any[];
  title: string;
  center?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({title, center = false}) => {
  return (
    <View style={styles.barTitleContainer}>
      <View
        style={[
          styles.line,
          !center && styles.fixedWidthLine,
          center && styles.flexLine,
        ]}></View>
      <Text style={[styles.columnTitle, center && styles.centerText]}>
        {title}
      </Text>
      <View
        style={[
          styles.line,
          center && styles.flexLine,
          !center && styles.flex1,
        ]}></View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  barTitleContainer: {
    borderBottomColor: COLORS.dibbleYellow,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SIZES.space12,
  },
  line: {
    height: 3,
    backgroundColor: COLORS.dibbleYellow,
  },
  fixedWidthLine: {
    width: 20,
  },
  flexLine: {
    flex: 0.8,
  },
  flex1: {
    flex: 1,
  },
  columnTitle: {
    ...FONTS.h2,
    color: COLORS.ParagraphGray,
    paddingHorizontal: SIZES.space4,
  },
  centerText: {
    textAlign: 'center',
    flex: 1,
  },
});

// make this component available to the app
export default SectionTitle;
