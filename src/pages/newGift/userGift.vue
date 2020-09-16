<template>
  <div id="newGiftUserGift">
    <div class="title">为您送上app新用户专属礼包</div>
    <div class="one_box">
      <div class="top">
        <div class="picture">
          <img src="../../assets/newGift/gift_num1.png" />
        </div>
        <div class="title_1">
          <span class="left-icon">一重礼</span>
          <span class="right-icon">-神劵狂欢</span>
        </div>
        <div class="title_2">限量神劵奉上，好书好课随心购</div>
      </div>
      <div class="content_coupon">
        <div class="coupon_img" v-for="(item,index) in ticketsData" :key="index">
          <div class="toUse">
            <div class="mid">
              <div class="price-icon">
                ￥
                <span class="price">{{ item.money }}</span>
              </div>
              <div class="condition">满{{ item.use_min_money }}元可用</div>
              <span class="circle top"></span>
              <span class="circle bottom"></span>
            </div>
            <div class="right">
              <div class="desc_top">{{ item.name }}</div>
              <div class="desc_bottom">{{ item.end_time_str }}</div>
            </div>
            <div class="coupon_title_name">优惠劵</div>
          </div>
        </div>
      </div>
    </div>
    <div class="one_box">
      <div class="top">
        <div class="picture">
          <img src="../../assets/newGift/gift_num2.png" />
        </div>
        <div class="title_1">
          <span class="left-icon">二重礼</span>
          <span class="right-icon">-好书解读随心听</span>
        </div>
        <div class="title_2">专家为你解读好书，三选一免费领取</div>
      </div>
      <div
        :class="[{content: content},{usedBook: item.is_buy == 1}]"
        v-for="(item,index) in freeData"
        :key="index"
        @click="freeClick(item,index)"
      >
        <div class="ratiobook">
          <div class="bookimg" v-lazy:background-image="item.pic"></div>
          <span class="book_text_title">{{ item.type }}</span>
        </div>
        <div class="right">
          <div class="text">{{ item.goods_name }}</div>
          <div class="pinpai">
            <div class="sub_title">{{ item.sub_title }}</div>
          </div>
          <div class="bot">
            <div class="price" v-if="item.sales_price">￥{{item.sales_price.toFixed(2)}}</div>
            <div class="price" v-else>免费</div>
            <del>￥{{ item.price.toFixed(2)}}</del>
          </div>
          <span class="used" v-if="item.is_buy == 1">
            <svg aria-hidden="true" class="icon">
              <use xlink:href="#icon-yiyongyou"></use>
            </svg>
          </span>
        </div>
        <div class="right_icon">
          <svg class="icon checked" aria-hidden="true" v-if="free_icon == index">
            <use xlink:href="#icon-checked-block" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-uncheck-line" />
          </svg>
        </div>
      </div>
    </div>
    <div class="one_box" style="margin-top: 40px;">
      <div class="top">
        <div class="picture">
          <img src="../../assets/newGift/gift_num3.png" />
        </div>
        <div class="title_1">
          <span class="left-icon">三重礼</span>
          <span class="right-icon">-好课0元购</span>
        </div>
        <div class="title_2">新人专属神价，仅有一次选择机会哦~</div>
      </div>
      <div
        :class="[{content: content},{usedBook: item.is_buy == 1}]"
        v-for="(item,index) in chargeData" :key="index"
        @click="chargeClick(item,index)"
      >
        <div class="ratiobook">
          <div class="bookimg" v-lazy:background-image="item.pic"></div>
          <span class="book_text_title">{{ item.type }}</span>
        </div>
        <div class="right">
          <div class="text">{{ item.goods_name }}</div>
          <div class="pinpai">
            <div class="sub_title">{{ item.sub_title }}</div>
          </div>
          <div class="bot">
            <div class="price" v-if="item.sales_price">￥{{item.sales_price.toFixed(2)}}</div>
            <div class="price" v-else>免费</div>
            <del>￥{{ item.price.toFixed(2) }}</del>
          </div>
          <span class="used" v-if="item.is_buy == 1">
            <svg aria-hidden="true" class="icon">
              <use xlink:href="#icon-yiyongyou"></use>
            </svg>
          </span>
        </div>
        <div class="right_icon">
          <svg class="icon checked" aria-hidden="true" v-if="charge_icon == index">
            <use xlink:href="#icon-checked-block" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-uncheck-line" />
          </svg>
        </div>
      </div>
    </div>
    <div class="next_page active" v-if="button_boolean">领取新人礼包</div>
    <div class="next_page" @click="drawUrl()" v-else>领取新人礼包</div>
    <Loading :isLoading="isLoading"></Loading>
    <EazyNav type="brand" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>
<style src="@/style/scss/pages/newGift/userGift.scss" scoped lang="scss"></style>
<style lang="scss" scoped>
  #newGiftUserGift {
    #loadingPage {
      background-color: #ffffff;
    }
  }
</style>
<script>
  import {
    NOVICEWELFARE_WELFARE,
    NOVICEWELFARE_RECEIVE
  } from "../../apis/newGift";
  export default {
    data () {
      return {
        content: true,
        new_id: 0,
        freeData: [],
        chargeData: [],
        ticketsData: [],
        free_icon: 100,
        charge_icon: 100,
        repeatclick: 0,
        isLoading: true,
        button_boolean: true,
      };
    },
    mounted () {
      this.new_id = this.$route.query.new_id;
      this.initData();
    },
    methods: {
      // 二重礼点击
      freeClick (item,index) {
        if (item.is_buy == 1) {
          return;
        }
        this.free_icon = index;
        this.album_id = item.goods_id;
        this.button_click();
      },
      // 三重礼点击
      chargeClick (item,index) {
        if (item.is_buy == 1) {
          return;
        }
        this.charge_icon = index;
        this.cur_id = item.goods_id;
        this.button_click();
      },
      // 领取新人礼包按钮
      drawUrl () {
        if (this.repeatclick >= 1) {
          return;
        }
        this.repeatclick++;
        this.drawButtonUrl();
      },
      // 判断按钮能否点击
      button_click () {
        if (this.free_icon <= 2 && this.charge_icon <= 2) {
          this.button_boolean = false;
        }
      },
      // 初始化接口
      async initData () {
        var tStamp = this.$getTimeStamp();
        let data = {
          id: this.new_id,
          timestamp: tStamp,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await NOVICEWELFARE_WELFARE(data);
        if (res.hasOwnProperty("response_code")) {
          this.freeData = res.response_data.free;
          this.chargeData = res.response_data.charge;
          this.ticketsData = res.response_data.tickets;
          this.isLoading = false;
        } else {
          this.$toast(res.error_message);
        }
      },
      // 领取按钮点击
      async drawButtonUrl () {
        var tStamp = this.$getTimeStamp();
        let data = {
          id: this.new_id,
          cur_id: this.cur_id,
          album_id: this.album_id,
          timestamp: tStamp,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await NOVICEWELFARE_RECEIVE(data);
        if (res.hasOwnProperty("response_code")) {
          this.$router.push({
            name: "newGiftSuccessDraw",
            query: {
              new_id: this.$route.query.new_id
            }
          });
          this.repeatclick = 0;
        } else {
          if (res.error_code === 100) {
            this.$toast(res.error_message);
            this.login();
          } else {
            this.$toast(res.error_message);
          }
          this.repeatclick = 0;
        }
      },
      // 登陆
      login () {
        this.$router.push({
          name: "login"
        });
      },
    }
  };
</script>
