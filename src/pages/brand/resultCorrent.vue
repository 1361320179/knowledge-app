<template>
  <div id="resultPage">
    <!--<div
      class="nullBox"
      v-if="programFinished && contentData.length == 0 && summaryList.length == 0 && huobaList.length == 0"
    >
      <img src="../../assets/null/list.png" width="100%" />
      <div>您搜索的内容为空</div>
    </div>
    <van-list
      v-else
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
      class="list"
    >-->
    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
      class="list"
    >
      <!-- <div> -->
      <div class="searhResult">
        <div class="cancel-back" @click="cancelBack">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-left-arrow" />
          </svg>
        </div>
        <div class="search_input">
          <svg class="icon searchIcon" aria-hidden="true">
            <use xlink:href="#icon-search-line" />
          </svg>
          <input type="text" @focus="inputCancel"/>
          <div class="input-text-1" v-if="searchContent != ''">
            <span>{{ searchContent }}</span>
            <svg class="icon input-close-de" aria-hidden="true" @click="cancelBack">
              <use xlink:href="#icon-close-line" />
            </svg>
          </div>
        </div>
        <div class="tileView" v-if="tileViewShow" @click="tilingMethods">
          <svg class="icon" aria-hidden="true" v-if="tilings">
            <use xlink:href="#icon-kapian1" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-liebiao" />
          </svg>
        </div>
      </div>
      <van-tabs
        sticky
        animated
        color="#666"
        title-active-color="#333"
        @click="tabChange"
        v-if="column_list.length > 0"
        v-model="activekey"
      >
        <van-tab :title="items.name" v-for="(items,index) in column_list" :key="index">
          <template v-if="items.column_type == 9 || items.column_type == 4 || items.column_type == 3 && activekey == index">
            <div class="screenSecond" v-if="screen_choose == items.column_type">
              <div class="sort_box" @click="sort_choose">
                <div class="sort_text" :style="{'color': sort_show_color?'#EF5755':'','background-color': sort_show_color?'#FFF7F7':'','border': sort_show_color?'1px solid  #F05654':''}">
                  <div class="screen_text">{{ sort_text_1 }}</div>
                  <svg class="icon" aria-hidden="true" v-if="sort_show">
                    <use xlink:href="#icon-unfold-line" />
                  </svg>
                  <svg class="icon" aria-hidden="true" v-else>
                    <use xlink:href="#icon-fold-line" />
                  </svg>
                </div>
                <ul v-if="sort_show">
                  <li @click="sort_choosetext('综合排序','')">综合排序</li>
                  <li @click="sort_choosetext('销量从高到低','buynum_desc')">销量从高到低</li>
                  <li @click="sort_choosetext('销量从低到高','buynum_asc')">销量从低到高</li>
                  <li @click="sort_choosetext('价格从高到低','price_desc')">价格从高到低</li>
                  <li @click="sort_choosetext('价格从低到高','price_asc')">价格从低到高</li>
                </ul>
              </div>
              <div class="price_box">
                <div class="price_text" @click="price_choose" :style="{'color': price_show_color?'#EF5755':'','background-color': price_show_color?'#FFF7F7':'','border': price_show_color?'1px solid  #F05654':''}">
                  <div class="screen_text">{{ price_text_1 }}</div>
                  <svg class="icon" aria-hidden="true" v-if="price_show">
                    <use xlink:href="#icon-unfold-line" />
                  </svg>
                  <svg class="icon" aria-hidden="true" v-else>
                    <use xlink:href="#icon-fold-line" />
                  </svg>
                </div>
                <div class="price_keyboard" v-if="price_show">
                  <div class="price_input">
                    <van-field
                      type="digit"
                      v-model="sdigit"
                      placeholder="最低价"
                    />
                    <div class="price_line">
                      <div class="line"></div>
                    </div>
                    <van-field
                      type="digit"
                      v-model="edigit"
                      placeholder="最高价"
                    />
                  </div>
                  <div class="price-button">
                    <div class="reset-button" @click="price_reset">重置</div>
                    <div class="sure-button" @click="price_sure">确定</div>
                  </div>
                </div>
              </div>
              <!--火把号筛选-->
              <div class="huoba_box" v-if="items.column_type == 9 || items.column_type == 4">
                <div class="huoba_text" @click="huoba_choose" :style="{'color': huoba_show_color?'#EF5755':'','background-color': huoba_show_color?'#FFF7F7':'','border': huoba_show_color?'1px solid  #F05654':''}">
                  <div class="screen_text">{{ huoba_text }}</div>
                  <svg class="icon" aria-hidden="true" v-if="huoba_show">
                    <use xlink:href="#icon-unfold-line" />
                  </svg>
                  <svg class="icon" aria-hidden="true" v-else>
                    <use xlink:href="#icon-fold-line" />
                  </svg>
                </div>
                <div class="huoba_radio" v-if="huoba_show">
                  <div class="radios" v-if="brand_list_length">
                    <van-checkbox-group v-model="huoba_radio">
                      <div v-for="(item,index) in brand_list" :key="index">
                        <van-checkbox :name="index">{{ item.brand_name }}</van-checkbox>
                      </div>
                    </van-checkbox-group>
                  </div>
                  <div class="radios" v-else>
                    无可选火把号
                  </div>
                  <div class="huoba-button">
                    <div class="reset-button" @click="huoba_reset">重置</div>
                    <div class="sure-button" @click="huoba_sure">确定</div>
                  </div>
                </div>
              </div>
              <!--店铺筛选-->
              <div class="huobashop_box" v-else>
                <div class="huobashop_text" @click="huobashop_choose" :style="{'color': huobashop_show_color?'#EF5755':'','background-color': huobashop_show_color?'#FFF7F7':'','border': huobashop_show_color?'1px solid  #F05654':''}">
                  <div class="screen_text">{{ huobashop_text }}</div>
                  <svg class="icon" aria-hidden="true" v-if="huobashop_show">
                    <use xlink:href="#icon-unfold-line" />
                  </svg>
                  <svg class="icon" aria-hidden="true" v-else>
                    <use xlink:href="#icon-fold-line" />
                  </svg>
                </div>
                <div class="huobashop_radio" v-if="huobashop_show">
                  <div class="radios" v-if="brand_list_length">
                    <van-checkbox-group v-model="huobashop_radio">
                      <div v-for="(item,index) in brand_list" :key="index">
                        <van-checkbox :name="index">{{ item.brand_name }}</van-checkbox>
                      </div>
                    </van-checkbox-group>
                  </div>
                  <div class="radios" v-else>
                    无可选火把店铺
                  </div>
                  <div class="huobashop-button">
                    <div class="reset-button" @click="huobashop_reset">重置</div>
                    <div class="sure-button" @click="huobashop_sure">确定</div>
                  </div>
                </div>
              </div>
              <div class="only_pay" @click="is_pay" v-if="items.column_type == 9 || items.column_type == 4">
                <van-checkbox v-model="needs_pay">仅看付费</van-checkbox>
              </div>
              <div class="only_shop" @click="is_shop" v-else>
                <van-checkbox v-model="needs_pay">仅看有货</van-checkbox>
              </div>
            </div>
          </template>
          <template v-if="sort_show || price_show || huoba_show || huobashop_show">
            <div class="screenOverflow" @touchstart="stop_shade()"></div>
          </template>
          <template
            v-if="items.column_type == 0 && items.search_type && items.search_type == 'summary' && activekey == index"
          >
            <div v-for="(litem,lindex) in summaryList" :key="lindex">
              <div class="summaryList" v-if="litem.search_type == 'brand'">
                <div class="head">
                  <span class="verticleLine"></span>
                  <span class="brandName">
                    火把号
                    <span class="title_name" v-if="litem.result_num > 0">{{ litem.result_num }}</span>
                  </span>
                </div>
                <div
                  class="brandContent"
                  v-for="(bitem,bindex) in litem.list"
                  :key="bindex"
                  @click="toBrand(bitem,bindex)"
                >
                  <img :src="bitem.brand_pic" alt width="45px" height="45px" />
                  <div class="huobaName">
                    <div class="bname">{{bitem.brand_name}}</div>
                    <div class="sname">{{bitem.summary}}</div>
                  </div>
                  <div class="huobabG" v-if="bitem.attention == 0" @click.stop="focusAction(bitem.brand_id,bitem.attention)">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shoucang" />
                    </svg>
                    <div>关注</div>
                  </div>
                  <div class="huobaG" v-else @click.stop="focusAction(bitem.brand_id,bitem.attention)">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shoucang" />
                    </svg>
                    <div>已关注</div>
                  </div>
                </div>
                <div class="readMore" v-if="litem.result_num > 2">
                  <span @click="watchMore(litem,lindex)">
                    查看更多
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-next-line" />
                    </svg>
                  </span>
                </div>
              </div>
              <div class="summaryList" v-if="litem.search_type == 'goods'">
                <div class="head">
                  <span class="verticleLine"></span>
                  <span class="brandName">
                    {{litem.column_name}}
                    <span class="title_name" v-if="litem.result_num > 0">{{ litem.result_num }}</span>
                  </span>
                </div>
                <div v-for="(gitem,gindex) in litem.list" :key="gindex">
                  <!-- 图书,专辑 -->
                  <div
                    class="content book"
                    @click="gotoDetail(gitem)"
                    v-if="gitem.goods_type == 3 || gitem.goods_type == 9"
                  >
                    <div class="ratiobook">
                      <div class="bookimg" v-lazy:background-image="gitem.pic"></div>
                      <span class="book_text_title" v-if="gitem.goods_type == 3">图书</span>
                      <span class="book_text_title" v-if="gitem.goods_type == 9">专辑</span>
                    </div>
                    <div class="right">
                      <div class="text">{{gitem.title}}</div>
                      <div class="pinpai">
                        <div class="price" v-if="gitem.price">￥{{gitem.price.toFixed(2)}}</div>
                        <div class="price" v-else>免费</div>
                        <div class="preferent_active">
                          <span v-for="(titems,indexs) in gitem.tag_list" :key="indexs">
                            <span class="active_1" v-if="indexs<1">
                              <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                              <span class="active_text_2" v-if="titems.type == 3">{{ titems.name }}</span>
                              <span class="active_text_3" v-if="titems.type == 4">{{ titems.name }}</span>
                            </span>
                          </span>
                        </div>
                        <div class="shopCar" @click.stop="addToCart(gitem)" v-if="gitem.goods_type == 3">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-gouwuche2" />
                          </svg>
                        </div>
                      </div>
                      <div class="nice" v-if="gitem.goods_type == 9">
                        <span class="comment">
                          <span @click.stop="toBrand(gitem,gindex)">
                            {{ gitem.brand_name }}
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-next-line" />
                            </svg>
                          </span>
                        </span>
                      </div>
                      <div class="nice bookflex" v-if="gitem.goods_type == 3">
                        <span class="bookgrow">
                          {{ gitem.brand_name }}
                          <span @click.stop="toBrandShop(gitem,gindex)">
                            <span class="bookShop">进店</span>
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-next-line" />
                            </svg>
                          </span>
                        </span>
                        <!--<span v-if="gitem.goods.length > 0" >-->
                          <!--其他{{ gitem.goods.length }}家店铺-->
                          <!--<svg class="icon" aria-hidden="true">-->
                            <!--<use xlink:href="#icon-fold-line" />-->
                          <!--</svg>-->
                        <!--</span>-->
                      </div>
                    </div>
                  </div>
                  <!-- 文章 -->
                  <div class="content" @click="gotoDetail(gitem)" v-if="gitem.goods_type == 6">
                    <div class="right">
                      <div class="text">{{gitem.title}}</div>
                      <div class="nice">
                        <span class="good" v-if="gitem.goods_type == 6">
                          <span @click.stop="toBrand(gitem,gindex)">
                            {{ gitem.brand_name }}
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-next-line" />
                            </svg>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div class="ratiobox">
                      <div class="bookImg" v-lazy:background-image="gitem.pic"></div>
                    </div>
                  </div>
                  <!-- 音视频 -->
                  <div
                    class="content audio"
                    @click="gotoDetail(gitem)"
                    v-if="gitem.goods_type == 1 || gitem.goods_type == 2"
                  >
                    <div class="ratiobox">
                      <div class="bookImg" v-lazy:background-image="gitem.pic"></div>
                    </div>
                    <div class="right">
                      <div class="text">{{gitem.title}}</div>
                      <div class="pinpai">{{gitem.sub_title}}</div>
                      <div class="nice">
                        <span class="good">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-time-line" />
                          </svg>
                          <span>{{gitem.duration}}</span>
                        </span>
                        <span class="price">
                          <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-comment-line" />
                          </svg>-->
                          <span v-if="gitem.price">￥{{ gitem.price }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 电子书 -->
                  <div
                    class="content ebook"
                    @click="gotoDetail(gitem)"
                    v-if="gitem.goods_type == 4"
                  >
                    <div class="ratiobox">
                      <div class="bookImg" v-lazy:background-image="gitem.pic"></div>
                      <span class="book_text_title">电子书</span>
                    </div>
                    <div class="right">
                      <div class="text">{{gitem.title}}</div>
                      <div class="pinpai">
                        <div class="price" v-if="gitem.price">￥{{gitem.price.toFixed(2)}}</div>
                        <div class="price" v-else>免费</div>
                        <div class="preferent_active">
                        <span v-for="(titems,indexs) in gitem.tag_list" :key="indexs">
                          <span class="active_1" v-if="indexs<1">
                            <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                              <span class="active_text_2" v-if="titems.type == 3">{{ titems.name }}</span>
                              <span class="active_text_3" v-if="titems.type == 4">{{ titems.name }}</span>
                          </span>
                        </span>
                        </div>
                      </div>
                      <div class="nice">
                        <span class="good">
                          <span @click.stop="toBrand(gitem,index)">
                            {{ gitem.brand_name }}
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-next-line" />
                            </svg>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="readMore" v-if="litem.result_num > 2">
                  <span @click="watchMore(litem,lindex)">
                    查看更多
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-next-line" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </template>
          <!-- 火把号 -->
          <template
            v-if="items.column_type == -1 && items.search_type && items.search_type == 'brand' && activekey == index"
          >
            <div class="summaryList huoba" v-if="huobaList.length>0">
              <div
                class="brandContent"
                v-for="(hbitem,hbindex) in huobaList"
                :key="hbindex"
                @click="toBrand(hbitem,hbindex)"
              >
                <img :src="hbitem.brand_pic" alt width="45px" height="45px" />
                <div class="huobaName">
                  <div class="bname">{{hbitem.brand_name}}</div>
                  <div class="sname">{{hbitem.summary}}</div>
                </div>
                <div class="huobabG" v-if="hbitem.attention == 0" @click.stop="focusAction(hbitem.brand_id,hbitem.attention)">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shoucang" />
                  </svg>
                  <div>关注</div>
                </div>
                <div class="huobaG" v-else @click.stop="focusAction(hbitem.brand_id,hbitem.attention)">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shoucang" />
                  </svg>
                  <div>已关注</div>
                </div>
              </div>
            </div>
          </template>
          <template
            v-if="items.column_type > 0 && items.search_type && items.search_type == 'goods' && activekey == index"
          >
            <div :class="{etc_box: is_etc_box}">
              <div class="etc_inbox" v-for="(item,index) in brandData" :key="index">
                <!-- 专辑 -->
                <div
                  class="content book"
                  @click="gotoDetail(item)"
                  v-if="item.goods_type == 3 || item.goods_type == 9"
                >
                  <div class="ratiobook">
                    <div class="bookimg" v-lazy:background-image="item.pic"></div>
                    <span class="book_text_title">专辑</span>
                  </div>
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <div class="pinpai">
                      <div class="price" v-if="item.price">￥{{item.price.toFixed(2)}}</div>
                      <div class="price" v-else>免费</div>
                      <div class="preferent_active">
                      <span v-for="(titems,indexs) in item.tag_list" :key="indexs">
                          <span class="active_1" v-if="indexs<1">
                            <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                              <span class="active_text_2" v-if="titems.type == 3">{{ titems.name }}</span>
                              <span class="active_text_3" v-if="titems.type == 4">{{ titems.name }}</span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div class="nice">
                    <span class="price" v-if="item.goods_type == 3">
                      <span>￥{{ item.price }}</span>
                    </span>
                      <span class="comment" v-if="item.goods_type == 9">
                      <span @click.stop="toBrand(item,index)">
                        {{ item.brand_name }}
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-next-line" />
                        </svg>
                      </span>
                    </span>
                    </div>
                  </div>
                </div>
                <!-- 文章 -->
                <div class="content" @click="gotoDetail(item)" v-if="item.goods_type == 6">
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <div class="nice">
                    <span class="good" v-if="item.goods_type == 6">
                      <span @click.stop="toBrand(item,index)">
                        {{ item.brand_name }}
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-next-line" />
                        </svg>
                      </span>
                    </span>
                    </div>
                  </div>
                  <div class="ratiobox">
                    <div class="bookImg" v-lazy:background-image="item.pic"></div>
                  </div>
                </div>
                <!-- 音视频 -->
                <div
                  class="content audio"
                  @click="gotoDetail(item)"
                  v-if="item.goods_type == 1 || item.goods_type == 2"
                >
                  <div class="ratiobox">
                    <div class="bookImg" v-lazy:background-image="item.pic"></div>
                  </div>
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <div class="pinpai">{{item.sub_title}}</div>
                    <div class="nice">
                    <span class="good">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-time-line" />
                      </svg>
                      <span>{{item.duration}}</span>
                    </span>
                      <span class="price">
                      <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-comment-line" />
                      </svg>-->
                      <span v-if="item.price">￥{{ item.price }}</span>
                    </span>
                    </div>
                  </div>
                </div>
                <!-- 电子书 -->
                <div class="content ebook" @click="gotoDetail(item)" v-if="item.goods_type == 4">
                  <div class="ratiobox">
                    <div class="bookImg" v-lazy:background-image="item.pic"></div>
                    <span class="book_text_title">电子书</span>
                  </div>
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <div class="pinpai">
                      <div class="price" v-if="item.price">￥{{item.price.toFixed(2)}}</div>
                      <div class="price" v-else>免费</div>
                      <div class="preferent_active">
                      <span v-for="(titems,indexs) in item.tag_list" :key="indexs">
                          <span class="active_1" v-if="indexs<1">
                            <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                              <span class="active_text_2" v-if="titems.type == 3">{{ titems.name }}</span>
                              <span class="active_text_3" v-if="titems.type == 4">{{ titems.name }}</span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div class="nice">
                    <span class="good">
                      <span @click.stop="toBrand(item,index)">
                        {{ item.brand_name }}
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-next-line" />
                        </svg>
                      </span>
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template
            v-if="items.column_type > 0 && items.search_type && items.search_type == 'book' && activekey == index"
          >
            <div :class="{book_box: is_book_box}">
              <template v-for="(item,index) in brandData">
                <!-- 图书 -->
                <div class="book_inbox" :key="`${index}`">
                  <div
                    class="content book"
                    @click="gotoDetail(item)"
                    v-if="item.goods_type == 3"
                  >
                    <div class="ratiobook">
                      <div class="bookimg" v-lazy:background-image="item.pic"></div>
                      <span class="book_text_title">图书</span>
                    </div>
                    <div class="right">
                      <div class="text">{{item.title}}</div>
                      <div class="pinpai">
                        <div class="price" v-if="item.price">￥{{item.price.toFixed(2)}}</div>
                        <div class="price" v-else>免费</div>
                        <div class="preferent_active">
                          <span v-for="(titems,indexs) in item.tag_list" :key="indexs">
                            <span class="active_1" v-if="indexs<1">
                              <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                              <span class="active_text_2" v-if="titems.type == 3">{{ titems.name }}</span>
                              <span class="active_text_3" v-if="titems.type == 4">{{ titems.name }}</span>
                            </span>
                          </span>
                        </div>
                        <div class="shopCar" @click.stop="addToCart(item)">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-gouwuche2" />
                          </svg>
                        </div>
                      </div>
                      <div class="nice bookflex">
                    <span class="bookgrow">
                      {{ item.brand_name }}
                      <span @click.stop="toBrandShop(item,index)">
                        <span class="bookShop">进店</span>
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-next-line" />
                        </svg>
                      </span>
                    </span>
                        <span v-if="item.goods.length > 0" class="shopShow_1" :id="'zShop_'+index" @click.stop="shopDevelop(index,item.goods.length)">
                      其他{{ item.goods.length }}家店铺
                        <svg class="icon" aria-hidden="true" v-if="is_book_box">
                          <use xlink:href="#icon-next-line" />
                        </svg>
                      <svg class="icon" aria-hidden="true" v-else>
                        <use xlink:href="#icon-fold-line" />
                      </svg>
                    </span>
                      </div>
                    </div>
                  </div>
                </div>
                <!--展开店铺-->
                <div class="book_inbox" :id="'showBook_'+index+zindex" v-for="(zitem,zindex) in item.goods" :key="`${index}-${zindex}`" v-show="zitem.goods_type == 3 && shopZindex == index">
                  <div
                    class="content book"
                    @click="gotoDetail(zitem)"
                    v-if="zitem.goods_type == 3"
                  >
                    <div class="ratiobook">
                      <!--<div class="bookimg" v-lazy:background-image="zitem.pic"></div>-->
                      <div class="bookimg" :style="{'background-image': 'url('+zitem.pic+')'}"></div>
                      <span class="book_text_title">图书</span>
                    </div>
                    <div class="right">
                      <div class="text">{{zitem.title}}</div>
                      <div class="pinpai">
                        <div class="price" v-if="zitem.price">￥{{zitem.price.toFixed(2)}}</div>
                        <div class="price" v-else>免费</div>
                        <div class="preferent_active">
                        <span v-for="(titems,indexs) in zitem.tag_list" :key="indexs">
                          <span class="active_1" v-if="indexs<1">
                            <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                            <span class="active_text_2" v-if="titems.type == 3">{{ titems.name }}</span>
                            <span class="active_text_3" v-if="titems.type == 4">{{ titems.name }}</span>
                          </span>
                        </span>
                        </div>
                        <div class="shopCar" @click.stop="addToCart(zitem)">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-gouwuche2" />
                          </svg>
                        </div>
                      </div>
                      <div class="nice bookflex">
                      <span class="bookgrow">
                        {{ zitem.brand_name }}
                        <span @click.stop="toBrandShop(zitem,zindex)">
                          <span class="bookShop">进店</span>
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-next-line" />
                          </svg>
                        </span>
                      </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </van-tab>
      </van-tabs>
      <!-- </div> -->
    </van-list>
    <EazyNav type="brand" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/brand/resultCorrent.scss" scoped lang="scss"></style>
<style>
  html {
    overflow-x: hidden;
  }
  .van-tabs__content--animated {
    overflow: unset;
  }
  .van-cell{
    padding: 15px 35px;
    line-height: 30px;
  }
  .van-field__control{
    padding-left: 10px;
  }
  .van-icon{
    padding-right: 10px;
  }
  .van-field__body{
    border-radius: 30px;
    background-color: rgba(242, 242, 242, 1);
  }
  .van-cell:not(:last-child):after{
    border-bottom: none;
  }
  .van-radio__icon--checked .van-icon {
    color: #F05654;
    border-color: #F05654 ;
    background-color: #FFF7F7;
  }
  .van-checkbox__icon--checked .van-icon {
    color: #F05654;
    border-color: #F05654 ;
    background-color: #FFF7F7;
  }
  .van-checkbox__icon .van-icon {
    font-size: 12px;
    line-height: initial;
    width: 15px;
    height: 15px;
  }
  .van-checkbox__label {
    margin-right: 10px;
    margin-left: 3px;
  }
</style>
<script>
  import {
    BRAND_SEARCH_GOODS_GETS,
    SEARCH_BRAND_GETS,
    SEARCH_COLUMU_GETS,
    SEARCH_SUMMARY_GETS,
    SEARCH_BOOK_GETS
  } from "../../apis/brand.js";
  import {
    FOCUS_ADD,
    FOCUS_CANCEL
  } from "../../apis/public.js";
  import { CART_ADD } from "../../apis/shopping.js";
  import resultVue from "../personal/order/result.vue";
  export default {
    data() {
      return {
        state: "brand",
        brandData: [],
        brand_list: [],
        bookData: [],
        column_list: [{ search_type: null }],
        programLoading: false,
        programFinished: false,
        tileViewShow: false,
        // 搜索结果参数
        searchContent: "",
        activekey: 0,
        sort_text_1: '综合排序',
        price_text_1: '价格区间',
        huoba_text: '所属火把号',
        huoba_radio: [],
        huoba_name: [],
        huoba_id: [],
        huobashop_text: '所属店铺',
        huobashop_radio: [],
        huobashop_name: [],
        huobashop_id: [],
        screen_choose: 0,
        price_zone: '',
        title: null,
        page_size: 10,
        contentData: [],
        supplier_id: null,
        tagids: null,
        cids: null,
        summaryList: [],
        huobapage: 1,
        page: 1,
        needs_pay: 1,
        huobaList: [],
        judgehome_id: null,
        sort_show: 0,
        sort_show_color: 0,
        price_show: 0,
        has_stock: 1,
        price_show_color: 0,
        huoba_show: 0,
        sort: '',
        huoba_show_color: 0,
        huobashop_show: 0,
        huobashop_show_color: 0,
        sort_num: 0,
        is_tap: 0,
        shopZindex: 1000,
        tilings: 1,
        is_etc_box: false,
        is_book_box: false,
        sdigit: '',
        edigit: '',
        brand_list_length: true,
        brand_list_once: false,
      };
    },
    mounted() {
      this.brand_list_once = true;
      this.isbrand_id = this.$route.query.brand_id;
      if(this.$route.query.searchContent){
        this.searchContent = this.$route.query.searchContent;
      }else if(sessionStorage.getItem('saveSearchContent')){
        this.searchContent = sessionStorage.getItem('saveSearchContent')
      }
      this.goods_type = this.$route.query.goods_type;
      this.screen_choose = this.$route.query.goods_type;
      this.supplier_id = this.$route.query.supplier_id
        ? parseInt(this.$route.query.supplier_id)
        : 0;
      this.tagids = this.$route.query.tagids ? this.$route.query.tagids : null;
      this.cids = this.$route.query.cids ? this.$route.query.cids : null;

      // title
      this.title = this.$route.query.searchContent
        ? this.$route.query.searchContent
        : "";
      if (this.title != "") this.title = "-" + this.title;
      document.title = "搜索结果" + this.title;
      this.judgehome_id = localStorage.getItem("home_id");
      // this.getGoodsColum();
      // this.getGoods();
      this.searchColumnGets();
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    },
    updated() {
      if (this.has_stock == 0) {
        $('.only_shop').find('.van-checkbox__label').css('color','#333');
      } else {
        $('.only_shop').find('.van-checkbox__label').css('color','#F05654');
      }
      if (this.needs_pay == 0) {
        $('.only_pay').find('.van-checkbox__label').css('color','#333');
      } else {
        $('.only_pay').find('.van-checkbox__label').css('color','#F05654');
      }
    },
    methods: {
      // 仅看有货
      is_shop () {
        if (this.has_stock == 0) {
          $('.only_shop').find('.van-checkbox__label').css('color','#F05654');
          this.has_stock = 1;
        } else {
          $('.only_shop').find('.van-checkbox__label').css('color','#333');
          this.has_stock = 0;
        }
        this.brandData = [];
        this.shopZindex = 1000;
        this.page = 1;
        this.brand_list_once = true;
        this.getBooks();
      },
      // 仅看付费
      is_pay () {
        if (this.needs_pay == 0) {
          $('.only_pay').find('.van-checkbox__label').css('color','#F05654');
          this.needs_pay = 1;
        } else {
          $('.only_pay').find('.van-checkbox__label').css('color','#333');
          this.needs_pay = 0;
        }
        this.brandData = [];
        this.shopZindex = 1000;
        this.page = 1;
        this.brand_list_once = true;
        this.getGoods();
      },
      // 火把号店铺筛选
      huobashop_choose () {
        this.huobashop_show ? (this.huobashop_show = 0) : (this.huobashop_show = 1);
        if (this.huobashop_text == '所属店铺') {
          this.huobashop_show_color ? (this.huobashop_show_color = 0) : (this.huobashop_show_color = 1);
        } else {
          this.huobashop_show_color = true;
        }
        // 综合排序关闭
        if (this.sort_num > 0) {
          this.sort_show_color = true;
        } else {
          this.sort_show_color = false;
        }
        this.sort_show = false;
        // 价格区间关闭
        if (this.price_text_1 == '价格区间') {
          this.price_show_color = false;
        } else {
          this.price_show_color = true;
        }
        this.price_show = false;
      },
      huobashop_reset () {
        this.huobashop_radio = [];
      },
      huobashop_sure () {
        this.huobashop_name = [];
        this.huobashop_id = [];
        if (this.huobashop_radio.length == 0) {
          this.huobashop_show_color = false;
          this.huobashop_text = '所属店铺';
          this.isbrand_id = this.$route.query.brand_id;
        } else {
          for (var i = 0; i < this.huobashop_radio.length; i++) {
            this.huobashop_name.push(this.brand_list[this.huobashop_radio[i]].brand_name);
            this.huobashop_id.push(this.brand_list[this.huobashop_radio[i]].brand_id);
          }
          this.huobashop_show_color = true;
          this.huobashop_text = this.huobashop_name.join(',');
          this.isbrand_id = this.huobashop_id.join(',');
        }
        this.brandData = [];
        this.shopZindex = 1000;
        this.page = 1;
        this.brand_list_once = true;
        this.getBooks();
        this.huobashop_show = false;
        // this.huobashop_radio = [];
      },
      // 火把号筛选
      huoba_choose () {
        this.huoba_show ? (this.huoba_show = 0) : (this.huoba_show = 1);
        if (this.huoba_text == '所属火把号') {
          this.huoba_show_color ? (this.huoba_show_color = 0) : (this.huoba_show_color = 1);
        } else {
          this.huoba_show_color = true;
        }
        // 综合排序关闭
        if (this.sort_num > 0) {
          this.sort_show_color = true;
        } else {
          this.sort_show_color = false;
        }
        this.sort_show = false;
        // 价格区间关闭
        if (this.price_text_1 == '价格区间') {
          this.price_show_color = false;
        } else {
          this.price_show_color = true;
        }
        this.price_show = false;
      },
      huoba_reset () {
        this.huoba_radio = [];
      },
      huoba_sure () {
        this.huoba_name = [];
        this.huoba_id = [];
        if (this.huoba_radio.length == 0) {
          this.huoba_show_color = false;
          this.huoba_text = '所属火把号';
          this.isbrand_id = this.$route.query.brand_id;
        } else {
          for (var i = 0; i < this.huoba_radio.length; i++) {
            this.huoba_name.push(this.brand_list[this.huoba_radio[i]].brand_name);
            this.huoba_id.push(this.brand_list[this.huoba_radio[i]].brand_id);
          }
          this.huoba_show_color = true;
          this.huoba_text = this.huoba_name.join(',');
          this.isbrand_id = this.huoba_id.join(',');
        }
        this.brandData = [];
        this.shopZindex = 1000;
        this.page = 1;
        this.brand_list_once = true;
        this.getGoods();
        this.huoba_show = false;
        // this.huoba_radio = [];
      },
      // 关闭遮罩
      stop_shade () {
        event.preventDefault();
        this.sort_show = 0;
        this.price_show = 0;
        this.huoba_show = 0;
        this.huobashop_show = 0;
        if (this.sort_num > 0) {
          this.sort_show_color = true;
        } else {
          this.sort_show_color = false;
        }
        if (this.price_text_1 == '价格区间') {
          this.price_show_color = false;
        } else {
          this.price_show_color = true;
        }
        if (this.huoba_text == '所属火把号') {
          this.huoba_show_color = false;
        } else {
          this.huoba_show_color = true;
        }
        if (this.huobashop_text == '所属店铺') {
          this.huobashop_show_color = false;
        } else {
          this.huobashop_show_color = true;
        }
      },
      // 价格区间
      price_choose () {
        this.price_show ? (this.price_show = 0) : (this.price_show = 1);
        if (this.price_text_1 == '价格区间') {
          this.price_show_color ? (this.price_show_color = 0) : (this.price_show_color = 1);
        } else {
          this.price_show_color = true;
        }
        // 综合排序关闭
        if (this.sort_num > 0) {
          this.sort_show_color = true;
        } else {
          this.sort_show_color = false;
        }
        this.sort_show = false;
        // 所属火把号关闭
        if (this.huoba_text == '所属火把号') {
          this.huoba_show_color = false;
        } else {
          this.huoba_show_color = true;
        }
        this.huoba_show = false;
        // 所属火把店铺关闭
        if (this.huobashop_text == '所属店铺') {
          this.huobashop_show_color = false;
        } else {
          this.huobashop_show_color = true;
        }
        this.huobashop_show = false;
      },
      price_reset () {
        this.sdigit = '';
        this.edigit = '';
      },
      price_sure () {
        if (!isNaN(this.sdigit) && !isNaN(this.edigit)) {
          if (this.sdigit == '' && this.edigit == '') {
            this.price_text_1 = '价格区间';
            this.search_price = '';
            this.price_show_color = false;
          } else if (this.sdigit == '') {
            this.price_text_1 = '0-'+ parseInt(this.edigit) + '元';
            this.search_price = '0_'+ parseInt(this.edigit);
            this.price_show_color = true;
          } else if (this.edigit == '') {
            this.price_text_1 = parseInt(this.sdigit) + '元以上';
            this.search_price = parseInt(this.sdigit) + '_';
            this.price_show_color = true;
          } else if (parseInt(this.sdigit) == parseInt(this.edigit)) {
            this.price_text_1 = parseInt(this.sdigit) + '-' + parseInt(this.edigit) + '元';
            this.search_price = parseInt(this.sdigit) + '_' + parseInt(this.edigit);
            this.price_show_color = true;
          } else if (parseInt(this.sdigit) > parseInt(this.edigit)) {
            this.price_text_1 = parseInt(this.edigit) + '-' + parseInt(this.sdigit) + '元';
            this.search_price = parseInt(this.edigit) + '_' + parseInt(this.sdigit);
            this.price_show_color = true;
          } else if (parseInt(this.sdigit) < parseInt(this.edigit)) {
            this.price_text_1 = parseInt(this.sdigit) + '-' + parseInt(this.edigit) + '元';
            this.search_price = parseInt(this.sdigit) + '_' + parseInt(this.edigit);
            this.price_show_color = true;
          } else {
            this.price_text_1 = '价格区间';
            this.search_price = '';
            this.price_show_color = false;
          }
        } else {
          this.price_text_1 = '价格区间';
          this.search_price = '';
          this.price_show_color = false;
        }
        this.brandData = [];
        this.shopZindex = 1000;
        this.page = 1;
        if (this.goods_type == 3) {
          this.getBooks();
        } else {
          this.getGoods();
        }
        this.price_show ? (this.price_show = 0) : (this.price_show = 1);
      },
      // 综合排序
      sort_choose () {
        this.sort_show ? (this.sort_show = 0) : (this.sort_show = 1);
        if (this.sort_num > 0) {
          this.sort_show_color ? (this.sort_show_color = 1) : (this.sort_show_color = 1);
        } else {
          this.sort_show_color ? (this.sort_show_color = 0) : (this.sort_show_color = 1);
        }
        // 价格区间关闭
        if (this.price_text_1 == '价格区间') {
          this.price_show_color = false;
        } else {
          this.price_show_color = true;
        }
        this.price_show = false;
        // 所属火把号关闭
        if (this.huoba_text == '所属火把号') {
          this.huoba_show_color = false;
        } else {
          this.huoba_show_color = true;
        }
        this.huoba_show = false;
        // 所属火把店铺关闭
        if (this.huobashop_text == '所属店铺') {
          this.huobashop_show_color = false;
        } else {
          this.huobashop_show_color = true;
        }
        this.huobashop_show = false;
      },
      // 综合排序
      sort_choosetext (item,sort) {
        this.sort_num++;
        this.sort_show ? (this.sort_show = 1) : (this.sort_show = 0);
        this.sort_text_1 = item;
        this.search_sort = sort;
        this.brandData = [];
        this.shopZindex = 1000;
        this.page = 1;
        if (this.goods_type == 3) {
          this.getBooks();
        } else {
          this.getGoods();
        }
      },
      gotoDetail(item) {
        var goodsType = item.goods_type;
        if (goodsType == 1 || goodsType == 2) {
          // 音频/视频，当前页更新
          this.$router.push({
            name: "albumdetail",
            query: { goods_id: item.goods_id }
          });
        } else if (goodsType == 6) {
          // 文章
          this.$router.push({
            name: "article",
            query: { goods_id: item.goods_id }
          });
        } else if (goodsType == 9) {
          // 专辑
          this.$router.push({
            name: "album",
            query: { goods_id: item.goods_id }
          });
        } else if (goodsType == 3) {
          // 图书
          this.$router.push({
            name: "detail",
            query: { goods_id: item.goods_id }
          });
        } else if (goodsType == 4) {
          // 电子书
          this.$router.push({
            name: "ebookdetail",
            query: { goods_id: item.goods_id }
          });
        }
      },
      // 关注火把号
      focusAction(id,index) {
        if (index > 0) {
          this.focusData("cancel",id);
        } else {
          this.focusData("focus",id);
        }
      },
      // 获取关注接口信息
      async focusData(__type,id) {
        var tStamp = this.$getTimeStamp();
        var data = {};
        var res;
        switch (__type) {
          case "focus":
            data = {
              timestamp: tStamp,
              brand_id: id,
              version: "1.0"
            };
            data.sign = this.$getSign(data);
            res = await FOCUS_ADD(data);
            if (res.hasOwnProperty("response_code")) {
              this.$toast("已关注~");
              if (this.goods_type == 0) {
                this.searchSummaryGets();
              } else {
                this.huobaBrand();
              }
            } else {
              this.$toast(res.error_message);
              if (res.hasOwnProperty("error_code") && res.error_code == 100) {
                this.$router.push({ name: "login", params: {} });
              }
            }
            break;
          case "cancel":
            data = {
              timestamp: tStamp,
              brand_id: id,
              version: "1.0"
            };
            data.sign = this.$getSign(data);
            res = await FOCUS_CANCEL(data);
            if (res.hasOwnProperty("response_code")) {
              this.$toast("已取消关注~");
              if (this.goods_type == 0) {
                this.searchSummaryGets();
              } else {
                this.huobaBrand();
              }
            } else {
              this.$toast(res.error_message);
              if (res.hasOwnProperty("error_code") && res.error_code == 100) {
                this.$router.push({ name: "login", params: {} });
              }
            }
            break;
        }
      },
      programLoad() {
        var list_index = this.activekey;

        if (this.column_list[list_index].search_type == "brand") {
          this.huobaBrand();
        } else if (this.column_list[list_index].search_type == "goods") {
          this.getGoods();
        } else if (this.column_list[list_index].search_type == "summary") {
          this.searchSummaryGets();
          // this.programFinished = true;
          // this.programLoading = false;
        } else if (this.column_list[list_index].search_type == "book") {
          this.getBooks();
        } else {
          // this.getGoods();
        }
      },
      // 图书搜索结果
      async getBooks() {
        if (this.has_stock) {
          this.has_stock = 1;
        } else {
          this.has_stock = 0;
        }
        var tStamp = this.$getTimeStamp();
        var data = {};
        if (this.judgehome_id == "all") {
          data = {
            scene: "platform",
            keywords: this.searchContent,
            brand_id: this.isbrand_id,
            // supplier_id: this.supplier_id,
            has_stock: this.has_stock,
            price_zone: this.search_price,
            sort: this.search_sort,
            page: this.page,
            page_size: this.page_size,
            is_tap: this.is_tap,
            version: "1.1",
            timestamp: tStamp
          };
        } else {
          data = {
            keywords: this.searchContent,
            brand_id: this.isbrand_id,
            has_stock: this.has_stock,
            price_zone: this.search_price,
            sort: this.search_sort,
            page: this.page,
            page_size: this.page_size,
            is_tap: this.is_tap,
            version: "1.1",
            timestamp: tStamp
          };
          if (this.supplier_id) {
            data.supplier_id = this.supplier_id;
          }
          if (this.$route.query.type == "brand" && this.$route.query.brand_id) {
            data.scene = "brand";
          } else if (this.$route.query.type == "mall" && this.$route.query.supplier_id) {
            data.scene = "mall";
          } else {
            data.scene = "platform";
          }
        }
        data.sign = this.$getSign(data);
        let res = await SEARCH_BOOK_GETS(data);
        if (res.hasOwnProperty("response_code")) {
          var result = res.response_data.result;
          if (this.brand_list_once) {
            if (res.response_data.brand_list == undefined) {
              this.brand_list = [];
              this.huobashop_radio = [];
            } else {
              this.brand_list = res.response_data.brand_list;
              if (this.huobashop_id.length > 0) {
                this.huobashop_radio = [];
                for (var n = 0; n < this.huobashop_id.length; n++) {
                  for (var m = 0; m < this.brand_list.length; m++) {
                    if (this.huobashop_id[n] == this.brand_list[m].brand_id) {
                      this.huobashop_radio.push(m);
                    }
                  }
                }
              }
            }
          }
          if (this.brand_list.length == 0) {
            this.brand_list_length = false;
          } else {
            this.brand_list_length = true;
          }
          console.log(111,result);
          // this.column_list = res.response_data.column;
          setTimeout(() => {
            for (let i = 0; i < result.length; i++) {
              this.brandData.push(result[i]);
              this.contentData.push(result[i]);
            }
            this.programLoading = false;
            this.page++;
            // console.log('thispage',this.page)
            // 数据全部加载完成
            if (this.page > res.response_data.total_page) {
              this.programFinished = true;
              this.page = 1;
              } else {
              this.programFinished = false;
            }
          }, 1);
          this.brand_list_once = false;
          this.is_tap = 0;
        } else {
          this.$toast(res.error_message);
        }
      },
      // 电子书专辑文章
      async getGoods () {
        if (this.needs_pay) {
          this.needs_pay = 1;
        } else {
          this.needs_pay = 0;
        }
        if (this.goods_type == 6) {
          this.needs_pay = 0;
        }
        var tStamp = this.$getTimeStamp();
        var data = {};
        if (this.judgehome_id == "all") {
          data = {
            scene: "platform",
            keywords: this.searchContent,
            column_type: this.goods_type,
            brand_id: this.isbrand_id,
            // supplier_id: this.supplier_id,
            need_pay: this.needs_pay,
            price_zone: this.search_price,
            sort: this.search_sort,
            page: this.page,
            page_size: this.page_size,
            is_tap: this.is_tap,
            version: "1.1",
            timestamp: tStamp
          };
        } else {
          data = {
            keywords: this.searchContent,
            column_type: this.goods_type,
            brand_id: this.isbrand_id,
            need_pay: this.needs_pay,
            price_zone: this.search_price,
            sort: this.search_sort,
            page: this.page,
            page_size: this.page_size,
            is_tap: this.is_tap,
            version: "1.1",
            timestamp: tStamp
          };
          if (this.supplier_id) {
            data.supplier_id = this.supplier_id;
          }
          if (this.$route.query.type == "brand" && this.$route.query.brand_id) {
            data.scene = "brand";
          } else if (this.$route.query.type == "mall" && this.$route.query.supplier_id) {
            data.scene = "mall";
          } else {
            data.scene = "platform";
          }
        }
        data.sign = this.$getSign(data);
        let res = await BRAND_SEARCH_GOODS_GETS(data);

        if (res.hasOwnProperty("response_code")) {
          var result = res.response_data.result;
          if (this.brand_list_once) {
            if (res.response_data.brand_list == undefined) {
              this.brand_list = [];
              this.huoba_radio = [];
            } else {
              this.brand_list = res.response_data.brand_list;
              if (this.huoba_id.length > 0) {
                this.huoba_radio = [];
                for (var n = 0; n < this.huoba_id.length; n++) {
                  for (var m = 0; m < this.brand_list.length; m++) {
                    if (this.huoba_id[n] == this.brand_list[m].brand_id) {
                      this.huoba_radio.push(m);
                    }
                  }
                }
              }
            }
          }
          if (this.brand_list.length == 0) {
            this.brand_list_length = false;
          } else {
            this.brand_list_length = true;
          }
          console.log(111,result);
          // this.column_list = res.response_data.column;
          setTimeout(() => {
            for (let i = 0; i < result.length; i++) {
              this.brandData.push(result[i]);
              this.contentData.push(result[i]);
            }
            this.programLoading = false;
            this.page++;
            // console.log('thispage',this.page)
            // 数据全部加载完成
            if (this.page > res.response_data.total_page) {
              this.programFinished = true;
              this.page = 1;
            } else {
              this.programFinished = false;
            }
          }, 1);
          this.brand_list_once = false;
          this.is_tap = 0;
        } else {
          this.$toast(res.error_message);
        }
      },
      // 获取搜索栏目列表
      async searchColumnGets() {
        var tStamp = this.$getTimeStamp();
        var data = {};
        if (this.judgehome_id == "all") {
          data = {
            scene: "platform",
            keywords: this.searchContent,
            brand_id: this.isbrand_id,
            supplier_id: this.$route.query.supplier_id,
            column_type: this.goods_type,
            version: "1.1",
            timestamp: tStamp
          };
        } else {
          data = {
            keywords: this.searchContent,
            column_type: this.goods_type,
            brand_id: this.isbrand_id,
            supplier_id: this.$route.query.supplier_id,
            version: "1.1",
            timestamp: tStamp
          };
          if (this.$route.query.type == "brand" && this.$route.query.brand_id) {
            data.scene = "brand";
          } else if (this.$route.query.type == "mall" && this.$route.query.supplier_id) {
            data.scene = "mall";
          } else {
            data.scene = "platform";
          }
        }
        data.sign = this.$getSign(data);
        let res = await SEARCH_COLUMU_GETS(data);
        if (res.hasOwnProperty("response_code")) {
          this.column_list = res.response_data;
          for (let i = 0; i < this.column_list.length; i++) {
            if (this.column_list[i].selected == '1') {
              if (this.column_list[i].column_type == '0') {
                this.activekey = i;
                this.goods_type = this.column_list[i].column_type;
                this.searchSummaryGets();
              } else if (this.column_list[i].column_type == '9') {
                this.activekey = i;
                this.screen_choose = this.column_list[i].column_type;
                this.goods_type = this.column_list[i].column_type;
                this.tileViewShow = true;
                this.getGoods();
              } else if (this.column_list[i].column_type == '4') {
                this.activekey = i;
                this.screen_choose = this.column_list[i].column_type;
                this.goods_type = this.column_list[i].column_type;
                this.tileViewShow = true;
                this.getGoods();
              } else if (this.column_list[i].column_type == '3') {
                this.activekey = i;
                this.screen_choose = this.column_list[i].column_type;
                this.goods_type = this.column_list[i].column_type;
                this.tileViewShow = true;
                this.getBooks();
              } else if (this.column_list[i].column_type == '6') {
                this.activekey = i;
                this.goods_type = this.column_list[i].column_type;
                this.getGoods();
              } else if (this.column_list[i].column_type == '-1') {
                this.activekey = i;
                this.goods_type = this.column_list[i].column_type;
                this.huobaBrand();
              }
            }
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      // 全部搜索列表
      async searchSummaryGets() {
        var tStamp = this.$getTimeStamp();
        var data = {};
        if (this.judgehome_id == "all") {
          data = {
            scene: "platform",
            keywords: this.searchContent,
            brand_id: this.isbrand_id,
            // supplier_id: this.supplier_id,
            is_tap: this.is_tap,
            version: "1.1",
            timestamp: tStamp
          };
        } else {
          data = {
            keywords: this.searchContent,
            brand_id: this.isbrand_id,
            is_tap: this.is_tap,
            version: "1.1",
            timestamp: tStamp
          };
          if (this.supplier_id) {
            data.supplier_id = this.supplier_id;
          }
          if (this.$route.query.type == "brand" && this.$route.query.brand_id) {
            data.scene = "brand";
          } else if (this.$route.query.type == "mall" && this.$route.query.supplier_id) {
            data.scene = "mall";
          } else {
            data.scene = "platform";
          }
        }
        data.sign = this.$getSign(data);
        let res = await SEARCH_SUMMARY_GETS(data);
        if (res.hasOwnProperty("response_code")) {
          this.summaryList = res.response_data;
          this.programFinished = true;
          this.programLoading = false;
          this.is_tap = 0;
        } else {
          this.$toast(res.error_message);
        }
      },
      // 火把公号列表
      async huobaBrand() {
        var tStamp = this.$getTimeStamp();
        var data = {
          keywords: this.searchContent,
          page: this.page,
          is_tap: this.is_tap,
          version: "1.1",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await SEARCH_BRAND_GETS(data);

        if (res.hasOwnProperty("response_code")) {
          var result = res.response_data.result;
          setTimeout(() => {
            this.huobaList = [];
            for (let i = 0; i < result.length; i++) {
              this.huobaList.push(result[i]);
            }
            this.programLoading = false;
            this.page++;
            // console.log('thispage',this.page)
            // 数据全部加载完成
            if (this.page > res.response_data.total_page) {
              this.programFinished = true;
              this.page = 1;
            }
          }, 1);
          this.is_tap = 0;
        } else {
          this.$toast(res.error_message);
        }
      },
      // 跳转公众号首页
      toBrand(item, index) {
        this.$router.push({
          name: "brand",
          query: {
            brand_id: item.brand_id
          }
        });
      },
      // 跳转店铺
      toBrandShop(item, index) {
        this.$router.push({
          name: "custompage",
          query: {
            type: "mall",
            supplier_id: item.supplier_id
          }
        });
      },
      // 加入购物车
      addToCart(item) {
        this.toCartData(item);
      },
      // 加入购物车
      async toCartData(item) {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: item.goods_id,
          sku_id: item.goods_id,
          count: 1,
          price: item.price,
          version: "1.1"
        };
        data.sign = this.$getSign(data);
        let res = await CART_ADD(data);

        if (res.hasOwnProperty("response_code")) {
          if (res.response_data.success == 1) {
            this.$toast("添加购物车成功~");
          }
        } else {
          if (res.hasOwnProperty("error_code") && res.error_code == 100) {
            this.$router.push({ name: "login" });
          }
          this.$toast(res.error_message);
        }
      },
      // 查看更多
      watchMore(item, index) {
        var _index = this.getArrayIndex(this.column_list, item);
        this.activekey = _index;
        this.goods_type = this.column_list[_index].column_type;
        this.screen_choose = this.column_list[_index].column_type;
        this.brandData = [];
        this.huobaList = [];
        this.page = 1;
        this.programLoading = true; //下拉加载中
        this.programFinished = false; //下拉结束
        if (this.programLoading) {
          this.programLoad();
        }
      },
      getArrayIndex(arr, obj) {
        for (var i = 0; i < this.column_list.length; i++) {
          if (obj.search_type == "goods") {
            if (this.column_list[i].column_type == obj.column_type) {
              return i;
            }
          } else {
            if (this.column_list[i].search_type == obj.search_type) {
              return i;
            }
          }
        }
      },
      // 点击tab页切换
      tabChange(index, title) {
        this.brand_list_once = true;
        this.activekey = index;
        this.is_tap = 1;
        this.goods_type = Number(this.column_list[index].column_type);
        this.screen_choose = this.goods_type;
        // 筛选重置
        this.huoba_text = '所属火把号';
        this.huoba_show_color = false;
        this.huobashop_text = '所属店铺';
        this.huobashop_show_color = false;
        this.price_text_1 = '价格区间';
        this.price_show_color = false;
        this.sort_text_1 = '综合排序';
        this.sort_show_color = false;
        this.sort_show = 0;
        this.sort_num = 0;
        this.price_show = 0;
        this.huoba_show = 0;
        this.huobashop_show = 0;
        this.needs_pay = 1;
        this.search_price = '';
        this.search_sort = '';
        this.isbrand_id = this.$route.query.brand_id;
        this.has_stock = 1;
        this.shopZindex = 1000;
        this.tilings = 1;
        this.is_etc_box = false;
        this.is_book_box = false;
        this.huoba_radio = [];
        this.huobashop_radio = [];
        switch (this.goods_type) {
          case 9:
            this.tileViewShow = true;
            break;
          case 4:
            this.tileViewShow = true;
            break;
          case 3:
            this.tileViewShow = true;
            break;
          default:
            this.tileViewShow = false;
            break;
        }
        // if (index > 0) {
        this.brandData = [];
        this.huobaList = [];
        this.page = 1;
        this.programLoading = true; //下拉加载中
        this.programFinished = false; //下拉结束
        if (this.programLoading) {
          this.programLoad();
        }
        // }
      },
      // 返回按钮
      cancelBack () {
        this.$router.go(-1);
        sessionStorage.setItem('saveSearchContent','');
      },
      // 右侧空白返回
      inputCancel () {
        this.$router.go(-1);
      },
      // 图书展开店铺
      shopDevelop (index,leng) {
        // this.shopZindex = index;
        var shopText_1 = 'zShop_'+index;
        document.getElementById(shopText_1).style.cssText = "display: none";
        for (var i = 0; i < leng; i++) {
          var show_bookid = 'showBook_'+index+i;
          document.getElementById(show_bookid).style.cssText = "display: ";
        }
      },
      // 平铺切换
      tilingMethods () {
        this.tilings ? (this.tilings = 0) : (this.tilings = 1);
        if (this.tilings) {
          this.is_etc_box = false;
          this.is_book_box = false;
        } else {
          this.is_etc_box = true;
          this.is_book_box = true;
        }
      }
    }
  };
</script>

