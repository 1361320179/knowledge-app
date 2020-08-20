/*
 * author: lufei
 * date:2019/4/30
 */
import req from './http.js'

//品牌首页
export const BRAND_INFO = query => req('post', '/brand/info', query);
export const BRAND_COLUMN_GETS = query => req('post', '/brand/column/gets', query);

//商品搜索(电子书专辑文章搜索结果)
export const BRAND_SEARCH_GOODS_GETS = query => req('post', '/search/goods/gets', query);

//品牌商城
export const BRAND_PAGE_MALL_INDEX = query => req('post', '/page/mall/index', query);

//自定义商城
export const PAGE_GET = query => req('post', '/page/get', query);

//商品搜索综合
export const SEARCH_GOODS_SUMMARY = query => req('post','/search/goods/summary',query)

//火把号搜索(v1.1)
export const SEARCH_BRAND_GETS = query => req('post','/search/brand/gets',query)

//获取搜索栏目列表
export const SEARCH_COLUMU_GETS = query => req('post', '/search/column/gets', query);

//获取全部搜索结果
export const SEARCH_SUMMARY_GETS = query => req('post', '/search/summary/gets', query);

//获取图书搜索结果
export const SEARCH_BOOK_GETS = query => req('post', '/search/book/gets', query);
