<template>
  <div id="couponResultPage">
    <div>
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
          <input type="text" :placeholder="placeholder" @focus="inputCancel"/>
          <div class="input-text-1" v-if="searchContent != ''">
            <span>{{ searchContent }}</span>
            <svg class="icon input-close-de" aria-hidden="true" @click="deleteInput">
              <use xlink:href="#icon-close-line" />
            </svg>
          </div>
        </div>
      </div>
      <template>
        <div class="screenSecond">
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
              <li @click="sort_choosetext('综合排序','default')">综合排序</li>
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
          <!--店铺筛选-->
          <div class="huobashop_box" v-if="couponChange">
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
          <!--火把号筛选-->
          <div class="huoba_box" v-else>
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
          <div class="only_shop" @click="is_shop" v-if="couponChange">
            <van-checkbox v-model="needs_pay">仅看有货</van-checkbox>
          </div>
        </div>
        <template v-if="sort_show || price_show || huobashop_show || huoba_show">
          <div class="screenOverflow" @click="stop_shade"></div>
        </template>
        <div class="activityName">
          <span class="text_name">{{activity_name}}</span>
          <div class="count_name">
            <span v-if="activity_boolean">{{hour? hourString+':'+minuteString+':'+secondString : minuteString+':'+secondString}}</span><span v-else>{{ activity_time }}</span><span style="color: #9A9A9A;">后失效</span>
          </div>
        </div>
        <div class="noMore" v-if="couponList.length == 0">没有更多了</div>
        <div v-for="(item,index) in couponList" :key="index">
          <!--图书-->
          <div
          class="content book"
          @click="toDetail(item,index)"
          v-if="item.goods_type == 3"
        >
          <div class="ratiobook">
            <div class="bookimg" v-lazy:background-image="item.pic"></div>
            <span class="book_text_title">图书</span>
          </div>
          <div class="right">
            <div class="text">{{item.title}}</div>
            <div class="pinpai">
              <div class="price" v-if="item.price">￥{{item.price}}</div>
              <div class="price" v-else>免费</div>
              <div class="preferent_active">
                  <span v-for="(titems,indexs) in item.tag_list" :key="indexs">
                    <span class="active_1" v-if="indexs<1">
                      <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                      <span class="active_text_2" v-if="titems.type == 3 || titems.type == 4">{{ titems.name }}</span>
                    </span>
                  </span>
              </div>
              <div class="shopCar" @click.stop="addCart(item,index)">
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
            </div>
          </div>
        </div>
          <!-- 电子书 -->
          <div class="content ebook" @click="toDetail(item,index)" v-if="item.goods_type == 4">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="item.pic"></div>
              <span class="book_text_title">电子书</span>
            </div>
            <div class="right">
              <div class="text">{{item.title}}</div>
              <div class="pinpai">
                <div class="price" v-if="item.price">￥{{item.price}}</div>
                <div class="price" v-else>免费</div>
                <div class="preferent_active">
                      <span v-for="(titems,indexs) in item.tag_list" :key="indexs">
                          <span class="active_1" v-if="indexs<2">
                            <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                            <span class="active_text_2" v-if="titems.type == 3 || titems.type == 4">{{ titems.name }}</span>
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
          <!--专辑-->
          <div
            class="content book"
            @click="toDetail(item,index)"
            v-if="item.goods_type == 9"
          >
            <div class="ratiobook">
              <div class="bookimg" v-lazy:background-image="item.pic"></div>
              <span class="book_text_title">专辑</span>
            </div>
            <div class="right">
              <div class="text">{{item.title}}</div>
              <div class="pinpai">
                <div class="price" v-if="item.price">￥{{item.price}}</div>
                <div class="price" v-else>免费</div>
                <div class="preferent_active">
                  <span v-for="(titems,indexs) in item.tag_list" :key="indexs">
                    <span class="active_1" v-if="indexs<2">
                      <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                      <span class="active_text_2" v-if="titems.type == 3 || titems.type == 4">{{ titems.name }}</span>
                    </span>
                  </span>
                </div>
              </div>
              <div class="nice">
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
        </div>
      </template>
      <!-- 底部 -->
      <div v-if="this.isIphx" style="height: 34px;"></div>
      <div style="height: 50px;"></div>
      <van-submit-bar
        :class="{iphx:this.isIphx}"
        safe-area-inset-bottom
        button-text="去购物车"
        @submit="onSubmit"
        v-if="couponChange"
      >
        <template>
          <div class="multi_bottom">
            <div>
              合计：<span class="price" v-if="multi_money">￥{{multi_money}}</span>
              <span class="price" v-else>￥0.00</span>
            </div>
            <div class="desc">{{multi_desc}}</div>
          </div>
        </template>
      </van-submit-bar>
    </div>
    <EazyNav type="coupon" ref="nav" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/coupon/resultCorrent.scss" scoped lang="scss"></style>
