import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import ReadyOrderCard from './ReadyOrderCard';
import {SIZES} from '../../src/constants/theme';
import SectionTitle from '../SectionTitle/SectionTitle';
import getLanguage from '../../resource/LanguageSupport';
import {bg_incomingOrder, bg_order_ready_1} from '../../resource/BaseValue';

const langObj = getLanguage();

const ReadyOrdersBar = ({readyOrder, shippedOrder, showModalBox, ...props}) => {
  return (
    <View style={styles.columnContainer}>
      <SectionTitle title={langObj.ready} filteredOrders={readyOrder.length} />
      <LinearGradient
        colors={[bg_order_ready_1, bg_incomingOrder]}
        style={styles.barLinearGradientStyle}>
        <FlatList
          listKey={moment().valueOf().toString()}
          data={readyOrder}
          renderItem={({item}) => (
            <ReadyOrderCard item={item} showModalBox={showModalBox} />
          )}
          keyExtractor={item => item.order_id}
        />
      </LinearGradient>
    </View>
  );
};

export const styles = StyleSheet.create({
  columnContainer: {
    flex: 0.5,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  barLinearGradientStyle: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    padding: SIZES.space8,
  },
});

export default ReadyOrdersBar;
