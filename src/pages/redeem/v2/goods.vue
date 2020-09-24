<template>
  <div
    id="redeemGoodsPage"
    v-show="pageShow"
    :style="{'background-color':goodsDetail.colour.bg?goodsDetail.colour.bg:''}"
  >
    <div>
      <!-- <van-list
     v-model="goodsLoading"
     :finished="goodsFinished"
     finished-text="没有更多了"
     @load="goodsLoad"
      >-->
      <div class="propaganda" v-if="goodsDetail.pic">
        <img :src="goodsDetail.pic" alt width="100%" />
      </div>
      <!-- 专辑 电子书 -->
      <div v-if="goods_type == 9 || goods_type == 4|| goods_type == 1">
        <div
          v-for="(item,index) in goods_Lists"
          :key="index"
          :title="item"
          :class="['huoba-goods-list','huoba-goods-list-five',
           item.used_num>=item.goods_num?'disabled_true':'',has_link_s=='1'?'disabled_true':'',item.has_own == '1'?'disabled_true':'']"
        >
          <div class="huoba-goods-list-left">
            <div class="ratioBox">
              <div class="box" v-lazy:background-image="item.pic">
                <!-- <img
                  :src="item.pic"
                  alt
                />-->
              </div>
              <span class="huoba-goods-list-label" v-if="item.goods_type == 9">专辑</span>
              <span class="huoba-goods-list-label goods_list_ebook" v-if="item.goods_type == 4">电子书</span>
            </div>
          </div>
          <div class="huoba-goods-list-mid">
            <span class="huoba-goods-title">
              <span>{{item.title}}</span>
            </span>
            <div>
              <p class="limited_immunity" v-if="service_day > 0">
                <svg aria-hidden="true" class="icon">
                  <use xlink:href="#icon-biaoqian" />
                </svg>
                <span>{{service_day}}天限免</span>
              </p>
              <p class="prices">
                ￥
                <span>{{item.price}}</span>
              </p>
            </div>
          </div>
          <div class="huoba-goods-list-right">
            <div
              v-if="has_link_s=='1'|| item.used_num>=item.goods_num||item.has_own == '1'"
              class="default"
              style="text-align: center;"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-uncheck-line" style="color:rgba(229, 229, 229, 1) !important;" />
              </svg>
            </div>
            <div
              v-else
              class="default"
              @click="singleChecked(item.goods_id,index,item.title)"
              :class="{ active: item.is_default == 1 }"
              style="text-align: center;"
            >
              <svg class="icon" aria-hidden="true" v-if="item.is_default == 1">
                <use xlink:href="#icon-checked-block"  class="is_default1" />
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-uncheck-line" class="is_default0"/>
              </svg>
            </div>
          </div>
          <div v-if="item.used_num >= item.goods_num && item.has_own == '1'" class="owned"></div>
          <div class="owned" v-else-if="item.has_own == '1'"></div>
          <div class="coupon_owned" v-else-if="item.used_num >= item.goods_num"></div>
        </div>
      </div>

      <!-- 优惠券 -->
      <div v-if="goods_type == 2">
        <div
          v-for="(item,index) in goods_Lists"
          :key="index"
          :title="item"
          :class="['huoba_goods_list','huoba_goods_coupon',
           item.used_num>=item.goods_num?'disabled_true':'',has_link_s==1?'disabled_true':'',item.has_own == 1?'disabled_true':'']"
        >
          <p class="goods_title">{{item.brand}}：{{item.use_range_desc}}</p>
          <div style="display: flex;justify-content: space-between;-webkit-box-pack: justify;">
            <div class="huoba-goods-list-left">
              <div
                class="huoba-goods-list-imgs"
                v-for="(arry,key) in item.goods"
                :key="key"
                :title="arry"
                style="margin-right: 6px;"
              >
                <div class="ratioBox">
                  <div class="box" v-lazy:background-image="arry.pic">
                    <!-- <img
                    src="http://file.mhuoba.com/picture/album/20190703/14/20190703141357973.png"
                    alt
                    />-->
                  </div>
                  <span class="huoba-goods-list-label" v-if="arry.goods_type == 3">图书</span>
                  <span class="huoba-goods-list-label" v-if="arry.goods_type == 9">专辑</span>
                  <span
                    class="huoba-goods-list-label goods_list_ebook"
                    v-if="arry.goods_type == 4"
                  >电子书</span>
                </div>
                <p style="text-align: center;">￥{{arry.price}}</p>
              </div>
            </div>
            <div class="huoba-goods-list-right">
              <p class="huoba-goods-price">
                ￥
                <span style="font-size: 20px;font-weight: 700;">{{item.money}}</span>
              </p>

              <p
                class="huoba-goods-num"
              >满{{item.min_money}}元可用</p>

              <div
                v-if="has_link_s==1|| item.used_num>=item.goods_num||item.has_own == 1"
                class="default default_s"
                style="text-align: center;"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-uncheck-line" style="color:rgba(229, 229, 229, 1) !important;" />
                </svg>
              </div>

              <div
                v-else
                class="default default_s"
                @click="singleChecked(item.ticket_id,index,item.title)"
                :class="{ active: item.is_default == 1 }"
              >
                <svg class="icon" aria-hidden="true" v-if="item.is_default == 1">
                  <use xlink:href="#icon-checked-block" class="is_default1"/>
                </svg>
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#icon-uncheck-line" class="is_default0"/>
                </svg>
              </div>
            </div>
          </div>
          <div v-if="item.used_num >= item.goods_num && item.has_own == '1'" class="owned"></div>
          <div class="owned" v-else-if="item.has_own == '1'"></div>
          <div
            class="coupon_owned"
            v-else-if="item.used_num >= item.goods_num"
            style="top: 12px;right: 4px;"
          ></div>
        </div>
      </div>

      <div class="rule">
        <p
          :style="{'color':goodsDetail.colour.text?goodsDetail.colour.text:''}"
          v-html="description ==''?'':goodsDetail.description.replace(/\n/g, '<br />')"
        ></p>
      </div>
    </div>
    <van-popup class="limit_info" v-model="remindPopShow">
      <h4 class="limit_title">此活动仅限受邀用户参加</h4>
      <div class="limit_img"></div>
      <p class="limit_remind">
        <span>{{time}}</span>秒后回到个人中心
      </p>
    </van-popup>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>

    <van-button
      v-if="has_link_s == '1'"
      type="primary"
      class="receive_btn"
      style="background: #F69A98;border-color:#F69A98;"
    >
      <span>{{page_button==""?page_button:page_button}}</span> (
      <span>{{select_goods}}</span> /
      <span>{{goodsListLenght}}</span> )
    </van-button>
    <van-button
      v-else
      type="primary"
      class="receive_btn"
      :style="{'background':goodsDetail.colour.button?goodsDetail.colour.button:'','border':goodsDetail.colour.button?goodsDetail.colour.button:''}"
      @click="receiveBtn()"
    >
      <span>{{page_button==""?page_button:page_button}}</span> (
      <span>{{select_goods}}</span> /
      <span>{{goodsListLenght}}</span> )
    </van-button>

    <van-popup v-model="pop_two_show" position="center" class="huoba-popup-two">
      <h3 class="pop-two-text-one">
        您只有一次兑换机会哦
        <p>确定兑换吗？</p>
      </h3>
      <div class="pop-two-text-two" @click="continueExchange()">我在想想</div>
      <div class="pop-two-text-three" @click="confirmEexchange()">确定兑换</div>
    </van-popup>

    <van-popup v-model="two_show" position="center" class="huoba-popup-two">
      <h3 class="pop-two-text-one">
        您还可以多选择{{goodsListNumber}}件商品哦
        <p>仅兑换选中的商品吗？</p>
      </h3>
      <div class="pop-two-text-two" @click="continueExchange()">我在想想</div>
      <div class="pop-two-text-three" @click="confirmEexchange()">继续兑换</div>
    </van-popup>
    <!-- 
    <van-popup class="outdated_info" v-model="isOutdated">
      <div class="outdated_title">{{errMsg}}仅受邀用户可参与此活动</div>
      <p class="outdated_remind">5秒后回到个人中心</p>
    </van-popup>-->
  </div>
