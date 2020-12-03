<template>
  <div class="myReward">
    <page-nav :title="'我的奖励'"></page-nav>
    <main>
      <div class="rewardbg">
        <p>
          <span>可用奖励</span>
          <span>¥ 230.00</span>
        </p>
        <p>
          <span>总返利</span>
          <span>¥ 21130.00</span>
        </p>
      </div>
      <p class="p-header">
        <span class="left">我的奖励</span>
        <span class="right">今日：<span class="red">+ ¥ 400</span></span>
      </p>

      <section>
        <div v-for="(item,index) in orderList" :key="index">
          <div>
            <img width="90px" height="92px" :src="item.img" alt="">
          </div>
          <div>
            <p><span class="title">{{item.name}}</span></p>
            <p>{{item.text}}</p>
          </div>
        </div>
        <p>合计返利：<span class="red"> ¥ 40.00</span></p>
      </section>

      <van-button @click="toWithdrawal()" color="#2A91F0" round block type="info" native-type="submit">
        立即提现
      </van-button>
    </main>
  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {List, Empty, Loading, Button} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "myReward",
    components: {
      pageNav,
      [List.name]: List,
      [Empty.name]: Empty,
      [Button.name]: Button,
      [Loading.name]: Loading,
    },
    data() {
      return {
        orderList: [
          {
            img: require('../../assets/fenlei.png'),
            text: '20/30   1*10盒*800g   22',
            name: '国鹏单冻熟虾',
          },
          {
            img: require('../../assets/fenlei.png'),
            text: '20/30   1*10盒*800g   22',
            name: '国鹏单冻熟虾',
          }
        ],
      }
    },
    methods: {
      toWithdrawal() {
        this.$router.push('/Withdrawal')
      },
      getReward(){
        http.get(urls.queryRebate,{}).then(res => {
          if (res.success){
          }
        }).catch(err => {

        })
      }
    },
    created(){
      this.getReward()
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .myReward {
    main {
      padding: 10px 10px;
      background-color: #F5F5F5;
      .rewardbg {
        height: 118px;
        background: url("../../assets/jianglibg.png") 100% 100%/100% 100% no-repeat;
        display: flex;
        p {
          padding: 10px;
          flex: 1;
          color: #FFFFFF;
          text-align: left;
          span {
            display: block;
            &:first-child {
              font-size: 14px;
            }
            &:last-child {
              margin-top: 20px;
              font-size: 23px;
            }
          }
        }
      }
      .p-header {
        overflow: hidden;
        padding: 10px 13px;
        background: #F8FAFD;
        border-radius: 3px;
        > span {
          color: #23242A;
        }
      }
      > section {
        padding: 1px 0;
        border-radius: 5px;
        background-color: #ffffff;
        > div {
          padding: 10px;
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
                  overflow: hidden;
                  font-weight: 600;
                  @include sc(14px, #5F5F5F)
                }
                &:nth-child(2) {
                  @include sc(12px, #898989)
                }
              }
            }
          }
        }
        > p {
          padding: 0 10px;
          margin: 0 0 10px;
          text-align: right;
        }
      }
      .red {
        @include sc(16px, #FF6464)
      }
    }
    .van-button {
      margin-top: 30px;
    }
  }

</style>
