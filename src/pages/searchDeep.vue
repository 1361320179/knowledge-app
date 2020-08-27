<template>
  <div id="searchPage">
    <div class="huoba-search">
      <div class="cancel-back" @click="cancelBack">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-left-arrow" />
        </svg>
      </div>
      <van-search
        v-model="searchHintData.search"
        :placeholder="searchHintData.placeholderText"
        show-action
        shape="round"
        @search="onSearch"
        @input="showList"
        @cancel="onCancel"
        id='inputId'
      >
        <div slot="action" @click="onSearch">搜索</div>
        <div slot="left-icon">
          <svg class="icon" aria-hidden="true" v-if="this.goods_type == 9">
            <use xlink:href="#icon-zhuanji" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else-if="this.goods_type == 4">
            <use xlink:href="#icon-dianzishu" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else-if="this.goods_type == 3">
            <use xlink:href="#icon-tushu" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else-if="this.goods_type == 6">
            <use xlink:href="#icon-wenzhang1" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else-if="this.goods_type == -1">
            <use xlink:href="#icon-huobahao" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-littleSearch-line" />
          </svg>
        </div>
      </van-search>
      <search-hintnew :searchHintData="searchHintData" ref="searchHintnew" @showLists="showLists"></search-hintnew>
    </div>
    <!-- 最近订单搜索 -->
    <div class="searchRecommend searchHistory" v-if="type=='order' && order_list.length>0 && showSearchContent">
      <p class="recommend title">
        <span class="history">最近搜索</span>
        <span class="clear" @click="clear" v-if="list.length>0||order_list.length>0">清空</span>
      </p>
      <div class="overflow-2">
        <span
          class="tag"
          v-for="(item,index) in order_list"
          :key="index"
          @click="searchItem(item)"
        >{{item.content}}</span>
      </div>
    </div>
    <!-- 最近全局搜索 -->
    <div class="searchRecommend searchHistory" v-if="list.length > 0 && type!=='order' && showSearchContent">
      <p class="recommend title">
        <span class="history">最近搜索</span>
        <span class="clear" @click="clear" v-if="list.length>0||order_list.length>0">清空</span>
      </p>
      <div class="overflow-2">
        <span
          class="tag"
          v-for="(item,index) in list"
          :key="index"
          @click="searchItem(item)"
        >{{item.content}}</span>
      </div>
    </div>
    <!-- 热门搜索 -->
    <div
      class="searchRecommend"
      v-if="(type == 'brand' || type == 'mall') && hotSearch.length > 0 && home_id == 'all' && showSearchContent"
    >
      <p class="recommend">热门搜索</p>
      <!--<van-row type="flex" gutter="15">-->
        <!--<van-col span="12" v-for="(item,index) in hotSearch" :key="index">-->
          <!--<div class="hotContent" @click="hotSearchItem(item)">-->
            <!--<span class="hotSort first" v-if="index == 0">{{index+1}}</span>-->
            <!--<span class="hotSort second" v-if="index == 1">{{index+1}}</span>-->
            <!--<span class="hotSort third" v-if="index == 2">{{index+1}}</span>-->
            <!--<span class="hotSort" v-if="index > 2">{{index+1}}</span>-->
            <!--<span class="hotDesc">{{item}}</span>-->
          <!--</div>-->
        <!--</van-col>-->
      <!--</van-row>-->
      <div class="hot_box">
        <div class="hot_left">
          <div v-for="(item,index) in hotSearch" :key="index">
            <div class="hotContent" @click="hotSearchItem(item)" v-if="index <= 4">
              <span class="hotSort first" v-if="index == 0">{{index+1}}</span>
              <span class="hotSort second" v-if="index == 1">{{index+1}}</span>
              <span class="hotSort third" v-if="index == 2">{{index+1}}</span>
              <span class="hotSort" v-if="index > 2">{{index+1}}</span>
              <span class="hotDesc">{{item}}</span>
            </div>
          </div>
        </div>
        <div class="hot_right">
          <div v-for="(item,index) in hotSearch" :key="index">
            <div class="hotContent" @click="hotSearchItem(item)" v-if="index >= 5">
              <span class="hotSort" v-if="index > 2">{{index+1}}</span>
              <span class="hotDesc">{{item}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EazyNav type="brand" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style scoped  src="@/style/scss/pages/searchCorrent.scss"  lang="scss"></style>

<script>
  import { SEARCH_HOTKEY_GETS } from "../apis/public.js";
  import searchHintnew from "../components/searchHintnew";
  // import easyNav from "./../components/easyNav";
  export default {
    components: {
      searchHintnew
    },
    data() {
      return {
        searchHintData: {
          search: "",
          placeholderText: "搜索专辑/电子书/图书/文章/火把号",
          list: [],
          type: "",
          state:0,
          bottomShow: true,
        },
        showSearchContent: true,
        goods_type: 0,
        type: "",
        home_id: "",
        hotSearch: [],
        list: [],
        order_list:[],
      };
    },
    mounted() {
      this.type = this.$route.query.type;
      this.goods_type = this.$route.query.goods_type;
      this.searchHintData.type = this.$route.query.type;
      if (this.type == "order") {
        this.searchHintData.placeholderText = "搜索专辑/电子书/图书/文章/火把号";
        this.goods_type = 0;
      } else if (this.goods_type == '9') {
        this.searchHintData.placeholderText = "搜索专辑名称";
        this.goods_type = 9;
      } else if (this.goods_type == '4') {
        this.searchHintData.placeholderText = "搜索电子书名称、作者";
        this.goods_type = 4;
      } else if (this.goods_type == '3') {
        this.searchHintData.placeholderText = "搜索图书名称、作者、ISBN";
        this.goods_type = 3;
      } else if (this.goods_type == '6') {
        this.searchHintData.placeholderText = "搜索文章名称";
        this.goods_type = 6;
      } else if (this.goods_type == '-1') {
        this.searchHintData.placeholderText = "搜索火把号名称";
        this.goods_type = -1;
      }
      if(sessionStorage.getItem('saveSearchContent')){
        this.searchHintData.search = sessionStorage.getItem('saveSearchContent')
      }
      this.home_id = localStorage.getItem("home_id");
      this.getHotKey();
      this.getLocalItem();
      document.getElementById('inputId').focus();
    },
    methods: {
      clear() {
        this.$dialog
          .confirm({
            title: "确认清空历史记录？",
            cancelButtonText: "取消",
            confirmButtonText: "清空"
          })
          .then(() => {
            if(this.type == 'order'){
              this.order_list = [];
              localStorage.removeItem("orderCmts");
            }else{
              this.list = [];
              localStorage.removeItem("cmts");
            }
          })
          .catch(() => {
            // on cancel
          });
      },
      onCancel(){

      },
      showList (){
        this.$refs.searchHintnew.showList();
        if (this.searchHintData.bottomShow) {
          this.showSearchContent = true;
        } else {
          this.showSearchContent = false;
        }
      },
      showLists () {
        if (this.searchHintData.bottomShow) {
          this.showSearchContent = true;
        } else {
          this.showSearchContent = false;
        }
      },
      // 搜索按钮
      searchTo(_type) {
        // var _searchContent = JSON.stringify(this.searchHintData.search)
        sessionStorage.setItem('saveSearchContent',this.searchHintData.search)
        // console.log('转码',_searchContent)
        switch (_type) {
          case "order":
            this.$router.push({
              path: "/personal/order/result",
              query: {
                type: "order",
                // searchContent: _searchContent
                // state:this.state,
              }
            });
            this.saveItem();
            break;
          case "brand":
            this.$router.push({
              path: "/brand/resultCorrent",
              query: {
                type: "brand",
                goods_type: this.goods_type,
                // searchContent: _searchContent
              }
            });
            this.saveItem();
            break;
          case "mall":
            this.$router.push({
              path: "/brand/resultCorrent",
              query: {
                type: "mall",
                goods_type: this.goods_type,
                // searchContent: _searchContent,
                supplier_id: this.$route.query.supplier_id?this.$route.query.supplier_id:0,
              }
            });
            this.saveItem();
            break;
          case "index":
            this.$router.push({
              path: "/brand/resultCorrent",
              query: {
                type: "index",
                goods_type: this.goods_type,
                // searchContent: _searchContent
              }
            });
            this.saveItem();
            break;
          case "coupon":
            this.$router.push({
              path: "/coupon/result",
              query: {
                type: "coupon",
                ticket_id: this.$route.query.ticket_id,
                // searchContent: _searchContent
              }
            });
            this.saveItem();
            break;
          case "multi":
            this.$router.push({
              path: "/multiresult",
              query: {
                type: "multi",
                multi_id: this.$route.query.multi_id,
                // searchContent: _searchContent
              }
            });
            this.saveItem();
            break;
        }
      },
      onSearch() {
        if (
          this.searchHintData.search.trim() == "" ||
          this.searchHintData.search.length == 0
        ) {
          this.$toast("请输入您要搜索的内容！");
          return;
        }

        if (this.type == "order") {
          this.searchTo("order");
        } else if (this.type == "brand") {
          this.searchTo("brand");
        } else if (this.type == "mall") {
          this.searchTo("mall");
        } else if (this.type == "index") {
          this.searchTo("index");
        } else if (this.type == "coupon") {
          this.searchTo("coupon");
        } else if (this.type == "multi") {
          this.searchTo("multi");
        } else {
          this.$toast("请输入您要搜索的内容！");
        }
      },
      //获取热搜词
      async getHotKey() {
        var data = {
          goods_type: this.$route.query.goods_type,
          version: "1.1"
        };
        data.sign = this.$getSign(data);
        let res = await SEARCH_HOTKEY_GETS(data);
        if (res.hasOwnProperty("response_code")) {
          this.hotSearch = res.response_data;
        } else {
          this.$toast(res.error_message);
        }
      },
      //将搜索内容存储到本地
      saveItem() {
        var content = { content: this.searchHintData.search };
        var list;
        if(this.type == 'order'){
          list = JSON.parse(localStorage.getItem("orderCmts") || "[]");
        }else{
          list = JSON.parse(localStorage.getItem("cmts") || "[]");
        }
        if (list == null) list = [];
        if (list.length > 10) {
          list = list.slice(0, 9);
        }
        list.unshift(content);
        const age = "content";
        list = list.reduce(
          (all, next) =>
            all.some(atom => atom[age] == next[age]) ? all : [...all, next],
          []
        );
        if(this.type == 'order'){
          localStorage.setItem("orderCmts", JSON.stringify(list));
        }else{
          localStorage.setItem("cmts", JSON.stringify(list));
        }
        this.content = "";
        this.$emit("func");
      },
      //读取本地历史记录
      getLocalItem() {
        if(this.type == 'order'){
          var list = JSON.parse(localStorage.getItem("orderCmts") || "[]");
          if (list) this.order_list = list;
        }else{
          var list = JSON.parse(localStorage.getItem("cmts") || "[]");
          if (list) this.list = list;
        }
      },
      hotSearchItem(item) {
        // var _hotContent = JSON.stringify(item)
        sessionStorage.setItem('saveSearchContent',item)
        // console.log('转码',_hotContent)
        if (this.type == "order") {
          this.$router.push({
            path: "/personal/order/result",
            query:{
              type: this.type,
              // searchContent: _hotContent,
            }
          })
        } else if (this.type == "brand") {
          this.$router.push({
            path: "/brand/resultCorrent",
            query:{
              type: this.type,
              goods_type: this.goods_type,
              // searchContent: _hotContent,
            }
          })
        } else if (this.type == "mall") {
          this.$router.push({
            path: "/brand/resultCorrent",
            query:{
              type: this.type,
              goods_type: this.goods_type,
              // searchContent: _hotContent,
              supplier_id: this.$route.query.supplier_id?this.$route.query.supplier_id:0,
            }
          })
        } else if (this.type == "coupon") {
          this.$router.push({
            path: "/coupon/result",
            query:{
              type: this.type,
              // searchContent: _hotContent,
              ticket_id: this.$route.query.ticket_id?this.$route.query.ticket_id:0,
            }
          })
        } else if (this.type == "multi") {
          this.$router.push({
            path: "/multiresult",
            query:{
              type: this.type,
              // searchContent: _hotContent,
              multi_id: this.$route.query.multi_id?this.$route.query.multi_id:0,
            }
          })
        } else {}
      },
      searchItem(item) {
        this.hotSearchItem(item.content)
      },
      cancelBack () {
        this.$router.push({
          path: "/searchcorrent",
          query:{
            type: this.type
          }
        })
        sessionStorage.setItem('saveSearchContent','');
      }
    }
  };
</script>
