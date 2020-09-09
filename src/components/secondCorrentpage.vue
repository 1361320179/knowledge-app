<template>
  <div id="secondCorrentpage">
    <template v-if="items.column_type == 9 || items.column_type == 4 || items.column_type == 3 && secondData.activekey == index">
      <div class="screenSecond">
        <div class="sort_box" @click="sort_choose">
          <div class="sort_text" :style="{'color': sort_show_color?'#EF5755':''}">
            <div class="screen_text">{{ sort_text_1 }}</div>
            <svg class="icon" aria-hidden="true" v-if="sort_show">
              <use xlink:href="#icon-unfold-line" />
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-fold-line" />
            </svg>
          </div>
          <ul v-if="sort_show">
            <li @click="sort_choosetext('综合排序','')">综合排序</li>
            <li @click="sort_choosetext('销量从高到低','buynum_desc')">销量从高到低</li>
            <li @click="sort_choosetext('价格从低到高','buynum_asc')">价格从低到高</li>
            <li @click="sort_choosetext('价格从高到低','price_desc')">价格从高到低</li>
            <li @click="sort_choosetext('价格从低到高','price_asc')">价格从低到高</li>
          </ul>
        </div>
        <div class="price_box">
          <div class="price_text" @click="price_choose" :style="{'color': price_show_color?'#EF5755':''}">
            <div class="screen_text">{{ price_text_1 }}</div>
            <svg class="icon" aria-hidden="true" v-if="price_show">
              <use xlink:href="#icon-unfold-line" />
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-fold-line" />
            </svg>
          </div>
          <div class="price_keyboard" v-if="price_show">
            <div class="price_input">
              <van-field
                type="digit"
                v-model="sdigit"
                placeholder="最低价"
              />
              <div class="price_line">
                <div class="line"></div>
              </div>
              <van-field
                type="digit"
                v-model="edigit"
                placeholder="最高价"
              />
            </div>
            <div class="price-button">
              <div class="reset-button" @click="price_reset">重置</div>
              <div class="sure-button" @click="price_sure">确定</div>
            </div>
          </div>
        </div>
        <!--火把号筛选-->
        <div class="huoba_box" v-if="items.column_type == 9 || items.column_type == 4">
          <div class="huoba_text" @click="huoba_choose" :style="{'color': huoba_show_color?'#EF5755':''}">
            <div class="screen_text">{{ huoba_text }}</div>
            <svg class="icon" aria-hidden="true" v-if="huoba_show">
              <use xlink:href="#icon-unfold-line" />
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-fold-line" />
            </svg>
          </div>
          <div class="huoba_radio" v-if="huoba_show">
            <div class="radios" v-if="secondData.brand_list_length">
              <van-radio-group v-model="huoba_radio">
                <div v-for="(item,index) in brand_list" :key="index">
                  <van-radio :name="index+1">{{ item.brand_name }}</van-radio>
                </div>
              </van-radio-group>
            </div>
            <div class="radios" v-else>
              无可选火把号
            </div>
            <div class="huoba-button">
              <div class="reset-button" @click="huoba_reset">重置</div>
              <div class="sure-button" @click="huoba_sure">确定</div>
            </div>
          </div>
        </div>
        <!--店铺筛选-->
        <div class="huobashop_box" v-else>
          <div class="huobashop_text" @click="huobashop_choose" :style="{'color': huobashop_show_color?'#EF5755':''}">
            <div class="screen_text">{{ huobashop_text }}</div>
            <svg class="icon" aria-hidden="true" v-if="huobashop_show">
              <use xlink:href="#icon-unfold-line" />
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-fold-line" />
            </svg>
          </div>
          <div class="huobashop_radio" v-if="huobashop_show">
            <div class="radios" v-if="secondData.brand_list_length">
              <van-radio-group v-model="huobashop_radio">
                <div v-for="(item,index) in brand_list" :key="index">
                  <van-radio :name="index+1">{{ item.brand_name }}</van-radio>
                </div>
              </van-radio-group>
            </div>
            <div class="radios" v-else>
              无可选火把店铺
            </div>
            <div class="huobashop-button">
              <div class="reset-button" @click="huobashop_reset">重置</div>
              <div class="sure-button" @click="huobashop_sure">确定</div>
            </div>
          </div>
        </div>
        <div class="only_pay" @click="is_pay" v-if="items.column_type == 9 || items.column_type == 4">
          <van-checkbox v-model="secondData.needs_pay">仅看付费</van-checkbox>
        </div>
        <div class="only_shop" @click="is_shop" v-else>
          <van-checkbox v-model="secondData.needs_pay">仅看有货</van-checkbox>
        </div>
      </div>
    </template>
    <template v-if="sort_show || price_show || huoba_show || huobashop_show">
      <div class="screenOverflow" @click="stop_shade"></div>
    </template>
  </div>
