/*
 * author: zby
 * date:2020/09/11
 */

import req from './http.js';

// 活动页性别年龄标签
export const NOVICEWELFARE_INFO = query => req('post', '/activity/novicewelfare/info', query);

// 活动页性别年龄标签添加
export const NOVICEWELFARE_ADD = query => req('post', '/activity/novicewelfare/add', query);

// 领取福利
export const NOVICEWELFARE_WELFARE = query => req('post', '/activity/novicewelfare/welfare', query);

// 领取福利动作
export const NOVICEWELFARE_RECEIVE = query => req('post', '/activity/novicewelfare/receive', query);

// 活动结果页面
export const NOVICEWELFARE_RESULT = query => req('post', '/activity/novicewelfare/result', query);
