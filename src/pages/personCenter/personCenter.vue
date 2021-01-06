<template>
  <div class="person">
    <!--个人中心-->
    <header>
      <section>
        <div v-if="userInfo">
          <p>
            {{userInfo.nickName}}
          </p>
          <p>{{userInfo.mobile}}</p>
        </div>
        <div class="sign" v-else>
          <span @click="Jump('/signIn')">去登录</span> / <span @click="Jump('/register')">去注册</span>
        </div>
        <div>
          <p class="right">
            <img  @click.stop="show = true" src="../../assets/Setup.png" alt="">
          </p>
          <!--<img @click="show = true" :src="userInfo.avatar | setImg" alt="">-->
        </div>
      </section>
      <div>
        <section>
          <!--<template>-->
          <van-grid :border="false" :column-num="5">
            <van-grid-item v-for="(item,index) in myOrders" :key="item.name" @click="pathJump(index +1)">
              <img :src="item.src" alt="">
              <span>{{item.name}}</span>
            </van-grid-item>
          </van-grid>
          <!--</template>-->
        </section>
      </div>

    </header>
    <main>
      <div class="tuiguang">
        <img src="../../assets/gerentuiguang.png" alt="">
      </div>
      <section class="services">
        <template v-for="item in services">
          <van-cell :icon="item.icon" :title="item.name" is-link @click="Jump(item.path)"/>
        </template>
      </section>
    </main>
    <foot></foot>

    <van-popup position="right" :style="{ height: '100%',width:'35%' }" v-model="show">
      <p class="signOut"><span @click="signOut">退出登录</span></p>
    </van-popup>

    <van-popup class="popup" v-model="show2">
      <p style="text-align: center;font-size: 18px">确认登出？</p>
      <van-button @click.stop="cancel()" type="primary">取消</van-button>
      <van-button @click.stop="loginOut()" type="info">确认</van-button>
    </van-popup>

  </div>
</template>

<script>
  import foot from '../../components/foot'
  import {Grid, GridItem, Image, Button, Cell, Toast, Popup} from 'vant';
  import {mapState, mapMutations} from 'vuex'
  import {getlocalStorage,removelocalStorage} from "../../config/Utils";
  import http from "../../utils/http";
  import urls from '../../utils/urls';
  export default {
    name: "personCenter",
    components: {
      [Popup.name]: Popup,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [Image.name]: Image,
      [Button.name]: Button,
      [Cell.name]: Cell,
      [Toast.name]: Toast,
      foot
    },
    data() {
      return {
        show: false,//登出弹框
        show2: false,//登出弹框
        isLogin: false,
        userInfo: {
          nickName: ''
        },
        myOrders: [
          {
            src: require('../../assets/daifukuan.png'),
            name: '待付款',
            path: '/'
          },
          {
            src: require('../../assets/daifahuo.png'),
            name: '待发货',
            path: '/'
          },
          {
            src: require('../../assets/daishouhuo.png'),
            name: '待收货',
            path: '/'
          },
          {
            src: require('../../assets/yiwancheng.png'),
            name: '已完成',
            path: '/'
          },
          {
            src: require('../../assets/tuihuo.png'),
            name: '退货',
            path: '/'
          }
        ],
        services: [
          {
            name: '收货地址管理',
            path: '/receiptAddress',
            icon: require('../../assets/dizhi.png'),
          },
          {
            name: '我的客服',
            path: '/onlineService',
            icon: require('../../assets/kefu.png'),
          },
          {
            name: '企业介绍',
            path: '',
            icon: require('../../assets/jieshao.png'),

          },
          {
            name: '联系我们',
            path: '',
            icon: require('../../assets/lianxi.png'),
          },
          {
            name: '我的排名',
            path: '/myRanking',
            icon: require('../../assets/paiming.png'),
          },
          {
            name: '我的奖励',
            path: '/myReward',
            icon: require('../../assets/jiangli.png'),
          },
          {
            name: '我的银行卡',
            path: '/chooseInvoice',
            icon: require('../../assets/yinhangka.png'),
          },

          {
            name: '意见反馈',
            path: '/feedback',
            icon: require('../../assets/fankui.png'),
          },
        ],
      }
    },
    computed: {
      ...mapState(['active']),
    },
    methods: {
      signOut() {
        this.show2 = true;
      },

      cancel() {
        this.show = false;
        this.show2 = false;
      },
      loginOut() { //退出
        http.post(urls.logout, {}).then(res => {
          if (res.success) {
            removelocalStorage("token");
            removelocalStorage("userInfo");

            Toast.success('退出成功！');
            this.$router.push('/signIn')
          }

        }).catch(err => {

        })

      },
      pathJump(index) { // 买家订单跳转
        if (index == 5) {
          this.$router.push({path: '/returnGoods'});
          return
        }
        this.$router.push({path: '/myOrders', query: {index: index}});
      },

      Jump(url) { // 我的应用跳转
        this.$router.push(url);
      },
    },
    mounted() {
      getlocalStorage("token") && (this.isLogin = true);
      this.userInfo = JSON.parse(getlocalStorage('userInfo'));
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .person {
    background-color: #F5F5F5;
    .sign {
      box-sizing: border-box;
      padding: 10px;
    }
    header {
      color: white;
      @include wh(100%, 173px);
      background: url(../../assets/personBg.png) no-repeat;
      background-size: 100% 100%;
      > section {
        padding: 10px 18px 15px;
        display: flex;
        text-align: left;
        div {
          &:first-child {
            flex: 4;
            p {
              margin-top: 0;
              margin-bottom: 13px;
              &:first-child {
                margin-top: 3px;
                @include sc(20px, #FFFFFF);
                font-weight: 600;
              }
              &:last-child {
                @include sc(14px, #FFFFFF);
                margin-bottom: 5px;

              }
            }
          }
          &:last-child {
            flex: 1;
            img {
              @include wh(18px,18px);
            }
          }
        }
      }
      > div {
        section {
          border-radius: 5px;
          padding: 0px 20px;
          margin-bottom: 15px;
          .van-grid {
            img {
              @include wh(33px, 30px)
            }
            span {
              margin-top: 5px;
              @include sc(12px, #E3E4FB)
            }
            /deep/ .van-grid-item__content {
              padding: 11px 0;
              background-color: transparent !important;
            }
          }
        }
      }
    }

    main {
      background-color: #F5F5F5;
      padding: 0 10px 50px;
    }
    .tuiguang {
      margin: 10px 0;
      img {
        @include wh(355px, 102px)
      }
    }

    .services {
      background-color: #ffffff;
      border-radius: 5px;
      padding: 8px 10px;
      margin-bottom: 15px;
      text-align: left;
      p {
        padding-left: 10px;
        @include sc(15px, #5A5A5A);
        font-weight: 500;
        margin: 0;
      }
      .van-cell {
        padding: 12px 10px;
        color: #8D8D8D;
        /deep/ .van-icon__image {
          @include wh(30px, 30px);
          margin-right: 10px;
          position: relative;
          top: -4px;
        }
      }
    }
    .signOut {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .popup {
      width: 60%;
      padding: 10px;
      border-radius: 5px;
      p {
        text-align: left;
        padding: 0 5px;
        margin: 8px 0;
        @include sc(13px, #323233)
      }
      .van-button {
        margin-top: 10px;
        padding: 0 8px;
        @include wh(100px, 30px);
      }
    }
  }

</style>
