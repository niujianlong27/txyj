<template>
  <div class="paySuccess">
    <header>
      <van-nav-bar :title="'支付成功'"></van-nav-bar>
    </header>
    <main>
      <img width="90px" src="../../assets/success.png" alt="">
      <p>订单支付成功</p>
      <section>
        <p>订单编号：{{orderData.orderSn}}</p>
        <p>实付金额：<span class="red">￥ {{orderData.totalAmt | fixNum}}</span></p>
        <p>支付方式：{{orderData.payTypeName}}</p>
        <p>{{defaultConsignee.name}} {{defaultConsignee.tel}}</p>
        <p>{{defaultConsignee.province}} {{defaultConsignee.city}} {{defaultConsignee.area}}</p>
      </section>

      <van-button @click="path('myOrders',{index:2})" round type="info" block>查看订单</van-button>
      <van-button @click="path('home')" round type="primary" block>返回首页</van-button>

    </main>
  </div>
</template>

<script>
  import {NavBar, Button, Toast} from 'vant';

  import urls from '../../utils/urls';
  import http from '../../utils/http';
  import {setSessionStorage} from "../../config/Utils";

  export default {
    name: "paySuccess",
    components: {
      [NavBar.name]: NavBar,
      [Button.name]: Button,
      Toast
    },
    data() {
      return {
        orderData: {},
        defaultConsignee: {}
      }
    },
    methods: {
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
          }

        })
      },
      path(path,data){
        if (data){
          setSessionStorage('tabActive', 2);
          this.$router.push({path:path,query:data});
          return
        }
        this.$router.push({path:path})
      }
    },
    created() {
      this.getDetail(this.$route.query.orderSn)
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .paySuccess {
    header {
      box-sizing: border-box;
      height: 55px;
      span {
        display: inline-block;
      }
      /deep/ .van-nav-bar {
        height: 55px;
        background: #F5F5F5;
        font-size: 18px;
        font-weight: 500;
        color: #9A9A9A !important;
      }
      /deep/ .van-nav-bar__title {
        color: #9A9A9A;
      }
      /deep/ .van-icon {
        color: #707070;
      }
    }
    .red {
      @include sc(16px, #FF6464)
    }
    main {
      >P{
        @include sc(20px,#2c3e50)
      }
      img{
        margin: 10px 0;
      }
      padding: 10px;
      section {
        text-align: left;
        background-color: #fff;
        border-radius: 5px;
        padding: 10px 20px;
        color: #2c3e50;
      }
      .van-button{
        width: 90%;
        margin: 20px auto;
        &:nth-of-type(1){
          margin-top: 40px;
        }
        /*margin-top: 20px;*/
      }
    }
  }
</style>