</template>

<style lang="scss">
  .van-tabs__content--animated {
    overflow: unset;
  }
  .van-cell{
    padding: 15px 35px;
    line-height: 30px;
  }
  .van-field__control{
    padding-left: 10px;
  }
  .van-icon{
    padding-right: 10px;
  }
  .van-field__body{
    border-radius: 30px;
    background-color: rgba(242, 242, 242, 1);
  }
  .van-cell:not(:last-child):after{
    border-bottom: none;
  }
  .van-radio__icon--checked .van-icon {
    color: #F05654;
    border-color: #F05654 ;
    background-color: #FFF7F7;
  }
  .van-checkbox__icon--checked .van-icon {
    color: #F05654;
    border-color: #F05654 ;
    background-color: #FFF7F7;
  }
  .van-checkbox__label {
    color: #F05654;
    margin-left: 2px;
  }
  .van-checkbox__icon .van-icon {
    font-size: 12px;
    line-height: initial;
    width: 15px;
    height: 15px;
  }
  #secondCorrentpage{
    .screenSecond{
      position: relative;
      display: flex;
      background-color: $white;
      height: 40px;
      align-items: center;
      box-shadow: 0 0 10px 0 rgba(0,0,0,.06);
      border-bottom: 1px solid #eee;
      .sort_box{
        flex-basis: 22%;
        overflow: hidden;
        .sort_text{
          position: relative;
          font-size: 14px;
          padding-left: 10px;
          color: #333333;
          .icon{
            font-size: 12px;
            position: absolute;
            right: 0;
            top: 5px;
          }
        }
        ul{
          position: absolute;
          top: 41px;
          background-color: $white;
          width: 100%;
          line-height: 30px;
          z-index: 2001;
          box-shadow: 0 0 10px 0 rgba(0,0,0,.06);
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          li{
            padding: 0 10px;
          }
        }
      }
      .price_box{
        flex-basis: 22%;
        overflow: hidden;
        .price_text{
          position: relative;
          font-size: 12px;
          padding-left: 10px;
          color: #333333;
          .icon{
            font-size: 14px;
            position: absolute;
            right: 0;
            top: 3px;
          }
        }
        .price_keyboard{
          position: absolute;
          top: 41px;
          left: 0;
          background-color: $white;
          width: 100%;
          height: 95px;
          z-index: 2001;
          box-shadow: 0 0 10px 0 rgba(0,0,0,.06);
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          .price_input{
            display: flex;
            align-items: center;
            .price_line{
              flex-grow: 1;
              .line{
                border-bottom: 1px solid #999;
                width: 20px;
              }
            }
          }
          .price-button{
            display: flex;
            align-items: center;
            line-height: 35px;
            text-align: center;
            color: rgb(84, 172, 240);
            .reset-button{
              flex-grow: 1;
              border-top: 1px solid #eee;
            }
            .sure-button{
              flex-grow: 1;
              background-color: rgba(17, 142, 233, 1);
              color: $white;
              border-bottom-right-radius: 15px;
            }
          }
        }
      }
      .huoba_box{
        flex-basis: 25%;
        overflow: hidden;
        .huoba_text{
          position: relative;
          font-size: 14px;
          padding-left: 10px;
          color: #333333;
          .icon{
            font-size: 12px;
            position: absolute;
            right: 0;
            top: 5px;
          }
        }
        .huoba_radio{
          position: absolute;
          top: 41px;
          left: 0;
          background-color: $white;
          width: 100%;
          z-index: 2001;
          box-shadow: 0 0 10px 0 rgba(0,0,0,.06);
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          .radios{
            padding: 0 15px;
            line-height: 40px;
            max-height: 160px;
            overflow: scroll;
          }
          .huoba-button{
            display: flex;
            align-items: center;
            line-height: 35px;
            text-align: center;
            color: rgb(84, 172, 240);
            .reset-button{
              flex-grow: 1;
              border-top: 1px solid #eee;
            }
            .sure-button{
              flex-grow: 1;
              background-color: rgba(17, 142, 233, 1);
              color: $white;
              border-bottom-right-radius: 15px;
            }
          }
        }
      }
      .huobashop_box{
        flex-basis: 22%;
        overflow: hidden;
        .huobashop_text{
          position: relative;
          font-size: 14px;
          padding-left: 10px;
          color: #333333;
          .icon{
            font-size: 12px;
            position: absolute;
            right: 0;
            top: 5px;
          }
        }
        .huobashop_radio{
          position: absolute;
          top: 41px;
          left: 0;
          background-color: $white;
          width: 100%;
          z-index: 2001;
          box-shadow: 0 0 10px 0 rgba(0,0,0,.06);
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          .radios{
            padding: 0 15px;
            line-height: 40px;
            max-height: 160px;
            overflow: scroll;
          }
          .huobashop-button{
            display: flex;
            align-items: center;
            line-height: 35px;
            text-align: center;
            color: rgb(84, 172, 240);
            .reset-button{
              flex-grow: 1;
              border-top: 1px solid #eee;
            }
            .sure-button{
              flex-grow: 1;
              background-color: rgba(17, 142, 233, 1);
              color: $white;
              border-bottom-right-radius: 15px;
            }
          }
        }
      }
      .only_pay {
        padding-left: 10px;
        flex-shrink: 0;
      }
      .only_shop {
        padding-left: 10px;
        flex-shrink: 0;
      }
      .screen_text{
        @include textOverflow;
      }
    }
    .screenOverflow{
      position: fixed;
      background-color: rgba(0,0,0,.4);
      width: 100%;
      height: 100%;
      z-index: 2000;
    }
  }
