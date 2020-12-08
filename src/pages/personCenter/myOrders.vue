<template>
  <div class="my-orders">
    <page-nav :setUrl="'personCenter'" :title="'我的订单'" :search="search"></page-nav>
    <main>
      <van-tabs @change="changeTabs()" sticky title-active-color="#2A91F0" color="#2A91F0" background="#F5F5F5"
                v-model="active">

        <van-tab title="全部">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >

                <template v-for="data in orderList">
                  <section class="order">
                    <p class="title">订单编号 ： {{data.orderSn}}</p>
                    <section class="goods" v-for="(item,index) in data.items" :key="item.id">
                      <div>
                        <img width="90px" height="92px" :src="item.goods.pic | setImg" alt="">
                      </div>
                      <div>
                        <p class="over"><span class="title">{{item.goods.name}}</span> <span class="right red">{{data.statusName}}</span>
                        </p>
                        <p>{{item.sku && item.sku.codeName}}</p>
                        <p><span>¥{{item.price}} </span> <span>x {{item.count}}</span></p>
                      </div>
                    </section>
                  </section>
                </template>

              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>

        <van-tab title="待付款">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >

                <template v-for="data in orderList">
                  <section class="order">
                    <p class="title">订单编号 ： {{data.orderSn}}</p>
                    <section class="goods" v-for="(item,index) in data.items" :key="item.id">
                      <div>
                        <img width="90px" height="92px" :src="item.goods.pic | setImg" alt="">
                      </div>
                      <div>
                        <p class="over"><span class="title">{{item.goods.name}}</span> <span class="right red">{{data.statusName}}</span>
                        </p>
                        <p>{{item.sku && item.sku.codeName }}</p>
                        <p><span>¥{{item.price}} </span> <span>x {{item.count}}</span>

                        </p>
                      </div>
                    </section>
                    <p style="margin-bottom: 5px" class="over">     <span class="takeOver">
                           <!--<span @click.stop="confirmReceipt(data,'去支付')">去支付</span>-->
                         </span></p>
                  </section>
                </template>

              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>

        <van-tab title="待发货">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >

                <template v-for="data in orderList">
                  <section class="order">
                    <p class="title">订单编号 ： {{data.orderSn}}</p>
                    <section class="goods" v-for="(item,index) in data.items" :key="item.id">
                      <div>
                        <img width="90px" height="92px" :src="item.goods.pic | setImg" alt="">
                      </div>
                      <div>
                        <p class="over"><span class="title">{{item.goods.name}}</span> <span class="right red">{{data.statusName}}</span>
                        </p>
                        <p>{{item.sku && item.sku.codeName}}</p>
                        <p><span>¥{{item.price}} </span> <span>x {{item.count}}</span></p>
                      </div>
                    </section>
                  </section>
                </template>

              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>

        </van-tab>

        <van-tab title="待收货">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <template v-for="data in orderList">
                  <section class="order">
                    <p class="title">订单编号 ： {{data.orderSn}}</p>
                    <section class="goods" v-for="(item,index) in data.items" :key="item.id">
                      <div>
                        <img width="90px" height="92px" :src="item.goods.pic | setImg" alt="">
                      </div>
                      <div>
                        <p class="over"><span class="title">{{item.goods.name}}</span> <span class="right red">{{data.statusName}}</span>
                        </p>
                        <p>{{item.sku && item.sku.codeName}}</p>
                        <p class="over"><span>¥{{item.price}} </span> <span>x {{item.count}}</span>
                          <span class="takeOver">
                            <span @click.stop="returnGoods(item.goods.id,item.count,data.id,data.orderSn)">申请退货</span>
                        </span>
                        </p>
                      </div>
                    </section>
                    <p style="margin-bottom: 5px" class="over">
                      <span class="takeOver">
                            <span @click.stop="confirmReceipt(data,'确认收货')">确认收货</span>
                        </span>
                    </p>
                  </section>
                </template>

              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>
        </van-tab>

        <van-tab title="已完成">
          <template v-if="isLoding">
            <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
          </template>
          <template v-else>
            <template v-if="orderList.length > 0">
              <van-list
                offset="100"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >

                <template v-for="data in orderList">

                  <section class="order">
                    <p class="title">订单编号 ： {{data.orderSn}}</p>
                    <section class="goods" v-for="(item,index) in data.items" :key="item.id">
                      <div>
                        <img width="90px" height="92px" :src="item.goods.pic | setImg" alt="">
                      </div>
                      <div>
                        <p class="over"><span class="title">{{item.goods.name}}</span> <span class="right red">{{data.statusName}}</span>
                        </p>
                        <p>{{item.sku && item.sku.codeName}}</p>
                        <p class="over"><span>¥{{item.price}} </span> <span>x {{item.count}}</span>
                          <span class="takeOver">
                            <span @click.stop="returnGoods(item.goods.id,item.count,data.id,data.orderSn)">申请退货</span>
                        </span>
                        </p>
                      </div>
                    </section>
                  </section>
                </template>

              </van-list>
            </template>
            <template v-else>
              <van-empty description="暂无数据"/>
            </template>
          </template>

        </van-tab>
      </van-tabs>

    </main>
  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Tab, Tabs, List, Empty, Loading} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';
  import {setSessionStorage, getSessionStorage} from "../../config/Utils";

  export default {
    name: "myOrders",
    components: {
      pageNav,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
      [Tab.name]: Tab,
      [List.name]: List,
      [Tabs.name]: Tabs,
    },
    data() {
      return {
        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        search: false,
        active: 0, // tab标记
        page: 1, // 页码
        limit: 10, // 每页条数
        orderList: [], // 订单列表
      }
    },
    methods: {
      confirmReceipt(data, text) {
        setSessionStorage('tabActive', this.active);
        this.$router.push({path: '/confirmReceipt', query: {footer: true, orderSn: data.orderSn, text: text}})
      },

      returnGoods(id, count, idOrder, orderSn) { // 申请退货
        this.$router.push({
          path: '/returnInformation',
          query: {id: id, count: count, idOrder: idOrder, orderSn: orderSn}
        })
        setSessionStorage('tabActive', this.active)
      },

      changeTabs() { // 切换
        this.page = 1;
        this.isLoding = true;
        this.orderList = [];
        this.getOrder();
      },

      onLoad() { // 滚动加载
        this.page += 1;
        this.getOrder();
      },

      getOrder() {
        let params = {
          page: this.page, // 页码
          limit: this.limit // 条数
        };
        switch (this.active) {
          case 0: { //0全部
            params.status = '1,2,3,4'
          }
            break;
          case 1: { //0待付款
            params.status = 1;
          }
            break;
          case 2: { //0待发货
            params.status = 2;
          }
            break;
          case 3: { //3待收货
            params.status = 3;
          }
            break;
          case 4: { //4完成
            params.status = 4;
          }
            break;
        }
        http.get(urls.getOrders, params).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.loading = false;
            let list = res.data && res.data.records || [];
            this.orderList = this.orderList.concat(list);
            if (this.orderList.length == res.data.total) {
              this.finished = true;
            }
          }
        }).catch(err => {

        })

      }
    },
    mounted() {
      this.isLoding = true;
      this.active = getSessionStorage('tabActive') ? Number(getSessionStorage('tabActive')) : Number(this.$route.query.index)
      this.getOrder();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .my-orders {
    background-color: #F5F5F5;
  }

  main {
    padding: 0 10px 30px;
    background-color: #F5F5F5;
    .order {
      background-color: #ffffff;
      border-radius: 5px;
      padding: 10px 10px;
      margin-top: 15px;
      > p {
        text-align: left;
        margin: 0;
      }

    }
    .goods {
      background-color: #ffffff;
      padding: 10px 0;
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
            &:nth-child(2) {
              @include sc(12px, #898989)
            }
            &:nth-child(3) {
              > span {
                &:first-child {
                  @include sc(15px, #FF6464)
                }
                &:nth-child(2) {
                  @include sc(13px, #959595);
                  margin-left: 5px;
                }
              }
            }
          }
        }
      }
    }
    .title {
      font-weight: 600;
      @include sc(14px, #5F5F5F)
    }
    .red {
      @include sc(12px, #FF6464)
    }
    .over {
      overflow: hidden;
    }
    .takeOver {
      float: right;
      text-align: center;
      span {
        display: inline-block;
        @include sc(12px, #7C7C7C);
        line-height: 22px;
        width: 65px;
        height: 22px;
        border-radius: 11px;
        border: 1px solid #979797;
      }
    }
    /deep/ .van-sticky--fixed {
      padding: 0 10px !important;
    }

  }

</style>
