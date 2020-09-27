<template>
  <div id="newGiftSexAge">
    <div class="title" v-if="sexLink">
      <div class="left">填写喜好，赢取专属好礼</div>
      <div class="right" v-if="titleShow1" @click="clear1">跳过</div>
    </div>
    <div class="title" v-else>
      <div class="left">你喜欢什么类型的内容？（{{ linkNum }}/3）</div>
      <div class="right" v-if="titleShow2" @click="clear2">跳过</div>
    </div>
    <div v-if="sexLink">
      <div class="sexChoose">
        <div class="left" @click="sexMan('1')">
          <div class="light" v-if="man_light"></div>
          <div class="w_light" v-else></div>
          <div class="text" :style="{'background-color': man_text?'#A4CCFF':'#E5E5E5'}">男</div>
        </div>
        <div class="right" @click="sexMan('2')">
          <div class="light" v-if="men_light"></div>
          <div class="w_light" v-else></div>
          <div class="text" :style="{'background-color': men_text?'#FFDBDD':'#E5E5E5'}">女</div>
        </div>
      </div>
      <div class="ageChoose">
        <div class="box" v-for="(item,index) in ageData" :key="index">
          <span :class="[{child: child},{active: active1 == item}]" @click="ageClick(item)">{{ item }}</span>
        </div>
      </div>
    </div>
    <div class="linkChoose" v-else>
      <div class="box" v-for="(item,index) in labelData" :key="index">
        <span :class="[{child: child},{active: item.selected}]" @click="linkClick(item)">{{ item.name }}</span>
      </div>
    </div>
    <div class="next_page" @click="saveUrl1()" v-if="sexLink">继续</div>
    <div v-else>
      <div class="next_page active" @click="saveUrl2()" v-if="skip_next">继续</div>
      <div class="next_page" @click="saveUrl3()" v-else>继续</div>
    </div>
    <EazyNav type="brand" :isShow="isShows"></EazyNav>
    <!--<Loading :isLoading="isLoading"></Loading>-->
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>
<style src="@/style/scss/pages/newGift/sexAge.scss" scoped lang="scss"></style>
<style lang="scss" scoped>
  #newGiftSexAge {
    #loadingPage {
      background-color: #ffffff;
    }
  }
</style>
<script>
  import {
    NOVICEWELFARE_INFO,
    NOVICEWELFARE_ADD
  } from "../../apis/newGift";
  export default {
    data () {
      return {
        titleShow1: true,
        titleShow2: true,
        child: true,
        man_light: true,
        man_text: true,
        men_text: false,
        men_light: false,
        skip_next: true,
        sexLink: true,
        isLoading: true,
        isShows: true,
        active1: '',
        ageData: [],
        linkNum: 0,
        selectedItem: [],
        labelData: [],
        sexStr: '',
        ageStr: '',
        labelStr: '',
      };
    },
    mounted () {
      if (localStorage.getItem("isHuobaAndroidLogin") == "yes" || localStorage.getItem("isHuobaIosLogin") == "yes") {
        this.isShows = false;
      } else {
        this.isShows = true;
      }
      this.initData();
      if (localStorage.getItem("isHuobaIosLogin") == "yes") {
        this.clickLogin();
      }
    },
    methods: {
      clickLogin (){
        this.$router.replace({
          name: 'newGiftSexAge'
        });
      },
      // 跳过弹窗1
      clear1 () {
        this.$dialog
          .confirm({
            message: "填写喜好更容易获得心仪的奖品哦，确定跳过吗",
            confirmButtonText: "坚决跳过",
            cancelButtonText: "我在想想"
          })
          .then(() => {
            this.sexLink = false;
            this.sexStr = '';
            this.ageStr = '';
          })
          .catch(() => {

          });
      },
      // 跳过弹窗2
      clear2 () {
        this.$dialog
          .confirm({
            message: "填写喜欢的类型更容易获得心仪的奖品哦，确定跳过吗",
            confirmButtonText: "坚决跳过",
            cancelButtonText: "我在想想"
          })
          .then(() => {
            this.labelStr = '';
            this.sendUrl();
          })
          .catch(() => {

          });
      },
      // 男女头像选择
      sexMan (id) {
        this.titleShow1 = false;
        if (id == '1') {
          this.man_light = true;
          this.man_text = true;
          this.men_light = false;
          this.men_text = false;
          this.sexStr = '男';
        } else {
          this.man_light = false;
          this.man_text = false;
          this.men_light = true;
          this.men_text = true;
          this.sexStr = '女';
        }
      },
      // 继续按钮1
      saveUrl1 () {
        this.sexLink = false;
        this.ageStr = this.active1;
        if (this.man_text) {
          this.sexStr = '男';
        } else {
          this.sexStr = '女';
        }
      },
      saveUrl2 () {
        this.$toast('请选择标签');
      },
      saveUrl3 () {
        this.sendUrl();
      },
      // 年龄选择
      ageClick (name) {
        this.titleShow1 = false;
        this.active1 = name;
      },
      // 爱好选择
      linkClick (item) {
        this.titleShow2 = false;
        if (!item.selected && this.selectedItem.length < 3) {
          item.selected = true;
          this.selectedItem.push(item.name)
        } else if (item.selected) {
          item.selected = false;
          const i = this.selectedItem.indexOf(item.name);
          this.selectedItem.splice(i, 1)
        } else if (this.selectedItem.length >= 3) {
          this.$toast('最多选择3个');
        }
        this.skip_next = false;
        this.linkNum = this.selectedItem.length;
        this.labelStr = this.selectedItem.join(',');
        if (this.selectedItem.length == 0) {
          this.skip_next = true;
        }
      },
      // 初始化接口
      async initData () {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await NOVICEWELFARE_INFO(data);
        if (res.hasOwnProperty("response_code")) {
          this.ageData = res.response_data.age;
          var datas = res.response_data.label;
          var user_info = res.response_data.user_info;
          var is_new = res.response_data.is_new;
          this.labelData = [];
          if (user_info.age == '' || user_info.age == null) {
            this.active1 = '95后';
          } else {
            this.active1 = user_info.age;
          }
          if (user_info.sex == '' || user_info.sex == null) {
            this.man_light = true;
            this.man_text = true;
            this.men_text = false;
            this.men_light = false;
          } else if (user_info.sex == '男') {
            this.man_light = true;
            this.man_text = true;
            this.men_text = false;
            this.men_light = false;
          } else if (user_info.sex == '女') {
            this.man_light = false;
            this.man_text = false;
            this.men_text = true;
            this.men_light = true;
          }
          for (var i = 0; i < datas.length; i++ ) {
            this.labelData.push({
              name: datas[i],
              selected: false
            });
          }
          if (is_new != 1) {
            window.location.href = res.response_data.url;
          } else {
            this.isLoading = false;
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.$toast(res.error_message);
        }
      },
      // 传输接口
      async sendUrl () {
        var tStamp = this.$getTimeStamp();
        let data = {
          sex: this.sexStr,
          age: this.ageStr,
          label: this.labelStr,
          timestamp: tStamp,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await NOVICEWELFARE_ADD(data);
        if (res.hasOwnProperty("response_code")) {
          this.$router.push({
            name: "newGiftUserGift",
            query: {
              new_id: res.response_data.id
            }
          });
        } else {
          this.$toast(res.error_message);
        }
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
