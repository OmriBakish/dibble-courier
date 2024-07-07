import {useState, useCallback, useEffect} from 'react';
import {useStateWithPromise} from '../Utils/useStateWithPromise';
import {key_user_info, req_supplier_get_orders} from '../../resource/BaseValue';
import {makeAPostRequest} from '../../resource/SupportFunction';

import AsyncStorage from '@react-native-community/async-storage';
import getLanguage from '../../resource/LanguageSupport';
let langObj = getLanguage();
export function useFetchHistory(
  status_filter,
  input,
  date_string,
  date_from,
  date_to,
  setLoading,
  statuses,
  setStatuses,
   sendInvoice,
  setSendInvoice,
 
) {
  const [page, setPage] = useState(0);
  // default this to true to kick the initial effect hook to
  // fetch the first page
  const [shouldFetch, setShouldFetch] = useStateWithPromise(true);
  const [orders, setOrders] = useStateWithPromise([]);
  const [num_of_pages, setNumOfPages] = useStateWithPromise(1);
 
  const reset = async () => {
    // wait for all state updates to be completed
    await Promise.all([setOrders([]), setPage(0), setNumOfPages(1)]);
    setShouldFetch(true);
  };
  // return this function for Flatlist to call onEndReached
  const fetchMore = useCallback(() => setShouldFetch(true), []);

 
  useEffect(
    () => {
      const fetch = async () => {
        let token = await AsyncStorage.getItem(key_user_info);
        if (token != null) {
          token = JSON.parse(token).token;
        }
        let dataObj = {
          request: req_supplier_get_orders,
          token: token,
        };

        if (status_filter !== langObj.status) {
          status_index =
            Object.keys(statuses)[
              Object.values(statuses).indexOf(status_filter)
            ];
          dataObj = {...dataObj, filter_statuses: parseInt(status_index)};
          //alert(status_index)
        }
        if (input !== '') {
          dataObj = {...dataObj, filter_search: input};
        }
        if (date_string != langObj.dates) {
          dataObj = {
            ...dataObj,
            filter_from_date: date_from,
            filter_to_date: date_to,
          };
          // alert(JSON.stringify(dataObj))
        }
         if (sendInvoice) {
          dataObj.invoice_parameter = true;
          setSendInvoice(false);
        }
 
        if (page > 0) {
          dataObj = {...dataObj, page: page};
          //alert(JSON.stringify(dataObj))
        }
        // console.log(JSON.stringify(dataObj))
        //alert(JSON.stringify(dataObj))
        //alert(JSON.stringify(dataObj))
        makeAPostRequest(
          dataObj,
          () => {
            setLoading(true);
          },
          () => {},
          (isSuccess, responseJson) => {
            if (isSuccess) {
              if (responseJson.num_of_pages) {
                setNumOfPages(responseJson.num_of_pages);
              }
              if (responseJson.statuses) {
                 let statuses = responseJson.statuses;
                delete statuses[2];
                setStatuses({0: langObj.all, ...statuses});
 
              }
              //alert(JSON.stringify(responseJson))
              setOrders([...orders, ...responseJson.orders]);
              setLoading(false);
              //alert(JSON.stringify(orders))
              setShouldFetch(false);
              setPage(page + 1);

              //alert("found")
            } else {
              setLoading(false);
              //alert(responseJson)
            }
          },
        );

        // set the should fetch call to false to prevent fetching
        // on page number update
      };
      // prevent fetching for other state changes
      if (shouldFetch && page < num_of_pages) {
        fetch();
      }
    },
    // prevent fetching for other state changes
    [page, shouldFetch],
  );
  return [orders, fetchMore, reset];
}
