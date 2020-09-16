<template>
  <div id="blankPage">
    <van-button type="info" @click="ceshi1()">跳转新人礼1111111111111</van-button>
    <EazyNav type="brand" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      };
    },
    mounted () {

    },
    methods: {
      // 跳过弹窗1
      ceshi1 () {
        this.$router.push({
          name: "newGiftSexAge"
        });
      },
    }
  };
</script>
