<template>
  <div id="newGiftSuccessDraw">
    <div class="title">您已成功领取新人礼包</div>
    <div class="sub_title">快来看看吧~</div>
    <div class="picture">
      <img src="../../assets/newGift/success_icon.png" />
    </div>
    <div class="button">
      <van-row>
        <van-col span="11">
          <div class="left-button" @click="couponUrl()">查看我的优惠劵</div>
        </van-col>
        <van-col span="2"></van-col>
        <van-col span="11">
          <div class="right-button" @click="orderUrl()">查看订单</div>
        </van-col>
      </van-row>
    </div>
    <div class="new_rem">
      <div class="rem_title">为您推荐</div>
      <van-list
        v-model="programLoading"
        :finished="programFinished"
        finished-text="没有更多了"
        @load="programLoad"
      >
        <div
        class="content"
        @click="gotoDetail(item)"
        v-for="(item,index) in resultData" :key="index"
      >
        <div class="ratiobook">
          <div class="bookimg" v-lazy:background-image="item.pic[0]"></div>
          <span class="book_text_title">专辑</span>
        </div>
        <div class="right">
          <div class="text">{{item.title}}</div>
          <div class="pinpai">
            <div class="price" v-if="item.price">￥{{item.price.toFixed(2)}}</div>
            <div class="price" v-else>免费</div>
            <div class="preferent_active">
              <span v-for="(titems,indexs) in item.tag_list" :key="indexs">
                <span class="active_1" v-if="indexs<1">
                  <span class="active_text_1" v-if="titems.type == 1 || titems.type == 2">{{ titems.name }}</span>
                  <span class="active_text_2" v-if="titems.type == 3">{{ titems.name }}</span>
                  <span class="active_text_3" v-if="titems.type == 4">{{ titems.name }}</span>
                </span>
              </span>
            </div>
          </div>
          <div class="nice">
            <span class="comment">
              <span @click.stop="toBrand(item)">
                {{ item.brand_name }}
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-next-line" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>
      </van-list>
    </div>
    <Loading :isLoading="isLoading"></Loading>
    <EazyNav type="brand" :isShow="isShows"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>
<style src="@/style/scss/pages/newGift/successDraw.scss" scoped lang="scss"></style>
<style lang="scss" scoped>
  #newGiftSuccessDraw {
    #loadingPage {
      background-color: #ffffff;
    }
  }
</style>
<script>
  import {
    NOVICEWELFARE_RESULT
  } from "../../apis/newGift";
  export default {
    data () {
      return {
        programLoading: false,
        programFinished: false,
        page_size: 10,
        page: 1,
        resultData: [],
        isLoading: true,
        isShows: true,
      };
    },
    mounted () {
      if (localStorage.getItem("isHuobaAndroidLogin") == "yes" || localStorage.getItem("isHuobaIosLogin") == "yes") {
        this.isShows = false;
      } else {
        this.isShows = true;
      }
      this.new_id = this.$route.query.new_id;
    },
    methods: {
      programLoad () {
        this.initData();
      },
      // 初始化接口
      async initData () {
        var tStamp = this.$getTimeStamp();
        let data = {
          id: this.new_id,
          page: this.page,
          page_size: this.page_size,
          timestamp: tStamp,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await NOVICEWELFARE_RESULT(data);
        if (res.hasOwnProperty("response_code")) {
          var result = res.response_data.result;
          setTimeout(() => {
            for (let i = 0; i < result.length; i++) {
              this.resultData.push(result[i]);
            }
            // 加载状态结束
            this.programLoading = false;
            this.page++;
            // 数据全部加载完成
            if (this.page > res.response_data.total_page || this.page > 5) {
              this.programFinished = true;
              this.page = 1;
            } else {
              this.programFinished = false;
            }
          }, 1);
          this.isLoading = false;
        } else {
          this.$toast(res.error_message);
        }
      },
      // 专辑跳转
      gotoDetail (item) {
        var goodsType = item.goods_type;
        if (goodsType == 1 || goodsType == 2) {
          // 音频/视频，当前页更新
          this.$router.push({
            name: "albumdetail",
            query: { goods_id: item.goods_id }
          });
        } else if (goodsType == 6) {
          // 文章
          this.$router.push({
            name: "article",
            query: { goods_id: item.goods_id }
          });
        } else if (goodsType == 9) {
          // 专辑
          this.$router.push({
            name: "album",
            query: { goods_id: item.goods_id }
          });
        } else if (goodsType == 3) {
          // 图书
          this.$router.push({
            name: "detail",
            query: { goods_id: item.goods_id }
          });
        } else if (goodsType == 4) {
          // 电子书
          this.$router.push({
            name: "ebookdetail",
            query: { goods_id: item.goods_id }
          });
        }
      },
      // 跳转公众号首页
      toBrand (item) {
        this.$router.push({
          name: "brand",
          query: {
            brand_id: item.brand_id
          }
        });
      },
      // 优惠劵跳转
      couponUrl () {
        this.$router.push({
          name: "couponmine",
          query: {}
        });
      },
      // 订单跳转
      orderUrl () {
        this.$router.push({
          name: "orderlist",
          query: {}
        });
      },
      // 登陆
      login () {
        this.$router.push({
          name: "login"
        });
      },
    }
  };
</script>
