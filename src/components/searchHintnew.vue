<template>
  <div id="searchHintnew">
    <ul v-if="searchHintData.state == 1">
      <li
        v-for="(item,index) in searchHintData.list"
        :key="index"
        @click="select(item,index)"
        v-html="item"
      ></li>
    </ul>
  </div>
</template>

<style lang="scss">
  #searchHintnew {
    ul {
      @include position(absolute, tl, 42px, 0px, calc(100%), null, null);
      margin-top: 10px;
      z-index: 99;
      li {
        background-color: $white;
        @include textOverflow;
        padding: 10px;
        border-bottom: 1px solid #F5F5F5;
      }
    }
  }
</style>

<script>
  import { SEARCH_SUGGEST } from "../apis/public";
  import { setTimeout } from 'timers';
  export default {
    name: "search-hintnew",
    props: ["searchHintData"],
    data(){
      return{
        resultList: [],
        resultLists: [],
      }
    },
    mounted(){

    },
    methods: {
      select(item, index) {
        console.log(this.resultList[index]);
        this.searchHintData.search = this.resultList[index].toString();
        this.searchHintData.state = 0;
        this.searchHintData.bottomShow = true;
        this.$emit('showLists');
        this.$emit('onSearch');
      },
      async showList() {
        if (this.searchHintData.search.trim() == "") {
          // this.searchData();
          this.searchHintData.bottomShow = true;
          this.searchHintData.state = 0;
          this.searchHintData.list = [];
          return;
        } else {
          this.searchHintData.bottomShow = false;
        }
        // console.log(this.searchHintData.search.trim() == "");

        // setTimeout(()=> {

        var tStamp = this.$getTimeStamp();
        var data = {
          k: this.searchHintData.search,
          brand_id:this.$route.query.brand_id,
          supplier_id:this.$route.query.supplier_id,
          goods_type:this.$route.query.goods_type,
          ticket_id:this.$route.query.ticket_id,
          multi_id:this.$route.query.multi_id,
          version: "1.1",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await SEARCH_SUGGEST(data);
        if (res.hasOwnProperty("response_code")) {
          // console.log(res)
          this.resultList = res.response_data;
          this.resultLists = [];
          for (var i = 0; i < this.resultList.length; i++) {
            var value = this.searchHintData.search;
            var values = this.resultList[i].toString().split(value);
            this.resultLists.push(values.join("<span style='color:#F05654;'>" + value + "</span>"));
          }
          this.searchHintData.list = this.resultLists;
          this.searchHintData.state = 1;
        } else {
          this.$toast(res.error_message);
        }

        // }, 600)
      },
    }
  };
</script>
