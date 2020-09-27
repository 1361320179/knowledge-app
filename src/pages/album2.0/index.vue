<template>
  <div id="albumIndex">
    <div class="nullBox" v-if="onsale == 0">
      <img src="./../../assets/null/product.png" width="100%"/>
      <div>该商品已下架~</div>
    </div>
    <div v-if="onsale == 1">
      <div class="listBox">
        <div class="filter"
             :style="{backgroundImage: 'url(' + baseData.pic[0] + ')',backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}"></div>
        <div class="shadow"></div>
        <div class="iconBox"></div>
        <div class="left">
          <div class="ratioBox">
            <div class="box">
              <img :src="baseData.pic[0]"/>
            </div>
          </div>
        </div>
        <div class="center">
          <h3 class="title">{{ baseData.title }}</h3>
          <div class="info">
            <div class="tag">
              <span class="count">{{ baseData.collection_num }}</span>收藏
            </div>
            <div class="tag">
              <span class="count">{{ baseData.play_num }}</span>播放
            </div>
            <div class="brand">
              <router-link
                :to="{name: 'brand', query: {brand_id: brandInfoData.brand_id}}"
                class="name"
              >
                <img :src="brandInfoData.header_pic" class="brandPic">
                <span class="brandText">{{ brandInfoData.name }}</span>
              </router-link>
            </div>
          </div>
        </div>
        <div
          class="collect"
          @click="collectAction('base', baseData.collect_id, baseData.goods_id)"
        >
          <van-tag round color="#fff" text-color="#999" v-if="baseData.collect_id > 0">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-collect-block"/>
            </svg>
            <span>
              已收藏
            </span>
          </van-tag>
          <van-tag round color="#fff" text-color="#f05654" v-else>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-collect-line"/>
            </svg>
            <span>
              收藏
            </span>
          </van-tag>
        </div>

      </div>

      <!--节目 - 介绍 - 评论 - 相似 -->
      <van-tabs v-model="tabModel" sticky animated @click="tabChange" class="detail">
        <van-tab v-for="(item, key) in tabData" :key="key">
          <template slot="title">{{item.title}}<sup class="commentNum" v-if="key == 2">{{ counter }}</sup></template>
          <template>
            <!--节目-->
            <van-list
              v-show="activeKey == 0"
              v-model="programLoading"
              :finished="programFinished"
              finished-text="没有更多了"
              @load="programLoad"
              ref="scrollList"
            >
              <!--回页面顶部-->
              <div class="toTop" @click="toTop" v-show="topIcon && (activeKey == 0)">
                <img src="./../../assets/album/to-top.png">
              </div>
              <div class="programContent">
                <div class="header">
                  <span class="total">共{{ programTotalCount }}集</span>
                  <template v-if="JSON.stringify(limitUse) != '{}'">
                    <span class="limited" v-if="limitInfo.exceedThree">{{limitUse.dead_str}}</span>
                    <span class="limited" v-else>剩余收听时间: {{countDown}}</span>
                  </template>
                  <template v-else>
                    <span class="bought" v-if="baseData.is_payed == 1">已购</span>
                    <span class="bought" v-if="baseData.is_free == 1">免费</span>
                  </template>
                  <!--暂时隐藏，有bug-->
                  <span class="play" v-if="false">
                      <div
                        class="tag"
                        v-if="allPlayStatus == 'play'"
                        @click="allAction"
                      >
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-zanting"/>
                          </svg>
                        全部播放
                      </div>
                      <div
                        class="tag"
                        v-if="allPlayStatus == 'pause'"
                        @click="allAction"
                      >
                          <!--<svg class="icon" aria-hidden="true">-->
                            <!--<use xlink:href="#icon-bofang"/>-->
                          <!--</svg>-->
                        <img class="bofang" src="./../../assets/album/bofang.png" alt="">
                        暂停播放
                      </div>
                      <div
                        class="tag"
                        v-if="allPlayStatus == 'continue'"
                        @click="allAction"
                      >
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-zanting"/>
                          </svg>
                        继续播放
                      </div>
                  </span>
                </div>
                <div class="content" v-for="(item, index) in programList" :key="index" @click="gotoDetail(item)">
                  <div class="left num">
                    <img
                      src="./../../assets/audio.svg"
                      width="22"
                      height="22"
                      alt
                      v-if="activeGoodNo == item.goods_no && audioPlaying"
                    />
                    <span v-else>{{ item.goods_no }}</span>
                  </div>
                  <div class="center">
                    <div class="flexBox">
                      <div class="label" v-if="JSON.stringify(limitUse) != '{}'">限免</div>
                      <template v-else>
                        <div class="label" v-if="item.goods_type == 1 && item.is_free == 1 && baseData.is_payed == 0 && baseData.is_free == 0">试听</div>
                        <div class="label" v-if="item.goods_type == 2 && item.is_free == 1 && baseData.is_payed == 0 && baseData.is_free == 0">试看</div>
                      </template>
                      <div class="carousel" v-if="activeGoodNo == item.goods_no && audioPlaying">
                        <span class="title">{{ item.title }}</span>
                      </div>
                      <div class="title" v-else>{{ item.title }}</div>
                    </div>
                    <!--不是文章，显示时间-->
                    <div class="time" v-if="item.goods_type != 6">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-time-line"/>
                      </svg>
                      <span class="text">{{ item.duration }}</span>
                    </div>
                  </div>
                  <!--视频显示图标-->
                  <div class="right" v-if="item.goods_type == 2">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shibo"/>
                    </svg>
                  </div>
                </div>
              </div>
            </van-list>
            <!-- 介绍 -->
            <div class="infoContent" v-show="activeKey == 1">
              <div
                v-html="baseData.desc"
                style="background-color: #fff;padding: 20px 15px;"
              >{{ baseData.desc }}
              </div>
            </div>
            <!--评论-->
            <div class="commentContent" v-show="activeKey == 2">
              <div class="addComment" @click="editComment">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-pinglun"/>
                </svg>
                <span class="text">赶快发表你的评论吧~</span>
              </div>
              <!--<div class="pic" v-if="discussData.length == 0">-->
              <!--<div class="pic" v-if="false">-->
                <!--<img src="./../../assets/album/no-comment.png">-->
                <!--<p class="text">来做第一个评论的人吧~</p>-->
              <!--</div>-->

              <van-list
                v-model="commentLoading"
                :finished="commentFinished"
                finished-text="没有更多了"
                @load="commentLoad"
              >
                <div class="commentList">
                  <div class="commentItem" v-for="(item, index) in discussData" :key="index">
                    <div class="photo">
                      <img :src="item.user_header">
                    </div>
                    <div class="content">
                      <p class="nickname">{{ item.nick_name }}</p>
                      <p class="comment">{{ item.content }}</p>
                      <div class="info">
                        <span class="time">{{ item.str_date }}</span>
                        <span class="up">
                         <svg class="icon" aria-hidden="true" v-if="item.is_like == 0" @click="upComment(item, index)">
                            <use xlink:href="#icon-zan"/>
                          </svg>
                          <svg class="icon icon-dianzan" aria-hidden="true" v-else @click="cancelUpComment(item, index)">
                            <use xlink:href="#icon-dianzan"/>
                          </svg>
                        <span v-if="item.praise_num != 0">{{ item.praise_num }}</span>
                      </span>
                        <span class="down">
                         <svg class="icon" aria-hidden="true" v-if="item.is_dislike == 0" @click="downComment(item, index)">
                           <use xlink:href="#icon-fandui"/>
                         </svg>
                         <svg class="icon icon-diancai" aria-hidden="true" v-else @click="cancelDownComment(item, index)">
                           <use xlink:href="#icon-fandui1"/>
                         </svg>
                        <span v-if="item.dislike_num != 0">{{ item.dislike_num }}</span>
                      </span>
                      </div>
                    </div>
                  </div>

                </div>
              </van-list>

              <van-popup class="commentPopup" v-model="commentShow" position="bottom">
                <span class="cancel" @click="cancelComment">取消</span>
                <span class="btn" @click="publicComment">发表</span>
                <van-field
                  v-model="contentModel"
                  rows="4"
                  autofocus="true"
                  type="textarea"
                  placeholder=""
                />
              </van-popup>
              <van-popup v-model="informLoginShow" class="informBox">
                <p class="title">提示</p>
                <p class="inform">登录后才可以发表评论哦</p>
                <div class="btn_wrapper">
                  <span class="cancel" @click="cancelLogin">取消</span>
                  <span class="confirm" @click="goToLogin">去登录</span>
                </div>
              </van-popup>
              <van-popup v-model="informBuyShow" class="informBox">
                <p class="title">提示</p>
                <p class="inform">购买专辑后才可以发表评论哦</p>
                <div class="btn_wrapper">
                  <span class="cancel" @click="cancelBuy">取消</span>
                  <span class="confirm" @click="goToBuy">立即购买</span>
                </div>
              </van-popup>

            </div>

            <!--相似-->
            <van-list
              v-show="activeKey == 3"
              v-model="recommendLoading"
              :finished="recommendFinished"
              finished-text="没有更多了"
              @load="recommendLoad"
            >
              <div class="huoba-album-list-two">
                <div v-for="item in recommendList" :key="item.goods_id">
                  <div class="huoba-album-item" v-if="item.goods_type==9" @click="recommendDetail(item)">
                    <div class="huoba-album-item-pic-box">
                      <img :src="item.pic[0]" class="huoba-album-item-pic">
                      <div class="icon-one-box">
                        <svg class="icon icon-one" aria-hidden="true">
                          <use xlink:href="#icon-sound-line"/>
                        </svg>
                      </div>
                    </div>
                    <div class="huoba-album-item-content">
                      <div class="huoba-album-item-des" v-text="item.title"></div>
                      <div class="huoba-album-item-total end">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-albumgoods-line"/>
                        </svg>
                        <span class="total-text">共{{item.item_count}}集</span>
                        <!--<svg class="icon ellipsis-line" aria-hidden="true">-->
                        <!--<use xlink:href="#icon-ellipsis-line"/>-->
                        <!--</svg>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </van-list>
          </template>
        </van-tab>
      </van-tabs>

      <!-- 音频缩略 -->
      <miniAudio
        :class="{isShow: myAudioData.src}"
        :audioData="myAudioData"
        :rank="rankType"

        :loginStatus="isLogin"
        :showBuyButton="showBuyButton"
        :baseData="baseData"
        ref="control"
        @setType="typeAction"
        @setMiniAudio="miniAudioData"
        @setProgress="audioProgressData"
        @showAudioList="audioListShow"
        @linkToPlayer="gotoPlayer"
        @getAllProgram="getAllProgramData"
      ></miniAudio>

      <!-- 播放列表 -->
      <audioList
        :goodsId="baseData.goods_id"
        :albumInfo="baseData"
        :goodsNo="activeGoodNo"
        :audioStatus="audioPlaying"
        @programChange="audioAction"
        @progressListData="progressListData"
        ref="controlList"
      ></audioList>
      <div class="buy" v-if="(baseData.is_free == 0 && baseData.is_payed == 0) && (activeKey == 0 || activeKey == 1)">
        <div class="getCoupon" @click="showCoupon" v-if="Object.keys(couponInfo.ticket).length>0">
          <span class="text-one" v-if="isReceived">已领券</span>
          <span class="text-one" v-else>领券</span>
          <span class="text-two" v-for="(item,index) in couponInfo.ticket.list" :key="index">{{item}}</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line"/>
          </svg>
        </div>
        <div class="bottom-btn" v-if="preListen.length > 0">
          <div class="left" @click="preListenAction">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shiting"/>
            </svg>
            <span v-if="preListen[0].goods_type == 1">试听</span>
            <span v-if="preListen[0].goods_type == 2">试看</span>
          </div>
          <div class="right" v-if="baseData.single_activity_id" @click="buyAction(baseData.goods_id)">
            <span class="discount">限时促销价:￥{{baseData.price}}</span>
            <span class="origin">原价:￥{{baseData.market_price}}</span>
          </div>
          <div class="right" v-if="JSON.stringify(recommendTicket) != '{}'" @click="buyAction(baseData.goods_id)">
            <span class="discount">券后价:￥{{recommendTicket.after_use_ticket_money}}</span>
            <span class="origin">原价:￥{{baseData.market_price}}</span>
          </div>
          <div class="right" v-if="!baseData.single_activity_id && JSON.stringify(recommendTicket) == '{}'"
               @click="buyAction(baseData.goods_id)">
            <span class="discount">购买专辑:￥{{baseData.market_price}}</span>
          </div>
        </div>
        <div class="bottom-btn" v-else>
          <div class="single" v-if="baseData.single_activity_id" @click="buyAction(baseData.goods_id)">
            <span class="discount">限时促销价:￥{{baseData.price}}</span>
            <span class="origin">原价:￥{{baseData.market_price}}</span>
          </div>
          <div class="single" v-if="JSON.stringify(recommendTicket) != '{}'" @click="buyAction(baseData.goods_id)">
            <span class="discount">券后价:￥{{recommendTicket.after_use_ticket_money}}</span>
            <span class="origin">原价:￥{{baseData.market_price}}</span>
          </div>
          <div class="single" v-if="!baseData.single_activity_id && JSON.stringify(recommendTicket) == '{}'"
               @click="buyAction(baseData.goods_id)">
            <span class="discount">购买专辑:￥{{baseData.market_price}}</span>
          </div>
        </div>
      </div>
      <!-- 领取优惠券 -->
      <van-popup class="couponPopup" v-model="couponModel" position="bottom" style="max-height:65%;min-height:65%;">
        <div class="header">
          <span class="catalogWord">可用优惠券（满足条件后可用于当前商品）</span>
          <span>
            <svg class="icon" aria-hidden="true" @click="closePopup">
              <use xlink:href="#icon-close-line"/>
            </svg>
          </span>
        </div>
        <div class="content">
          <div
            style="margin-top:10px;overflow:hidden;border-radius:0 6px 6px 0;box-shadow:0 0 10px rgba(0,0,0,0.06);"
            v-for="(item,index) in couponList"
            :key="index"
          >
            <!-- 可领取 -->
            <div class="toUse" v-if="item.state == 1 || item.state == 3">
              <div class="left"></div>
              <div class="mid">
                <div>
                  ￥
                  <span class="price">{{item.money}}</span>
                </div>
                <div class="condition">{{item.use_time_desc}}</div>
                <span class="circle top"></span>
                <span class="circle bottom"></span>
              </div>
              <div class="right">
                <div>
                  <span class="shopCoupon">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-coupon-block"/>
                    </svg>
                    <span class="dianpu" v-if="item.brand_id">店铺券</span>
                    <span class="dianpu" v-else>平台券</span>
                  </span>
                  <span class="shop">{{item.brand_name}}</span>
                </div>
                <div class="desc">
                  {{item.use_range_desc}}
                  <span
                    class="toMall btn red"
                    v-if="item.state == 1 && requestState"
                    @click="receive(item,index)"
                  >点击领取</span>
                  <span class="toMall btn red" v-if="item.state == 1 && !requestState">点击领取</span>
                  <span class="toMall btn" v-if="item.state == 3" @click="toResult(item,index)">可用商品</span>
                </div>
                <div class="time">
                  <span
                    v-if="item.state == 3"
                  >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</span>
                  <span v-else>
                    <span v-if="item.use_time_type == 2">领取后{{item.use_time_day}}天有效</span>
                    <span
                      v-else
                    >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</span>
                  </span>
                </div>
                <span class="used" v-if="item.state == 3">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yilingqu"/>
                  </svg>
                </span>
              </div>
            </div>
            <!-- 已领完 -->
            <div class="toUse overdue" v-if="item.state == 2">
              <div class="left"></div>
              <div class="mid">
                <div>
                  ￥
                  <span class="price">{{item.money}}</span>
                </div>
                <div class="condition">{{item.use_time_desc}}</div>
                <span class="circle top"></span>
                <span class="circle bottom"></span>
              </div>
              <div class="right">
                <div>
                  <span class="shopCoupon">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-coupon-block"/>
                    </svg>
                    <span class="dianpu" v-if="item.brand_id">店铺券</span>
                    <span class="dianpu" v-else>平台券</span>
                  </span>
                  <span class="shop">{{item.brand_name}}</span>
                </div>
                <div class="desc">{{item.use_range_desc}}</div>
                <span class="used">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-received-line"/>
                  </svg>
                </span>
                <div class="time" v-if="item.use_time_type == 2">领取后{{item.use_time_day}}天有效</div>
                <div
                  class="time"
                  v-else
                >
                  {{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
    <EazyNav type="brand" ref="nav" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<script>
  // aes加密解密
  import CryptoJS from "crypto-js/crypto-js";

  import miniAudio from "./../../components/miniAudio";
  import audioList from "./../../pages/album2.0/components/list";
  //  引入接口
  import {ALBUM, ALBUM_DETAIL} from "@/apis/album.js";
  import {GOODS_TICKET_GETS, TICKET_LINK} from "@/apis/coupon.js";
  import {
    COLLECT_ADD,
    COLLECT_CANCEL,
    FOCUS_ADD,
    FOCUS_CANCEL,
    COMMENT,
    COMMENT_ADD,
    COMMENT_PRAISE,
    COMMENT_DISLIKE,
    COMMENT_COUNTER,
    RECOMMEND
  } from "@/apis/public.js";

  export default {
    data() {
      return {
        topIcon: false,
        // 判断是否第一次调取
        ifFirst: 0,
        showBuyButton: true,
        isLogin: null,
        onsale: null,
        tabModel: 0,
        activeKey: 0,
        /*
       * ----------------------------------音频控件----------------------------------
       */
        // 播放路径
        playUrl: '',
        /*
        * ----------------------------------限时免费----------------------------------
        */
        limitUse: {},
        limitInfo: {},
        countDown: '',
        /*
         * ----------------------------------介绍----------------------------------
         */
        // 基础信息
        baseData: {
          title: "",
          sub_title: "",
          pic: [],
          goods_type: null,
          collection_num: 0,
          play_num: 0,
          collect_id: null,
          goods_id: null
        },
        // 所属媒体信息
        brandInfoData: {
          brand_id: "",
          header_pic: "",
          name: "",
          fans: 0,
          is_followed: null
        },
        // 选项卡
        tabData: [
          {
            title: "节目"
          },
          {
            title: "介绍"
          },
          {
            title: "评论"
          },
          {
            title: "相似"
          }
        ],
        /*
        * ----------------------------------节目----------------------------------
        */
        // 分页
        // showHistory: true,
        programList: [],
        programPage: 1,
        // 分页
        programLoading: false,
        programFinished: false,
        // 节目总数
        programTotalCount: 0,
        // 迷你音频当前节目信息
        myAudioData: {},
        // 存放当前播放音频key值
        activeGoodNo: null,
        // 存放当前播放器播放状态
        audioPlaying: false,
        // 排序
        rankType: 1, // 默认0倒序, 1正序
        // 记录节目播放进度
        progressList: [],
        /*
        * --------------------------------评论--------------------------------
        */
        commentShow: false,
        informLoginShow: false, // 登录提示
        informBuyShow: false, // 购买提示
        // 分页
        commentLoading: false,
        commentFinished: false,
        // 评论
        discussData: [],
        commentPage: 1,
        totalCount: "评论 (" + 0 + ")",
        contentModel: '', // 评论内容
        counter: '',
        /*
        * --------------------------------相似--------------------------------
        */
        recommendList: [],
        recommendPage: 1,
        // 分页
        recommendLoading: false,
        recommendFinished: false,
        // 存放相似状态
        simularStatus: [],
        /*
         * --------------------------------播放列表--------------------------------
         */
        // 试听数据，存放goods_no为1的数据
        preListen: [],
        // 存放不包含文章类型全部播放所有节目
        allProgramList: [],
        // 判断是否需要自动播放
        autoPlay: true,
        // 全部播放状态
        allPlayStatus: "play",
        /*
       * -------------------------------商品活动及购买------------------------------
       */
        couponInfo: null,
        recommendTicket: null,
        couponList: [],
        couponModel: false,
        isReceived: false,
        requestState: true,
        // groupModel: false,
        // remain_time: [],
      }
    },
    methods: {
      // 进入详情
      gotoDetail(item) {
        var _name;
        if (item.goods_type == 1) {
          _name = "albumAudio";
        } else if (item.goods_type == 2) {
          _name = "albumVideo";
        } else if (item.goods_type == 6) {
          _name = "article";
        }
        this.$router.push({
          name: _name,
          query: {
            pid: this.baseData.goods_id,
            goods_id: item.goods_id,
            goods_no: item.goods_no,
            // title: item.title
          }
        });
      },

      // --------------------------------限时免费----------------------------------
      handleTime() {
        console.log('handleTime');
        let time = this.limitUse.dead_time;
        // let time = 10;
        if (time/3600 > 72) {
          this.limitInfo.exceedThree = true;
        } else {
          clearInterval(this.timer);
          this.limitInfo.exceedThree = false;
          let formatTime = this.$formatTime(time);
          this.countDown = formatTime;

          // 处理倒计时
           this.timer = setInterval(() => {
            if (time > 0) {
              time--;
              let formatTime = this.$formatTime(time);
              this.countDown = formatTime;
              // console.log('1',this.countDown);
            } else {
              window.location.reload();
            }
          }, 1000);
        }
      },
      // --------------------------------专辑信息----------------------------------
      // 获取整个专辑信息
      async wholeAlbum() {
        var tStamp = this.$getTimeStamp();
        let data = {
          ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
          timestamp: tStamp,
          goods_id: this.baseData.goods_id,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM(data);
        if (res.hasOwnProperty("response_code")) {
          //专辑基础信息
          this.baseData = res.response_data.base;
          // console.log(this.baseData);
          // 所属媒体信息
          this.brandInfoData = res.response_data.brand_info;
          // title
          document.title = "节目详情-" + res.response_data.base.title;
          // 优惠券
          this.couponInfo = res.response_data.activity;
          // 推荐用券
          this.recommendTicket = res.response_data.recommend_ticket;
          // 限时免费
          this.limitUse = res.response_data.activity.limituse;
          this.onsale = 1;

          // 处理限时免费时间
          if (JSON.stringify(this.limitUse) != '{}' && this.limitUse.dead_time > 0) {
            this.handleTime();
          }
        } else {
          if (res.hasOwnProperty("error_code") && res.error_code == 401) {
            // 上下架状态, 1=> 在架, 0=> 下架
            this.onsale = 0;
          }
          // this.$toast(res.error_message);
        }
        // // console.log('专辑基础信息:', res.response_data);
        // 读取localStorage音频缩略播放器数据
        this.getMiniAudioData();
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
          // 音视频秘钥
          let play_url = res.response_data.base.play_url;
          let play_key = res.response_data.base.play_key;
          // console.log(play_url);
          // console.log(play_key);
          this.playUrl = this.$aesDecrypt(play_url, play_key);
          console.log('playurl',this.playUrl);

          // console.log(this.$aesDecrypt(play_url, play_key));

          // if (Hls.isSupported()) {
          //   var musicPlayer = document.getElementById('musicPlayer');
          //   var myhls = new Hls();
          //   var _this = this;
          //   myhls.loadSource(path);
          //   myhls.attachMedia(musicPlayer);
          //   myhls.on(Hls.Events.MANIFEST_PARSED, function () {
          //     var u = navigator.userAgent;
          //     var _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          //     if (_this.isAutoPlay() && !_ios) {
          //       _this.playAudio();
          //     }
          //   });
          // }

        } else {
          this.$toast(res.error_message);
        }
      },
      // tab切换
      tabChange(index, title) {
        this.activeKey = index;
        // console.log('activeKey',this.activeKey);
      },

      // 获取收藏接口信息
      collectAction(__type, __collectId, __goodsId) {
        if (__collectId > 0) {
          this.collectData(__type, "cancel", __goodsId);
        } else {
          this.collectData(__type, "collect", __goodsId);
        }
      },
      async collectData(__type, __status, __goodsId) {
        var tStamp = this.$getTimeStamp();
        var data = {};
        var res;
        // 出错提示
        switch (__status) {
          case "collect":
            data = {
              timestamp: tStamp,
              type: this.baseData.goods_type,
              target: __goodsId,
              version: "1.0"
            };
            data.sign = this.$getSign(data);
            res = await COLLECT_ADD(data);
            if (res.hasOwnProperty("response_code")) {
              if (__type == "base") {
                this.baseData.collect_id = 1;
              } else {
                this.simularStatus[__type].is_collect = 1;
              }
            } else {
              this.$toast(res.error_message);
              if (res.hasOwnProperty("error_code") && res.error_code == 100) {
                this.$router.push({name: "login", params: {}});
              }
            }
            this.baseData.collection_num++;
            break;
          case "cancel":
            data = {
              timestamp: tStamp,
              goods_id: __goodsId,
              version: "1.0"
            };
            data.sign = this.$getSign(data);
            res = await COLLECT_CANCEL(data);
            if (res.hasOwnProperty("response_code")) {
              if (__type == "base") {
                this.baseData.collect_id = 0;
              } else {
                this.simularStatus[__type].is_collect = 0;
              }
            } else {
              this.$toast(res.error_message);
              if (res.hasOwnProperty("error_code") && res.error_code == 100) {
                this.$router.push({name: "login", params: {}});
              }
            }
            this.baseData.collection_num--;
            break;
        }
      },

      // ----------------------------------节目------------------------------------
      // 获取试听节目
      async preListenData() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: this.baseData.goods_id,
          goods_no: this.rankType,
          page: 1,
          page_size: 10000000,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM_DETAIL(data);
        if (res.hasOwnProperty("response_code")) {
          this.ifFirst++;
          // 异步更新数据
          var result = res.response_data.result;
          for (let i = 0; i < res.response_data.result.length; i++) {
            // 存放试听数据,只取第一条
            if (
              result[i].is_free &&
              result[i].goods_type != 6 &&
              this.preListen.length == 0
            ) {
              this.preListen = [];
              this.preListen.push(result[i]);
            }
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      // 获取节目列表
      async programData(_type) {
        // console.log(this.programPage);
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: this.baseData.goods_id,
          goods_no: this.rankType,
          page: this.programPage,
          page_size: 10,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM_DETAIL(data);
        if (res.hasOwnProperty("response_code")) {
          if (_type == "rank") this.programList = [];
          // 异步更新数据
          var result = res.response_data.result;
          // console.log('result', result);
          setTimeout(() => {
            // this.programList = [];
            for (let i = 0; i < res.response_data.result.length; i++) {
              this.programList.push(result[i]);
            }
            // localStorage:audioProgress存放节目播放进度,根据pid创建数组，并存放至localStorage
            // this.progressListData();
            // 设置迷你缩略音频播放信息
            // this.getMiniAudioData();
            // 加载状态结束
            this.programLoading = false;
            this.programPage++;
            // 数据全部加载完成
            if (this.programPage > res.response_data.total_page) {
              this.programFinished = true;
            }
          }, 600);
          // 设置总节目数
          this.programTotalCount = res.response_data.total_count;
        } else {
          this.$toast(res.error_message);
        }
      },
      async allProgramData(info, actionType) {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: this.baseData.goods_id,
          goods_no: this.rankType,
          page_size: 1000000000000000,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM_DETAIL(data);
        // 存储当前节目的下一项
        var next;
        this.allProgramList = [];
        if (res.hasOwnProperty("response_code")) {
          var type1 = 0;
          var type2 = 0;
          var type3 = 0;
          // 异步更新数据
          var result = res.response_data.result;
          for (let i = 0; i < res.response_data.result.length; i++) {
            var type = result[i].goods_type;
            if (type == 1) type1 = 1;
            if (type == 2) type2 = 1;
            if (type == 6) type3 = 1;
            // 不包含文章类型
            // if (result[i].goods_type != 6) {
            this.allProgramList.push(result[i]);
            // }
            if (
              info != null &&
              info.length > 0 &&
              result[i].goods_no == info[0]
            ) {
              next = i + 1;
            }
          }
          // 专辑is_payed:0未支付；1已支付，is_freeL:0不免费，1免费，未支付不能自动播放
          if (
            eval(type1 + type2 + type3) > 1 ||
            (this.baseData.is_free == 0 &&
              this.baseData.is_payed == 0 &&
              this.baseData.sale_style == 1 &&
              JSON.stringify(this.limitUse) == '{}')
          ) {
            this.autoPlay = false;
          } else {
            this.autoPlay = true;
          }
          var count = this.allProgramList.length;
          next = next > count - 1 ? 0 : next;
          // 当点击全部播放，从第一条开始播放
          if (actionType == "all") next = 0;

          // 获取节目播放秘钥
          this.albumData(this.baseData.goods_id, this.allProgramList[next].goods_id);

          // // 当收费方式非专辑收费为单个节目收费时，跳转到需要收费的单个节目的支付页面
          // if (
          //   this.allProgramList[next].is_payed == 0 &&
          //   this.allProgramList[next].is_free == 0
          // ) {
          //   this.$router.push({
          //     name: "payaccount",
          //     query: {pid: parseInt(this.allProgramList[next].goods_id), goods_id: this.baseData.goods_id}
          //   });
          //   console.log('第一次跳转购买')
          //   return;
          // }
          // // 当第一条是视频或者是文章时，跳转到对应详情
          // if (this.allProgramList[next].goods_type == 6) {
          //   this.$router.push({
          //     name: "article",
          //     query: {
          //       pid: parseInt(this.$route.query.goods_id),
          //       goods_id: parseInt(this.allProgramList[next].goods_id)
          //     }
          //   });
          //   return;
          // }
          // if (this.allProgramList[next].goods_type == 2) {
          //   this.$router.push({
          //     name: "albumdetail",
          //     query: {
          //       pid: parseInt(this.$route.query.goods_id),
          //       goods_id: parseInt(this.allProgramList[next].goods_id)
          //     }
          //   });
          //   return;
          // }
        } else {
          this.$toast(res.error_message);
          return;
        }
        this.allPlayStatus = "pause";
        if (this.autoPlay) {
          // 单一类型，自动播放
          this.updateLocalStorage(this.allProgramList[next]);
          // console.log("当前播放的下一项：", this.allProgramList[next]);
          // console.log("单一类型，自动播放");
        } else {
          this.$refs.control.pauseAudio();
          this.allPlayStatus = "play";
          // 含多种类型，不自动播放
          this.$toast("含多种类型或者专辑未支付，不自动播放");
        }
      },
      // 更新localStorage数据
      updateLocalStorage(item) {
        var info = JSON.parse(localStorage.getItem("miniAudio"));
        if (info == null) info = [];
        info[0] = item.goods_no;
        info[1] = this.baseData.goods_id;
        info[2] = item.pic;
        // info[3] = item.file_path;
        info[3] = '';
        info[4] = item.duration;
        info[5] = 0;
        info[6] = item.title;
        info[7] = this.baseData.title;
        info[8] = item.goods_id;
        info[9] = this.baseData.pic[0];
        this.activeGoodNo = info[0];
        localStorage.setItem("miniAudio", JSON.stringify(info));
        // 更新播放器当前播放音频
        this.miniAudioData(info);
        setTimeout(() => {
          this.$refs.control.playAudio(0);
        }, 600);
      },

      // load
      programLoad() {
        // console.log("节目");
        this.programData("");
        // 获取试听节目
        if (this.ifFirst == 0) {
          this.preListenData();
        }
      },

      // 节目列表播放/暂停音频
      audioAction(item) {
        // 视频跳转到节目详情页
        // if (item.goods_type == 2) {
        //   this.$router.push({
        //     name: "albumdetail",
        //     query: {
        //       pid: this.baseData.goods_id,
        //       goods_id: item.goods_id,
        //       goods_no: item.goods_no
        //     }
        //   });
        //   return;
        // }
        // console.log(item);
        // 未支付
        if (item.goods_id != null && item.is_payed == 0 && item.is_free == 0) {
          // var _goodsId = null;
          if (this.baseData.sale_style == 1) {
            this.$router.push({
              name: "payaccount",
              query: {goods_id: this.baseData.goods_id}
            });
          } else {
            this.$router.push({
              name: "payaccount",
              query: {goods_id: this.baseData.goods_id, pid: item.goods_id}
            });
          }

          // console.log('第二次跳转购买')
          return;
        }
        // 获取节目播放秘钥
        this.albumData(this.baseData.goods_id, item.goods_id);

        $("#miniAudio").css("display", "block");
        let __goodsNo = item.goods_no;
        let __pid = this.baseData.goods_id ? this.baseData.goods_id : 0;
        let __pic = item.pic;
        // let __src = item.file_path;
        let __src = '';
        let __duration = item.duration;
        // 获取当前节目播放进度
        // ??????????????????????
        let __currentTime = this.getAudioProgress(item);
        let __program = item.title;
        let __album = this.baseData.title;
        let __goodsId = item.goods_id;
        let __albumPic = this.baseData.pic[0];
        // console.log( this.baseData)
        // 判断是否点击当前或者第一次点击
        if (this.activeGoodNo == __goodsNo || this.activeGoodNo == null) {
          this.audioPlaying = !this.audioPlaying;
        } else {
          this.audioPlaying = true;
        }
        // 父页面关联子组件
        setTimeout(() => {
          if (this.audioPlaying) {
            this.$refs.control.playAudio(__currentTime);
            // 设置全部播放状态
            this.allPlayStatus = "pause";
          } else {
            this.$refs.control.pauseAudio();
            this.allPlayStatus = "continue";
          }
        }, 600);
        // console.log(__currentTime)
        // 管理子组件播放状态
        this.activeGoodNo = __goodsNo;
        // 解决子组件数据实时刷新问题
        this.$refs.control.audioData.type = !this.audioPlaying;
        // 将当前音频播放信息存放到localStorage: miniAudio
        var info = [
          __goodsNo,
          __pid,
          __pic,
          __src,
          __duration,
          __currentTime,
          __program,
          __album,
          __goodsId,
          __albumPic
        ];
        this.miniAudioData(info);
      },
      // 点击播放，子组件关联父页面 - 切换miniAudio组件播放状态
      typeAction(__type) {
        /*
         * __type == true; 播放
         * __type == false; 暂停
         */
        // 关联节目列表播放状态
        this.myAudioData.type = __type;
        this.audioPlaying = !__type;
      },
      // 将当前音频播放信息存放到localStorage: miniAudio
      miniAudioData(info) {
        // console.log(1111111)
        /*
         * __goodsNo节目编号
         * __pid当前节目对应专辑id，单个节目时pid为0
         * __pic专辑封面
         * __src音频地址
         * __duration音频时长，单位s
         * __currentTime音频当前播放位置，单位s
         * __program节目标题
         * __album专辑标题
         * __goodsId商品id
         * __albumPic专辑图片，无专辑为null
         */
        if (info != null && info.length > 0) {
          let __goodsNo = info[0];
          let __pid = info[1];
          let __pic = info[2];
          let __src = info[3];
          let __duration = info[4];
          let __currentTime = info[5];
          let __program = info[6];
          let __album = info[7];
          let __goodsId = info[8];
          let __albumPic = info[9];
          // 设置音频信息
          this.$set(this.myAudioData, "goodsNo", __goodsNo);
          this.$set(this.myAudioData, "pid", __pid);
          this.$set(this.myAudioData, "pic", __pic);
          this.$set(this.myAudioData, "src", this.playUrl);
          this.$set(this.myAudioData, "duration", __duration);
          this.$set(this.myAudioData, "currentTime", __currentTime);
          this.$set(this.myAudioData, "program", __program);
          this.$set(this.myAudioData, "album", __album);
          this.$set(this.myAudioData, "goodsId", __goodsId);
          this.$set(this.myAudioData, "albumPic", __albumPic);

          // localStorage存储
          localStorage.setItem("miniAudio", JSON.stringify(info));
          // 解决父页面子组件实时刷新问题
          setTimeout(() => {
            if (this.$refs.control) {
              this.$refs.control.audioData.pic = __pic;
              this.$refs.control.audioData.src = this.playUrl;
              this.$refs.control.audioData.currentTime = __currentTime;
              this.$refs.control.audioData.duration = __duration;
              this.$refs.control.audioData.program = __program;
              this.$refs.control.audioData.album = __album;
              this.$refs.control.audioData.albumPic = __albumPic;
            }
          }, 600);
          // if (info[3] == null) {
          //   $("#miniAudio").css("display", "none");
          // } else {
          //   $("#miniAudio").css("display", "block");
          // }
        }
      },
      // 将当前专辑节目列表播放进度信息存放到localStorage
      audioProgressData(result) {
        /*
         * __goodsId专辑id
         * __goodsNo节目编号
         * __progress节目当前播放进度
         * __duration节目时长，单位s
         * __pid专辑id，单个节目pid默认为0
         */
        // localStorage存储
        localStorage.setItem("audioProgress", JSON.stringify(result));
        this.progressListData();
        this.$refs.controlList.progressListData();
      },
      gotoPlayer(queryData) {
        // this.$router.push({ name: "player", query: { isLogin: this.isLogin } });
      },
      // 当前节目播放结束，获取当前播放节目的专辑下所有节目（不分页）
      getAllProgramData(info) {
        this.allProgramData(info, "end");
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
      getMiniAudioData() {
        // 设置迷你音频信息
        var info = JSON.parse(localStorage.getItem("miniAudio"));
        // 解决子组件数据实时刷新问题
        if (this.$refs.control)
          this.$refs.control.audioData.type = !this.audioPlaying;
        if (info != null && info.length != 0) {
          // 当前goods_id与localStorage一致时,关联播放列表当前播放状态
          for (let i = 0; i < this.programList.length; i++) {
            var list = this.programList[i];
            if (list.goods_id == info[8]) {
              this.activeGoodNo = info[0];
            }
          }
          // 将当前音频播放信息存放到localStorage: miniAudio
          this.miniAudioData(info);
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
      // --------------------------------播放列表----------------------------------
      audioListShow(__type) {
        this.$refs.controlList.popupModel = true;
        // 关联播放列表
        this.$refs.controlList.goodsNo = this.activeGoodNo;
      },
      // 全部播放
      allAction() {
        // console.log('click');
        if (this.baseData.is_free == 0 && this.baseData.is_payed == 0 && JSON.stringify(this.limitUse) == '{}') {
          this.$toast("专辑收费~");
          return;
        }
        // 全部播放
        if (this.allPlayStatus == "play") {
          // console.log('全部播放');
          var info = JSON.parse(localStorage.getItem("miniAudio"));
          // 从第一条开始播放，是否自动播放规则同上
          this.allProgramData(info, "all");
          // setTimeout(() => {
          //   console.log('timeout');
          //   this.$refs.control.playAudio(null);
          // }, 15000)
        }
        // 暂停播放
        else if (this.allPlayStatus == "pause") {
          this.allPlayStatus = "continue";
          this.$refs.control.pauseAudio();
        }
        // 继续播放
        else {
          this.allPlayStatus = "pause";
          this.$refs.control.playAudio(null);
        }
        $("#miniAudio").css("display", "block");
      },
      // 点击试听
      preListenAction() {
        if (this.preListen != null && this.preListen.length > 0) {
          this.gotoDetail(this.preListen[0]);
        } else {
          this.$toast("无试听节目~");
        }
      },
      // ----------------------------------评论------------------------------------
      async commentCounter() {
        let data = {
          goods_id: this.baseData.goods_id,
          version: "1.0"
        };
        let res = await COMMENT_COUNTER(data);
        if (res.hasOwnProperty("response_code")) {
          // console.log('counter', res);
          this.counter = res.response_data.counter;
        }
      },

      editComment() {
        // 未登录跳转至登录页
        if (this.isLogin == 0) {  // 未登录
          this.informLoginShow = true;
        } else if (this.baseData.is_payed == 0 && this.baseData.is_free == 0 && JSON.stringify(this.limitUse) == '{}') { //  不免费且未购买 + 不限免
          this.informBuyShow = true;
        } else {
          this.commentShow = true;
        }
      },
      cancelComment() {
        this.commentShow = false;
      },
      cancelLogin() {
        this.informLoginShow = false;
      },
      cancelBuy() {
        this.informBuyShow = false;
      },
      goToLogin() {
        this.$router.push({name: 'login'});
      },
      goToBuy() {
        // 跳转购买
        this.$router.push({
          name: "payaccount",
          query: {goods_id: this.baseData.goods_id}
        });
      },
      commentLoad() {
        this.commentData();
      },
      async commentData() {
        var tStamp = this.$getTimeStamp();
        let data = {
          goods_id: this.baseData.goods_id,
          timestamp: tStamp,
          page: this.commentPage,
          page_size: 1000000000,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await COMMENT(data);

        if (res.hasOwnProperty("response_code")) {
          // 异步更新数据
          var result = res.response_data.result;
          // console.log('comment',result);
          setTimeout(() => {
            for (let i = 0; i < res.response_data.result.length; i++) {
              this.discussData.push(result[i]);
              // this.answerData.push(result[i].reply_list);
              // this.replyPage.push(1);
              // console.log('评论：', result[i]);
            }
            // 加载状态结束
            this.commentLoading = false;
            this.commentPage++;

            // 数据全部加载完成
            if (this.commentPage > res.response_data.total_page) {
              this.commentFinished = true;
              this.commentPage = 1;
            }
          }, 600);

          // 设置总评论数
          this.totalCount = "评论 (" + res.response_data.total_count + ")";
          // console.log("当前页数组：", this.replyPage);
          // console.log("评论列表：", result);
        } else {
          this.$toast(res.error_message);
        }
      },
      async addComment() {
        var tStamp = this.$getTimeStamp();
        var data =
          {
            timestamp: tStamp,
            goods_id: this.baseData.goods_id,
            content: this.contentModel,
            // goods_pid: this.$route.query.pid
            //   ? Number(this.$route.query.pid)
            //   : 0,
            version: "1.0"
          };
        data.sign = this.$getSign(data);
        let res = await COMMENT_ADD(data);
        if (res.hasOwnProperty("response_code")) {
          this.commentPage = 1;
          // 本地存储最新的数据，展示
          // this.answerData = [];
          this.discussData = [];
          // this.replyPage = [];
          this.contentModel = "";
          this.commentShow = false;
          this.commentData();
        } else {
          this.$toast(res.error_message);
        }
      },
      publicComment() {
        this.addComment();
      },
      upComment(item, index) {
        if (this.isLogin == 0) {
          this.informLoginShow = true;
        } else {
          this.commentUp(item, index, 'up');
        }
      },
      cancelUpComment(item, index) {
        if (this.isLogin == 0) {
          this.informLoginShow = true;
        } else {
          this.commentUp(item, index, 'cancelUp');
        }
      },
      // 评论 (取消)赞
      async commentUp(item, index, state) {
        var data = {};
        var tStamp = this.$getTimeStamp();
        if (state == 'up') {
          data =
            {
              timestamp: tStamp,
              comment_id: item.comment_id,
              version: "1.0"
            };
        } else if (state == 'cancelUp') {
          data =
            {
              timestamp: tStamp,
              comment_id: item.comment_id,
              type: 'CANCEL_LIKES',
              version: "1.0"
            };
        }
        let res = await COMMENT_PRAISE(data);
        if (res.hasOwnProperty("response_code")) {
          if (state == 'up' && this.discussData[index].is_dislike == 1) {
            this.discussData[index].is_like = 1;
            this.discussData[index].is_dislike = 0;
            this.discussData[index].praise_num += 1;
            this.discussData[index].dislike_num > 0 ? this.discussData[index].dislike_num -= 1 : 0;
          } else if (state == 'up' && this.discussData[index].is_dislike == 0) {
            this.discussData[index].is_like = 1;
            this.discussData[index].praise_num += 1;
          } else if (state == 'cancelUp') {
            this.discussData[index].is_like = 0;
            this.discussData[index].praise_num > 0 ? this.discussData[index].praise_num -= 1 : 0;
          }
        } else {
          // this.$toast(res.error_message);
        }
      },
      downComment(item, index) {
        if (this.isLogin == 0) {
          this.informLoginShow = true;
        } else {
          this.commentDown(item, index, 'down');
        }
      },
      cancelDownComment(item, index) {
        if (this.isLogin == 0) {
          this.informLoginShow = true;
        } else {
          this.commentDown(item, index, 'cancelDown');
        }
      },
      // 评论 (取消)踩
      async commentDown(item, index, state) {
        var data = {};
        var tStamp = this.$getTimeStamp();
        if (state == 'down') {
          data =
            {
              timestamp: tStamp,
              comment_id: item.comment_id,
              version: "1.0"
            };
        } else if (state == 'cancelDown') {
          data =
            {
              timestamp: tStamp,
              comment_id: item.comment_id,
              type: 'CANCEL_DISLIKE',
              version: "1.0"
            };
        }
        let res = await COMMENT_DISLIKE(data);
        if (res.hasOwnProperty("response_code")) {
          if (state == 'down' && this.discussData[index].is_like == 1) {
            this.discussData[index].is_dislike = 1;
            this.discussData[index].is_like = 0;
            this.discussData[index].dislike_num += 1;
            this.discussData[index].praise_num > 0 ? this.discussData[index].praise_num -= 1 : 0;
          } else if (state == 'down' && this.discussData[index].is_like == 0) {
            this.discussData[index].is_dislike = 1;
            this.discussData[index].dislike_num += 1;
          } else if (state == 'cancelDown') {
            this.discussData[index].is_dislike = 0;
            this.discussData[index].dislike_num > 0 ? this.discussData[index].dislike_num -= 1 : 0;
          }
        } else {
          // this.$toast(res.error_message);
        }
      },
      // ----------------------------------相似------------------------------------
      // load
      recommendLoad() {
        this.recommendData();
      },
      async recommendData() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: this.baseData.goods_id,
          page: this.recommendPage,
          page_size: 10,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await RECOMMEND(data);
        if (res.hasOwnProperty("response_code")) {
          // 异步更新数据
          var result = res.response_data.result;
          setTimeout(() => {
            for (let i = 0; i < res.response_data.result.length; i++) {
              this.recommendList.push(result[i]);
              // 存放相似收藏状态/临时数据
              this.simularStatus.push(result[i]);
            }
            // 加载状态结束
            this.recommendLoading = false;
            this.recommendPage++;
            // 数据全部加载完成
            if (this.recommendPage > res.response_data.total_page) {
              this.recommendFinished = true;
              this.recommendPage = 1;
            }
          }, 600);
        } else {
          this.$toast(res.error_message);
        }
      },
      recommendDetail(item) { // 查看推荐 专辑详情
        this.$router.push({name: 'album', query: {goods_id: item.goods_id}});
      },

      // ----------------------------------商品活动及购买------------------------------------
      // 优惠券
      showCoupon() {
        this.couponModel = true;
      },
      closePopup() {
        this.couponModel = false;
      },
      async getCouponList() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: this.baseData.goods_id,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await GOODS_TICKET_GETS(data);
        if (res.hasOwnProperty("response_code")) {
          // console.log(res);
          this.couponList = res.response_data;
          for (var i = 0; i < this.couponList.length; i++) {
            if (this.couponList[i].state == 3) {
              this.isReceived = true;
            }
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      // 领取优惠券
      receive(item, index) {
        if (this.isLogin == 0) {
          this.$router.push({name: "login", params: {}});
          this.$toast("用户未登录!");
        } else {
          this.ticketLink(item.ticket_id, index);
        }
      },
      async ticketLink(ticket_id, index) {
        this.requestState = false;
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
          this.$toast("领取成功！");
          this.requestState = true;
          this.couponList = this.couponList.map((value, key) => {
            if (key == index) {
              value.state = 3;
              value.use_stime = res.response_data.use_stime;
              value.use_etime = res.response_data.use_etime;
            }
            return value;
          });
          // 领取成功后刷新券后价
          // console.log('couponlist', this.couponList);
        } else {
          this.$toast(res.error_message);
          this.requestState = true;
        }
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
          this.$toast("已为您领取" + this.recommendTicket.money + "元优惠券");
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
            this.autoGetTicket(this.recommendTicket.ticket_id ,goodsId);
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
      // 处理页面滚动
      handleScroll() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 500) {
          this.topIcon = true;
        } else {
          this.topIcon = false;
        }
      },
      toTop() {
        window.scrollTo(0, 0);
      }
    },
    watch: {
      '$route' (to, from) {
        // console.log('to',to);
        // console.log('from',from);
        if (to.fullPath != from.fullPath) {
          window.location.reload();
        }
      }
    },
    mounted() {
      this.baseData.goods_id = parseInt(this.$route.query.goods_id);
      // 账号信息，是否登录
      this.isLogin = localStorage.getItem('loginState');
      // 当前页接口信息
      this.wholeAlbum();
      this.commentCounter();
      this.getCouponList();

      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    components: {
      miniAudio,
      audioList
    },
  }
</script>

<style lang="scss">
  #albumIndex {
    .van-tabs .van-tab.van-tab--active {
      color: #333;
      font-weight: bold;
    }
    .van-tabs.van-tabs--line .van-tabs__wrap {
      border-radius: 14px 14px 0 0;
    }
    .van-field__control {
      background: #F5F5F5;
    }
  }
</style>

<style lang="scss" src="@/style/scss/pages/album2.0/index.scss" scoped>

</style>
