<template>
  <div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<script>
// import { REDEEM_LINK } from "@/apis/redeem.js";

export default {
  name: "straight-link-index",
  data() {
    return {
      redeem_id: "",
      referer: "",
      redeemArr: [],
      redeems:[],
      code: "",
    };
  },
  methods: {
    // async getDetail() {
    //   // console.log(this.redeem);
    //   var tStamp = this.$getTimeStamp();
    //   let data = {
    //     // referer: "redirect",
    //     timestamp: tStamp,
    //     redeem_id: this.redeem,
    //     version: "1.1",
    //     code: this.code,
    //   };
    //   data.sign = this.$getSign(data);
    //   let res = await REDEEM_LINK(data);
    //   // this.$toast(res);
    //   // console.log(res, 999);
    //   if (res.hasOwnProperty("response_code")) {
    //     let encryptRedeem = encodeURI(res.response_data.redeem_id);
    //     // console.log(encryptRedeem);
    //     // 判断是商品还是优惠券
    //     if (res.response_data.goods_type == 2) {
    //       // this.$router.push({name: 'redeemCoupons', query: {redeem_id: encryptRedeem}});
    //     } else {
    //       // this.$router.push({name: 'redeemGood_s', query: {redeem_id: encryptRedeem}});
    //     }
    //   } else {
    //     // this.$router.push({name: 'wapFail', query: {errorMsg: res.error_message}});
    //   }
    //   // console.log(res);
    // },
  },
  created() {
    this.redeem_id = this.$route.query.redeem_id;
    this.code = this.$route.query.code;

    // console.log(this.code, this.redeem, this.$route.query.redeem_id,this.$route.query.code, 988); redeemArr

    if (localStorage.getItem("redeemArr")) {
      this.redeems = JSON.parse(localStorage.getItem("redeemArr"));
      this.redeems.forEach((element, index) => {
        if (element.id == this.redeem_id) {
          this.redeems.splice(index, 1);
        }
      });
    }

    this.redeems.push({
      id: this.redeem_id,
      refer: "redirect",
    });
    localStorage.setItem("redeemArr", JSON.stringify(this.redeems));

    this.$router.push({
      name: "redeemGood_s",
      query: { redeem_id: this.redeem_id, code: this.code },
    });
  },
  // mounted() {
  //   this.getDetail();
  // },
};
</script>