</style>

<script>
  import { setTimeout } from 'timers';
  export default {
    name: "second-correntpage",
    props: ["items","secondData","brand_list","index"],
    data(){
      return{
        sdigit: '',
        edigit: '',
        // 搜索结果参数
        sort_text_1: '综合排序',
        price_text_1: '价格区间',
        huoba_text: '所属火把号',
        huoba_radio: '',
        huobashop_text: '所属店铺',
        huobashop_radio: '',
        sort_show: 0,
        sort_show_color: 0,
        price_show: 0,
        price_show_color: 0,
        huoba_show: 0,
        huoba_show_color: 0,
        huobashop_show: 0,
        huobashop_show_color: 0,
        sort_num: 0,
      }
    },
    mounted(){

    },
    methods: {
      // 仅看有货
      is_shop () {
        if (this.secondData.has_stock == 0) {
          document.getElementsByClassName('van-checkbox__label')[0].style.cssText = "color: #F05654";
          this.secondData.has_stock = 1;
        } else {
          document.getElementsByClassName('van-checkbox__label')[0].style.cssText = "color: #333";
          this.secondData.has_stock = 0;
        }
        this.secondData.is_brandData = true;
        this.secondData.page = 1;
        this.$emit("getBooks");
      },
      // 仅看付费
      is_pay () {
        if (this.secondData.needs_pay == 0) {
          document.getElementsByClassName('van-checkbox__label')[0].style.cssText = "color: #F05654";
          this.secondData.needs_pay = 1;
        } else {
          document.getElementsByClassName('van-checkbox__label')[0].style.cssText = "color: #333";
          this.secondData.needs_pay = 0;
        }
        this.secondData.is_brandData = true;
        this.secondData.page = 1;
        this.$emit("getGoods");
      },
      // 火把号店铺筛选
      huobashop_choose () {
        this.huobashop_show ? (this.huobashop_show = 0) : (this.huobashop_show = 1);
        if (this.huobashop_text == '所属店铺') {
          this.huobashop_show_color ? (this.huobashop_show_color = 0) : (this.huobashop_show_color = 1);
        } else {
          this.huobashop_show_color = true;
        }
        // 综合排序关闭
        if (this.sort_num > 0) {
          this.sort_show_color = true;
        } else {
          this.sort_show_color = false;
        }
        this.sort_show = false;
        // 价格区间关闭
        if (this.price_text_1 == '价格区间') {
          this.price_show_color = false;
        } else {
          this.price_show_color = true;
        }
        this.price_show = false;
      },
      huobashop_reset () {
        this.huobashop_radio = '';
      },
      huobashop_sure () {
        if (this.huobashop_radio == '') {
          this.huobashop_show_color = false;
          this.huobashop_text = '所属店铺';
          this.secondData.isbrand_id = 0;
        } else {
          this.huobashop_show_color = true;
          this.huobashop_text = this.brand_list[this.huobashop_radio - 1].brand_name;
          this.secondData.isbrand_id = this.brand_list[this.huobashop_radio - 1].brand_id;;
        }
        this.secondData.is_brandData = true;
        this.secondData.page = 1;
        this.$emit("getBooks");
        this.huobashop_show = false;
      },
      // 火把号筛选
      huoba_choose () {
        this.huoba_show ? (this.huoba_show = 0) : (this.huoba_show = 1);
        if (this.huoba_text == '所属火把号') {
          this.huoba_show_color ? (this.huoba_show_color = 0) : (this.huoba_show_color = 1);
        } else {
          this.huoba_show_color = true;
        }
        // 综合排序关闭
        if (this.sort_num > 0) {
          this.sort_show_color = true;
        } else {
          this.sort_show_color = false;
        }
        this.sort_show = false;
        // 价格区间关闭
        if (this.price_text_1 == '价格区间') {
          this.price_show_color = false;
        } else {
          this.price_show_color = true;
        }
        this.price_show = false;
      },
      huoba_reset () {
        this.huoba_radio = '';
      },
      huoba_sure () {
        if (this.huoba_radio == '') {
          this.huoba_show_color = false;
          this.huoba_text = '所属火把号';
        } else {
          this.huoba_show_color = true;
          this.huoba_text = this.brand_list[this.huoba_radio - 1].brand_name;
          this.secondData.isbrand_id = this.brand_list[this.huoba_radio - 1].brand_id;;
        }
        this.secondData.is_brandData = true;
        this.secondData.page = 1;
        this.$emit("getGoods");
        this.huoba_show = false;
      },
      // 关闭遮罩
      stop_shade () {
        this.sort_show = 0;
        this.price_show = 0;
        this.huoba_show = 0;
        this.huobashop_show = 0;
        if (this.sort_num > 0) {
          this.sort_show_color = true;
        } else {
          this.sort_show_color = false;
        }
        if (this.price_text_1 == '价格区间') {
          this.price_show_color = false;
        } else {
          this.price_show_color = true;
        }
        if (this.huoba_text == '所属火把号') {
          this.huoba_show_color = false;
        } else {
          this.huoba_show_color = true;
        }
        if (this.huobashop_text == '所属店铺') {
          this.huobashop_show_color = false;
        } else {
          this.huobashop_show_color = true;
        }
      },
      // 价格区间
      price_choose () {
        this.price_show ? (this.price_show = 0) : (this.price_show = 1);
        if (this.price_text_1 == '价格区间') {
          this.price_show_color ? (this.price_show_color = 0) : (this.price_show_color = 1);
        } else {
          this.price_show_color = true;
        }
        // 综合排序关闭
        if (this.sort_num > 0) {
          this.sort_show_color = true;
        } else {
          this.sort_show_color = false;
        }
        this.sort_show = false;
        // 所属火把号关闭
        if (this.huoba_text == '所属火把号') {
          this.huoba_show_color = false;
        } else {
          this.huoba_show_color = true;
        }
        this.huoba_show = false;
        // 所属火把店铺关闭
        if (this.huobashop_text == '所属店铺') {
          this.huobashop_show_color = false;
        } else {
          this.huobashop_show_color = true;
        }
        this.huobashop_show = false;
      },
      price_reset () {
        this.sdigit = '';
        this.edigit = '';
      },
      price_sure () {
        if (this.sdigit || this.edigit !== '') {
          if (this.sdigit == '') {
            this.price_text_1 = parseInt(this.edigit) + '元以上';
            this.secondData.search_price = parseInt(this.edigit) + '_';
            this.price_show_color = true;
          } else if (this.edigit == '') {
            this.price_text_1 = parseInt(this.sdigit) + '元以上';
            this.secondData.search_price = parseInt(this.sdigit) + '_';
            this.price_show_color = true;
          } else if (this.sdigit == this.edigit) {
            this.price_text_1 = parseInt(this.sdigit) + '元以上';
            this.secondData.search_price = parseInt(this.sdigit) + '_';
            this.price_show_color = true;
          } else if (this.sdigit > this.edigit) {
            this.price_text_1 = parseInt(this.edigit) + '-' + parseInt(this.sdigit) + '元';
            this.secondData.search_price = parseInt(this.edigit) + '_' + parseInt(this.sdigit);
            this.price_show_color = true;
          } else if (this.sdigit < this.edigit) {
            this.price_text_1 = parseInt(this.sdigit) + '-' + parseInt(this.edigit) + '元';
            this.secondData.search_price = parseInt(this.sdigit) + '_' + parseInt(this.edigit);
            this.price_show_color = true;
          }
          this.secondData.is_brandData = true;
          this.secondData.page = 1;
          if (this.secondData.goods_type == 3) {
            this.$emit("getBooks");
          } else {
            this.$emit("getGoods");
          }
        } else {
          this.price_text_1 = '价格区间';
          this.secondData.search_price = '';
          this.price_show_color = false;
        }
        this.price_show ? (this.price_show = 0) : (this.price_show = 1);
      },
      // 综合排序
      sort_choose () {
        this.sort_show ? (this.sort_show = 0) : (this.sort_show = 1);
        if (this.sort_num > 0) {
          this.sort_show_color ? (this.sort_show_color = 1) : (this.sort_show_color = 1);
        } else {
          this.sort_show_color ? (this.sort_show_color = 0) : (this.sort_show_color = 1);
        }
        // 价格区间关闭
        if (this.price_text_1 == '价格区间') {
          this.price_show_color = false;
        } else {
          this.price_show_color = true;
        }
        this.price_show = false;
        // 所属火把号关闭
        if (this.huoba_text == '所属火把号') {
          this.huoba_show_color = false;
        } else {
          this.huoba_show_color = true;
        }
        this.huoba_show = false;
        // 所属火把店铺关闭
        if (this.huobashop_text == '所属店铺') {
          this.huobashop_show_color = false;
        } else {
          this.huobashop_show_color = true;
        }
        this.huobashop_show = false;
      },
      // 综合排序
      sort_choosetext (item,sort) {
        this.sort_num++;
        this.sort_show ? (this.sort_show = 1) : (this.sort_show = 0);
        this.sort_text_1 = item;
        this.secondData.search_sort = sort;
        this.secondData.is_brandData = true;
        this.secondData.page = 1;
        if (this.secondData.goods_type == 3) {
          this.$emit("getBooks");
        } else {
          this.$emit("getGoods");
        }
      },
    }
  };
</script>
