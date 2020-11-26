<template>
  <div class="chooseInvoice">
    <page-nav class="bg" :title="'我的银行卡'"></page-nav>

    <main>
      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <template v-if="invoiceData.length > 0">
          <!--<van-list-->
          <!--offset="100"-->
          <!--v-model="loading"-->
          <!--:finished="finished"-->
          <!--finished-text="没有更多了"-->
          <!--@load="onLoad"-->
          <!--&gt;-->
          <template v-for="item in invoiceData">
            <van-swipe-cell >
              <!--<template #left>-->
                <!--<van-button square type="primary" text="选择" />-->
              <!--</template>-->
              <section  class="myCard">
                <div>
                  <div>
                    <img src="../../assets/yinhangka.png" alt="">
                  </div>
                  <div>
                    <p>{{item.bankName}}</p>
                    <p>储蓄卡</p>
                  </div>
                </div>
                <div>
                 **** **** ****  {{item.cardNum | setStr}}
                </div>
              </section>
              <template #right>
                <van-button @click=deleteBank(item)  square text="删除" type="danger" class="delete-button" />
              </template>
            </van-swipe-cell>

          </template>


          <!--</van-list>-->
        </template>
        <template v-else>
          <img width="100%" src="../../assets/yinhang.png" alt="">
          <h2>空空如也</h2>
          <p style="color: #8E8E94;">你暂时还没有绑定任何银行卡</p>
        </template>
      </template>
      <van-button color="#2A91F0" round type="primary" @click.stop="addTo">去绑定</van-button>
    </main>
  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Button, Icon, List, SwipeCell,Loading, Empty, Toast,} from 'vant';
  import http from "../../utils/http";
  import urls from '../../utils/urls';
  import {getSessionStorage, setSessionStorage} from "../../config/Utils";

  export default {
    name: "chooseInvoice",
    components: {
      pageNav,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Loading.name]: Loading,
      [SwipeCell.name]: SwipeCell,
      [List.name]: List,
      [Empty.name]: Empty,
      [Toast.name]: Toast
    },
    data() {
      return {
        data: {},
        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        invoiceData: [],// 发票数据
        page: 1,// 页码
      }
    },
    methods: {
      getInvoice() {
        http.get(urls.queryBankByUser, {}).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.invoiceData = res.data || [];
          }

        }).catch(err => {

        })
      },

      addTo() { // 新增
        this.$router.push({path: "/addSettlement", query: {state: "add"}})
      },

      deleteBank(data){ // 删除银行卡
        http.delete(`${urls.deleteCard}/${data.id}`, {}).then(res => {
          if (res.success) {
            Toast.success('删除成功！');
            this.getInvoice();
          }
        })

      },

      onLoad() { //滚动加载
        this.page += 1;
        this.getInvoice();
      },

      chooseInvoice(data) {// 选择发票
        setSessionStorage('invoice', data.center);
        this.$router.go(-1)
      }
    },
    created() {
      this.isLoding = true;
      this.getInvoice()
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';

  .chooseInvoice {
    background-color: #fff;
    /deep/ .van-nav-bar {
      background-color: #fff !important;
    }
    main {
      padding: 10px 10px 0;
      .myCard {
        margin-bottom: 10px;
        height: 119px;
        background: linear-gradient(180deg, #679CF6 0%, #4072EE 100%);
        border-radius: 5px;
        color: white;
        text-align: left;
        padding-top: 1px;
        > div {
          margin-top: 10px;

          &:first-child {
            display: flex;
            div {
              &:first-child {
                flex: 1;
                position: relative;
                img {
                  @include wh(40px, 40px);
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                }
              }
              &:last-child {
                flex: 5;
                p {
                  margin: 10px;
                  &:first-child {
                    font-size: 14px;
                  }
                  &:last-child {
                    @include sc(12px, #96B6F7)
                  }
                }
              }
            }
          }
          &:last-child {
            padding-left: calc(100% / 6);
          }
        }

      }
      > /deep/ .van-button {
        margin-top: 20px;
        padding: 0 60px;
      }
    }
    .delete-button{
      border: none!important;
      height: 99.99%;
      border-radius: 5px;
    }

  }

</style>
