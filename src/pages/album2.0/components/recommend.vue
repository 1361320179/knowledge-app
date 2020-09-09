<template>
  <div id="recommendComponent">
    <section class="flexBox">
      <div class="left">
        <div class="ratioBox">
          <div class="box">
            <!--图片-->
            <img :src="baseData.pic[0]"/>
          </div>
        </div>
      </div>
      <div class="center">
        <h4 class="title">{{ baseData.title }}</h4>
        <h5 class="subTitle">{{ brandInfoData.name }}</h5>
      </div>
      <div class="right huoba-btn">
        <button class="huoba-btn" v-if="albumInfo.collect_id > 0" @click="collectCancel($route.query.pid, 'present')">已收藏</button>
        <button class="huoba-btn huoba-btn-one" v-else @click="collectAdd(baseData.goods_type, $route.query.pid, 'present')">收藏</button>
      </div>
    </section>
    <section class="pic" v-if="bannerInfo.id" @click="clickBanner">
      <img :src="bannerInfo.pic">
    </section>
    <!--知识讲义-->
    <section class="knowledge" v-if="baseData.desc">
      <h3 class="title">知识讲义</h3>
      <div class="unfold"  v-show="(baseData.is_payed == 1 || isFree == 1) && foldState == 1">
        展开
        <svg class="icon" aria-hidden="true" @click="unfold">
          <use xlink:href="#icon-fold-line"/>
        </svg>
      </div>
      <div class="fold" v-show="(baseData.is_payed == 1 || isFree == 1) && foldState == 0">
        收起
        <svg class="icon" aria-hidden="true" @click="fold">
          <use xlink:href="#icon-unfold-line"/>
        </svg>
      </div>
      <div class="content">
        <div class="text normal" v-show="(baseData.is_payed == 1 || isFree == 1) && foldState == 0">
          <p v-html="baseData.desc"></p>
        </div>
        <div class="text foldText" v-show="(baseData.is_payed == 1 || isFree == 1) && foldState == 1">
        <p v-html="baseData.desc"></p>
        </div>
        <div class="text unbought" v-show="baseData.is_payed == 0 && isFree == 0">
          <p v-html="baseData.desc"></p>
        </div>
        <div class="info" v-if="baseData.is_payed == 0 && isFree == 0">***购买后解锁完整讲义***</div>
      </div>
    </section>
    <!--相似专辑-->
    <section class="album">
      <h3 class="title">相似专辑</h3>
      <div class="huoba-goods-list huoba-goods-list-seven">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item,index) in recommendAlbum" :key="index" v-if="item.goods_type==9" @click="recommendDetail(item)">
            <div class="huoba-goods-list-imgs" @click="toAlbumDetail(item.goods_id)">
              <div class="ratioBox">
                <div class="box">
                  <img :src="item.pic[0]"/>
                </div>
              </div>
            </div>
            <div class="collected" v-if="item.is_collect==1" @click="collectCancel(item.goods_id)">已收藏</div>
            <div class="collect" v-else @click="collectAdd(item.goods_type, item.goods_id)">收藏</div>
          </swiper-slide>
        </swiper>
      </div>
    </section>
    <!--精选好书-->
    <section class="book">
      <h3 class="title">{{ recommendInfo.title }}</h3>
      <div class="huoba-goods-list huoba-goods-list-seven">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="item in recommendInfo.result" :key="item.goods_id">
            <div class="huoba-goods-list-imgs" @click="toGoodsDetail(item.goods_id)">
              <div class="ratioBox">
                <div class="box">
                  <img :src="item.pic"/>
                </div>
              </div>
            </div>
            <div class="name">{{ item.goods_name }}</div>
          </swiper-slide>
        </swiper>
      </div>

    </section>
  </div>
</template>

