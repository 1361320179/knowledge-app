<template>
  <div id="audioPage" @click="hideMore">
    <div class="filter"
         v-if="(baseData.is_payed == 0 && albumBase.is_free == 0 && JSON.stringify(limitUse) == '{}') || ((baseData.is_payed == 1 || albumBase.is_free == 1 || JSON.stringify(limitUse) != '{}') && baseData.goods_type == 2)"
         :style="{backgroundImage: 'url(' + baseData.pic + ')',backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}">
      <img class="pic" src="./../../assets/album/audio-bg.png" alt="">
      <div class="shadow"></div>
    </div>
    <div class="normal"
         v-else
         :style="{backgroundImage: 'url(' + baseData.pic + ')',backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}">
      <img class="pic" src="./../../assets/album/audio-bg.png" alt="">
    </div>
    <div class="center"
         v-if="baseData.is_payed == 0 && albumBase.is_free == 0 && baseData.is_free == 1 && JSON.stringify(limitUse) != '{}' && baseData.goods_type == 1">
      <span class="info" v-if="baseData.goods_type == 1">试听中，购买后解锁完整专辑</span>
      <span class="action" v-if="albumBase.single_activity_id" @click="buyAction(pid)">限时促销价 ￥{{albumBase.price}}</span>
      <span class="action" v-if="JSON.stringify(recommendTicket) != '{}'" @click="buyAction(pid)">券后价 ￥{{recommendTicket.after_use_ticket_money}}</span>
      <span class="action" v-if="!albumBase.single_activity_id && JSON.stringify(recommendTicket) == '{}'"
            @click="buyAction(pid)">购买专辑 ￥{{albumBase.market_price}}</span>
    </div>
    <div class="center" v-if="baseData.is_payed == 0 && albumBase.is_free == 0 && baseData.is_free == 0 && JSON.stringify(limitUse) == '{}'">
      <span class="info" v-if="baseData.is_free == 0 && JSON.stringify(limitUse) == '{}'">购买后即可播放完整专辑</span>
      <span class="action" v-if="albumBase.single_activity_id" @click="buyAction(pid)">限时促销价 ￥{{albumBase.price}}</span>
      <span class="action" v-if="JSON.stringify(recommendTicket) != '{}'" @click="buyAction(pid)">券后价 ￥{{recommendTicket.after_use_ticket_money}}</span>
      <span class="action" v-if="!albumBase.single_activity_id && JSON.stringify(recommendTicket) == '{}'"
            @click="buyAction(pid)">购买专辑 ￥{{albumBase.market_price}}</span>
    </div>
    <div class="center" v-if="baseData.is_payed == 1 || albumBase.is_free == 1 || baseData.is_free == 1 || JSON.stringify(limitUse) != '{}'">
      <span class="info" v-if="baseData.goods_type == 2">本节目为视频，点击观看</span>
      <span class="action" v-if="baseData.goods_type == 2" @click="toVideo">前去观看</span>
    </div>

    <!--<template v-if="JSON.stringify(aOption) != '{}'">-->
      <!--<aplayer :playerOptions="aOption" muted="muted" />-->
    <!--</template>-->
    <audio id="musicPlayer" @ended="onEnded" style="display: none;"></audio>

    <!--<audio ref="audio" id="musicPlayer" @ended="onEnded">-->
      <!--<source :src="baseData.file_path"/>-->
      <!--您的浏览器不支持 audio 元素。-->
    <!--</audio>-->

    <!--控件一-->
    <div class="controlBoxOne">
      <div class="more">
        <svg class="icon" aria-hidden="true" @click="moreOperate">
          <use xlink:href="#icon-gengduo"/>
        </svg>
        <div class="moreList" v-show="moreOperateShow">
          <div class="moreItem collected" v-if="albumBase.collect_id > 0" @click="collectCancel($route.query.pid)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yishoucang"/>
            </svg>
            <span class="text">已收藏</span>
          </div>
          <div class="moreItem collect" v-else @click="collectAdd(albumBase.goods_type, $route.query.pid)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoucang1"/>
            </svg>
            <span class="text">收藏</span>
          </div>
        </div>
      </div>
      <div class="normalTitle" v-if="playStatus">
        <span class="title">{{title}}</span>
      </div>
      <div class="carousel" v-else>
        <span class="title">{{title}}</span>
      </div>
      <div class="list">
        <svg class="icon" aria-hidden="true" @click="programListShow">
          <use xlink:href="#icon-liebiao"/>
        </svg>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="sliderBox">
      <van-slider
        v-model="sliderValue"
        @change="audioSliderChange"
        :min="0"
        :max="100"
        bar-height="2px"
        active-color="#f05654"
        inactive-color="#eee"
        :disabled="(baseData.is_payed == 0 && baseData.is_free == 0 && JSON.stringify(limitUse) == '{}') || baseData.goods_type == 2"
      >
        <div
          slot="button"
          class="sliderButton"
        >
          <span class="sliderText"
                v-if="(baseData.is_payed == 1 || baseData.is_free == 1 || JSON.stringify(limitUse) != '{}') && baseData.goods_type == 1">{{ currentTime__ }}/{{ baseData.duration_str }}</span>
          <span class="sliderText" v-else>00:00/{{ baseData.duration_str }}</span>
        </div>
      </van-slider>
      <div>
      </div>
    </div>

    <!--控件二-->
    <!--不可点击-->
    <div class="controlBoxTwo"
         v-if="baseData.is_payed == 0 && baseData.is_free == 0 && JSON.stringify(limitUse) == '{}' || baseData.goods_type == 2">
      <div class="backward">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-houtui"/>
        </svg>
      </div>
      <div class="prev non-clickable">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zuo"/>
        </svg>
      </div>
      <div class="play non-clickable">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-bofang_zhongxinbofang"/>
        </svg>
      </div>
      <div class="next non-clickable">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-you"/>
        </svg>
      </div>
      <div class="forward">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-kuaijin"/>
        </svg>
      </div>
    </div>
    <!--可点击-->
    <div class="controlBoxTwo" v-else>
      <div class="backward">
        <svg class="icon" aria-hidden="true" @click="goBack(15)">
          <use xlink:href="#icon-houtui"/>
        </svg>
      </div>
      <div class="prev">
        <svg class="icon" aria-hidden="true" @click="prevProgram">
          <use xlink:href="#icon-zuo"/>
        </svg>
      </div>
      <div class="play" v-if="playStatus">
        <svg class="icon" aria-hidden="true" @click="playAudio">
          <use xlink:href="#icon-bofang_zhongxinbofang"/>
        </svg>
      </div>
      <div class="pause" v-else>
        <svg class="icon" aria-hidden="true" @click="pauseAudio">
          <use xlink:href="#icon-bofang_zanting"/>
        </svg>
      </div>
      <div class="next">
        <svg class="icon" aria-hidden="true" @click="nextProgram">
          <use xlink:href="#icon-you"/>
        </svg>
      </div>
      <div class="forward">
        <svg class="icon" aria-hidden="true" @click="goAhead(30)">
          <use xlink:href="#icon-kuaijin"/>
        </svg>
      </div>
    </div>
    <Recommend :message="baseData.is_free" :albumBase="albumBase" ref="recommendContent" @collect="collectAction"></Recommend>
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
    <!-- 播放列表 -->
    <audioList
      :goodsId="pid"
      :albumInfo="albumBase"
      :goodsNo="activeGoodNo"
      :audioStatus="!playStatus"
      :limitUse="limitUse"
      @programChange="audioAction"
      @progressListData="progressListData"
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
  //  引入接口
  import {ALBUM, ALBUM_DETAIL} from "@/apis/album.js";
  import {USER_PLAYED_RECORD} from "@/apis/user.js";
  import {COMMENT_COUNTER} from "@/apis/public.js";
  // vue无刷新修改url参数
  import merge from "webpack-merge";

  export default {
    data() {
      return {
        moreOperateShow: false,
        moreFlag: false,
        // 存储是否新增
        isAdd: false,
        // 专辑节目信息
        album_info: {},
        // 整个专辑
        albumBase: {},
        // 推荐用券
        recommendTicket: {
          money: '',
          after_use_ticket_money: ''
        },
        // 节目评论数
        counter: '',
        // 存放所有节目
        allProgramList: [],
        sliderValue: null,
        playStatus: true,
        // 存放当前播放音频key值
        activeGoodNo: null,
        currentTime__: "00:00",
        isLogin: 0,
        goods_id: null,
        pid: null,
        title: null,
        baseData: {},

        programList: [],
        programPage: 1,
        myAudioData: {},
        progressList: [],

        limitUse: {} // 限时免费
      }
    },
    methods: {
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
      async albumData(pid, goods_id) {
        var tStamp = this.$getTimeStamp();
        var data = {
          ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
          timestamp: tStamp,
          pid: pid,
          goods_id: goods_id,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM(data);
        if (res.hasOwnProperty("response_code")) {
          // 存放专辑信息
          this.album_info = res.response_data.album_info;
          // 设置音频播放信息
          this.setBaseData("base", res.response_data.base);
          // 设置播放秘钥
          this.baseData.play_url = res.response_data.base.play_url;
          this.baseData.play_key = res.response_data.base.play_key;

          // 音视频秘钥
          let play_url = this.baseData.play_url;
          let play_key = this.baseData.play_key;
          // console.log(play_url);
          // console.log(play_key);
          let path = this.$aesDecrypt(play_url, play_key);
          // console.log(this.$aesDecrypt(play_url, play_key));

          // return path;
          // let play_url =
          //   "U2FsdGVkX1+kio7qvgg85GTx+0NaWh+Ngt0bXu+o3FRccFgtc4JeTr86PFR6D41uluqd8IA45KvprH4+Yufrz9J9dOyAQW+QtjIxAI0aiq4=";
          // let play_key =
          //   "U2FsdGVkX1/x5CixbFmvUKEmjyIXWx8xSW/tKqVQMKl8tuLLl++v8Lpk+HHwPQK1UAx92+ikF2fcuwc1zKC4qw==";
          // hls.js
          if (Hls.isSupported()) {
            var musicPlayer = document.getElementById('musicPlayer');
            var myhls = new Hls();
            var _this = this;
            myhls.loadSource(path);
            myhls.attachMedia(musicPlayer);
            myhls.on(Hls.Events.MANIFEST_PARSED, function () {
              var u = navigator.userAgent;
              var _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
              if (_this.isAutoPlay() && !_ios) {
                _this.playAudio();
                // var audio = document.getElementById("musicPlayer");
                // audio.addEventListener('play', function () {
                //   audio.load();
                //   audio.play();
                // });

                // var _this = this;
                // setTimeout(function () {
                //   _this.pauseAudio();
                //   _this.playAudio();
                //   alert("11111");
                // }, 10000);

              }
            });
          }

        } else {
          this.$toast(res.error_message);
        }
      },
      // 获取整个专辑信息
      async wholeAlbum() {
        var tStamp = this.$getTimeStamp();
        var data = {
          timestamp: tStamp,
          goods_id: this.$route.query.pid,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM(data);
        if (res.hasOwnProperty("response_code")) {
          // 存放整个专辑信息
          this.albumBase = res.response_data.base;
          // 推荐用券
          this.recommendTicket = res.response_data.recommend_ticket;
          // 限时免费
          this.limitUse = res.response_data.activity.limituse;

        } else {
          this.$toast(res.error_message);
        }
      },
      // 更新localStorage:miniAudio数据
      updateMiniAudio(item) {
        // 获取localStorage数据
        var info = JSON.parse(localStorage.getItem("miniAudio"));
        if (info == null) info = [];
        info[0] = this.$route.query.goods_no;
        info[1] = this.$route.query.pid;
        info[2] = item.pic[0];
        // info[3] = item.file_path;
        info[3] = '';
        info[4] = item.duration;
        info[5] = item.progress;
        info[6] = item.title;
        // 专辑标题
        info[7] = this.album_info.title;
        // 商品id
        info[8] = this.$route.query.goods_id;
        // 专辑图片
        info[9] = this.album_info.pic;
        localStorage.setItem("miniAudio", JSON.stringify(info));
      },
      // 重置音频播放信息以及当前slider进度
      resetAudioSliderInfo(item) {
        this.clearClock();
        var audio = document.getElementById("musicPlayer");
        audio.currentTime = 0;
        // 设置当前播放时间
        this.currentTime__ = this.todate(0);
        // 绑定slider
        this.audiobindtoslider(0);
        if ((item.is_payed == 1 || item.is_free == 1 || JSON.stringify(this.limitUse) != '{}') && item.goods_type == 1) {
          this.pauseAudio();
          this.playAudio();
        }
      },
      // 设置音频播放信息
      setBaseData(_type, item) {
        if (_type == "base") {
          this.baseData.duration_str = this.$formatTime(item.duration);
          this.baseData.duration = item.duration;
          // this.sliderValue = (item.progress / item.duration) * 100;
          this.sliderValue = 0;
        }
        if (_type == "item") {
          this.baseData.duration_str = this.$formatTime(item.ori_duration);
          this.baseData.duration = item.ori_duration;
          this.activeGoodNo = item.goods_no;
          this.$router.replace({
            query: merge(this.$route.query, {
              goods_id: item.goods_id,
              goods_no: item.goods_no
            })
          });
        }
        this.baseData.title = item.title;
        this.baseData.pic = item.pic;
        this.baseData.is_free = item.is_free;
        this.baseData.is_payed = item.is_payed;
        // console.log('isfree', this.baseData.is_free);
        // console.log('ispayed', this.baseData.is_payed);
        this.baseData.goods_type = item.goods_type;
        // if (item.goods_type == 1 && (this.baseData.is_free == 1 || this.baseData.is_payed == 1 || JSON.stringify(this.limitUse) != '{}')) {
          // this.baseData.file_path = item.file_path;
          // this.$refs.audio.src = item.file_path;
        // } else {
          // this.baseData.file_path = "";
          // this.$refs.audio.src = "";
        // }
        document.title = "正在播放-" + item.title;
        this.goods_id = item.goods_id;
        this.title = item.title;
        // 更新localStorage:miniAudio数据
        this.updateMiniAudio(item);
      },
      // 清除倒计时
      clearClock() {
        // 播放结束后销毁倒计时
        if (this.progressClock != null) {
          window.clearInterval(this.progressClock);
          this.progressClock = null;
        }
        if (this.clock != null) {
          window.clearInterval(this.clock);
          this.clock = null;
        }
      },
      // 播放
      playAudio() {
        this.audioStatus(false);
      },
      // 暂停
      pauseAudio() {
        this.audioStatus(true);
      },
      audioStatus(_status) {
        var audio = document.getElementById("musicPlayer");
        var __currentTime = audio.currentTime;
        // if (!audio.hasAttribute("src")) {
        //   this.$refs.audio.src = this.baseData.file_path;
        //   audio.load();
        //   return;
        // }

        this.playStatus = _status;
        if (_status) {
          audio.pause();
        } else {
          // audio.load();
          audio.play();
        }
        var second = parseInt(audio.currentTime);
        this.audioTimeChange(second, _status);
        // 用户播放进度记录
        this.currentTimeData(__currentTime);
        // console.log("当前播放时间：", second);
      },
      // 播放中倒计时
      audioTimeChange(second, type) {
        clearInterval(this.clock);
        var audio = document.getElementById("musicPlayer");
        // 暂停
        if (type) {
          this.clearClock();
          return false;
        }
        this.clock = window.setInterval(() => {
          // 修复倒计时中音频paused状态改变的问题
          if (audio.paused) audio.play();
          if (second >= this.baseData.duration) {
            clearInterval(this.clock);
          } else {
            second++;
            this.currentTime__ = this.todate(second);
            // 绑定slider
            this.audiobindtoslider(second);
            // console.log("倒计时：", second, audio.currentTime);
          }
        }, 1000);
        // 音频实时播放进度，每5s更新
        this.audioProgress();
      },
      // 音频实时播放进度，每5s更新
      audioProgress() {
        this.progressClock = window.setInterval(() => {
          this.updateProgress();
          this.$refs.controlList.progressListData();
          // console.log("每5s更新");
        }, 5000);
      },
      // 更新音频当前播放进度
      updateAudioProgress() {
        var audio = document.getElementById("musicPlayer");
        var __currentTime = audio.currentTime;
        // 获取localStorage数据
        var info = JSON.parse(localStorage.getItem("miniAudio"));
        if (info != null && info.length > 0) info[5] = __currentTime;
        localStorage.setItem("miniAudio", JSON.stringify(info));
        // 用户播放进度记录
        this.currentTimeData(__currentTime);
      },
      // 更新音频播放进度
      updateProgress() {
        // 更新音频当前播放进度
        this.updateAudioProgress();
        // 判断是否需要新增进度
        this.progressAddOrUpdate();
        // 根据pid + goods_id来存储loacalStorage
        var result = JSON.parse(localStorage.getItem("audioProgress"));
        if (result == null || this.isAdd) {
          // 新增播放进度记录
          this.addProgressData();
        } else {
          // 更新播放进度记录
          this.updateProgressData();
        }
      },
      // 用户播放进度记录
      async currentTimeData(__currentTime) {
        // 已登录账号才存储到数据库
        if (this.isLogin == 0) return;

        // 如果是非专辑，则传入goods_id
        var _pid = this.$route.query.pid;
        var _goodsId = this.$route.query.goods_id;
        if (_pid == null || _pid == "NaN") {
          _pid = this.$route.query.goods_id;
          _goodsId = null;
        }
        var tStamp = this.$getTimeStamp();
        var data = {
          goods_id: _pid,
          sub_goods_id: _goodsId,
          duration: __currentTime,
          timestamp: tStamp,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await USER_PLAYED_RECORD(data);
        if (res.hasOwnProperty("response_code")) {
        } else {
          this.$toast(res.error_message);
        }
      },
      // 判断是否需要新增进度
      progressAddOrUpdate() {
        var result = JSON.parse(localStorage.getItem("audioProgress"));
        var info = JSON.parse(localStorage.getItem("miniAudio"));
        var pid;
        var goodsId;
        if (info != null && info.length > 0) {
          pid = info[1];
          goodsId = info[8];
        }
        this.isAdd = true;
        if (result != null && result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            // 当记录已经存在则更新
            if (pid == result[i].pid && goodsId == result[i].goods_id) {
              this.isAdd = false;
            }
          }
        }
      },
      // 新增播放进度记录
      addProgressData() {
        // 当记录不存在则添加
        /*
         * __goodsId专辑id
         * __goodsNo节目编号
         * __progress节目当前播放进度
         * __duration节目时长，单位s
         * __pid专辑id，单个节目pid默认为0
         */

        var info = JSON.parse(localStorage.getItem("miniAudio"));
        var arr = JSON.parse(localStorage.getItem("audioProgress"));

        if (info != null && info.length > 0) {
          var obj = {};
          obj.goods_id = info[8];
          obj.goods_no = info[0];
          obj.progress = info[5];
          obj.duration = info[4];
          obj.pid = info[1];

          // 100条上限，多于100条从第一条覆盖以此类推
          if (arr == null) arr = [];
          if (arr.length <= 100) {
            arr.push(obj);
          } else {
            arr = arr.pop();
          }
        }

        localStorage.setItem("audioProgress", JSON.stringify(arr));
      },
      // 更新播放进度记录
      updateProgressData() {
        var info = JSON.parse(localStorage.getItem("miniAudio"));
        var result = JSON.parse(localStorage.getItem("audioProgress"));
        var audio = document.getElementById("musicPlayer");
        var __currentTime = audio.currentTime;
        var pid = info[1];
        var goodsId = info[8];

        if (result != null && result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            // 当记录已经存在则更新
            if (pid == result[i].pid && goodsId == result[i].goods_id) {
              result[i].progress = __currentTime;
              // 设置节目列表播放进度，只设置不显示
              localStorage.setItem("audioProgress", JSON.stringify(result));
            }
          }
        }
      },
      // 播放结束
      onEnded() {
        // this.$toast("end");
        this.clearClock();
        var audio = document.getElementById("musicPlayer");
        // 重置
        audio.currentTime = 0;
        this.currentTime__ = this.todate(0);
        // 绑定slider
        this.audiobindtoslider(0);
        // 节目上下切换
        this.allProgramData("next");
      },
      // 后退15s
      goBack(time) {
        this.clearClock();
        var audio = document.getElementById("musicPlayer");
        // 设置音频当前时间
        if (audio.currentTime >= time) {
          audio.currentTime -= time;
        } else {
          audio.currentTime = 0;
        }
        // 设置当前播放时间
        this.currentTime__ = this.todate(audio.currentTime);
        // 绑定slider
        this.audiobindtoslider(audio.currentTime);

        this.pauseAudio();
        this.playAudio();
      },
      // 前进30s
      goAhead(time) {
        this.clearClock();
        var audio = document.getElementById("musicPlayer");
        // 设置音频当前时间
        if (this.baseData.duration - audio.currentTime > time) {
          audio.currentTime += time;
        } else {
          audio.currentTime = this.baseData.duration;
        }
        // 设置当前播放时间
        this.currentTime__ = this.todate(audio.currentTime);
        // 绑定slider
        this.audiobindtoslider(audio.currentTime);

        this.pauseAudio();
        this.playAudio();
      },
      // 滑动进度条
      audioSliderChange() {
        this.clearClock();
        var audio = document.getElementById("musicPlayer");
        var c;
        if (this.sliderValue) {
          // 设置音频当前时间
          audio.currentTime = (this.sliderValue / 100) * this.baseData.duration;
          // 滑动到最后
          if (this.sliderValue > 100) {
            // 重置
            c = 0;
          } else {
            c = audio.currentTime;
          }
          // 设置当前播放时间
          this.currentTime__ = this.todate(c);
          // 绑定slider
          this.audiobindtoslider(c);
        }
        this.pauseAudio();
        this.playAudio();
      },
      // 点击上一个节目
      prevProgram() {
        this.allProgramData("prev");
      },
      // 点击下一个节目
      nextProgram() {
        this.allProgramData("next");
      },
      // 节目上下切换
      async allProgramData(actionType) {
        // 当前节目不为单个商品
        if (this.pid != 0) {
          var tStamp = this.$getTimeStamp();
          let data = {
            timestamp: tStamp,
            goods_id: this.pid,
            page_size: 1000000000000000,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          let res = await ALBUM_DETAIL(data);
          // 存储当前节目的prev和next
          var prev;
          var next;

          if (res.hasOwnProperty("response_code")) {
            var type1 = 0;
            var type2 = 0;
            var type3 = 0;
            this.allProgramList = [];
            var list = res.response_data.result;
            for (let i = 0; i < res.response_data.result.length; i++) {
              var type = list[i].goods_type;
              if (type == 1) type1 = 1;
              if (type == 2) type2 = 1;
              if (type == 6) type3 = 1;
              // 不包含文章类型
              if (list[i].goods_type != 6) {
                this.allProgramList.push(list[i]);
              }
              if (list[i].goods_no == this.$route.query.goods_no) {
                prev = i - 1;
                next = i + 1;
              }
            }
            // 判断专辑是否自动播放
            if (eval(type1 + type2 + type3) > 1) {
              this.autoPlay = false;
            } else {
              this.autoPlay = true;
            }

            if (this.allProgramList && this.allProgramList.length > 0) {
              // 当前列表只有一条
              if (this.allProgramList.length == 1) {
                this.$toast("当前列表只有一条");
                return;
              }
              var count = this.allProgramList.length;
              prev = prev < 0 ? count - 1 : prev;
              next = next > count - 1 ? 0 : next;
            } else {
              prev = 0;
              next = 0;
            }

            var item;
            // 判断是prev还是next，或者是自动播放完毕
            if (actionType == "prev") {
              // 节目已支付
              if (
                this.allProgramList[prev].is_payed == 0 &&
                this.allProgramList[prev].is_free == 0 &&
                JSON.stringify(this.limitUse) == '{}'
              ) {
                this.pauseAudio();
                this.$toast("上一个节目收费");
                return;
              } else {
                item = this.allProgramList[prev];
              }
            } else if (actionType == "next" || this.autoPlay) {
              // 节目已支付
              if (
                this.allProgramList[next].is_payed == 0 &&
                this.allProgramList[next].is_free == 0 &&
                JSON.stringify(this.limitUse) == '{}'
              ) {
                this.pauseAudio();
                this.$toast("下一个节目收费");
                return;
              } else {
                item = this.allProgramList[next];
              }
            }

            // 重置音频播放信息以及当前slider进度
            this.resetAudioSliderInfo(item);
            // 设置音频播放信息
            this.setBaseData("item", item);
            this.albumData(this.pid, item.goods_id);
          } else {
            this.$toast(res.error_message);
          }
        } else {
          this.$toast("当前为单个节目");
        }
      },
      // --------------------------------播放列表----------------------------------
      programListShow() {
        this.$refs.controlList.popupModel = true;
        // 关联播放列表
        this.$refs.controlList.goodsNo = this.activeGoodNo;
      },
      // localStorage:audioProgress存放节目播放进度
      progressListData() {
        /*
         * __goodsId节目id
         * __goodsNo节目编号
         * __progress节目当前播放进度
         * __duration节目时长，单位s
         * __pid专辑id，单个节目pid默认为0
         */
        var result = JSON.parse(localStorage.getItem("audioProgress"));
        // 临时存放节目进度
        this.progressList = [];
        for (let i = 0; i < this.programList.length; i++) {
          this.progressList.push(this.programList[i]);
          if (result != null && result.length > 0) {
            for (let j = 0; j < result.length; j++) {
              // 当节目播放进度存在localStorage时,显示已播放进度
              if (
                result[j].pid == this.baseData.goods_id &&
                result[j].goods_id == this.programList[i].goods_id
              ) {
                this.$set(
                  this.progressList[i],
                  "progressHistory",
                  result[j].progress
                );
              }
            }
          }
        }
      },
      // 获取当前节目播放进度
      getAudioProgress(item) {
        var pid = this.baseData.goods_id;
        var goods_no = item.goods_no;
        var goods_id = item.goods_id;
        var result = JSON.parse(localStorage.getItem("audioProgress"));
        // 默认从0播放,如果localStorage有播放进度记录则从记录处播放
        var __currentTime = 0;
        if (result != null && result.length > 0) {
          // 遍历localStorage中记录进度的数组，获取当前节目当前进度
          for (let i = 0; i < result.length; i++) {
            if (goods_id == result[i].goods_id && pid == result[i].pid) {
              __currentTime = result[i].progress;
            }
          }
        }
        // 如果当前节目有播放记录，跳到当前记录位置继续播放
        return __currentTime;
      },
      // 节目列表播放/暂停音频
      // 点击节目
      audioAction(item) {
        // 未支付
        // if (item.goods_id != null && item.is_payed == 0 && item.is_free == 0) {
        //   var _goodsId = null;
        //   if (item.sale_style == 1) {
        //     _goodsId = this.pid;
        //   } else {
        //     _goodsId = item.goods_id;
        //   }
        //   this.$router.push({
        //     name: "payaccount",
        //     query: {goods_id: _goodsId}
        //   });
        //   return;
        // }
        // 切换节目设置当前播放器播放信息
        this.setAudioInfo(item);
      },
      // 切换节目设置当前播放器播放信息
      setAudioInfo(item) {
        // 关联播放列表
        this.listData(item.goods_no, false);

        // 设置音频播放信息
        this.setBaseData("item", item);
        this.$router.replace({
          query: merge(this.$route.query, {
            goods_id: item.goods_id,
            goods_no: item.goods_no
          })
        });

        // 重置音频播放信息以及当前slider进度
        this.resetAudioSliderInfo(item);
      },
      // 关联播放列表
      listData(goods_no, _bool) {
        this.activeGoodNo = goods_no;
        this.$refs.controlList.popupModel = _bool;
      },
      // 去评论
      toComment(state) {
        this.$router.push({name: 'albumComment', query: {pid: this.pid, goods_id: this.goods_id, autofocus: state}});
      },
      // 日期格式转换
      todate(second) {
        // 转换为时间格式
        var date = "00:00";
        // var h = Math.floor(second / 60 / 60);
        var m = Math.floor(second / 60);
        var s = Math.floor(second - m * 60);
        // if (h < 10) h = "0" + h;
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;
        // var date = h + ":" + m + ":" + s;
        var date = m + ":" + s;
        return date;
      },
      // 绑定slider
      audiobindtoslider(second) {
        var percent = (second / this.baseData.duration) * 100;
        // 设置slider进度
        this.sliderValue = percent;
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
      // 去视频播放页
      toVideo() {
        this.$router.push({
          name: 'albumVideo',
          query: {
            pid: this.pid,
            goods_id: this.goods_id,
            goods_no: this.activeGoodNo,
          }
        });
      },
      // 是否自动播放
      isAutoPlay() {
        // 播放
        var type = this.baseData.goods_type;
        var is_payed = this.baseData.is_payed;
        var is_free = this.baseData.is_free;
        if (type == 1 && (is_payed == 1 || is_free == 1 || JSON.stringify(this.limitUse) != '{}')) {
          return true;
        } else {
          return false;
        }
      },
      // 更多操作
      moreOperate() {
        var _this = this;
        setTimeout(function () {
          if (!_this.moreOperateShow) {
            _this.moreFlag = true;
            _this.moreOperateShow = true;
          }
        }, 100);

      },
      hideMore() {
        if (this.moreFlag) {
          this.moreOperateShow = false;
        }
      },
      collectAdd(goods_type, goods_id) {
        this.$refs.recommendContent.collectAdd(goods_type, goods_id, 'present');
        this.albumBase.collect_id = 1;
      },
      collectCancel(goods_id) {
        this.$refs.recommendContent.collectCancel(goods_id, 'present');
        this.albumBase.collect_id = 0;
      },
      // 监听子组件
      collectAction(state) {
        this.albumBase.collect_id = state;
      }
    },

    beforeDestroy() {
      // 播放结束后销毁倒计时
      this.clearClock();
    },
    // created() {
    //   if (localStorage.getItem('isReload') && localStorage.getItem('isReload') == '1') {
    //     localStorage.setItem('isReload', '0');
    //   }
    // },
    created() {
      this.activeGoodNo = this.$route.query.goods_no;
      this.pid =
        this.$route.query.pid == "NaN" || this.$route.query.pid == null
          ? 0
          : this.$route.query.pid;
      this.goods_id = this.$route.query.goods_id;
      // 账号信息，是否登录
      this.isLogin = localStorage.getItem('loginState');

      this.wholeAlbum();
      this.albumData(this.pid, this.goods_id);
      this.commentCounter();
    },
    components: {
      'Recommend': recommend,
      'audioList': audioList,
    }
  }
</script>

<style lang="scss" src="@/style/scss/pages/album2.0/audio.scss" scoped>

</style>
