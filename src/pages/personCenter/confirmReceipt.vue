<template>
  <div class="confirmReceipt">
    <page-nav :title="'订单确认'"></page-nav>
    <main>
      <section>
        <p>{{defaultConsignee.name}} {{defaultConsignee.tel}} </p>
        <van-cell v-if="defaultConsignee.province" :border="false"
                  :title="defaultConsignee.wholeAddressInfo"/>
      </section>


      <section class="orderItem" v-for="(item,index) in orderData.items" :key="index">
        <div>
          <img width="90px" height="92px" :src="item.goods.pic | setImg" alt="">
        </div>
        <div>
          <p><span class="title">{{item.goods.name}}</span></p>
          <p>{{item.title}}</p>
          <p><span>¥{{item.price}} </span> <span>x {{item.count}}</span> <span>
      <van-stepper disabled integer button-size="24" v-model="item.count"/>
      </span></p>
        </div>
      </section>

      <van-field v-model="message" label="备注" placeholder="请输入备注"/>


    </main>

    <van-popup class="popup" position="bottom" v-model="popupShow">
      <p style="text-align: center;margin:0 0 16px;font-size: 20px">
        选择支付方式
      </p>

      <van-radio-group v-model="payType">
        <van-cell-group>

          <van-cell :border="false" clickable @click="payType = 'alipay'">
            <template #right-icon>
              <van-radio name="alipay"/>
            </template>
            <template #title>
              <van-icon size="30" :name="require('../../assets/zfbLogo.png')"/>
              <span class="custom-title">支付宝</span>
            </template>
          </van-cell>

          <van-cell :border="false" clickable @click="payType = 'wechat'">
            <template #right-icon>
              <van-radio name="wechat"/>
            </template>

            <template #title>
              <van-icon size="30" name="chat"/>
              <span class="custom-title">微信支付</span>
            </template>
          </van-cell>


        </van-cell-group>
      </van-radio-group>
      <van-button round block @click="toPay()" type="info">确认支付</van-button>

    </van-popup>
    <footer>
      <van-submit-bar button-color="#2A91F0" :decimal-length="2" :label="titleNume" :price="totalPrice"
                      :button-text="buttonText" @submit="onSubmit">
      </van-submit-bar>
    </footer>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Icon, Cell, Button, Stepper, Radio, Popup, CellGroup, RadioGroup, Toast, SubmitBar, Field} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';
  import {mul} from "../../config/Utils";

  export default {
    name: "confirmReceipt",
    components: {
      pageNav,
      Toast,
      [Button.name]: Button,
      [CellGroup.name]: CellGroup,
      [RadioGroup.name]: RadioGroup,
      [Field.name]: Field,
      [Popup.name]: Popup,
      [Radio.name]: Radio,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Stepper.name]: Stepper,
      [SubmitBar.name]: SubmitBar,

    },
    data() {
      return {
        aliChannel: null,
        wxChannel: null,
        payType: 'alipay',//
        code: '',//查询code
        defaultConsignee: {}, // 收货地址信息
        popupShow: false, // 弹出层控制
        message: '',//备注
        titleNume: '共 1 件 合计：',
        successMsg: {},//订单信息
        totalPrice: 0,
        showFooter: false,
        orderData: {}
      }
    },
    methods: {
      onSubmit() {//
        if (this.buttonText == '确认收货') {
          let orderSn = this.$route.query.orderSn;
          http.post(`${urls.confirmOrderSn}/${orderSn}`, {}).then(res => {

          }).catch(err => {

          })
        } else {
          // this.popupShow = true;
        }
      },
      toPay() {
        switch (this.payType) {
          case 'alipay':
            this.alipay();
            break;
          case 'wechat':
            this.wechatPay();
            break

        }
      },

      wechatPay() { // 微信支付
        let useAccBalance = 0;
        http.post(`${urls.wxpay}?orderSn=${this.$route.query.orderSn}&useAccBalance=${useAccBalance}`, {}).then(res => {
          if (res.success) {
            plus.payment.getChannels(function (channels) {
              for (var i in channels) {
                if (channels[i].id == 'wxpay') {  // 获取支付通道 ，微信支付通道
                  plus.payment.request(channels[i], res.data, function (result) { // 提交支付调用微信支付
                    plus.nativeUI.alert("支付成功！", function () {
                      // back();
                      this.$router.push({path: '/paySuccess', query: {orderSn: this.$route.query.orderSn}})

                    });
                  }, function (error) {
                    plus.nativeUI.alert("支付失败");
                  });

                }
              }
            }, function (e) {
              // plus.nativeUI.alert("支付失败：" + e.message);
            });

          } else {
            Toast.fail(res.msg)
          }

        }).catch(err => {

        })
      },

      alipay() { // 支付宝支付
        let useAccBalance = 0;
        http.post(`${urls.alipay}?orderSn=${this.$route.query.orderSn}&useAccBalance=${useAccBalance}`, {}).then(res => {
          if (res.success) {
            plus.payment.getChannels(function (channels) { // 手机端调用 支付 使用的hbuilderx 提供的支付方式
              for (var i in channels) {
                if (channels[i].id == 'alipay') { // 获取支付通道 ，支付宝支付通道
                  plus.nativeUI.alert(channels[i].id, channels[i].description, channels[i].serviceReady);
                  plus.payment.request(channels[i], res.data, function (result) { // 提交支付调用支付宝
                    plus.nativeUI.alert("支付成功！", function () {
                      this.$router.push({path: '/paySuccess', query: {orderSn: this.$route.query.orderSn}})
                    });
                  }, function (error) {
                    plus.nativeUI.alert("支付失败");
                  });

                } else {
                  // plus.nativeUI.alert("暂不支持该支付方式");
                }
              }
            }, function (e) {
              // plus.nativeUI.alert("支付失败：" + e.message);
            });

          } else {
            Toast.fail(res.msg)
          }

        }).catch(err => {

        })
      },


      getDetail(orderSn) { // 根据订单号查询订单信息
        const toast = Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: false,
          message: '数据加载中',
        });
        http.get(`${urls.orderSn}/${orderSn}`, {}).then(res => {
          toast.clear();
          if (res.success) {
            this.orderData = res.data;

            this.defaultConsignee = res.data.address;
            this.addTotal();
          }

        })
      },

      addTotal() { //计算价格
        let total = 0;
        let totalPrice = 0;
        this.orderData.items.forEach(item => {
          total += item.count;
          totalPrice += mul(item.count, item.price)
        });
        this.titleNume = `共 ${total} 件 合计: `;
        this.totalPrice = totalPrice * 100 // 展示到分
      },
    },
    created() {
      if (this.$route.query.footer) {
        this.showFooter = true;
        this.buttonText = this.$route.query.text;
      }
    },
    mounted() {
      this.getDetail(this.$route.query.orderSn);
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    padding: 10px 10px 50px;
    background-color: #F5F5F5;
    /deep/ .van-field {
      border-radius: 5px;
    }
    .red {
      font-size: 12px;
      color: #E44A4A;
    }
    > section {
      border-radius: 5px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      font-weight: 500;
      @include sc(14px, rgba(83, 83, 83, 1));
      text-align: left;
      &:nth-child(1) {
        margin-bottom: 15px;
        padding: 1px 12px 10px;
        .van-cell {
          padding: 0;
        }
        p {
          margin: 10px 0 !important;
        }
        .van-icon {
          top: 2px;
        }
        .van-cell {
          background: rgba(255, 255, 255, 1);
        }
      }
    }

    .orderItem {
      padding: 15px;
      margin: 5px 0;
      display: flex;
      > div {
        flex: 1;
        flex-shrink: 0;
        &:first-child {
          flex: 1;
        }
        &:last-child {
          flex: 2;
          padding-left: 5px;
          text-align: left;
          box-sizing: border-box;
          p {
            margin: 10px 0;
            @include sc(12px, #5F5F5F);
            .title {
              font-weight: 600;
              @include sc(14px, #5F5F5F)
            }
            &:nth-child(2) {
              @include sc(12px, #898989)
            }
            &:nth-child(3) {
              overflow: hidden;
              position: relative;
              height: 24px;

              span {
                &:first-child {
                  @include sc(15px, #FF6464)
                }
                &:nth-child(2) {
                  @include sc(13px, #959595);
                  margin-left: 5px;
                }
                &:nth-child(3) {
                  position: absolute;
                  right: 0;
                  top: -2px;
                }
              }
            }
          }
        }
      }
    }
  }

  .popup {
    width: 100%;
    padding: 30px 10px;
    border-radius: 5px;
    box-sizing: border-box;
    .van-cell__title {
      text-align: left;
      line-height: 50px;
      span {
        font-size: 18px;
      }
    }
    .van-icon {
      top: 10px;
    }
    /deep/ .van-button {
      width: 80%;
      margin: 20px auto;

    }
  }

  .color {
    color: #9D9D9D
  }

</style>
