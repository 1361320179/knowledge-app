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
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-littleSearch-line" />
          </svg>
        </div>
      </van-search>
      <search-hintnew :searchHintData="searchHintData" ref="searchHintnew" @showLists="showLists"></search-hintnew>
    </div>
    <div class="searchAppoint" v-if="showAppoint">
      <div class="appoint-text">搜索指定内容</div>
      <div class="appoint-content">
        <div class="appoint-detail" @click="deepUrl(9)">专辑</div>
        <div class="appoint-detail" @click="deepUrl(4)">电子书</div>
        <div class="appoint-detail" @click="deepUrl(3)">图书</div>
        <div class="appoint-detail" @click="deepUrl(6)">文章</div>
        <div class="appoint-detail" @click="deepUrl(-1)">火把号</div>
      </div>
    </div>
    <EazyNav type="brand" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style scoped  src="@/style/scss/pages/searchCorrent.scss"  lang="scss"></style>

<script>
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
        showAppoint: true,
        brand_type: 0,
        type: "",
        home_id: "",
        hotSearch: [],
        list: [],
        order_list:[],
      };
    },
    mounted() {
      this.type = this.$route.query.type;
      this.searchHintData.type = this.$route.query.type;
      if (this.type == "order") {
        this.searchHintData.placeholderText = "搜索商品名称/订单编号";
      }
      if(sessionStorage.getItem('saveSearchContent')){
        this.searchHintData.search = sessionStorage.getItem('saveSearchContent')
      }
      this.home_id = localStorage.getItem("home_id");
      this.getLocalItem();
      document.getElementById('inputId').focus();
    },
    methods: {
      onCancel(){

      },
      showList (){
        this.$refs.searchHintnew.showList();
        if (this.searchHintData.bottomShow) {
          this.showAppoint = true;
        } else {
          this.showAppoint = false;
        }
      },
      showLists () {
        if (this.searchHintData.bottomShow) {
          this.showAppoint = true;
        } else {
          this.showAppoint = false;
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
                brand_type: this.brand_type,
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
                brand_type: this.brand_type,
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
                brand_type: this.brand_type,
                // searchContent: _searchContent
              }
            });
            this.saveItem();
            break;
          case "coupon":
            this.$router.push({
              path: "/coupon/resultCorrent",
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
              path: "/multiresultCorrent",
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
              brand_type: this.brand_type,
              // searchContent: _hotContent,
            }
          })
        } else if (this.type == "mall") {
          this.$router.push({
            path: "/brand/resultCorrent",
            query:{
              type: this.type,
              brand_type: this.brand_type,
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
        this.$router.go(-1);
      },
      // 专辑等跳转
      deepUrl (index) {
        this.$router.push({
          path: "/searchDeep",
          query:{
            type: this.type,
            goods_type: index
          }
        })
        sessionStorage.setItem('saveSearchContent',this.searchHintData.search);
      }
    }
  };
</script>
