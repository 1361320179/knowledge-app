<template>
  <div id="appSuccessPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换成功</h3>
    <div class="content_goods" v-if="goodsNameType == 'goods'">
      <p>
        您已成功兑换商品
        <span style="color: #343434">“{{ goodsName }}”</span>
      </p>
      <p>
        快去
        <span class="content_title">“我的-我的订单"</span>查看吧！
      </p>
    </div>
    <div class="content_goods" v-if="goodsNameType == 'coupons'">
      <p>
        您已成功兑换
        <span style="color: #343434">“优惠券”</span>
      </p>
      <p>
        快打开火把知识App，点击
        <span class="content_title">“我的-我的优惠券"</span>查看吧！
      </p>
    </div>
    <div class="content_goods" v-if="goodsNameType == 'service_day'">
      <p>
        您已成功兑换商品
        <span style="color: #343434">“{{ goodsName }}”</span>
        的{{ service_day }}天免费体验权
      </p>
      <p>
        快去
        <span class="content_title">"我听我看"</span>查看吧！
      </p>
    </div>
    <div class="button_wrapper">
      <van-button
        type="primary"
        style="background: #f05654; border: 1px solid #f05654"
        @click="toCheck"
        >去看看</van-button
      >
    </div>
    <div class="recommend">
      <div style="color: #666666; font-weight: 700; font-size: 15px">
        为您推荐
      </div>
      <div style="color: rgb(242, 121, 144)">
        <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-lipin" />
        </svg>-->
        <van-icon
          name="point-gift-o"
          style="vertical-align: sub; font-size: 17px"
        />
        <span style="font-size: 13px">首登APP专享110元新人礼</span>
      </div>
    </div>
    <div id="resultPage" style="padding: 10px">
      <div class="etc_box" style="display: block">
        <div
          class="etc_inbox"
          v-for="(item, index) in goods_Lists"
          :key="index"
          style="margin-bottom: 10px; width: auto"
        >
          <!-- 专辑 -->
          <div
            class="content book"
            @click="gotoDetail(item)"
            style="margin: 0px"
          >
            <div
              class="ratiobook"
              style="
                width: 100%;
                overflow: hidden;
                border-radius: 5px 5px 0px 0px;
              "
            >
              <div
                class="bookimg"
                v-lazy:background-image="item.pic[0]"
                style="background-size: cover; border-radius: 5px 5px 0px 0px"
              ></div>

              <span
                class="book_text_title huoba-goods-list-label"
                v-if="item.goods_type == 3"
                >图书</span
              >
              <span
                class="book_text_title huoba-goods-list-label"
                v-if="item.goods_type == 9"
                >专辑</span
              >
              <span
                class="book_text_title huoba-goods-list-label goods_list_ebook"
                v-if="item.goods_type == 4"
                >电子书</span
              >
            </div>
            <div class="right">
              <div class="text">{{ item.title }}</div>
              <div class="pinpai">
                <div class="price" v-if="item.price">
                  ￥
                  <span style="font-size: 15px;">{{
                    item.price.toFixed(2)
                  }}</span>
                </div>
                <div class="price" v-else>
                  <span style="font-size: 15px;">免费</span>
                </div>
                <div class="preferent_active">
                  <span v-for="(titems, indexs) in item.tag_list" :key="indexs">
                    <span class="active_1" v-if="indexs < 1">
                      <span
                        class="active_text_1"
                        v-if="titems.type == 1 || titems.type == 2"
                        >{{ titems.name }}</span
                      >
                      <span class="active_text_2" v-if="titems.type == 3">{{
                        titems.name
                      }}</span>
                      <span class="active_text_3" v-if="titems.type == 4">
                        {{ titems.name }}</span
                      >
                    </span>
                  </span>
                </div>
              </div>
              <div class="nice">
                <!-- <span class="price" v-if="item.goods_type == 3">
                  <span>￥{{ item.price }}</span>
                </span>-->
                <span class="comment" v-if="item.goods_type == 9">
                  <span @click.stop="toBrand(item, index)">
                    {{ item.brand_name }}
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-next-line" />
                    </svg>
                  </span>
                </span>
                <span class="bookgrow" v-if="item.goods_type == 3">
                  {{ item.brand_name }}
                  <span @click.stop="toBrandShop(item, index)">
                    <span
                      class="bookShop"
                      style="color: #343434; margin-left: 10px"
                      >进店</span
                    >
                    <svg class="icon" aria-hidden="true" style="color: #343434">
                      <use xlink:href="#icon-next-line" />
                    </svg>
                  </span>
                </span>
                <span class="good" v-if="item.goods_type == 4">
                  <span @click.stop="toBrand(item, index)">
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

<style src="@/style/scss/pages/redeem/result/appSuccess.scss" lang="scss">
</style>
<style src="@/style/scss/pages/brand/resultCorrent.scss" scoped lang="scss"></style>
<script>
import { REDEEM_RECOMMEND } from "@/apis/redeem.js";
import Utils from "@/components/util.js";
export default {
  name: "app-success",
  data() {
    return {
      goodsName: "",
      goodsNameType: "",
      goods_Lists: [],
      serviceday: "",
      resData: {},
    };
  },
  methods: {
    async getGoodsDetail() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        page: "1",
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

    toCheck() {
      let params = "";
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
      // Utils.$emit("goToApp", params);
    },
  },
  created() {
    this.goodsName = this.$route.query.goodsName;
    if (this.goodsName instanceof Array) {
      this.goodsName = this.goodsName.join(",");
    }
    this.resData = this.$route.query.resData;
    this.goodsNameType = this.$route.query.goodsNameType;
    this.service_day = this.$route.query.service_day;
    // console.log(this.resData);
    this.getGoodsDetail();
  },
};
</script>
