import {useIsFocused} from '@react-navigation/native';

import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import DibbleHeader from '../../components/DibbleHeader/DibbleHeader';
import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import {screenInvoiceStyle} from './styles';
import CollapsibleInvoiceCard from './CollapsibleInvoiceCard';
import {LocaleConfig} from '../../components/HistoryServices/CollapsibleDate';
import {
  makeAPostRequest,
  getDataWithSubKey,
} from '../../resource/SupportFunction';
import {
  rq_supplier_get_invoice_summary,
  key_user_info,
  sub_key_token,
  c_loading_icon,
  greyHasOpacity,
  rq_get_basic_info,
} from '../../resource/BaseValue';
import ResponseAnimation from '../../components/ResonseAnimation/ResponseAnimation';
let langObj = getLanguage();
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let perfectSize = getPerfectSize();
let GetHeader = React.memo(({label, is_status}) => {
  //console.count('header ' + label)
  return <View></View>;
});

export default function ScreenInvoice(props) {
  let failed_animation_type = 0;
  let success_animation_type = 1;
  let [animationType, setAnimationType] = React.useState(
    success_animation_type,
  );
  let [playAnimation, setPlayAnimation] = React.useState(false);
  let [invoices, setInvoices] = React.useState([]);
  const [vat, setVat] = useState(1);
  const [loadingPage, setLoadingPage] = React.useState(false);
  const isFocused = useIsFocused()
 

  React.useEffect(() => {
    setLoadingPage(true);
    getDataWithSubKey(key_user_info, sub_key_token, (token) => {
      makeAPostRequest(
        {request: rq_supplier_get_invoice_summary, token: token},
        () => {},
        () => {},
        (isSuccess, response) => {
          setLoadingPage(false);

          // setLoadingPage(false)

          if (isSuccess) {
            // alert(JSON.stringify(response));
            if (response.summaries.length&&response.summaries[0]==null){
              
            }
            else{
            setInvoices(response.summaries);
            }
            
          } else {
            alert(JSON.stringify(response));
          }
        },
      );
      makeAPostRequest(
        {request: rq_get_basic_info},
        () => {},
        () => {},
        (isSuccess, response) => {
          setLoadingPage(false);
          if (isSuccess) {
            setVat(response.VAT);
          } else {
            alert(JSON.stringify(response));
          }
        },
      );
    });
  }, [isFocused]);
  return (
    <View
      style={{
        display: 'flex',
        // backgroundColor: 'blue',
        flex: 1,
      }}>
      <View
        style={{
          position: 'absolute',
          display: loadingPage ? 'flex' : 'none',
          backgroundColor: greyHasOpacity,
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: screenWidth,
          height: screenHeight,
        }}>
        <ActivityIndicator
          animating={loadingPage}
          size="large"
          color={c_loading_icon}
        />
      </View>

      <View
        style={{
          height: perfectSize(150),
          backgroundColor: 'white',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <View
          style={{alignSelf: 'flex-start', backgroundColor: 'white'}}></View>

        <DibbleHeader {...props}></DibbleHeader>
        <Text style={[screenInvoiceStyle.titleStyle]}>
          {langObj.invoiceTitle}
        </Text>
      </View>
    {invoices.length>0?(  <ScrollView style={{flex: 1}}>
        <View
          style={{
            alignItems: 'center',
            paddingBottom: perfectSize(100),
            flexDirection: 'column',
          }}>
          {invoices.map((inv) => (
            <CollapsibleInvoiceCard
              setPlayAnimation={setPlayAnimation}
              setAnimationType={setAnimationType}
              inv={inv}
              vat={vat}
              dateString={
                LocaleConfig.monthNames[inv.month - 1] + ' ' + String(inv.year)
              }
              incomeString={inv.order_sum}></CollapsibleInvoiceCard>
          ))}
        </View>
      </ScrollView>):<View>
      <Text
        style={{
          alignSelf: 'center',
          marginTop: perfectSize(134),
          fontFamily: 'OscarFM-Regular',
          fontSize: perfectSize(75),

          letterSpacing: perfectSize(-1.5),
          color: '#d1d2d4',
        }}>
        {langObj.noResults}
      </Text>
      </View>}
      <ResponseAnimation
        playAnimation={playAnimation}
        setPlayAnimation={setPlayAnimation}
        animationType={animationType}></ResponseAnimation>
    </View>
  );
}
