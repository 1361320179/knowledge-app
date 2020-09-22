<template>
  <div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div> 
</template>

<script>
import { REDEEM_LINK } from "@/apis/redeem.js";

export default {
  name: "straight-link-index",
  data() {
    return {
      redeem: "",
      referer: "",
      code: "",
    };
  },
  methods: {
    async getDetail() {
      // console.log(this.redeem);
      let data = {
        // referer: "redirect",
        redeem_id: this.redeem,
        version: "1.1",
        code: this.code,
      };
      let res = await REDEEM_LINK(data);
      // this.$toast(res);
      // console.log(res, 999);
      if (res.hasOwnProperty("response_code")) {
        let encryptRedeem = encodeURI(res.response_data.redeem_id);
        // console.log(encryptRedeem);
        // 判断是商品还是优惠券
        if (res.response_data.goods_type == 2) {
          // this.$router.push({name: 'redeemCoupons', query: {redeem_id: encryptRedeem}});
        } else {
          // this.$router.push({name: 'redeemGood_s', query: {redeem_id: encryptRedeem}});
        }
      } else {
        // this.$router.push({name: 'wapFail', query: {errorMsg: res.error_message}});
      }
      // console.log(res);
    },
  },
  created() {
    this.redeem = this.$route.query.redeem_id;
    this.code = this.$route.query.code;

    this.$router.push({
      name: "redeemGood_s",
      query: { redeem_id: this.redeem, code: this.code },
    });
    // console.log(this.code, this.redeem, this.$route.query.redeem_id,this.$route.query.code, 988);
    localStorage.setItem("ori_redeem_id", this.redeem);
    localStorage.setItem("originLink", "redirect");
  },
  mounted() {
    this.getDetail();
  },
};
</script>
