import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../src/constants/theme';

interface SectionTitleProps {
  filteredOrders: any[];
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({filteredOrders, title}) => {
  return (
    <View style={styles.barTitleContainer}>
      <View style={styles.rightLine}></View>
      <Text style={styles.columnTitle}>
        {filteredOrders} {title}
      </Text>
      <View style={styles.leftLine}></View>
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
  rightLine: {
    width: 20,
    height: 3,
    backgroundColor: COLORS.dibbleYellow,
  },
  leftLine: {
    height: 3,
    backgroundColor: COLORS.dibbleYellow,
    flex: 1,
  },
  columnTitle: {
    ...FONTS.h2,
    paddingHorizontal: SIZES.space4,
    color: COLORS.ParagraphGray,
  },
});

//make this component available to the app
export default SectionTitle;
