<template>
  <div class="videoDetails">
    <div class="bgdiv">
      <header>
      <span style="position: absolute;left: 10px">
        <van-icon style="margin-top: 10px" color="#fff" @click.stop="toPath" size="30px"
                  name="arrow-left"/>
      </span>
      </header>
      <img v-if="articleDetail.img" @click.stop="show = true" :src="articleDetail.img | setImg" alt="">
    </div>
    <!--<van-cell is-link @click="show = true">展示弹出层</van-cell>-->
    <van-popup v-model="show">
      <template v-if="articleDetail.content">
        <video width="355" controls>
          <source :src="articleDetail.content | setVideo " type="video/mp4">
        </video>

        <!--<video-player  class="video-player vjs-custom-skin"-->
                       <!--ref="videoPlayer"-->
                       <!--:playsinline ="true"-->
                       <!--:options="playerOptions"-->
        <!--&gt;</video-player>-->
      </template>


    </van-popup>
    <div class="title-div">
      <h3>{{articleDetail.title}}</h3>
    </div>

    <main>
      <section class="textLeft ">
        <p> 产品介绍：</p>
        <div id="details" v-html="articleDetail.remark"></div>
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
          <van-grid-item @click.stop="details(item.id)" v-for="(item,index) in articleList" :key="index">
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
        playerOptions : {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [],
          // poster: "../../static/images/test.jpg", //你的封面地址
          width:'355px', //播放器宽度
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },
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
      toPath() {
        this.$router.go(-1)
      },  // 路由跳转

      details(id) { // 跳转详情
        this.$router.push({path: '/videoDetails', query: {id: id}});
      },


      getArticle() {
        http.get(urls.articleDetail, {id: this.$route.query.id}).then(res => {
          if (res.success) {
            this.articleDetail = res.data;
            this.$set(this.playerOptions.sources, 0, {
              type: "video/mp4",
              src: `http://test.tonginfo.com:8084/prod-api/file/getImgStream?idFile=${this.articleDetail.content}`,
            });
            // let imgs = document.querySelectorAll("#details img"); // 获取所有的img
            // imgs.forEach(item => { // 重新设置宽度
            //   item.style.width = "100%"
            // });
            this.getArticleList(this.articleDetail.author)

          }
        }).catch(err => {

        })
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
        this.getArticle()
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
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

    .video-player{
      width:355px!important;
    }
    .bgdiv {
      width: 100%;
      background-size: 100% 100%;
      header {
        .van-icon {
          position: relative;
          top: 2px;
        }
      }
      img {
        width: 100%
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
    #details{
      text-indent: 2em;
    }
    #details > > > img {
      width: 100%
    }

  }

</style>
