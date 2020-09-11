<template>
  <div id="app">
    <!-- 需要微信端打开，引导微信内打开 -->
    <!-- 引导app端打开 -->
    <template v-if="nullPage == 1 || nullPage == 2">
      <div class="nullBox">
        <img src="./assets/null/link.png" width="100%" />
        <div>{{ msg }}</div>
        <EazyNav type="brand" :isShow="true"></EazyNav>
      </div>
    </template>
    <template v-if="nullPage == 3">
      <div class="nullBox">

        <img src="./assets/null/link.png" width="100%" />

        <div>{{ msg }}</div>
        <EazyNav type="brand" :isShow="true"></EazyNav>
      </div>
    </template>

    <template v-else>
      <Download></Download>

      <!-- <aplayer :playerOptions="aOption" muted="muted" /> -->
      <!-- <vplayer :playerOptions="vOption" muted="muted" /> -->

      <!-- 页面缓存, $route.meta.keepAlive默认false -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </template>
  </div>
</template>

<style lang="scss" src="@/style/scss/app.scss">
</style>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0 !important;
  /* padding-top: env(safe-area-inset-top);  */
  /* 为导航栏+状态栏的高度 88px */
  /* padding-left: env(safe-area-inset-left);  */
  /* 如果未竖屏时为0 */
  /* padding-right: env(safe-area-inset-right);  */
  /* 如果未竖屏时为0 */
  /* padding-bottom: env(safe-area-inset-bottom);  */
  /* 为底下圆弧的高度 34px */
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
::-ms-scrollbar {
  width: 0;
  height: 0;
}
::scrollbar[orient="vertical"] {
  min-width: 0 !important;
}
/* 滚动条的滑轨背景颜色 */
::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}
/* 滑块颜色 */
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
}
/* 滑轨两头的监听按钮颜色 */
::-webkit-scrollbar-button {
  height: 0;
  background-color: rgba(0, 0, 0, 0.05);
}
/* 横向滚动条和纵向滚动条相交处尖角的颜色 */
::-webkit-scrollbar-corner {
  background-color: black;
}

/*设置input placeholder颜色*/
::-webkit-input-placeholder,
::-webkit-textarea-placeholder {
  font-size: 13px;
  color: #999;
}

:-moz-placeholder {
  font-size: 13px;
  color: #999;
}

:-ms-input-placeholder,
:-ms-textarea-placeholder {
  font-size: 13px;
  color: #999;
}
</style>
<script>
// aes加密解密
// import CryptoJS from "crypto-js/crypto-js";
// 音视频流兼容m3u8
// import { aplayer, vplayer } from "vue-hls-player";

// 微信分享，引入sdk
import wx from "weixin-js-sdk";
export default {
  name: "App",
  data() {
    return {
      nullPage: this.$route.query.nullPage ? this.$route.query.nullPage : 0,
      msg: "",
      // aOption: {
      //   type: "application/x-mpegURL",
      //   src: "http://file.huoba.dev.zzy/test/v6/output.m3u8",
      //   preload: true,
      //   autoplay: true,
      //   isLoop: false,
      //   poster: "https://oimdztrab.qnssl.com/Frp4SyVe5PosdkUKRaE-krjK7B5z",
      //   title: "音频播放器",
      //   description: "",
      //   controls: "progress,durration",
      // },
      // vOption: {
      //   type: "application/x-mpegURL",
      //   src:
      //     "http://file.huoba.dev.zw/test/v1/output.m3u8",
      //   preload: true,
      //   autoplay: true,
      //   isLoop: false,
      //   poster: "https://oimdztrab.qnssl.com/FlRHT5-abdwNVXyBb-sYzUPIihoe",
      //   playsinline: true,
      //   title: "视频播放器",
      //   controls: "progress,durration,volume",
      // },
    };
  },
  mounted() {


    // console.log("token:", this.$cookies.get("token"));

    //hash值获取方式  KlgisfineKJ123@abc是前后台规定的key请改变的时候通知后端开发人员
    // var key = 'test';
    // var hash = CryptoJS.MD5(key).toString();

    // //加密
    // var username = "Sebaxtian";
    // var password = "Contraseña";
    // var json_obj = { username: username, password: password };
    // var mensajePlano = JSON.stringify(json_obj);
    // var mensajeEncriptado = CryptoJS.AES.encrypt(mensajePlano, hash).toString();
    // console.log("Mensaje Encriptado: " + mensajeEncriptado);

    // //解密
    // var data = "U2FsdGVkX18VPEmp29pSCEntot/n6nMHk7DMk++7b8A=";
    // var plaintext = CryptoJS.AES.decrypt(data, hash);
    // console.log(
    //   "解密: " + plaintext.toString(CryptoJS.enc.Utf8),
    //   "hash:",
    //   hash
    // );






    if (this.$route.query.nullPage == 1) this.msg = "请在微信端打开~";
    if (this.$route.query.nullPage == 2) this.msg = "请在app端打开~";
    // 获取适配信息，并微信授权
    this.$setLoginData();
  },
};
</script>
