/*
 * author: nancyzeng
 * date:2019/5/17
 */

import req from './http.js'

// 新增虚拟订单
export const ORDER_VIRTUAL_ADD = query => req('post', '/shopping/order/virtual/add', query);

// 订单余额支付手机验证码发送
export const ORDER_VIRTUAL_ADD_SENDCODE = query => req('post', '/shopping/cashier/balance/sendcode', query);

// 订单支付
export const ORDER_VIRTUAL_ADD_PAY = query => req('post', '/shopping/cashier/balance/pay', query);

// 新增虚拟订单
export const ORDER_VIRTUAL_ADDINFO = query => req('post', '/shopping/order/virtual/addinfo', query);

//退款申请
export const ORDER_REFUND_ADD = query => req('post', '/shopping/order/refund/add', query);

//获取退款申请信息
export const ORDER_REFUND_ADDINFO = query => req('post', '/shopping/order/refund/addinfo', query);

//退款记录列表
export const ORDER_REFUND_LOG_GETS = query => req('post', '/shopping/order/refund/log/gets', query);

//撤销退款申请
export const ORDER_REFUND_CANCLE = query => req('post', '/shopping/order/refund/cancle', query);

//填写退款物流信息
export const ORDER_REFUND_DISPATCH_EDIT = query => req('post', '/shopping/order/dispatch/edit', query);

//订单物流信息查询
export const ORDER_EXPRESS_GET = query => req('post', '/shopping/order/express/get', query);

//退货物流公司列表
export const ORDER_REFUND_DISPATCH_COMPANY = query => req('post', '/shopping/order/refund/dispatch/company', query);

//订单确认收货
export const ORDER_RECEIVE = query => req('post', '/shopping/order/RECEIVE', query);

// 加入购物车
export const CART_ADD = query => req('post', '/shopping/cart/add', query);

// 删除购物车中的商品品种
export const CART_DELETE = query => req('post', '/shopping/cart/delete', query);

// 更改商品在购物车的数量
export const CART_EDIT = query => req('post', '/shopping/cart/edit', query);

// 获取购物车信息
export const CART_INFO = query => req('post', '/shopping/cart/gets', query);

// 新增实物订单
export const ORDER_PHYSICAL_ADDINFO = query => req('post', '/shopping/order/physical/addinfo', query);

// 新增实物订单 支付
export const ORDER_PHYSICAL_ADD = query => req('post', '/shopping/order/physical/add', query);

// 实物支付信息获取
export const ORDER_PHYSICAL_PAYINFO = query => req('post', '/shopping/order/physical/payinfo', query);

