<template>
  <div class="returnGoods">
    <page-nav :title="'退货列表'"></page-nav>
    <main>
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
                <section class="goods"  v-for="(item,index) in data.items" :key="item.id">
                  <div>
                    <img width="90px" height="92px" :src="item.goods.pic | setImg" alt="">
                  </div>
                  <div>
                    <p class="over"><span class="title">{{item.goods.name}}</span> <span class="right red">{{data.statusName}}</span>
                    </p>
                    <p>{{item.sku.codeName}}</p>
                    <p class="over"><span>¥ {{item.price}} </span> <span>x {{item.count}}</span></p>
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

    </main>

  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {List, Empty, Loading} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "returnGoods",
    components: {
      pageNav,
      [List.name]: List,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
    },
    data() {
      return {
        isLoding: false,
        loading: false,
        finished: false,
        orderList: [],
      }
    },
    methods: {
      onLoad() {
        this.page += 1;
        this.getOrder()
      },

      getOrder() {
        let params = {
          page: this.page, // 页码
          limit: this.limit // 条数
        };
        params.status = '5,6,7,8';
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
      this.getOrder()
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .returnGoods {
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
      > p {
        overflow: hidden;
        margin: 0 0 10px;
      }
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
              span {
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

    /deep/ .van-sticky--fixed {
      padding: 0 10px !important;
    }

  }

</style>
