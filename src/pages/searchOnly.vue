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
      >
        <div slot="action" @click="onSearch">搜索</div>
        <div slot="left-icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-littleSearch-line" />
          </svg>
        </div>
      </van-search>
      <search-hintnew :searchHintData="searchHintData" ref="searchHintnew"></search-hintnew>
    </div>
    <EazyNav type="brand" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style scoped  src="@/style/scss/pages/searchCorrent.scss"  lang="scss"></style>

<script>
  import searchHintnew from "../components/searchHintnew";
  export default {
    components: {
      searchHintnew
    },
    data() {
      return {
        searchHintData: {
          search: "",
          placeholderText: "搜索商品名称",
          list: [],
          type: "",
          state:0
        },
        type: "",
        list: [],
      };
    },
    mounted() {
      this.type = this.$route.query.type;
      this.searchHintData.type = this.$route.query.type;
      if (this.type == 'coupon') {
        if(sessionStorage.getItem('saveCouponKey')){
          this.searchHintData.search = sessionStorage.getItem('saveCouponKey')
        }
      } else {
        if(sessionStorage.getItem('saveFullreduction')){
          this.searchHintData.search = sessionStorage.getItem('saveFullreduction')
        }
      }
    },
    methods: {
      onCancel(){

      },
      showList (){
        this.$refs.searchHintnew.showList();
      },
      // 搜索按钮
      searchTo(_type) {
        switch (_type) {
          case "coupon":
            sessionStorage.setItem('saveCouponKey',this.searchHintData.search);
            this.$router.push({
              path: "/coupon/resultCorrent",
              query: {
                type: "coupon",
                ticket_id: this.$route.query.ticket_id
              }
            });
            break;
          case "multi":
            sessionStorage.setItem('saveFullreduction',this.searchHintData.search);
            this.$router.push({
              path: "/multiresultCorrent",
              query: {
                type: "multi",
                multi_id: this.$route.query.multi_id
              }
            });
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
        if (this.type == "multi") {
          this.searchTo("multi");
        } else if (this.type == "coupon") {
          this.searchTo("coupon");
        } else {
          this.$toast("请输入您要搜索的内容！");
        }
      },
      cancelBack () {
        this.$router.go(-1);
      },
    }
  };
</script>