<style lang="scss">
  #couponResultPage {
    .van-submit-bar__bar {
      border-top: 1px solid #F5F5F5;
    }
    .van-list {
      padding: 0 15px;
      padding-bottom: 50px;
    }
    .van-list .van-button--danger {
      font-size: $fontSize - 4;
      background-color: transparent;
      border-color: $redLight;
      color: $redLight;
      padding: 0 3px;
    }
    .noMore {
      color: #969799;
      font-size: 13px;
      line-height: 50px;
      text-align: center;
    }
    .multi_bottom{
      font-size:$fontSize + 1;
      padding:0 15px;
      .price{
        font-size: $fontSize - 1;
        color:$redLight;
      }
      .desc{
        font-size: $fontSize - 2;
      }
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
  }
</style>
<script>
  import { TICKET_DETAIL_GETS,SHOPPING_CART_INFO } from "../../apis/coupon.js";
  import { CART_ADD } from "../../apis/shopping.js";
  export default {
    data() {
      return {
        page: 1,
        searchContent: "",
        ticket_id: "",
        priceSort: 0,
        couponList: [],
        brand_list: [],
        brand_list_length: true,
        coupon_sort: "default",
        activity_name: null,
        activity_time: '',
        activity_boolean: false,
        isLogin: null,
        multi_money:null,
        multi_desc:null,
        has_stock: 1,
        search_sort: 'default',
        search_price: '',
        placeholder: '在结果中搜索',
        sort_text_1: '综合排序',
        price_text_1: '价格区间',
        huoba_text: '所属火把号',
        huobashop_text: '所属店铺',
        huobashop_radio: [],
        huobashop_name: [],
        huobashop_id: [],
        huoba_radio: [],
        huoba_name: [],
        huoba_id: [],
        screen_choose: 0,
        couponChange: true,
        price_zone: '',
        title: null,
        page_size: 10,
        huobashop_show: 0,
        huobashop_show_color: 0,
        contentData: [],
        supplier_id: null,
        tagids: null,
        cids: null,
        summaryList: [],
        huobapage: 1,
        needs_pay: 1,
        huobaList: [],
        judgehome_id: null,
        sort_show: 0,
        sort_show_color: 0,
        price_show: 0,
        price_show_color: 0,
        huoba_show: 0,
        huoba_show_color: 0,
        sort_num: 0,
        is_tap: 0,
        is_etc_box: false,
        is_book_box: false,
        sdigit: '',
        edigit: '',
        hour: '',
        minute: '',
        second: '',
        promiseTimer: '',
        brand_list_once: false,
      };
    },
    mounted() {
      this.brand_list_once = true;
      this.ticket_id = this.$route.query.ticket_id;
      this.brand_ids = this.$route.query.brand_id;
      if(this.$route.query.searchContent){
        this.searchContent = this.$route.query.searchContent;
      }else if(sessionStorage.getItem('saveCouponKey')){
        this.searchContent = sessionStorage.getItem('saveCouponKey')
        this.placeholder = '';
      }
      this.getBottomInfo();
      this.getList();
    },
    updated() {
      if (this.has_stock == 0) {
        $('.only_shop').find('.van-checkbox__label').css('color','#333');
      } else {
        $('.only_shop').find('.van-checkbox__label').css('color','#F05654');
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
        this.page = 1;
        this.getList();
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
          this.brand_ids = this.$route.query.brand_id;
        } else {
          for (var i = 0; i < this.huobashop_radio.length; i++) {
            this.huobashop_name.push(this.brand_list[this.huobashop_radio[i]].brand_name);
            this.huobashop_id.push(this.brand_list[this.huobashop_radio[i]].brand_id);
          }
          this.huobashop_show_color = true;
          this.huobashop_text = this.huobashop_name.join(',');
          this.brand_ids = this.huobashop_id.join(',');
        }
        this.page = 1;
        this.getList();
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
          this.brand_ids = this.$route.query.brand_id;
        } else {
          for (var i = 0; i < this.huoba_radio.length; i++) {
            this.huoba_name.push(this.brand_list[this.huoba_radio[i]].brand_name);
            this.huoba_id.push(this.brand_list[this.huoba_radio[i]].brand_id);
          }
          this.huoba_show_color = true;
          this.huoba_text = this.huoba_name.join(',');
          this.brand_ids = this.huoba_id.join(',');
        }
        this.page = 1;
        this.getList();
        this.huoba_show = false;
        // this.huoba_radio = [];
      },
      // 关闭遮罩
      stop_shade () {
        this.sort_show = 0;
        this.price_show = 0;
        this.huobashop_show = 0;
        this.huoba_show = 0;
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
        if (this.huobashop_text == '所属店铺') {
          this.huobashop_show_color = false;
        } else {
          this.huobashop_show_color = true;
        }
        if (this.huoba_text == '所属火把号') {
          this.huoba_show_color = false;
        } else {
          this.huoba_show_color = true;
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
        if (this.sdigit || this.edigit !== '') {
          if (this.sdigit == '') {
            this.price_text_1 = '0-'+ parseInt(this.edigit) + '元';
            this.search_price = '0_'+ parseInt(this.edigit);
            this.price_show_color = true;
          } else if (this.edigit == '') {
            this.price_text_1 = parseInt(this.sdigit) + '元以上';
            this.search_price = parseInt(this.sdigit) + '_';
            this.price_show_color = true;
          } else if (this.sdigit == this.edigit) {
            this.price_text_1 = '0-'+ parseInt(this.sdigit) + '元';
            this.search_price = '0_'+ parseInt(this.sdigit);
            this.price_show_color = true;
          } else if (this.sdigit > this.edigit) {
            this.price_text_1 = parseInt(this.edigit) + '-' + parseInt(this.sdigit) + '元';
            this.search_price = parseInt(this.edigit) + '_' + parseInt(this.sdigit);
            this.price_show_color = true;
          } else if (this.sdigit < this.edigit) {
            this.price_text_1 = parseInt(this.sdigit) + '-' + parseInt(this.edigit) + '元';
            this.search_price = parseInt(this.sdigit) + '_' + parseInt(this.edigit);
            this.price_show_color = true;
          }
        } else {
          this.price_text_1 = '价格区间';
          this.search_price = '';
          this.price_show_color = false;
        }
        this.page = 1;
        this.getList();
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
        this.page = 1;
        this.getList();
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
      // 跳转公众号首页
      toBrand(item, index) {
        this.$router.push({
          name: "brand",
          query: {
            brand_id: item.brand_id
          }
        });
      },
      inputCancel () {
        this.$router.push({
          name: "searchonly",
          query: {
            type: "coupon",
            ticket_id: this.$route.query.ticket_id
          }
        });
      },
      // 返回按钮
      cancelBack () {
        this.$router.go(-1);
        sessionStorage.setItem('saveCouponKey','');
      },
      // 删除按钮按钮
      deleteInput () {
        this.$router.push({
          name: "searchonly",
          query: {
            type: "coupon",
            ticket_id: this.$route.query.ticket_id
          }
        });
        sessionStorage.setItem('saveCouponKey','');
      },
      addCart(item, index) {
        // console.log(222);
        this.toCartData(item.goods_id,item.price);
      },
      async getBottomInfo(){
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          version: "1.1",
          ticket_id: this.ticket_id,
        };
        data.sign = this.$getSign(data);
        let res = await SHOPPING_CART_INFO(data);
        if (res.hasOwnProperty("response_code")) {
          this.multi_money = res.response_data.block_money;
          this.multi_desc = res.response_data.block_desc;
        } else {
          this.$toast(res.error_message);
        }
      },
      async getList() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          version: "1.1",
          brand_ids: this.brand_ids,
          price_zone: this.search_price,
          has_stock: this.has_stock,
          sort: this.search_sort,
          page: this.page,
          ticket_id: this.ticket_id,
          keywords: this.searchContent
        };
        data.sign = this.$getSign(data);
        let res = await TICKET_DETAIL_GETS(data);
        if (res.hasOwnProperty("response_code")) {
          // console.log(res);
          this.activity_name = res.response_data.activity_name;
          if (res.response_data.count_down == 1 && res.response_data.remain_time > 0) {
            this.countDown(res.response_data.remain_time);
            this.activity_boolean = true;
          } else {
            this.activity_time = res.response_data.remain_time;
            this.activity_boolean = false;
          }
          // 异步更新数据
          var result = res.response_data.result;
          if (result.length == 0) {
          } else {
            if (result[0].goods_type == 3) {
              this.couponChange = true;
            } else {
              this.couponChange = false;
            }
          }
          if (this.brand_list_once) {
            if (res.response_data.brand_list == undefined) {
              this.brand_list = [];
            } else {
              this.brand_list = res.response_data.brand_list;
            }
          }
          if (this.brand_list.length == 0) {
            this.brand_list_length = false;
          } else {
            this.brand_list_length = true;
          }
          setTimeout(() => {
            this.couponList = [];
            for (let i = 0; i < result.length; i++) {
              this.couponList.push(result[i]);
            }
            this.page++;
            // 数据全部加载完成
            if (this.page > res.response_data.total_page) {
              this.programFinished = true;
              this.page = 1;
            }
            // console.log(this.couponList)
          }, 1);
          this.brand_list_once = false;
        } else {
          this.$toast(res.error_message);
        }
      },
      // 倒计时
      countDown (time) {
        this.hour = Math.floor((time / 3600));
        this.minute = Math.floor((time % 3600) / 60);
        this.second = Math.floor(time % 60);
        var self = this
        clearInterval(this.promiseTimer)
        this.promiseTimer = setInterval(function () {
          if (self.hour === 0) {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.second = 0
              self.$emit('countDowmEnd', true)
              clearInterval(self.promiseTimer)
            } else {
              self.second -= 1
            }
          } else {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.hour -= 1
              self.minute = 59
              self.second = 59
            } else {
              self.second -= 1
            }
          }
        }, 1000)
      },
      formatNum (num) {
        return num < 10 ? '0' + num : '' + num
      },
      // 加入购物车
      async toCartData(goods_id,price) {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: goods_id,
          sku_id: goods_id,
          count: 1,
          price:price,
          version: "1.1"
        };
        data.sign = this.$getSign(data);
        let res = await CART_ADD(data);
        if (res.hasOwnProperty("response_code")) {
          if (res.response_data.success == 1) {
            this.$toast("添加购物车成功~");
            this.shoppingcart_num++;
            this.getBottomInfo();
            this.$refs.nav.navData.goods_nums ++;
          }
        } else {
          if (res.hasOwnProperty("error_code") && res.error_code == 100) {
            this.$router.push({ name: "login" });
          }
          this.$toast(res.error_message);
        }
      },
      toDetail(item, index) {
        // console.log(3333)
        // 音频/视频
        if (item.goods_type == 1 || item.goods_type == 2) {
          this.$router.push({
            name: "albumdetail",
            query: { goods_id: item.goods_id }
          });
        }
        // 文章
        if (item.goods_type == 6) {
          this.pid = null;
          this.$router.push({
            name: "article",
            query: { goods_id: item.goods_id }
          });
        }
        // 专辑
        if (item.goods_type == 9) {
          this.$router.push({
            name: "album",
            query: { goods_id: item.goods_id }
          });
        }
        // 电子书
        if (item.goods_type == 4) {
          this.$router.push({
            name: "ebookdetail",
            query: { goods_id: item.goods_id }
          });
        }
        // 纸质书
        if (item.goods_type == 3) {
          this.$router.push({
            name: "detail",
            query: { goods_id: item.goods_id }
          });
        }
      },
      onSubmit() {
        if (this.$refs.nav.is_Login) {
          this.$router.push({ name: "cart" });
        } else {
          this.$router.push({ name: "login" });
        }
      }
    },
    computed: {
      hourString () {
        return this.formatNum(this.hour)
      },
      minuteString () {
        return this.formatNum(this.minute)
      },
      secondString () {
        return this.formatNum(this.second)
      }
    }
  };
</script>
