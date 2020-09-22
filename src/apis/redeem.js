/*
 * author: lrf
 * date:2019/12/04
 */

import req from './http.js';

// // 验证码
// export const Validate_CODE = query => req('post', '/activity/redeem/code/get', query);

// 兑换码详情
export const REDEEM_CODE_GET = query => req('post', '/activity/redeem/code/get', query);

// 兑换物品（实物/虚拟/优惠券）详情

export const REDEEM_ITEM_GET = query => req('post', '/activity/redeem/get', query)

// 商品兑换动作

export const REDEEM_GOODS = query => req('post', '/activity/redeem/link', query)



/*
 * author: ym
 * date:2020/9/16
 */

// 兑换物品（实物/虚拟/优惠券）详情

export const REDEEM_ITEM_POST = query => req('post', '/activity/redeem/detail', query)

// 兑换物品（实物/虚拟/优惠券）详情

export const REDEEM_LINK = query => req('post', '/activity/redeem/codecheck', query)


export const REDEEM_EXCHANGE = query => req('post', '/activity/redeem/exchange', query)