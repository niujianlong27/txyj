<template>
  <div class="myRanking">
    <page-nav :title="'我的排名'"></page-nav>
    <main>
      <section>
        <div class="tab-item">
          <van-tabs @change="changeTabs()" color="#155ea8" title-inactive-color="#fff" background="transparent"
                    type="card"
                    v-model="tabActive">
            <van-tab title="日排行">
              <section class="no">
                <div v-for="(item,index) in topThree" :key="item.nick_name">
                  <img class="person-img" style="width: 40px;height: 25px" :src="Arr[index].img" alt="">
                  <div><img src="../../assets/touxiang.png" alt=""></div>
                  <div class="name">{{item.nick_name}}</div>
                  <div class="price"><img class="coin" src="../../assets/coin.png" alt=""> ￥ {{item.rebate_amount_total
                    | fixNum}}
                  </div>
                </div>
              </section>

              <section class="ranking">
                <p>我的排行</p>
                <div style="font-weight: 600" v-if="item.is_self == 1" v-for="(item,index) in rankList">
                  <span>{{item.rank_no}}</span>
                  <img style="width: 38px;height: 38px;position: relative;top: 13px;margin: 0 5px"
                       src="../../assets/touxiang.png" alt="">
                  <span style="color: black">{{item.nick_name}}</span>
                  <span class="right red" style="position: relative;top:5px">
                   <img class="coin" style="" src="../../assets/coin.png" alt=""> ￥120
                  </span>
                </div>

                <div v-if="index >= 3" v-for="(item,index) in rankList">
                  <span>{{item.rank_no}}</span>
                  <img style="width: 38px;height: 38px;position: relative;top: 13px;margin: 0 5px"
                       src="../../assets/touxiang.png" alt="">
                  <span>{{item.nick_name}}</span>
                  <span class="right red" style="position: relative;top:5px">
                   <img class="coin" style="" src="../../assets/coin.png" alt=""> ￥120
                  </span>
                </div>
              </section>

            </van-tab>
            <van-tab title="周排行">
              <section class="no">
                <div v-if="index < 3" v-for="(item,index) in rankList" :key="item.nick_name">
                  <img class="person-img" style="width: 40px;height: 25px" :src="Arr[index].img" alt="">
                  <div><img src="../../assets/touxiang.png" alt=""></div>
                  <div class="name">{{item.nick_name}}</div>
                  <div class="price"><img class="coin" src="../../assets/coin.png" alt=""> ￥ {{item.rebate_amount_total
                    | fixNum}}
                  </div>
                </div>
              </section>

              <section class="ranking">
                <p>我的排行</p>
                <div style="font-weight: 600" v-if="item.is_self == 1" v-for="(item,index) in rankList">
                  <span>{{item.rank_no}}</span>
                  <img style="width: 38px;height: 38px;position: relative;top: 13px;margin: 0 5px"
                       src="../../assets/touxiang.png" alt="">
                  <span style="color: black">{{item.nick_name}}</span>
                  <span class="right red" style="position: relative;top:5px">
                   <img class="coin" style="" src="../../assets/coin.png" alt=""> ￥120
                  </span>
                </div>

                <div v-if="index >= 3" v-for="(item,index) in rankList">
                  <span>{{item.rank_no}}</span>
                  <img style="width: 38px;height: 38px;position: relative;top: 13px;margin: 0 5px"
                       src="../../assets/touxiang.png" alt="">
                  <span>{{item.nick_name}}</span>
                  <span class="right red" style="position: relative;top:5px">
                   <img class="coin" style="" src="../../assets/coin.png" alt=""> ￥120
                  </span>
                </div>
              </section>
            </van-tab>
            <van-tab title="月排行">
              <section class="no">
                <div v-if="index < 3" v-for="(item,index) in rankList" :key="item.nick_name">
                  <img class="person-img" style="width: 40px;height: 25px" :src="Arr[index].img" alt="">
                  <div><img src="../../assets/touxiang.png" alt=""></div>
                  <div class="name">{{item.nick_name}}</div>
                  <div class="price"><img class="coin" src="../../assets/coin.png" alt=""> ￥ {{item.rebate_amount_total
                    | fixNum}}
                  </div>
                </div>
              </section>

              <section class="ranking">
                <p>我的排行</p>
                <div style="font-weight: 600" v-if="item.is_self == 1" v-for="(item,index) in rankList">
                  <span>{{item.rank_no}}</span>
                  <img style="width: 38px;height: 38px;position: relative;top: 13px;margin: 0 5px"
                       src="../../assets/touxiang.png" alt="">
                  <span style="color: black">{{item.nick_name}}</span>
                  <span class="right red" style="position: relative;top:5px">
                   <img class="coin" style="" src="../../assets/coin.png" alt=""> ￥120
                  </span>
                </div>

                <div v-if="index >= 3" v-for="(item,index) in rankList">
                  <span>{{item.rank_no}}</span>
                  <img style="width: 38px;height: 38px;position: relative;top: 13px;margin: 0 5px"
                       src="../../assets/touxiang.png" alt="">
                  <span>{{item.nick_name}}</span>
                  <span class="right red" style="position: relative;top:5px">
                   <img class="coin" style="" src="../../assets/coin.png" alt=""> ￥120
                  </span>
                </div>
              </section>
            </van-tab>
            <van-tab title="总排行">
              <section class="no">
                <div v-if="index < 3" v-for="(item,index) in rankList" :key="item.nick_name">
                  <img class="person-img" style="width: 40px;height: 25px" :src="Arr[index].img" alt="">
                  <div><img src="../../assets/touxiang.png" alt=""></div>
                  <div class="name">{{item.nick_name}}</div>
                  <div class="price"><img class="coin" src="../../assets/coin.png" alt=""> ￥ {{item.rebate_amount_total
                    | fixNum}}
                  </div>
                </div>
              </section>

              <section class="ranking">
                <p>我的排行</p>
                <div style="font-weight: 600" v-if="item.is_self == 1" v-for="(item,index) in rankList">
                  <span>{{item.rank_no}}</span>
                  <img style="width: 38px;height: 38px;position: relative;top: 13px;margin: 0 5px"
                       src="../../assets/touxiang.png" alt="">
                  <span style="color: black">{{item.nick_name}}</span>
                  <span class="right red" style="position: relative;top:5px">
                   <img class="coin" style="" src="../../assets/coin.png" alt=""> ￥120
                  </span>
                </div>

                <div v-if="index >= 3" v-for="(item,index) in rankList">
                  <span>{{item.rank_no}}</span>
                  <img style="width: 38px;height: 38px;position: relative;top: 13px;margin: 0 5px"
                       src="../../assets/touxiang.png" alt="">
                  <span>{{item.nick_name}}</span>
                  <span class="right red" style="position: relative;top:5px">
                   <img class="coin" style="" src="../../assets/coin.png" alt=""> ￥120
                  </span>
                </div>
              </section>
            </van-tab>
          </van-tabs>
        </div>
      </section>
    </main>

  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Tab, Tabs, Grid, GridItem,} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "myRanking",
    components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      pageNav
    },
    data() {
      return {
        topThree: [], // 前三排名
        tabActive: 0,
        rankList: [
          {rank_no: 1, rebate_amount_total: 200.0, id_user: 8, is_self: 0, nick_name: "赵"},
          {rank_no: 2, rebate_amount_total: 200.0, id_user: 8, is_self: 0, nick_name: "钱"},
          {rank_no: 3, rebate_amount_total: 200.0, id_user: 8, is_self: 0, nick_name: "孙"},
          {rank_no: 4, rebate_amount_total: 200.0, id_user: 8, is_self: 0, nick_name: "李"},
          {rank_no: 5, rebate_amount_total: 200.0, id_user: 8, is_self: 0, nick_name: "周"},
          {rank_no: 6, rebate_amount_total: 200.0, id_user: 8, is_self: 0, nick_name: "吴"},
          {rank_no: 7, rebate_amount_total: 200.0, id_user: 8, is_self: 0, nick_name: "郑"},
          {rank_no: 8, rebate_amount_total: 200.0, id_user: 8, is_self: 0, nick_name: "王"},
          {rank_no: 9, rebate_amount_total: 200.0, id_user: 8, is_self: 1, nick_name: "冯"},
          {rank_no: 10, rebate_amount_total: 200.0, id_user: 8, is_self: 0, nick_name: "陈"},

        ],
        Arr: [
          {
            name: '第二名名称',
            img: require('../../assets/no2.png'),
            price: 200.00
          },
          {
            name: '第一名名称',
            img: require('../../assets/no1.png'),
            price: 200.00
          },
          {
            name: '第三名名称',
            img: require('../../assets/no3.png'),
            price: 200.11
          }
        ]
      }
    },
    methods: {

      changeTabs() { // 切换
        this.isLoding = true;
        // this.rankList = [];
        // this.rankType();
      },


      rankType() {
        let params = {};
        let type = 'day';
        switch (this.tabActive) {
          case 0: { //0全部
            type = 'day'
          }
            break;
          case 1: { //0待付款
            type = "week";
          }
            break;
          case 2: { //0待发货
            type = "month";
          }
            break;
          case 3: { //3待收货
            type = "year";
          }
            break;
        }
        http.get(`${urls.rankType}/${type}`).then(res => {
          if (res.success) {
            // this.rankList = res.data.rank || [];
            this.topThree = [];
            this.rankList[1] && this.topThree.push(this.rankList[1]);
            this.rankList[0] && this.topThree.push(this.rankList[0]);
            this.rankList[2] && this.topThree.push(this.rankList[2]);
            console.log(this.topThree)
          }
          //
        }).catch(err => {

        })
      }
    },
    created() {
      // this.rankType()
      this.topThree = [];
      this.rankList[1] && this.topThree.push(this.rankList[1]);
      this.rankList[0] && this.topThree.push(this.rankList[0]);
      this.rankList[2] && this.topThree.push(this.rankList[2]);
    }


  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .red {
    color: #ED4A47
  }

  .myRanking {
    /deep/ .van-nav-bar {
      background-color: #3974F6;
      color: white;
    }
    /deep/ .van-icon {
      color: white;
    }
    /deep/ .van-nav-bar__title {
      color: white;
    }
  }

  main {
    min-height: calc(100% - 55px);
    padding: 10px 10px 50px;
    background: linear-gradient(239deg, #3974F6 0%, #2A91F0 100%);
    .tab-item {
      margin-top: 10px;
      /deep/ .van-tabs__nav {
        border: none;
      }
      /deep/ .van-tab {
        border: none;
        border-radius: 15px;
      }
    }
    .no {
      display: flex;
      > div {
        > img {
          position: relative;
          top: 7px;
        }
        margin-top: 15px;
        flex: 1;
        &:nth-child(2) {
          margin-top: 0;
        }
        .name, .price {
          margin-top: 4px;
          @include sc(14px, #fff)
        }
      }
    }
    .ranking {
      margin-top: 20px;
      border-radius: 5px;
      background-color: white;
      padding: 10px;
      > P {
        margin-top: 0;
        text-align: left;
        @include sc(15px, #5F5F5F)
      }
      > div {
        text-align: left;
        overflow: hidden;
        line-height: 60px;
        height: 60px;
        border-bottom: 1px solid #EFEFEF;
        span {
          &:nth-of-type(2) {
            @include sc(14px, #9B9B9B)
          }
        }
      }
    }
    .coin {
      position: relative;
      /*top: 1px;*/
      width: 13px;
      height: 13px;
    }
  }

</style>
