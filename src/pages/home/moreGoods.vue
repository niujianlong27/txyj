<template>
  <div class="moreGoods">
    <page-nav :title="'更多商品'"></page-nav>
    <main>
      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <template v-if="goodsList.length > 0">
          <van-list
            offset="100"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-grid :gutter="8" :border="false" :column-num="2">
              <van-grid-item class="tab-grid" @click="clickGoods(item)" v-for="(item,index) in goodsList"
                             :key="index">
                <img :src="item.pic | setImg" alt="">
                <div class="tabDiv">
                  <p>
                    <span class="title">{{item.name}}</span>
                    <span class="brief-in">{{item.descript}}</span>
                  </p>
                  <p>
                    <van-icon size="30px" color="#2A91F0" name="add"/>
                  </p>
                </div>
              </van-grid-item>
            </van-grid>
          </van-list>
        </template>
      </template>

    </main>

  </div>
</template>

<script>
  import {List, Empty, Loading, Icon, Grid, GridItem} from 'vant';
  import pageNav from '../../components/pageNav'

  import urls from '../../utils/urls';
  import http from '../../utils/http';

  export default {
    name: "moreGoods",
    components: {
      pageNav,
      [Empty.name]: Empty,
      [Loading.name]: Loading,
      [List.name]: List,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [Icon.name]: Icon,
    },
    data() {
      return {
        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        goodsList: [],
        limit: 10, // 每页条数
        page: 1, // 页码
      }
    },
    methods: {
      onLoad() { // 滚动加载
        this.page += 1;
        this.getGoods();
      },
      clickGoods(data) { // 点击商品
        this.$router.push({path: '/goodsDetails', query: {id: data.id}})
      },
      getGoods() { // 查询商品
        http.get(urls.queryGoods, {
          isNew: true,
          // isHot: false,
          // isReadNum: false,
          // isSaleNum: false,
          page: this.page, // 页码
          limit: this.limit // 条数
        }).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.loading = false;
            let list = res.data.records || [];
            this.goodsList = this.goodsList.concat(list);
            if (this.goodsList.length == res.data.total) {
              this.finished = true;
            }
          }
        }).catch(err => {

        })
      }

    },
    mounted() {
      this.isLoding = true;
      this.getGoods();

    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .moreGoods {
    main {
      background: #F5F5F5;
      padding:0 10px 10px;
      /deep/ .van-grid-item {
        overflow: hidden;
      }
      .tab-grid {
        img {
          width: 100%;
          height: 140px;
        }
        .tabDiv {
          box-sizing: border-box;
          padding: 0 3px;
          width: 100%;
          color: #fff;
          display: flex;
          background-color: #173143;
          p {
            text-align: left;
            flex-shrink: 0;
            margin: 6px 0;
            &:first-child {
              width: calc(100% - 30px);
              span {
                display: block;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 3px 0;
              }

              .title {
                height: 19px;
                @include sc(14px, #FFFFFF);
                font-weight: 600;
                line-height: 19px;
              }
              .brief-in {
                @include sc(12px, #FFFFFF);
                height: 16px;
                line-height: 16px;
              }

            }
            &:last-child {
              width: 30px;
            }

          }
        }
      }
      /deep/ .van-grid-item__content {
        padding: 10px 0;
        background: #F5F5F5;
      }
    }
  }

</style>