</template>


<style src="@/style/scss/pages/redeem/v2/goods.scss" lang="scss">
</style>
<script>
import easyNav from "@/components/easyNav";
import { USER_ADDRESS_EDIT, USER_ADDRESS_LIST } from "@/apis/user.js";
import {
  REDEEM_ITEM_POST,
  REDEEM_GOODS,
  REDEEM_EXCHANGE,
} from "@/apis/redeem.js";

export default {
  name: "goods",
  data() {
    return {
      code: "",
      is_checked: false,
      isOutdated: true,
      redeem: "",
      errMsg: "",
      is_default: "0",
      is_owned: "1",
      secShare: "",
      coupons_length: "",
      has_link_s: "",
      disabled_true: "true",
      disabled_false: "false",
      service_day: "",
      description: "",
      page_button: "一键领取",
      pop_two_show: false,
      two_show: false,
      goodsListNumber: "",
      pick_a_few: [],
      goods_type: "",
      goods_Lists: [],
      goodsNameType: "",
      btnShoucang: [],
      referer: "itself",
      checked_book: false,
      checked_ebook: false,
      checked_coupon: false,
      select_goods: "0",
      is_default_arr: [],
      remindPopShow: false,
      goodsListLenght: "0",
      time: 3,
      redeemArr: "",
      goodsDetail: {
        colour: { bg: "", text: "", bt: "" },
      },
      goodsList: [],
      // goodsLoading: false,
      // goodsFinished: false,
      addressShowPopup: false,
      addressData: [],
      addressId: 0,
      percentGoods: [],
      popFlag: false,
      pageShow: true,
    };
  },
  mounted() {
    this.renderingGoods();
  },
  methods: {
    async getGoodsDetail() {
      if (localStorage.getItem("redeemArr")) {
        this.redeemArr = JSON.parse(localStorage.getItem("redeemArr"));
        this.redeemArr.forEach((element, index) => {
          if (element.id == this.redeem) {
            this.referer = element.refer;
            return;
          }
        });
      } else {
        this.referer = "itself";
      }
      var tStamp = this.$getTimeStamp();
      let data = {
        code: this.code,
        redeem_id: this.redeem,
        timestamp: tStamp,
        referer: this.referer,
        is_captcha: 1,
        version: "1.1",
      };
      // console.log(data);
      data.sign = this.$getSign(data);
      let res = await REDEEM_ITEM_POST(data);

      // console.log(res);
      if (res.hasOwnProperty("response_code")) {
        this.goodsDetail = res.response_data;
        this.secShare = res.response_data.sec_share;
        this.goods_type = res.response_data.goods_type;
        this.goodsListLenght = res.response_data.redeem_kind_num;
        this.description = res.response_data.description;
        if (res.response_data.page_button != "") {
          this.page_button = res.response_data.page_button;
        }

        this.service_day = res.response_data.service_day;
        this.has_link_s = res.response_data.has_link;
        this.visitPage();
        this.goodsDetail.colour = JSON.parse(this.goodsDetail.colour);
        document.title = this.goodsDetail.page_title
          ? this.goodsDetail.page_title
          : "火把知识";
      } else if (res.error_code == 0) {
        switch (res.error_message) {
          case "仅受邀用户可参与此活动":
          case "此活动不存在":
          case "此活动已结束":
          case "兑换码已过期":
          case "无效的兑换码！":
          case "该码已经被兑换过！":
          case "该兑换码已经兑换过":
          case "字段[code]值不能为空":
          case "字段[redeem_id]值不能为空":
            this.errMsg = res.error_message;
            this.$toast(res.error_message + "\n5秒后回到个人中心");
            const timer = setInterval(() => {
              this.isOutdated = false;
              clearInterval(timer);
              this.$router.push({ name: "personalIndex" });
            }, 5000);
            break;
          default:
            this.$toast(res.error_message);
            // const timers = setInterval(() => {
            //   clearInterval(timers);
            //   this.$router.go(0);
            // }, 3000);
            break;
        }
      }
      let list = this.goodsDetail.goods_list;
      this.goodsList = [];

      //  加载
      for (let i = 0; i < list.length; i++) {
        // console.log(list[i]);
        if (this.goodsListLenght == list.length) {
          if (
            list[i].has_own == "0" &&
            list[i].used_num < list[i].goods_num &&
            this.has_link_s != "1"
          ) {
            list[i].is_default = "1";
            if (this.goods_type == "2") {
              this.pick_a_few.push(list[i].ticket_id);
            } else {
              this.pick_a_few.push(list[i].goods_id);
            }
            this.is_default_arr.push(list[i].is_default);
            this.percentGoods.push(list[i].title);
          }
        } else {
          list[i].is_default = "0";
        }
        this.goodsList.push(list[i]);
      }
      localStorage.removeItem("goods_Lists");
      localStorage.setItem("goods_Lists", JSON.stringify(this.goodsList));
      // 加载状态结束
      // this.goodsLoading = false
      this.renderingGoods();
    },
    renderingGoods() {
      this.goods_Lists = [];
      if (localStorage.getItem("login_add") == "1") {
        localStorage.removeItem("login_add");
        this.goods_Lists = JSON.parse(
          localStorage.getItem("login_goods_Lists")
        );

        for (let index = 0; index < this.goods_Lists.length; index++) {
          const ele = this.goods_Lists[index];

          if (ele.is_default == "1") {
            if (this.goods_type == "2") {
              this.pick_a_few.push(ele.ticket_id);
            } else {
              this.pick_a_few.push(ele.goods_id);
            }
          }

          for (let r = 0; r < this.goodsList.length; r++) {
            const eles = this.goodsList[r];

            if (ele.has_own == "1") {
              eles.has_own = ele.has_own;
              eles.is_default = "0";
            } else {
              eles.has_own = ele.has_own;
            }
          }
        }

        this.select_goods = this.pick_a_few.length;
        this.goodsList = this.goods_Lists;
        // console.log(this.goods_Lists, 99);
        // console.log(this.pick_a_few, 99);
        // this.$router.go(0);
      } else {
        this.goods_Lists = JSON.parse(localStorage.getItem("goods_Lists"));
        this.select_goods = this.pick_a_few.length;
      }
      // console.log(this.goods_Lists, 99);
    },
    singleChecked(value, id, name) {
      for (let i = 0; i < this.goodsList.length; i++) {
        if (this.goods_type == "2") {
          if (this.goodsList[i].ticket_id == value) {
            if (this.goodsList[i].is_default == "1") {
              this.goodsList[i].is_default = "0";
              var index = this.pick_a_few.indexOf(value);
              var inde_x = this.percentGoods.indexOf(name);
              this.pick_a_few.splice(index, 1);
              this.percentGoods.splice(inde_x, 1);
            } else {
              if (this.pick_a_few.length > this.goodsListLenght) {
                this.goodsList[i].is_default = "0";
              } else if (this.goodsListLenght > this.pick_a_few.length) {
                this.pick_a_few.push(this.goodsList[i].ticket_id);
                this.percentGoods.push(name);
                this.goodsList[i].is_default = "1";
              } else {
                this.$toast("最多只能领取" + this.goodsListLenght + "件商品");
              }
            }
          }
        } else {
          if (this.goodsList[i].goods_id == value) {
            if (this.goodsList[i].is_default == "1") {
              this.goodsList[i].is_default = "0";
              var index = this.pick_a_few.indexOf(value);
              var inde_x = this.percentGoods.indexOf(name);
              this.pick_a_few.splice(index, 1);
              this.percentGoods.splice(inde_x, 1);
            } else {
              if (this.pick_a_few.length > this.goodsListLenght) {
                this.goodsList[i].is_default = "0";
              } else if (this.goodsListLenght > this.pick_a_few.length) {
                this.pick_a_few.push(this.goodsList[i].goods_id);
                this.goodsList[i].is_default = "1";
                this.percentGoods.push(name);
              } else {
                this.$toast("最多只能领取" + this.goodsListLenght + "件商品");
              }
            }
          }
        }
        localStorage.removeItem("goods_Lists");
        localStorage.setItem("goods_Lists", JSON.stringify(this.goodsList));
        this.renderingGoods();
      }
    },
    //领取兑换码
    receiveBtn() {
      if (this.pick_a_few.length > 0) {
        if (this.pick_a_few.length >= this.goodsListLenght) {
          this.pop_two_show = true;
        } else {
          this.two_show = true;
          this.goodsListNumber = this.goodsListLenght - this.pick_a_few.length;
        }
      } else {
        if (this.goods_type == "2") {
          this.$toast("请选择优惠券");
        } else {
          this.$toast("请选择商品");
        }
      }
    },
    continueExchange() {
      this.pop_two_show = false;
      this.two_show = false;
    },
    async confirmEexchange() {
      var tStamp = this.$getTimeStamp();
      let data = {
        code: this.code,
        timestamp: tStamp,
        redeem_id: this.redeem,
        target_ids: this.pick_a_few.join(","),
        referer: this.referer,
        is_captcha: 1,
        version: "1.1",
      };
      data.sign = this.$getSign(data);
      let res = await REDEEM_EXCHANGE(data);

      if (res.error_code == 99) {
        // 未登录
        localStorage.setItem(
          "login_goods_Lists",
          JSON.stringify(this.goods_Lists)
        );
        localStorage.setItem("login_add", 1);
        localStorage.setItem("select_goods", this.select_goods);
        // if (true) {
        if (localStorage.getItem("unionid")) {
          this.$router.push({ name: "redeemLogin" });
        } else {
          this.$router.push({ name: "login" });
        }
      } else if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        localStorage.removeItem("login_goods_Lists");
        localStorage.removeItem("login_add");
        localStorage.removeItem("select_goods");
        let data = res.response_data;

        if (this.goods_type == "2") {
          this.goodsNameType = "coupons";
          this.coupons_length = this.percentGoods.length;
        } else if (this.service_day > 0) {
          this.goodsNameType = "service_day";
        } else {
          this.goodsNameType = "goods";
        }

        if (this.isApp()) {
          // APP
          this.$router.push({
            name: "appSuccess",
            query: {
              goodsName: this.percentGoods,
              resData: data,
              coupons_length: this.coupons_length,
              service_day: this.service_day,
              goodsNameType: this.goodsNameType,
            },
          });
        } else {
          //  WAP
          this.$router.push({
            name: "wapSuccess",
            query: {
              goodsName: this.percentGoods,
              service_day: this.service_day,
              coupons_length: this.coupons_length,
              goodsNameType: this.goodsNameType,
            },
          });
        }
      } else {
        if (this.isApp()) {
          // APP
          this.$router.push({
            name: "appFail",
            query: { errorMsg: res.error_message },
          });
        } else {
          //  WAP
          this.$router.push({
            name: "wapFail",
            query: { errorMsg: res.error_message },
          });
        }
      }
    },
    goodsRedeem(item) {
      if (item != undefined) {
        this.percentGoods = item;
        sessionStorage.setItem("goodsItem", JSON.stringify(item));
        sessionStorage.setItem("goodsType", "goods");
      }
      this.submitRedeem();
    },
    // 是否是APP
    isApp() {
      if (
        localStorage.getItem("isHuobaIosLogin") == "yes" ||
        localStorage.getItem("isHuobaAndroidLogin") == "yes"
      ) {
        return true;
      } else {
        return false;
      }
    },
    visitPage() {
      if (
        this.secShare == "0" &&
        localStorage.getItem("originLink") == "itself"
      ) {
        // 不可二次分享
        this.remindPopShow = true;
        const timer = setInterval(() => {
          this.time--;
          if (this.time == 0) {
            this.remindPopShow = false;
            clearInterval(timer);
            this.$router.push({ name: "personalIndex" });
          }
        }, 1000);
      }
    },
  },
  created() {
    this.code = this.$route.query.code;
    this.redeem = this.$route.query.redeem_id;
    localStorage.setItem("hash", window.location.hash);
  },
  mounted() {
    let _this = this;
    this.getGoodsDetail().then(function () {
      if (sessionStorage.getItem("fromRedeemLogin") == "1") {
        if (_this.goodsDetail.goods_type != 3) {
          // 非实物商品
          _this.pageShow = false;
        }
        _this.popFlag = false;
        _this.goodsRedeem(JSON.parse(sessionStorage.getItem("goodsItem")));
        sessionStorage.setItem("fromRedeemLogin", "0");
      }
    });
  },
};
</script>
