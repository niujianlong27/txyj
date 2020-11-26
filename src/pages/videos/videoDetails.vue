<template>
  <div class="videoDetails">
    <div class="bgdiv">
      <header>
      <span style="position: absolute;left: 10px">
        <van-icon style="margin-top: 10px" color="#fff" @click.stop="toPath" size="30px"
                  name="arrow-left"/>
      </span>
      </header>
      <img @click.stop="show = true" :src="articleDetail.img | setImg" alt="">
    </div>
    <!--<van-cell is-link @click="show = true">展示弹出层</van-cell>-->
    <van-popup v-model="show">
      <video width="355"  controls>
        <source :src="articleDetail.content | setImg " type="video/mp4">
      </video>
    </van-popup>
    <div class="title-div">
      <h3>{{articleDetail.title}}</h3>
    </div>

    <main>
      <section class="textLeft ">
        <p> 操作方法：</p>
        <div id="details"></div>
        <!--<p> 1.自然解冻后放入加盐、料酒、葱节的水中浸泡5-10分钟；</p>-->
        <!--<p> 2.取出金鲳鱼用干毛巾沾干水分，加入鸡蛋清拌匀；</p>-->
        <!--<p> 3.沾上生粉下油锅炸透捞出，等油温升高后复炸一次，捞出装盘；</p>-->
        <!--<p> 4.锅上火加油，番茄酱、白糖翻炒后加水适量，白糖、盐、大红浙醋润二流芡，淋热油浇在炸好的鱼上。</p>-->
      </section>

      <section class="video-recommend">
        <p class="p-title">
        <span>
          相关推荐
        </span>
          <span>
           <!--查看全部-->
        </span>
        </p>
        <van-grid :border="false" :column-num="2">
          <van-grid-item  @click.stop="details(item.id)" v-for="(item,index) in articleList" :key="index">
            <img :src="item.img | setImg"/>
            <p class="text">{{item.title}}</p>
          </van-grid-item>
        </van-grid>
      </section>
    </main>
  </div>
</template>

<script>
  import {Cell, Toast, Popup, Icon, Grid, GridItem} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "videoDetails",
    components: {
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Cell.name]: Cell,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [Toast.name]: Toast,
    },
    data() {
      return {
        show: false,// 显示弹框
        articleDetail: {}, //视频详情
        articleList: [],//视频推荐
        goodsimages: [
          {
            img: require('../../assets/fish.png'),
            text: '干烧鲈桂鱼'
          },
          {
            img: require('../../assets/fish.png'),
            text: '干烧鲈桂鱼'
          },
          {
            img: require('../../assets/fish.png'),
            text: '干烧鲈桂鱼'
          },
          {
            img: require('../../assets/fish.png'),
            text: '干烧鲈桂鱼'
          },
        ],
      }
    },
    methods: {
      toPath() { // 路由跳转
        this.$router.go(-1)
      },
      getArticle() {
        http.get(urls.articleDetail, {id: this.$route.query.id}).then(res => {
          if (res.success) {
            this.articleDetail = res.data;
            let Div = document.getElementById('details');  // 推荐
            Div.innerHTML = ""; // 标签内容设置为空
            let div = document.createElement("div"); // 创建div
            div.innerHTML = this.articleDetail && this.articleDetail.content || " ";
            Div.appendChild(div); // /添加到商品介绍 Div 的标签

            let imgs = document.querySelectorAll("#details img"); // 获取所有的img
            imgs.forEach(item => { // 重新设置宽度
              item.style.width = "100%"
            });
            this.getArticleList(this.articleDetail.author)

          }
        }).catch(err => {

        })
      },

      details(id) { // 跳转详情
        this.$router.push({path:'/videoDetails',query:{id:id}});
      },

      getArticleList(author) { // 查询视频
        let params = {
          page: this.page,
          limit: 4
        };
        http.get(urls.articleList, {...params, author: author}).then(res => {
          if (res.success) {
            this.articleList = res.data.records;

          }

        }).catch(err => {

        });

      }
    },
    watch: {
      $route() {   // 监听路由参数变化重新加载 当前路由跳转自身改变路由后挂在的参数时使用
        this.articleDetail = [];
        // this.isLoding = true;
        this.getArticle()
      }
    },
    mounted() {
      this.getArticle();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .videoDetails {
    .bgdiv {
      width: 100%;
      height: 300px;
      background-size: 100% 100%;
      header {
        .van-icon {
          position: relative;
          top: 2px;
        }
      }
      img {
        @include wh(100%, 100%)
      }
    }
    .title-div {
      padding: 10px;
      height: 34px;
      line-height: 34px;
      text-align: left;
      background: white;
      h3 {
        margin: 0;
        font-size: 20px;
        display: inline-block;
      }
      span {
        height: 24px;
        line-height: 26px;
        border-radius: 13px;
        margin-left: 12px;
        padding: 0 18px;
        display: inline-block;
        background: #2A91F0;
        @include sc(12px, white);
        position: relative;
        top: -3px;
      }
    }
    main {
      margin-top: 10px;
      background: white;
      padding: 10px;
      section {
        &:first-child {
          p {
            @include sc(13px, #898989)
          }
        }
      }
      .video-recommend {
        margin-top: 20px;
        img {
          @include wh(165px, 113px)
        }
        /deep/ .van-grid-item {
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
    }
    .van-popup{
      /*width: 355px;*/
      /*height: 355px;*/

    }
  }

</style>
