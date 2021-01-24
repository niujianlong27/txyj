<template>
  <div class="home">
    <nav>
      <div style="text-align: left">
             <span class="textLeft">
             </span>
        <span>天下一家 </span>
        <span @click="toPath('/myMessage')" class="textRight"> <van-icon :badge="badgeNum" :name="icon"/> </span>
      </div>
    </nav>
    <van-swipe :autoplay="2000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img style="width: 100%" :src="image"/>
      </van-swipe-item>
    </van-swipe>
    <main>
      <section class="rec-t">
        <p>
          <span>今日推荐</span>
          <span @click.stop="toPath('/moreGoods')">查看全部</span>
        </p>

        <div class="scroll">
          <van-grid class="grid" :gutter="6" :border="false" :column-num="20">
            <van-grid-item @click="clickGoods(item)" v-for="(item,index) in recList" :key="index">
              <img :src="item.pic | setImg" alt="">
              <span class="title">{{item.name}}</span>
              <span class="brief-in">{{item.descript}}</span>
            </van-grid-item>
          </van-grid>
        </div>
      </section>
      <div>
        <img src="../../assets/tuiguang.png" alt="">
      </div>
      <section>
        <van-tabs @click="clickTabs" v-model="tabActive">
          <van-tab v-for="data in catalogList" :key="data.id" :title="data.name">
            <div class="tab-item">
              <van-tabs @click="clickItem(data)" color="#2A91F0" type="card" v-model="tabActive2">
                <van-tab v-for="(item,index) in data.children" :key="item.id" :title="item.name">
                  <template v-if="typeList.length == 0">
                    <van-empty description="暂无商品"/>
                  </template>
                  <template v-else>
                    <van-list
                      offset="100"
                      v-model="loading"
                      :finished="finished"
                      finished-text="没有更多了"
                      @load="onLoad"
                    >
                      <van-grid :gutter="8" :border="false" :column-num="2">
                        <van-grid-item class="tab-grid" @click="clickGoods(item)" v-for="(item,index) in typeList"
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
                </van-tab>

              </van-tabs>
            </div>

          </van-tab>
        </van-tabs>
      </section>

    </main>
    <foot></foot>
  </div>

</template>

