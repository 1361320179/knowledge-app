<template>
  <div id="wapSuccessPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换成功</h3>
    <p class="content_goods" v-if="goodsNameType == 'goods'">
      恭喜您获得商品名
      <span style="color:#343434;">“{{goodsName}}”</span> ，快打开火把知识App，点击
      <span class="content_title">“我的-我的订单"</span>查看吧！
    </p>
    <p class="content_goods" v-if="goodsNameType == 'coupons'">
      恭喜您获得
      <span style="color:#343434;">“优惠券”</span>，快去
      <span class="content_title">“我的-我的优惠券"</span>查看吧！
    </p>
    <p class="content_goods" v-if="goodsNameType == 'service_day'">
      您已成功兑换的
      <span style="color:#343434;">“{{goodsName}}”</span>
      的{{service_day}}天免费体验权，快打开火把知识app，点击底部
      <span class="content_title">"我听我看"</span>查看吧！
    </p>
    <div class="button_wrapper">
      <van-button
        type="primary"
        style="background:#F05654;border: 1px solid #F05654;"
        @click="download"
      >去看看</van-button>
    </div>

    <div class="recommend">
      <div style="color: #666666;font-weight: 700;">为您推荐</div>
      <div style="color: rgb(242, 121, 144);">
        <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-lipin" />
        </svg>-->
        <van-icon name="point-gift-o" style="font-size: 16px;vertical-align: middle;" />
        <span>首登APP专享110元新人礼</span>
      </div>
    </div>
    <div id="resultPage" style="padding: 10px;">
      <div class="etc_box" style="justify-content: space-between;">
        <div
          class="etc_inbox"
          v-for="(item,index) in goods_Lists"
          :key="index"
          style="width: 49%;margin-bottom: 10px;border-radius: 10px;"
        >
          <!-- 专辑 -->
          <div class="content book" @click="gotoDetail(item)" style="margin:0px;">
            <div class="ratiobook" style="width: 100%;overflow: hidden;">
              <div
                class="bookimg"
                v-lazy:background-image=" item.pic[0]"
                style="background-size: cover;border-radius: 10px 10px 0px 0px;"
              ></div>
              <span
                class="book_text_title"
                v-if="item.goods_type == 3"
                style="border-radius: 10px 0px 10px 0px;padding: 2px 8px;"
              >图书</span>
              <span
                class="book_text_title"
                v-if="item.goods_type == 9"
                style="border-radius: 10px 0px 10px 0px;padding: 2px 8px;"
              >专辑</span>
              <span
                class="book_text_title"
                v-if="item.goods_type == 4"
                style="border-radius: 10px 0px 10px 0px;padding: 2px 8px;"
              >电子书</span>
            </div>
            <div class="right">
              <div class="text">{{item.title}}</div>
              <div class="pinpai">
                <div class="price" v-if="item.price">
                  ￥
                  <span style="font-size: 20px;">{{item.price.toFixed(2)}}</span>
                </div>
                <div class="price" v-else>
                  <span style="font-size: 20px;">免费</span>
                </div>
                <div class="preferent_active">
                  <span v-for="(titems,indexs) in item.tag_list" :key="indexs">
                    <span class="active_1" v-if="indexs<1">
                      <span
                        class="active_text_1"
                        v-if="titems.type == 1 || titems.type == 2"
                      >{{ titems.name }}</span>
                      <span class="active_text_2" v-if="titems.type == 3">{{ titems.name }}</span>
                      <span class="active_text_3" v-if="titems.type == 4">{{ titems.name }}</span>
                    </span>
                  </span>
                </div>
              </div>
              <div class="nice">
                <!-- <span class="price" v-if="item.goods_type == 3">
                  <span>￥{{ item.price }}</span>
                </span>-->
                <span class="comment" v-if="item.goods_type == 9">
                  <span @click.stop="toBrand(item,index)">
                    {{ item.brand_name }}
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-next-line" />
                    </svg>
                  </span>
                </span>
                <span
                  class="bookgrow"
                  v-if="item.goods_type == 3"
                  style="display: flex;justify-content: space-between;"
                >
                  {{ item.brand_name }}
                  <span @click.stop="toBrandShop(item,index)">
                    <span class="bookShop" style="color:#343434;">进店</span>
                    <svg class="icon" aria-hidden="true" style="color:#343434;">
                      <use xlink:href="#icon-next-line" />
                    </svg>
                  </span>
                </span>
                <span class="good" v-if="item.goods_type == 4">
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
    </div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/redeem/result/wapSuccess.scss" lang="scss">
</style>

<style src="@/style/scss/pages/brand/resultCorrent.scss" scoped lang="scss"></style>

<script>
import Utils from "@/components/util.js";
import { REDEEM_RECOMMEND } from "@/apis/redeem.js";
export default {
  name: "wap-success",
  data() {
    return {
      goodsName: "",
      goods_Lists: [],
      goodsNameType: "",
      coupons_length: "",
      service_day: "",
      serviceday: "",
    };
  },
  methods: {
    async getGoodsDetail() {
      var tStamp = this.$getTimeStamp();
      let data = {
        page: "1",
        timestamp: tStamp,
        page_size: "20",
        version: "1.0",
      };
      data.sign = this.$getSign(data);
      let res = await REDEEM_RECOMMEND(data);

      // console.log(res);
      if (res.hasOwnProperty("response_code")) {
        this.goods_Lists = res.response_data.result;
      }
      // console.log(this.goods_Lists);
    },
    // 跳转公众号首页
    toBrand(item, index) {
      this.$router.push({
        name: "brand",
        query: {
          brand_id: item.brand_id,
        },
      });
    },
    // 跳转店铺
    toBrandShop(item, index) {
      this.$router.push({
        name: "custompage",
        query: {
          type: "mall",
          supplier_id: item.supplier_id,
        },
      });
    },
    gotoDetail(item) {
      var goodsType = item.goods_type;
      if (goodsType == 9) {
        // 专辑
        this.$router.push({
          name: "album",
          query: { goods_id: item.goods_id },
        });
      } else if (goodsType == 3) {
        // 图书
        this.$router.push({
          name: "detail",
          query: { goods_id: item.goods_id },
        });
      } else if (goodsType == 4) {
        // 电子书
        this.$router.push({
          name: "ebookdetail",
          query: { goods_id: item.goods_id },
        });
      }
    },

    download() {
      var params;
      if (this.goodsNameType == "goods") {
        // params = "/personal/order/list";
        this.$router.push({ name: "orderlist" });
      } else if (this.goodsNameType == "coupons") {
        // params = "/coupon/mine";
        this.$router.push({ name: "couponmine" });
      } else if (this.goodsNameType == "service_day") {
        // params = "/listenAndRead/index";
        this.$router.push({ name: "listenAndReadIndex" });
      }
    },
  },
  created() {
    this.goodsName = this.$route.query.goodsName;
    if (this.goodsName.length > 0) {
      this.goodsName = this.goodsName.join(",");
    }
    console.log(this.goodsName.length);
    this.goodsNameType = this.$route.query.goodsNameType;
    this.service_day = this.$route.query.service_day;
    this.coupons_length = this.$route.query.coupons_length;
    this.getGoodsDetail();
  },
};
</script>
