export const SplashScreenName = 'ספלאש';
export const LoginScreenName = 'התחברות';
export const DashboardScreenName = 'הזמנות פעילות';
export const OrdersHistoryName = 'היסטוריית הזמנות';
export const SupportScreenName = 'תמיכה';
export const TermsScreenName = 'תנאי השימוש';
export const CheckInfoScreenName = 'חשבוניות';
export const ActiveOrdersScreenName = 'הזמנות פעילות';
export const ScreenOrderChangeName = 'ChangeOrderBid';
export let order_type = {
  1: 'משלוח מהיר',
  2: 'איסוף עצמי',
  3: 'משלוח מתוזמן',
};
export const apiUrl = {
  Development: 'https://test.dibble.co.il/backend/api/index.php',
  Test: 'https://test.dibble.co.il/backend/api/index.php',
  QA: 'https://qa.dibble.co.il/backend/api/index.php',
  Production: 'https://api.dibble.co.il/backend/api/index.php',
};

export const rc_success = '0';
export const rc_token_expire = '201';
export const rq_login = 'login';
export const rq_get_active_order_requests = 'get_active_order_requests';
export const rq_send_invoice = 'get_supplier_orders_summary';
export const rq_place_bid = 'place_bid';
export const rq_get_granted_order_requests = 'get_granted_order_requests';
export const rq_set_bid_order_ready = 'set_bid_order_ready';
export const rq_get_ready_order_requests = 'get_ready_order_requests';
export const rq_get_shipped_order_requests = 'get_shipped_order_requests';
export const rq_get_updated_bidded_orders = 'get_updated_bidded_orders';
export const rq_supplier_get_order_details = 'supplier_get_order_details';
export const rq_supplier_get_invoice_summary = 'get_suppliers_orders_summaries';

export const req_supplier_get_orders = 'supplier_get_orders';
export const rq_set_order_picked_up = 'set_order_picked_up';
export const rq_get_revenue = 'get_supplier_revenue';
export const rq_get_bid_order = 'get_bid_order';
export const rq_get_basic_info = 'get_system_basic_info';
export const rq_reject_order = 'reject_order';
export const rq_update_device_info = 'update_device_info';
export const key_Accepted_Timed_orders = 'Accepted_Timed_Orders';
export const key_user_info = 'user_info';
export const key_business_name = 'business_name';

export const key_restart_for_rtl = 'restart_for_rtl';
export const sub_key_token = 'token';
export const sub_key_name = 'first_name';
export const sub_key_business_name = 'supplier_business_name';

export const sub_key_logo = 'logo_image';
export const c_text_green = '#12d2b3';
export const c_text_black = 'rgb(0,0,0)';
export const c_text_white = 'rgb(255,255,255)';
export const c_text_grey = 'rgb(70,71,75)';
export const c_text_blue = 'rgb(63,135,229)';
export const c_text_yellow = 'rgb(247,186,72)';
export const c_green_status = 'rgb(93,207,25)';
export const c_green_status_opacity = 'rgba(93,207,25,0.5)';
export const c_orange = 'rgb(247,186,72)';
export const c_orange_opacity_50 = 'rgb(247,186,72,0.5)';
export const greyHasOpacity = 'rgba(237,237,237,0.8)';
export const bg_grey_no_opacity = 'rgb(237,237,237)';
export const c_loading_icon = 'rgb(247,186,72)';
export const c_error_line = 'rgb(220 ,50 ,50)';
export const bg_main_dashboard = 'rgba(228,228,228,0.1)';
export const bg_yellow_bubble = 'rgb(255,239,210)';
export const bg_grey = 'rgba(203,207,211,0.25)';
export const bg_red = 'rgb(227,0,0)';
export const bg_pink = 'rgb(255, 234, 234)';
export const bg_dark = 'rgb(0,0,0)';
export const bg_white = 'rgb(255,255,255)';
export const c_text_pink = 'rgb(255, 135, 136)';
export const bg_footer_label = 'rgb(241,141,139)';
export const bg_button_grey = 'rgb(65,66,69)';
export const bg_button_light_blue = 'rgb(223,243,254)';
export const bg_dark_line = '#000000';
export const bg_underline = 'rgb(255,232,188)';
export const bg_incomingOrder = 'rgb(252, 252, 252)';
export const c_text_error_red = 'rgb(227,0,0)';
export const c_text_error_yellow = 'rgb(255,202,26)';
export const c_text_label = 'rgb(133,133,134)';
export const bg_order_ready_1 = 'rgba(255,232,188, 0.25)';
export const c_text_order_id = 'rgb(140, 141, 143)';
export const c_text_order_ready_status = 'rgb(112, 112, 112)';
export const bg_order_grey_start = 'rgba(203, 207, 211,0.25)';
export const bg_order_grey_end = 'rgb(255, 255, 255)';

export const delivery_type_internal = 1;
export const delivery_type_external = 0;
export const delivery_scooter = 2;
export const delivery_bicycle = 3;
export const delivery_scooter_eletric = 4;
export const delivery_car = 5;
export const delivery_truck = 6;
export const delivery_huge_truck = 7;

export const order_type_fast = 1;
export const order_type_pickup = 2;
export const order_type_scheduled = 3;

export const modal_select_product = 1;
export const modal_submit_bid = 2;
export const modal_ready_for_shipment = 3;
export const modal_select_delivery_method = 4;
export const modal_order_summary = 5;

export const isForceRTL = true;
export const timeForAcceptOrder = 5 * 60 * 1000;
export const timeForAcceptOrderNotice = 30 * 1000;
export const timeForAcceptOrderNoticeInSecond = 30;
export const displayTimeFormat = 'YYYY-MM-DD HH:mm:ss';
