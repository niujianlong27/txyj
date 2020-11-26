<template>
  <div>
    <div class="bgDiv">
      <p class="p-header">
    <span>
    视频推荐
    </span>
        <span>
    <van-icon color="#fff" size="18px" name="search"/>
    </span>
      </p>
    </div>
    <!--<template v-if="isLoding">-->
    <!--<van-loading color="#1989fa" size="24px">数据加载中...</van-loading>-->
    <!--</template>-->
    <!--<template v-else>-->

    <section class="swipe">
      <van-swipe :show-indicators="false" @change="changeItem" :autoplay="2000" :loop="false" :width="235"
                 indicator-color="white">
        <van-swipe-item :class="{swipeChoose:index == swipActive }" v-for="(image, index) in recArticle" :key="index">
          <img @click.stop="details(image.id)" style="width: 100%" :src="image.img | setImg"/>
        </van-swipe-item>
      </van-swipe>
    </section>
    <main>
      <van-list
        offset="100"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <section class="video-recommend">
          <p class="p-title">
          <span>
          大家在看
          </span>
            <span>
          <!--查看全部-->
          </span>
          </p>
          <van-grid :border="false" :column-num="2">
            <van-grid-item @click.stop="details(item.id)" v-for="(item,index) in recArticle" :key="index">
              <img :src="item.img | setImg"/>
              <p class="text">{{item.title}}</p>
            </van-grid-item>
          </van-grid>
        </section>

        <section class="videosList">
          <p class="p-title">
        <span>
          视频列表
        </span>
            <span>
        </span>
          </p>
        </section>

        <van-grid :border="false" :column-num="1">
          <van-grid-item class="videos" v-for="(item,index) in articleList" :key="index">
            <van-image @click.stop="details(item.id)" :src="item.img | setImg"/>
          </van-grid-item>

        </van-grid>
      </van-list>
    </main>
    <!--</template>-->
    <foot></foot>

  </div>

</template>

<script>
  import {NoticeBar, Image, Loading, Grid, List, GridItem, Swipe, Icon, SwipeItem} from 'vant';
  import foot from '../../components/foot'
  import {mapState} from 'vuex'
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "videoRecommend",
    components: {
      [Loading.name]: Loading,
      [NoticeBar.name]: NoticeBar,
      [SwipeItem.name]: SwipeItem,
      [List.name]: List,
      [Swipe.name]: Swipe,
      [Icon.name]: Icon,
      [GridItem.name]: GridItem,
      [Grid.name]: Grid,
      [Image.name]: Image,
      foot
    },
    data() {
      return {
        isFalse: false,
        queryNum: 1,
        page: 1,//页码
        isLoding: false,//整个页面加载
        loading: true,//数据滚动加载
        finished: false,//全部加载完成
        swipActive: 0,
        images: [
          require('../../assets/banner1@3x.png'),
          require('../../assets/banner1@3x.png'),
          require('../../assets/banner1@3x.png'),
          require('../../assets/banner1@3x.png'),
        ],
        articleList: [],// 视频列表
        recArticle: [], // 推荐列表
        goodsimages: [],
        imagesList: [],
      }
    },
    computed: {
      ...mapState(['active']),
    },
    methods: {
      changeItem(index) {
        this.swipActive = index
      },

      details(id) {
        this.$router.push({path: '/videoDetails', query: {id: id}});
      },

      onLoad() { //滚动加载
        this.page += 1;
        this.getArticle();
      },

      getArticle() { // 查询视频
        let params = {
          page: this.page,
          limit: 4
        };
        http.get(urls.articleList, {...params, author: ''}).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.loading = false;
            let list = res.data && res.data.records || [];
            this.articleList = this.articleList.concat(list);
            console.log(this.articleList);
            if (this.articleList.length == res.data.total) {
              this.finished = true;
            }
            if (this.queryNum == 1) {
              console.log(res.data.records.length);
              if (res.data.records.length > 4) {
                this.recArticle = res.data.records.slice(0, 4);
                console.log(res.data.records.slice(0, 4));
              } else {
                this.recArticle = res.data.records
              }
            }
            this.queryNum = 2;

          }

        }).catch(err => {

        });

      }

    },
    mounted() {
      // this.isLoding = true;
      this.getArticle();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .bgDiv {
    @include wh(375px, 175px);
    background-color: #2A91F0;
    position: absolute;
    top: 0;
    .p-header {
      overflow: hidden;
      padding: 10px;
      margin-top: 5px;
      span {
        &:first-child {
          float: left;
          @include sc(16px, #FFFFFF)
        }
        &:last-child {
          float: right;
        }
      }
    }
  }

  .swipe {
    margin-top: 52px;
    .van-swipe-item {
      box-sizing: border-box;
      padding-right: 3px;
    }
    img {
      height: 123.2px;
    }
    .swipeChoose img {
      height: 135px;
    }
  }

  main {
    background: #F5F5F5;
    padding: 0 10px 50px;
    .p-title {
      overflow: hidden;
      span {
        &:first-child {
          float: left;
          @include sc(16px, #173143);
          font-weight: 600;
        }
        &:last-child {
          float: right;
          @include sc(12px, #7A7A7A)
        }
      }
    }
    .video-recommend {
      img {
        @include wh(165px, 113px)
      }
      /*van-grid-item*/
      .van-grid-item {
        overflow: hidden;
      }

      /deep/ .van-grid-item__content {
        padding: 0;

      }
      .text {
        width: 100%;
        text-align: left;
        @include sc(14px, #787878);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .videosList {
      .p-title {
        margin: 12px 0;
      }
    }

  }

  .videos {
    @include wh(355px, 196px);
    .van-image {
      @include wh(100%, 100%);
    }
  }


</style>
