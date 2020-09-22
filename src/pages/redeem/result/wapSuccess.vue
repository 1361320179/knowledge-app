<template>
  <div id="wapSuccessPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换成功</h3>
    <p class="content" v-if="goodsNameType == 'goods'">
      恭喜您获得商品名“{{goodsName}}”，快打开火把知识App，点击
      <span class="content_title">“我的-我的订单"</span>查看吧！
    </p>
    <p class="content" v-if="goodsNameType == 'coupons'">
      恭喜您获得优惠券X{{coupons_length}}，快打开火把知识App，点击
      <span class="content_title">“我的-我的优惠券"</span>查看吧！
    </p>
    <p class="content" v-if="goodsNameType == 'service_day'">
      您已成功兑换的“{{goodsName}}”的{{serviceday}}天免费体验权，快打开火把知识app，点击底部
      <span class="content_title">"我听我看"</span>查看吧！
    </p>
    <div class="button_wrapper">
      <van-button
        type="primary"
        style="background:#F05654;border: 1px solid #F05654;"
        @click="download"
      >打开火把知识App</van-button>
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

    <div class="content book">
      <!-- v-if="gitem.goods_type == 3 || gitem.goods_type == 9"   v-if="gitem.goods_type == 9"@click="gotoDetail(gitem)"v-if="gitem.goods_type == 3"-->
      <!--  v-lazy:background-image="gitem.pic" {{gitem.title}}v-if="gitem.price"v-else{{gitem.price.toFixed(2)}}-->
      <div class="ratiobook">
        <div class="bookimg"></div>
        <span class="book_text_title">图书</span>
        <span class="book_text_title">专辑</span>
      </div>
      <div class="right">
        <div class="text"></div>
        <div class="pinpai">
          <div class="price">￥</div>
          <div class="price">免费</div>
          <div class="preferent_active">
            <span>
              <span class="active_1">
                <span class="active_text_1"></span>
                <!--v-if="titems.type == 1 || titems.type == 2" {{ titems.name }}v-if="indexs<1" v-for="(titems,indexs) in gitem.tag_list" :key="indexs"-->
                <span class="active_text_2"></span>
                <span class="active_text_3"></span>
                <!-- v-if="titems.type == 3" {{ titems.name }} v-if="titems.type == 4"{{ titems.name }} -->
              </span>
            </span>
          </div>
          <div class="shopCar">
            <!-- @click.stop="addToCart(gitem)" v-if="gitem.goods_type == 3" -->
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gouwuche2" />
            </svg>
          </div>
        </div>
        <div class="nice">
          <span class="comment">
            <span>
              <!-- {{ gitem.brand_name }} v-if="gitem.goods_type == 9" @click.stop="toBrand(gitem,gindex)"-->
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-next-line" />
              </svg>
            </span>
          </span>
        </div>
        <div class="nice bookflex">
          <span class="bookgrow">
            <!-- {{ gitem.brand_name }}  @click.stop="toBrandShop(gitem,gindex)"v-if="gitem.goods_type == 3"-->
            <span>
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

    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/redeem/result/wapSuccess.scss" lang="scss">
</style>


<script>
import Utils from "@/components/util.js";
export default {
  name: "wap-success",
  data() {
    return {
      goodsName: "",
      goodsNameType: "",
      coupons_length: "",
      service_day: "",
      serviceday: "",
    };
  },
  methods: {
    download() {
      //   // window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
      //   let u = navigator.userAgent,
      //     app = navigator.appVersion;
      //   let _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      //   let _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      //   console.log(u, app, _ios, _android);
      //   if (_ios) {
      //     window.location.href =
      //       "https://apps.apple.com/cn/app/%E7%81%AB%E6%8A%8A%E7%9F%A5%E8%AF%86/id1473766311";
      //
      //       // "www.huoba.net://huoba";
      //
      //   } else if (_android) {
      //     window.location.href =
      //       "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
      //   }
      var params;
      if (this.goodsNameType == "goods") {
        params = "/personal/order/list";
      } else if (this.goodsNameType == "coupons") {
        params = "/coupon/mine";
      } else if (this.goodsNameType == "service_day") {
        params = "/listenAndRead/index";
      }
      Utils.$emit("goToApp", params);
    },
  },
  created() {
    this.goodsName = this.$route.query.goodsName;
    this.goodsNameType = this.$route.query.goodsNameType;
    this.service_day = this.$route.query.service_day;
    this.coupons_length = this.$route.query.coupons_length;
  },
};
</script>
