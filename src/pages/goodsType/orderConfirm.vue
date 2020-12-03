<template>
  <div class="orderConfirm">
    <page-nav :title="'订单确认'"></page-nav>
    <main>

      <section>
        <p>{{defaultConsignee.name}} {{defaultConsignee.tel}} </p>
        <van-cell v-if="defaultConsignee.province" :border="false"
                  :title="defaultConsignee.wholeAddressInfo"
                  is-link @click="toPath('/receiptAddress',{from: true})"/>
        <p v-if="defaultConsignee.isDefault" class="red">
          <van-icon name="passed"/>
          已设为默认
        </p>
      </section>


      <section class="orderItem" v-for="(item,index) in chooseCart" :key="index">
        <div>
          <img width="90px" height="92px" :src="item.goods.pic | setImg" alt="">
        </div>
        <div>
          <p><span class="title">{{item.goods.name}}</span></p>
          <p>{{item.title}}</p>
          <p><span>¥{{item.price}} </span> <span>x {{item.count}}</span> <span>
               <van-stepper @change="stpChange(item)" integer button-size="24" v-model="item.count"/>
              </span></p>
        </div>
      </section>

      <van-field v-model="message" label="备注" placeholder="请输入备注"/>


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
                <span class="custom-title">支付宝支付</span>
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

    </main>
    <footer>
      <van-submit-bar button-color="#2A91F0" :decimal-length="2" :label="titleNume" :price="totalPrice"
                      :loading="btnLoading" button-text="提交订单" @submit="onSubmit">
      </van-submit-bar>
    </footer>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav';
  import {
    Icon,
    Form,
    Cell,
    Popup,
    Field,
    CellGroup,
    Stepper,
    Button,
    Calendar,
    Toast,
    SubmitBar,
    RadioGroup,
    Radio,
  } from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';
  import {getlocalStorage, getSessionStorage, removeSessionStorage, mul} from "../../config/Utils";
  import {mapState} from 'vuex'

  export default {
    name: "orderConfirm",
    components: {
      pageNav,
      [RadioGroup.name]: RadioGroup,
      [Form.name]: Form,
      [Field.name]: Field,
      [Calendar.name]: Calendar,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Stepper.name]: Stepper,
      [SubmitBar.name]: SubmitBar,
      [CellGroup.name]: CellGroup,
      [Radio.name]: Radio,
      [Toast.name]: Toast,
      [Popup.name]: Popup,
      [Button.name]: Button,


    },
    data() {
      return {
        btnLoading:true,
        orderSn: '', // 订单编号
        payType: 'wechat',  // 支付方式
        code: '',//查询code
        defaultConsignee: {}, // 收货地址信息
        popupShow: false, // 弹出层控制
        message: '',//备注
        titleNume: '共 1 件 合计：',
        successMsg: {},//订单信息
        totalPrice: 0,
        newDate: '', // 向后取一周时间,
        channel: null, // 支付相关
      }
    },
    computed: {
      ...mapState(['chooseCart']), // 购物车缓存
    },
    methods: {

      toPath(url, data) { // 路由跳转
        if (data) {
          this.$router.push({path: url, query: data}); //跳转地址设置
          return
        }
        this.$router.push(url)
      },


      stpChange(data) { // 商品数量变化
        http.post(`${urls.updateCart}/${data.id}/${data.count}`, {}).then(res => {
          if (res.success) {
            this.addTotal();
          }
        }).catch(err => {

        })
      },
      toggle(index) { // 选择
        this.$refs.checkboxes[index].toggle();
      },

      onSubmit() { // 提交订单
        let params = {};
        let ids = this.chooseCart.map(item => {
          return item.id
        });
        params.idAddress = this.defaultConsignee.id;
        params.message = this.message;
        params.idCarts = ids.join();
        let formData = new FormData();
        for (let item in params) {
          formData.append(item, params[item]);
        }
        this.btnLoading = true;
        http.post(urls.saveOrder, formData).then(res => {
          if (res.success) {
            this.btnLoading = false;
            // this.orderSn = res.data.orderSn;
            // this.popupShow = true;
          }

        }).catch(err => {

        })
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
        http.post(`${urls.wxpay}?orderSn=${this.orderSn}&useAccBalance=${useAccBalance}`, {}).then(res => {
          if (res.success) {
            plus.payment.getChannels(function (channels) {
              for (var i in channels) {
                if (channels[i].id == 'wxpay') {  // 获取支付通道 ，微信支付通道
                  plus.payment.request(channels[i], res.data, function (result) { // 提交支付调用微信支付
                    plus.nativeUI.alert("支付成功！", function () {
                      // back();
                      this.$router.push({path: '/paySuccess', query: {orderSn: this.orderSn}})

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
        http.post(`${urls.alipay}?orderSn=${this.orderSn}&useAccBalance=${useAccBalance}`, {}).then(res => {
          if (res.success) {
            plus.payment.getChannels(function (channels) { // 手机端调用 支付 使用的hbuilderx 提供的支付方式
              for (var i in channels) {
                if (channels[i].id == 'alipay') { // 获取支付通道 ，支付宝支付通道
                  plus.nativeUI.alert(channels[i].id, channels[i].description, channels[i].serviceReady);
                  plus.payment.request(channels[i], res.data, function (result) { // 提交支付调用支付宝
                    plus.nativeUI.alert("支付成功！", function () {
                      this.$router.push({path: '/paySuccess', query: {orderSn: this.orderSn}})
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

      addTotal() { //计算价格
        let total = 0;
        let totalPrice = 0;
        this.chooseCart.forEach(item => {
          total += item.count;
          totalPrice += mul(item.count, item.price)
        });
        this.titleNume = `共 ${total} 件 合计: `;
        this.totalPrice = totalPrice * 100 // 展示到分
      },

      getAddress() { // 查询地址
        http.get(urls.queryAddress, {}).then(res => {
          this.isLoding = false;
          if (res.success) {
            let addressData = res.data || [];
            addressData.forEach(item => {
              if (item.isDefault) {
                this.defaultConsignee = item;
                return
              }
            });
          }

        }).catch(err => {

        })
      },

      plusReady() {
        // 获取支付通道

      }
    },
    created() {

      this.addTotal(); // 计算价格；
      if (getSessionStorage('address')) {
        this.defaultConsignee = JSON.parse(getSessionStorage('address'))
      } else {
        this.getAddress();
      }
    },

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