<script>
  import {ALBUM} from "@/apis/album.js";
  import {RECOMMEND, COLLECT_ADD, COLLECT_CANCEL,} from "@/apis/public.js";
  export default {
    data() {
      return {
        swiperOption: {
          slidesPerView: "auto",
          // loop: true,
          // loopSlides: 10
        },
        isFree: null,
        foldState: 1,
        // 所属媒体信息
        brandInfoData: {
          header_pic: "",
          name: "",
          fans: 0,
          is_followed: null
        },
        baseData: {
          title: "",
          sub_title: "",
          pic: [],
          goods_type: null,
          collection_num: 0,
          play_num: 0,
          goods_id: null
        },
        albumInfo: {
          collect_id: null
        },
        recommendInfo: {},
        bannerInfo: {
          id: '',
          pic: '',
          url: {},
          close_conf: {}
        },
        recommendAlbum: []
      }
    },
    props: ['message'],
    watch: {
      message(val) {
        this.isFree = val;
        console.log('val',this.isFree);
      }
    },
    methods: {
      async recommendData() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: this.$route.query.pid,
          page: this.recommendPage,
          page_size: 10000000,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await RECOMMEND(data);
        console.log(666, res);
        if (res.hasOwnProperty("response_code")) {
          // 异步更新数据
          this.recommendAlbum = res.response_data.result;
        } else {
          this.$toast(res.error_message);
        }
      },
      recommendDetail(item) { // 查看推荐 专辑详情
        this.$router.push({name: 'album', query: {goods_id: item.goods_id}});
      },
      async collectAdd(goods_type, goods_id, action) {
        var tStamp = this.$getTimeStamp();
        var data = {
          timestamp: tStamp,
          type: goods_type,
          target: goods_id,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await COLLECT_ADD(data);
        if (res.hasOwnProperty("response_code")) {
          if (action == 'present') {
            this.albumInfo.collect_id = 1;
            this.$emit('collect', 1);
          } else {
            this.recommendData();
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      async collectCancel(goods_id, action) {
        var tStamp = this.$getTimeStamp();
        var data = {
          timestamp: tStamp,
          goods_id: goods_id,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await COLLECT_CANCEL(data);
        if (res.hasOwnProperty("response_code")) {
          if (action == 'present') {
            this.albumInfo.collect_id = 0;
            this.$emit('collect', 0);
          } else {
            this.recommendData();
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      clickBanner() {
        let urlObj = JSON.parse(this.bannerInfo.url); // 图片跳转链接(JSON)
        let tempObj = this.$translate(urlObj);
        if (tempObj.name) {
          urlObj = this.$translate(urlObj);
        }
        let url = window.location.href.split('#')[0] + '#/' +  urlObj.action;

        // url拼接
        if (Object.keys(urlObj.params).length !== 0) {
          url += '?';
        }
        for (var k in urlObj.params) {
          url += ( k + '=' + urlObj.params[k] + '&');
        }
        url = url.substring(0, url.length - 1);

        window.location.href = url;
        },

      // 获取专辑接口信息
      async albumData() {
        var tStamp = this.$getTimeStamp();
        let data = {
          ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
          timestamp: tStamp,
          goods_id: this.$route.query.goods_id,
          pid: this.$route.query.pid ? this.$route.query.pid : null,
          if_page: 1,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await ALBUM(data);
        if (res.hasOwnProperty("response_code")) {
          console.log(res);
          //专辑基础信息
          this.baseData = res.response_data.base;
          this.albumInfo = res.response_data.album_info;
          console.log(this.baseData);
          // 推荐信息
          this.recommendInfo = res.response_data.recommend.content;
          // banner信息
          this.bannerInfo = res.response_data.banner;
          // 所属媒体信息
          this.brandInfoData = res.response_data.brand_info;

        }
      },
      toAlbumDetail(goods_id) {
        this.$router.push({name: 'album', query: {goods_id: goods_id}});
      },
      toGoodsDetail(goods_id) {
        this.$router.push({name: 'detail', query: {goods_id: goods_id}})
      },

      unfold() {
        this.foldState = 0;
      },
      fold() {
        this.foldState = 1;
      },
    },
    mounted() {
      this.recommendData();
      this.albumData();
    }
  }
</script>

<style lang="scss" src="@/style/scss/pages/album2.0/components/recommend.scss" scoped>

</style>