<script>
  import {
    Swipe, Notify, Search, Tab, Tabs, Empty, NoticeBar, Image,
    SwipeItem, Icon, Field, Grid, GridItem, CellGroup, List
  } from 'vant';
  import foot from '../../components/foot';
  import urls from '../../utils/urls';
  import http from '../../utils/http';
  import {mapState, mapActions} from 'vuex'

  export default {
    components: {
      [List.name]: List,
      [Empty.name]: Empty,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [Icon.name]: Icon,
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Search.name]: Search,
      [NoticeBar.name]: NoticeBar,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Image.name]: Image,
      [Notify.name]: Notify,
      foot

    },
    data() {
      return {
        badgeNum: '',// 消息条数
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        searchValue: '',
        tabActive: 0, // 一级分类tab标记
        tabActive2: 0, // 二级分类tab标记
        limit: 3, // 每页条数
        page: 1, // 页码
        goodsId: '',// 分类id
        icon: require('../../assets/icon-test@3x.png'),
        recList: [],// 今日推荐
        typeList: [],// 商品列表
        images: [
          require('../../assets/banner@3x.png'),
          require('../../assets/banner@3x.png'),
          require('../../assets/banner@3x.png'),
        ],
        catalogList: [],// 分类集合
      }
    },
    methods: {
      ...mapActions([
        'getCatalogList'
      ]),

      toPath(url, data) { // 路由跳转
        if (data) {
          this.$router.push({path: url, query: {id: data}}); //跳转地址设置
          return
        }
        this.$router.push(url)
      },

      clickTabs(name, title) { // 点击一级分类
        this.tabActive2 = 0;
        let arr = this.catalogList[name].children;
        if (arr && (arr.length > 0)) {
          this.typeList = [];
          this.page = 1;
          this.goodsId = arr[0].id;
          this.queryGoods(arr[0].id);
        }
      },


      onLoad() { // 滚动加载
        this.page += 1;
        this.queryGoods(this.goodsId)
      },

      clickItem(data) { // 点击二级分类 data当前 一级分类的数据 children 是二级数据
        let arr = data.children;
        if (arr && (arr.length > 0)) {
          this.typeList = [];
          this.page = 1;
          this.goodsId = arr[this.tabActive2].id;
          this.queryGoods(arr[this.tabActive2].id);
        }
      },
      clickGoods(data) { // 点击商品
        this.$router.push({path: '/goodsDetails', query: {id: data.id}})
      },

      queryGoods(id) { //根据分类id 查询商品
        console.log(121);
        console.log(id);
        http.get(urls.queryGoods, {
          idCategory: id,
          page: this.page,
          limit:10
        }).then(res => {
          this.loading = false;
          if (res.success) {
            let list = res.data.records || [];
            this.typeList = this.typeList.concat(list);
            if (res.data.total == this.typeList.length) {
              this.finished = true
            }
          }
        }).catch(err => {

        })
      },

      getRecommend() { // 商品推荐
        http.get(urls.queryGoods, {
          isNew: true,
          isHot: false,
          isReadNum: false,
          isSaleNum: false,
          page: this.page, // 页码
          limit: this.limit // 条数
        }).then(res => {
          if (res.success) {
            this.recList = res.data.records || []; // 赋值
          }
        }).catch(err => {

        })
      },

      getList() {
        http.get(urls.list, {}).then(res => { // 查询商品分类
            if (res.success) {
              this.catalogList = res.data || [];
              this.goodsId = this.catalogList[0].children[0].id;
              this.queryGoods(this.goodsId);
            }
          }
        ).catch(err => {

        });
      }
    },

    computed: {
      ...mapState(['active', 'catalog']),
    },

    created() {
      this.getList();
      this.getRecommend();
    },
    activated() {
      // console.log(121)
    }


  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .home {
    background-color: #fff;
    padding: 0 10px;
    box-sizing: border-box;
    .search {
      margin: 16px 0;
      .van-search__content {
        padding: 0;
      }
      .van-cell {
        line-height: 30px;
        padding: 5px 8px;
      }
      /deep/ .van-icon {
        font-size: 14px;
      }
    }
    nav {
      width: 100%;
      color: #D8D8D8;
      > div {
        display: flex;
        > span {
          flex: 1;
          padding: 10px 5px;
          font-size: .14rem;
          &:nth-child(2) {
            text-align: center;
            @include sc(.18rem, #5A5A5A)
          }
        }
        .textRight {
          .van-icon {
            top: 6px;
          }
        }
      }
    }
    main {
      /deep/ .van-grid-item__content {
        padding: 10px 0;
      }
      padding-bottom: 70px;
      > div {
        margin: 16px 0;
        img {
          width: 100%;
          height: 58px;
        }
      }
      .rec-t {
        > p {
          overflow: hidden;
          margin: 13px 0;
          span {
            &:first-child {
              float: left;
              @include sc(16px, #173143);
              font-weight: 600;
            }
            &:last-child {
              float: right;
              @include sc(12px, #7A7A7A);
            }
          }
        }
        .scroll {
          text-align: left;
          overflow-x: scroll;
          .grid {
            min-width: 500px !important;
            img {
              width: 150px;
              height: 100px;
            }
            .title, .brief-in {
              display: block;
              width: 150px;
              margin: 5px 0;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .title {
            height: 19px;
            @include sc(14px, #173143);
            font-weight: 600;
            line-height: 19px;
          }
          .brief-in {
            @include sc(12px, #B3B3B3);
            height: 16px;
            line-height: 16px;
          }
        }
      }
      .tab-item {
        .van-grid-item {
          overflow: hidden;
        }
        margin-top: 10px;
        /deep/ .van-tabs__nav {
          border: none;
        }
        /deep/ .van-tab {
          border: none;
          border-radius: 15px;
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
                  width: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin: 3px 0;
                  display: block;
                  &:first-child {
                    @include sc(14px, #FFFFFF)
                  }
                  &:last-child {
                    @include sc(12px, #FFFFFF)

                  }
                }
              }
              &:last-child {
                width: 30px;
                /*position: relative;*/
                /*.van-icon {*/
                /*position: absolute;*/
                /*bottom: 4px;*/
                /*right: 0;*/
                /*}*/
              }

            }
          }
        }
      }

    }

  }


</style>
