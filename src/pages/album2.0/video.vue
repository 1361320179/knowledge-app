<template>
  <div id="videoPage">
    <div class="videoBox" @contextmenu.prevent="menuPlayer()">
      <div class="filter"
           v-if="(baseData.is_payed == 0 && albumBase.is_free == 0 && baseData.is_free == 0 && JSON.stringify(limitUse) == '{}') || baseData.goods_type == 1"
           :style="{backgroundImage: 'url(' + baseData.pic[0] + ')',backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}">
        <div class="shadow"></div>
      </div>
      <video
        id="myVideo"
        ref="video"
        v-if="(baseData.is_payed == 1 || baseData.is_free == 1 || JSON.stringify(limitUse) != '{}') && baseData.goods_type == 2"
        @play="videoPlay"
        @pause="videoPause"
        controls
        controlslist="nodownload"
        width="100%"
        height="100%"
        x5-playsinline="true" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint"
      ></video>
      <!--<div class="leftBottom" v-if="baseData.is_payed == 0 && baseData.is_free == 1 && albumBase.is_free == 0">-->
        <!--<span class="info">试看中</span>-->
        <!--<span class="action" @click="buyAction(pid)">购买此专辑</span>-->
      <!--</div>-->
      <div class="center" v-if="baseData.is_payed == 0 && albumBase.is_free == 0 && baseData.is_free == 0 && JSON.stringify(limitUse) == '{}'">
        <span class="info" v-if="baseData.is_free == 0" >购买后即可播放完整专辑</span>
        <span class="action" v-if="albumBase.single_activity_id"  @click="buyAction(pid)">限时促销价 ￥{{albumBase.price}}</span>
        <span class="action" v-if="JSON.stringify(recommendTicket) != '{}'"  @click="buyAction(pid)">券后价 ￥{{recommendTicket.after_use_ticket_money}}</span>
        <span class="action" v-if="!albumBase.single_activity_id && JSON.stringify(recommendTicket) == '{}' && baseData.is_free == 0"  @click="buyAction(pid)">购买专辑 ￥{{albumBase.market_price}}</span>
      </div>
      <div class="center" v-else>
        <!--<span class="info" v-if="baseData.is_free == 1">试看中，购买后解锁完整专辑</span>-->
        <span class="info" v-if="baseData.goods_type == 1">本节目为音频，点击观看</span>
        <span class="action" v-if="baseData.goods_type == 1"  @click="toAudio">前去观看</span>
      </div>
    </div>
    <div class="titleBox">
      <p class="title unfoldState" v-show="!foldState">
        {{title}}
      </p>
      <p class="title foldState" v-show="foldState">
        {{title}}
      </p>
      <div class="unfold" v-show="foldState && beyondOne">
        <svg class="icon" aria-hidden="true" @click="unfoldTitle">
          <use xlink:href="#icon-fold-line"/>
        </svg>
      </div>
      <div class="fold" v-show="!foldState && beyondOne">
        <svg class="icon" aria-hidden="true" @click="foldTitle">
          <use xlink:href="#icon-unfold-line"/>
        </svg>
      </div>
    </div>
    <div class="videoList">
      <h3 class="name">节目列表</h3>
      <div class="totalBox" @click="programListShow">
        <span class="totalText">共{{programTotalCount}}集</span>
        <div class="totalIcon">
          <svg class="icon" aria-hidden="true" @click="foldTitle">
            <use xlink:href="#icon-next-line"/>
          </svg>
        </div>
      </div>
      <div>
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item, index) in programList" :key="index" :class="itemClass[index]">
            <span class="itemText" @click="changeVideo(item)">
             {{ item.title }}
            </span>
          </swiper-slide>
        </swiper>
      </div>

    </div>
    <div class="commentBox">
      <div class="addComment" @click="toComment(1)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun"/>
        </svg>
        <span class="text">赶快发表你的评论吧~</span>
      </div>
      <div class="info">
        <svg class="icon" aria-hidden="true" @click="toComment(0)">
          <use xlink:href="#icon-comment-line"/>
        </svg>
        <div class="count">{{counter}}</div>
      </div>
    </div>
    <Recommend :message="baseData.is_free" :albumBase="albumBase"></Recommend>
    <!-- 播放列表 -->
    <!--<audioList-->
      <!--:goodsId="pid"-->
      <!--:albumInfo="baseData"-->
      <!--:goodsNo="activeGoodNo"-->
      <!--:audioStatus="!playStatus"-->
      <!--@audioChange="audioAction"-->
      <!--@progressListData="progressListData"-->
      <!--ref="controlList"-->
    <!--&gt;</audioList>-->
    <audioList
      :goodsId="pid"
      :albumInfo="albumBase"
      :goodsNo="goods_no"
      :audioStatus="!playStatus"
      :limitUse="limitUse"
      @programChange="changeVideo"
      ref="controlList"
    ></audioList>
    <EazyNav type="index" ref="nav" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<script>
  // aes加密解密
  import CryptoJS from "crypto-js/crypto-js";
  // m3u8播放
  import Hls from 'hls.js';

  import {TICKET_LINK} from "@/apis/coupon.js";
  import audioList from "@/pages/album2.0/components/list";
  import recommend from './components/recommend';
  import {ALBUM, ALBUM_DETAIL} from "../../apis/album.js";
  import {COMMENT_COUNTER} from "@/apis/public.js";

  // vue无刷新修改url参数
  import merge from "webpack-merge";
  export default {
    data() {
      return {
        // 专辑id
        pid: '',
        // 商品id
        goods_id: '',
        goods_no: '',
        // 当前节目标题
        title: '',
        // 账号信息，是否登录
        isLogin: null,
        // 专辑基础信息
        albumInfo: {},
        // 整个专辑
        albumBase: {},
        // 推荐用券
        recommendTicket: {
          money: '',
          after_use_ticket_money: ''
        },
        // 排序
        rankType: 1, // 默认0倒序, 1正序
        programList: [],
        programTotalCount: 0,
        // videoPath: '',
        playStatus: null,
        // 基础信息
        baseData: {
          title: "",
          sub_title: "",
          pic: [],
          goods_type: null,
          collection_num: 0,
          collect_id: null
        },
        // 所属媒体信息
        brandInfoData: {
          header_pic: "",
          name: "",
          fans: 0,
          is_followed: null
        },
        foldState: 0, // 0未折叠 1折叠
        beyondOne: null,
        itemClass: [],  //  节目列表样式
        swiperOption: {
          slidesPerView: "auto",
          // on: {
          //   click: () => {
          //     console.log(this);
          //   }
          // }
        },
        counter: '', // 评论数
        limitUse: {} // 限时免费
      }
    },
    methods: {
      // 获取节目列表
      async programData(_type) {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: this.pid,
          goods_no: this.rankType,
          page_size: 1000000000000000,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM_DETAIL(data);
        if (res.hasOwnProperty("response_code")) {
          if (_type == "rank") this.programList = [];
          // 异步更新数据
          var result = res.response_data.result;
          // console.log('r',result);
          // 设置节目列表
          this.programList = result;
          var index = result.findIndex(element =>
            element.goods_id == this.goods_id
          );
          var item = this.programList[index];
          // console.log('index',index);
          this.setVideo(item);
          // 设置总节目数
          this.programTotalCount = res.response_data.total_count;
        } else {
          this.$toast(res.error_message);
        }
      },
      async commentCounter() {
        let data = {
          goods_id: this.goods_id,
          version: "1.0"
        };
        let res = await COMMENT_COUNTER(data);
        if (res.hasOwnProperty("response_code")) {
          // console.log('counter', res);
          this.counter = res.response_data.counter;
        }
      },
      // 获取节目接口信息
      async albumData(goods_id) {
        var tStamp = this.$getTimeStamp();
        let data = {
          ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
          timestamp: tStamp,
          pid: this.pid,
          goods_id: goods_id,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM(data);
        // console.log(res);

        if (res.hasOwnProperty("response_code")) {
          //专辑基础信息
          this.albumInfo = res.response_data.album_info;
          // 当前商品基础信息
          this.baseData = res.response_data.base;
          console.log('baseData',this.baseData);
          // 公号信息
          this.brandInfoData = res.response_data.brand_info;

          // 音视频秘钥
          let play_url = this.baseData.play_url;
          let play_key = this.baseData.play_key;
          let path = this.$aesDecrypt(play_url, play_key);
          console.log('path',path);

          // hls.js
          if (Hls.isSupported()) {
            var myVideo = document.getElementById('myVideo');
            var myhls = new Hls();
            myhls.loadSource(path);
            myhls.attachMedia(myVideo);
          } else if (this.$refs.video.canPlayType('application/vnd.apple.mpegurl')) {
            // this.$refs.video.type = "application/vnd.apple.mpegurl";
            this.$refs.video.src = path;
            // this.$refs.video.addEventListener('loadedmetadata',function() {
            //   this.$refs.video.play();
            // });
          }

          // console.log(7474,$('.van-goods-action-big-btn .van-button__text'))

          // 所属媒体信息
          // this.brandInfoData = res.response_data.brand_info;

          // 获取页面分享信息
          // if (this.isWxLogin) this.wxShareData();
          // var _pageName = "goods/detail";
          // var _params = JSON.stringify({
          //   goods_id: this.$route.query.goods_id,
          //   album_id: this.$route.query.pid
          // });
          // if (this.isWxLogin) this.$getWxShareData(_pageName, _params);

        } else {
          this.$toast(res.error_message);
        }

        // 读取localStorage音频缩略播放器数据
        // this.getMiniAudioData();
      },
      // 获取整个专辑信息
      async wholeAlbum() {
        var tStamp = this.$getTimeStamp();
        var data = {
          timestamp: tStamp,
          goods_id: this.pid ? this.pid : null,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM(data);
        if (res.hasOwnProperty("response_code")) {
          // 存放整个专辑信息
          this.albumBase = res.response_data.base;
          // console.log('albumBase', this.albumBase);
          // 推荐用券
          this.recommendTicket = res.response_data.recommend_ticket;
          // 限时免费
          this.limitUse = res.response_data.activity.limituse;
        } else {
          this.$toast(res.error_message);
        }
      },
      // --------------------------------播放列表----------------------------------
      programListShow() {
        this.$refs.controlList.popupModel = true;
        // 关联播放列表
        this.$refs.controlList.goodsNo = this.goods_no ;
      },
      // 视频播放
      videoPlay() {
        // console.log('videoPlay');
        // this.playStatus = true;
        // this.$refs.controlList.popupModel = false;
      },
      // 视频暂停
      videoPause() {
        // console.log('videoPause');
        // this.playStatus = false;
      },
      // 展开标题
      unfoldTitle() {
        this.foldState = 0;
      },
      // 折叠标题
      foldTitle() {
        this.foldState = 1;
      },
      handleTitle() {
        if (this.title) {
          const el = document.getElementsByClassName('unfoldState')[0];
          const style = window.getComputedStyle(el, null);
          const height = parseInt(style.height, 10);
          const lineHeight = parseInt(style.lineHeight, 10);
          // console.log('height',height);
          // console.log('lineHeight',lineHeight);
          if (height/ lineHeight > 1) {
            this.beyondOne = true;
            this.foldState = 1;
            // console.log('be',this.beyondOne);
          } else {
            this.beyondOne = false;
          }
        }
      },

      // 设置初始视频
      setVideo(item) {
        var program = item;
        console.log('program', program);
        var index = this.programList.findIndex(element =>
          element.goods_id == program.goods_id
        );
        this.baseData = program;
        // 处理节目标题
        this.title = program.title;
        this.foldState = 0;
        this.$nextTick(() => {
          this.handleTitle();
        });

        // console.log('program',program);
        this.itemClass = [];
        this.itemClass.length = this.programList.length;
        this.itemClass[index] = 'percent';
      },
      // 切换节目列表
      changeVideo(item) {
        var program = item;
        console.log('program', program);
        var index = this.programList.findIndex(element =>
          element.goods_id == program.goods_id
        );
        this.baseData = program;
        if (program.goods_type == 1) {
          // this.baseData.goods_type = 1;
          // this.videoPath = "";
          // this.$toast('音频');
        } else if (program.goods_type == 2 && (this.baseData.is_free == 1 || this.baseData.is_payed == 1 || JSON.stringify(this.limitUse) != '{}')) {
          // this.baseData.goods_type = 2;
          // this.videoPath = program.file_path;
          this.albumData(program.goods_id);
        }
        this.goods_id = program.goods_id;
        this.goods_no = program.goods_no;
        // 处理节目标题
        this.title = program.title;
        this.foldState = 0;
        this.$nextTick(() => {
          this.handleTitle();
        });
        // 关闭通用列表
        this.$refs.controlList.popupModel = false;

        // console.log('program',program);
        this.itemClass = [];
        this.itemClass.length = this.programList.length;
        this.itemClass[index] = 'percent';

        // 更新url
        this.$router.replace({
          query: merge(this.$route.query, {
            goods_id: this.goods_id,
            goods_no: this.goods_no
          })
        });
      },
      // 去评论
      toComment(state) {
        this.$router.push({name: 'albumComment', query: {pid: this.pid, goods_id: this.goods_id, autofocus: state}});
      },
      async autoGetTicket(ticket_id, goodsId) {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          version: "1.0",
          ticket_id: ticket_id
        };
        data.sign = this.$getSign(data);
        let res = await TICKET_LINK(data);
        if (res.hasOwnProperty("response_code")) {
          // console.log(res);
          this.$toast("已为您领取" + this.RecommendTicket.money + "元优惠券");
          // 跳转购买
          this.$router.push({
            name: "payaccount",
            query: {goods_id: goodsId}
          });
        }
      },
      // 购买
      buyAction(goodsId) {
        if (this.$refs.nav.is_Login && goodsId != null) {
          if (JSON.stringify(this.recommendTicket) != '{}' && this.recommendTicket.state != 'linked') { // 有推荐券但未领券
            this.autoGetTicket(this.recommendTicket.ticket_id, goodsId);
          } else {
            this.$router.push({
              name: "payaccount",
              query: {goods_id: goodsId}
            });
          }
        } else {
          this.$router.push({name: "login"});
        }
      },
      // 去音频播放页
      toAudio() {
        this.$router.push({name: 'albumAudio', query: {pid: this.pid, goods_id: this.goods_id, goods_no: this.goods_no}});
      },
      menuPlayer() {
        // console.log('11');
      }
    },
    mounted() {
      this.pid =
        this.$route.query.pid == "NaN" || this.$route.query.pid == null
          ? 0
          : this.$route.query.pid;
      this.goods_id = this.$route.query.goods_id;
      this.goods_no = this.$route.query.goods_no;
      // 账号信息，是否登录
      this.isLogin = localStorage.getItem('loginState');

      this.wholeAlbum();
      this.programData().then(() => {
        this.albumData(this.goods_id);
      });
      this.commentCounter();
    },
    components: {
      'Recommend': recommend,
      'audioList': audioList
    }
  }
</script>

<style lang="scss" src="@/style/scss/pages/album2.0/video.scss" scoped>

</style>
