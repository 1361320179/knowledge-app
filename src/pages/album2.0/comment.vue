<template>
  <div id="universalComment">
    <!--评论-->
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


    <EazyNav type="index" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<script>
  import {ALBUM} from "@/apis/album.js";
  import {
    COMMENT,
    COMMENT_ADD,
    COMMENT_PRAISE,
    COMMENT_DISLIKE,
  } from "@/apis/public.js";

  export default {
    data() {
      return {
        pid: null,
        goods_id: null,
        autofocus: null,
        isLogin: '',
        baseData: {},
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

      }
    },
    methods: {
      // 获取专辑/商品接口信息
      async albumData() {
        var tStamp = this.$getTimeStamp();
        var data = {
          ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
          timestamp: tStamp,
          pid: this.pid,
          goods_id: this.goods_id,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM(data);
        if (res.hasOwnProperty("response_code")) {
          // 存放专辑信息
          // this.album_info = res.response_data.album_info;
          // 当前商品基础信息
          this.baseData = res.response_data.base;
          // 账号信息，是否登录
          this.isLogin = res.response_data.user_info.is_login;
          if (this.autofocus == 1) {
            this.editComment();
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      editComment() {
        // 未登录跳转至登录页
        if (this.isLogin == 0) {  // 未登录
          this.informLoginShow = true;
        } else if (this.baseData.is_payed == 0 && this.baseData.is_free == 0) { //  不免费且未购买
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
          query: {goods_id: this.pid}
        });
      },
      commentLoad() {
        this.commentData();
      },
      async commentData() {
        var tStamp = this.$getTimeStamp();
        let data = {
          goods_id: this.goods_id,
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
            goods_id: this.goods_id,
            content: this.contentModel,
            goods_pid: this.pid,
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
        // this.discussData = [];
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
        } else if (state== 'cancelUp') {
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
            this.discussData[index].dislike_num -= 1;
          } else if (state == 'up' && this.discussData[index].is_dislike == 0) {
            this.discussData[index].is_like = 1;
            this.discussData[index].praise_num += 1;
          } else if (state == 'cancelUp') {
            this.discussData[index].is_like = 0;
            this.discussData[index].praise_num -= 1;
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
        } else if (state== 'cancelDown') {
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
            this.discussData[index].praise_num -= 1;
          } else if (state == 'down' && this.discussData[index].is_like == 0) {
            this.discussData[index].is_dislike = 1;
            this.discussData[index].dislike_num += 1;
          } else if (state == 'cancelDown') {
            this.discussData[index].is_dislike = 0;
            this.discussData[index].dislike_num -= 1;
          }
        } else {
          // this.$toast(res.error_message);
        }
      },
    },
    mounted() {
      this.goods_id = parseInt(this.$route.query.goods_id);
      this.pid = parseInt(this.$route.query.pid);
      this.autofocus = parseInt(this.$route.query.autofocus);
      this.albumData();
    }
  }
</script>

<style lang="scss">
  #universalComment {
    .van-field__control {
      background: #F5F5F5;
    }
  }
</style>
<style lang="scss" src="@/style/scss/pages/album2.0/comment.scss" scoped>

</style>

