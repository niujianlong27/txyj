<template>
  <div class="videoDetails">
    <page-nav :title="'视频播放'"></page-nav>
    <!--<video-player class="video-player vjs-custom-skin"-->
    <!--ref="'videoPlayer'"-->
    <!--:playsinline="playsinline"-->
    <!--:options="playerOptions"-->
    <!--&gt;</video-player>-->
    <div id="video"></div>
    <!--<div id="video2"></div>-->
    <div class="title-div">
      <h3 @click="show = true">{{articleDetail.title}}</h3>
    </div>


    <!---->

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
  import pageNav from '../../components/pageNav'
  import Player from 'xgplayer';   //2、引入视频组件

  export default {
    name: "videoDetails",
    components: {
      pageNav,
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Cell.name]: Cell,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [Toast.name]: Toast,
    },
    data() {
      return {
        // playsinline: true,
        // playerOptions: {
        //   playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        //   autoplay: false, //如果true,浏览器准备好时开始回放。
        //   muted: false, // 默认情况下将会消除任何音频。
        //   loop: false, // 导致视频一结束就重新开始。
        //   preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        //   language: 'zh-CN',
        //   aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        //   fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        //   sources: [],
        //   poster: "", //你的封面地址
        //   width: '375px', //播放器宽度
        //   notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //   controlBar: {
        //     timeDivider: true,
        //     durationDisplay: true,
        //     remainingTimeDisplay: false, // 显示剩余时间
        //     fullscreenToggle: true  //全屏按钮
        //   }
        // },

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
        playerConfig: {   //3、动态设置相关值
          id: 'mse',
          normalUrl: '',  //普清
          midUrl: '',   //高清
          hightUrl: '', //超清
          poster: '',   //封面
        }
      }
    },
    methods: {

      playerInit() {   //4、设置视频配置(注意：playerInit应放在异步函数里或mounted之后，不可在created里直接加载，否则不生效)
        let player = new Player({   //初始化player实例对象
          id: 'video',
          url: this.playerConfig.midUrl,   //视频链接
          poster: this.playerConfig.poster,    //封面图片
          fluid: true,   //流式布局
          volume: 0.6,   //初始音量
          playbackRate: [0.5, 0.75, 1, 1.5, 2],
          whitelist: ['iPhone', 'Android'],   //白名单
          playsinline: true,   //内联模式
          rotateFullscreen: true, // 全屏播放
          'x5-video-player-type': 'h5',
        });
        player.emit('resourceReady');

        // player.on('rotate',function(deg) {
        //   console.log(deg);// 旋转时会触发rotate事件，角度有四个值90，180，270，0
        // })

        // player.getFullscreen(player.root)


        // url:'https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4',   //视频链接

    },

    toPath() {
      this.$router.go(-1)
    },  // 路由跳转
    openVideo() {
      this.show = true;

    },
    details(id) { // 跳转详情
      this.$router.push({path: '/videoDetails', query: {id: id}});
    },


    getArticle() {
      http.get(urls.articleDetail, {id: this.$route.query.id}).then(res => {
        if (res.success) {
          this.articleDetail = res.data;
          this.playerConfig.midUrl = `http://39.98.85.187:8084/prod-api/file/getImgStream?&idFile=${this.articleDetail.content}`; //获取高清视频链接
          this.playerConfig.poster = `http://39.98.85.187:8084/prod-api/file/download?&fileName=${this.articleDetail.img}`;   //获取视频封面
          this.playerInit();
          // this.$set(this.playerOptions.sources, 0, {
          //   type: "video/mp4",
          //   src: `http://39.98.85.187:8084/prod-api/file/getImgStream?&idFile=${this.articleDetail.content}`,
          // });
          // https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4

          // this.playerOptions.poster = `http://39.98.85.187:8084/prod-api/file/download?&fileName=${this.articleDetail.img}`;
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
    },
  }
  ,
  watch: {
    $route()
    {   // 监听路由参数变化重新加载 当前路由跳转自身改变路由后挂在的参数时使用
      this.articleDetail = [];
      this.getArticle()
    }
  }
  ,
  mounted()
  {
    this.getArticle();
  }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .videoDetails {

    .xgplayer-skin-default.xgplayer-rotate-fullscreen{
      max-width: 100vh!important;
      padding-top: 0!important;
      z-index: 10;
    }
    touch-action: none;
    .video-player {
      width: 375px !important;
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
    #details {
      text-indent: 2em;
    }
    #details > > > img {
      width: 100%
    }

    /deep/ .van-popup .vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {
      opacity: 1 !important;
    }

  }

</style>
