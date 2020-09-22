<template>
  <div id="playList">
    <van-popup v-model="popupModel" position="bottom">
      <div class="header">
        <span class="title">节目列表</span>
        <span class="total">共{{ programTotalCount }}集</span>
        <svg class="icon closeIcon" aria-hidden="true" @click="closePopup">
          <use xlink:href="#icon-shanchu3"/>
        </svg>
      </div>
      <!--节目-->
      <van-list
        v-model="programLoading"
        :finished="programFinished"
        finished-text="没有更多了"
        @load="programLoad"
      >
        <div class="programContent">
          <div class="content" v-for="(item, index) in programList" :key="index" @click="chooseAction(item)">

            <div class="left num">
              <img
                src="./../../../assets/audio.svg"
                width="22"
                height="22"
                alt
                v-if="goodsNo == item.goods_no && audioStatus"
              />
              <span v-else>{{ item.goods_no }}</span>
            </div>
            <div class="center">
              <div class="flexBox">
                <div class="label" v-if="JSON.stringify(limitUse) != '{}'">限免</div>
                <template v-else>
                  <div class="label" v-if="item.goods_type == 1 && item.is_free == 1 && albumInfo.is_payed == 0 && albumInfo.is_free == 0">试听</div>
                  <div class="label" v-if="item.goods_type == 2 && item.is_free == 1 && albumInfo.is_payed == 0 && albumInfo.is_free == 0">试看</div>
                </template>
                <div class="carousel" v-if="goodsNo == item.goods_no && audioStatus">
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
    </van-popup>
  </div>
</template>

<script>
  //  引入接口
  import { ALBUM_DETAIL } from "@/apis/album.js";
  export default {
    data() {
      return {
        programTotalCount: null,
        programList: [],
        programPage: 1,
        // 分页
        programLoading: false,
        programFinished: false,
        popupModel: false,
        // 记录节目播放进度
        progressList: [],
        // 专辑标题
        title__: "",
        // 专辑头像
        albumPic__: ""
      }
    },
    methods: {
      programLoad() {
        // console.log('load');
        this.programData();
      },
      // 获取节目列表
      async programData() {
        var info = JSON.parse(localStorage.getItem("miniAudio"));
        var __goodsId = null;

        if (info != null && info.length > 0) {
          if (info[1] != null) {
            // 专辑pid
            __goodsId = parseInt(info[1]);
          }
          this.title__ = info[7];
          this.albumPic__ = info[9];
        }

        // console.log(info);
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          // 判断是否还有pid
          // goods_id: __goodsId,
          goods_id: this.goodsId,
          page: this.programPage,
          page_size: 10,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM_DETAIL(data);

        if (res.hasOwnProperty("response_code")) {
          // 异步更新数据
          var result = res.response_data.result;

          setTimeout(() => {
            for (let i = 0; i < res.response_data.result.length; i++) {
              result[i].sale_style = res.response_data.sale_style;
              this.programList.push(result[i]);
            }

            // 非文章节目根据good_id创建数组，并存放至localStorage
            this.progressListData();

            // 加载状态结束
            this.programLoading = false;
            this.programPage++;

            // 获取支付方式
            // this.programList.sale_style

            // 数据全部加载完成
            if (this.programPage > res.response_data.total_page) {
              this.programFinished = true;
              this.programPage = 1;
            }
          }, 600);

          // 设置总节目数
          this.programTotalCount = res.response_data.total_count;
        } else {
          this.$toast(res.error_message);
        }
      },
      // localStorage存放节目播放进度
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
        if (result != null && result.length > 0) {
          for (let i = 0; i < this.programList.length; i++) {
            this.progressList.push(this.programList[i]);
            for (let j = 0; j < result.length; j++) {
              // 当节目播放进度存在localStorage时,显示已播放进度
              if (
                result[j].pid == this.goodsId &&
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
      chooseAction(item) {
        // console.log(item);
        this.$emit("programChange", item);
      },
      closePopup() {
        this.popupModel = false;
      }
    },
    props: ["albumInfo", "goodsNo", "audioStatus", "goodsId", "limitUse"],

  }
</script>

<style lang="scss" src="@/style/scss/pages/album2.0/components/list.scss" scoped>

</style>
