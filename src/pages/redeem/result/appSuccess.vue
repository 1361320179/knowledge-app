<template>
  <div id="appSuccessPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换成功</h3>
    <p class="content" v-if="goodsNameType == 'goods'">恭喜您获得商品名“{{goodsName}}”，快去看看吧！</p>
    <p class="content" v-if="goodsNameType == 'coupons'">恭喜您获得优惠券X{{coupons_length}}，快去看看吧！</p>
    <p class="content" v-if="goodsNameType == 'service_day'">
      您已成功兑换的“{{goodsName}}”的{{serviceday}}天免费体验权快去
      <span class="content_title">"我听我看"</span>查看吧！
    </p>
    <div class="button_wrapper">
      <van-button
        type="primary"
        style="background:#F05654;border: 1px solid #F05654;"
        @click="toCheck"
      >去看看</van-button>
    </div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<script>
export default {
  name: "app-success",
  data() {
    return {
      goodsName: "",
      goodsNameType: "",
      serviceday: "",
      resData: {},
    };
  },
  methods: {
    toCheck() {
      // this.$toast(this.resData.redeem_goods_type);
      if (this.resData.redeem_goods_type == 1) {
        //  虚拟
        if (this.resData.goods_type == 4) {
          //  电子书
          this.$router.push({
            name: "ebookdetail",
            query: { goods_id: this.resData.goods_id },
          });
        } else if (this.resData.goods_type == 9) {
          this.$router.push({
            name: "album",
            query: { goods_id: this.resData.goods_id },
          });
        }
      } else if (this.resData.redeem_goods_type == 2) {
        // 优惠券
        // console.log('url', window.location.href);
        // this.$toast(window.location.href);
        this.$router.push({ name: "couponmine" });
      } else if (this.resData.redeem_goods_type == 3) {
        this.$router.push({
          name: "orderdetail",
          query: { order_id: this.resData.order_id },
        });
      } else if (this.goodsNameType == "service_day") {
        this.$router.push({
          name: "listenAndReadIndex",
        });
      }
    },
  },
  created() {
    this.goodsName = this.$route.query.goodsName;
    this.resData = this.$route.query.resData;
    this.goodsNameType = this.$route.query.goodsNameType;
    this.serviceday = this.$route.query.serviceday;
    console.log(this.resData);
  },
};
</script>

<style src="@/style/scss/pages/redeem/result/appSuccess.scss" lang="scss">
</style>
