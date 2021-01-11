<template>
  <div class="goodsDetails">
    <div class="bgdiv">
      <header>
          <span style="position: absolute;left: 10px">
        <van-icon color="#fff" @click="Return" size="18px"
                  name="arrow-left"/>
      </span>
        <span class="text">商品详情</span>
        <span style="position: absolute;right: 10px">
        <van-icon color="#fff" size="18px"
                  :name="require('../../assets/fenxiang.png')"/>
      </span>

      </header>
      <!--<img v-if="goodsDetails.pic" :src="goodsDetails.pic | setImg" alt="">-->


      <van-swipe>
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img :src="image | setImg" alt="">
        </van-swipe-item>
      </van-swipe>
    </div>
    <main>
      <div class="title">
        <h4 class="left">{{goodsDetails.name}}</h4>
        <span class="right">点击：{{goodsDetails.readNum}}</span>
      </div>
      <section>
        <p>产品卖点：</p>
        <p>{{goodsDetails.descript}}</p>
      </section>
      <section>
        <p>产品详情：</p>
        <div v-html="goodsDetails.detail" id="details">

        </div>
      </section>
      <section>
        <p class="p-title">
          <span class="left">视频推荐</span>
          <span @click.stop="clickSim('/videoRecommend')" class="right">查看全部</span>
        </p>

        <div class="scroll vidoes">
          <van-grid class="grid" :border="false" :column-num="20">
            <van-grid-item v-for="item in similarCommodityList" :key="item.id">
              <img @click.stop="clickSim('/videoDetails',item.id)" :src="item.img | setImg" alt="">
              <span>{{item.title}}</span>
            </van-grid-item>
          </van-grid>
        </div>
        <van-popup v-model="showVideo">
          <video width="355" controls>
            <source :src="contentVideo | setImg " type="video/mp4">
          </video>
        </van-popup>
      </section>
      <section>
        <p class="p-title">
          <span class="left">同类商品</span>
          <span class="right">查看全部</span>
        </p>
        <div class="scroll">
          <van-grid class="grid" :border="false" :column-num="20">
            <van-grid-item class="tab-grid" @click="clickSim('/goodsDetails',item.id)" v-for="(item,index) in typeList"
                           :key="index">
              <img :src="item.pic | setImg" alt="">
              <div class="tabDiv">
                <p class="textLeft">
                  <span class="title">{{item.name}}</span>
                  <span class="brief-in">{{item.xQ}}</span>
                </p>
              </div>
            </van-grid-item>
          </van-grid>
        </div>
      </section>
    </main>

    <footer>
      <div class="right">
        <span class="left" @click.stop="addCart">加入购物车</span>
        <span class="left" @click.stop="nowBuy">立即购买</span>
      </div>
    </footer>

    <van-popup class="textLeft" v-model="showPopup" closeable position="bottom" :style="{ height: '80%' }">
      <section>
        <p>
          <img src="../../assets/shopcart.png" alt="">
        </p>
        <p class="textLeft">
          <span class="red"> ￥{{skuObj.price}}</span>
          <span>已选：{{skuObj.codeName}}</span>
          <span>配送至 {{defaultConsignee.wholeAddressInfo}}</span>
        </p>
      </section>
      <section>
        <h4>配送区域</h4>
        <van-cell :border="false" icon="location-o" :title="defaultConsignee.wholeAddressInfo" is-link
                  @click="toPath('/receiptAddress',{from: true})"/>
        <p>隔日达·现在下单</p>
      </section>

      <section v-if="skus.length > 0">
        <h4>选择规格</h4>
        <span :class="{sku : skuIndex == index}" @click="choodeSku(item,index)" v-for="(item,index) in skus">{{item.codeName}}</span>
      </section>

      <section>
        <h4>购买数量</h4>
        <van-stepper button-size="32px" input-width="40px" v-model="goodsValue" integer/>
      </section>

      <van-button @click="Submit" type="primary" round color="#2A91F0" block>{{popupText}}</van-button>
    </van-popup>


  </div>
</template>

<script>
  import {
    Row, Cell, GoodsAction, GoodsActionIcon, GoodsActionButton, Toast, Button,
    Lazyload, Icon, Popup, SwipeItem, Swipe, Grid, GridItem, Stepper, Sticky, Loading, SubmitBar
  } from 'vant';
  import Vue from 'vue';
  import urls from '../../utils/urls';
  import http from '../../utils/http';
  import {getlocalStorage, setSessionStorage,getSessionStorage} from "../../config/Utils";

  Vue.use(Lazyload, {
    lazyComponent: true
  });
  export default {
    name: "goodsDetails",
    components: {
      [Button.name]: Button,
      [SubmitBar.name]: SubmitBar,
      [Row.name]: Row,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [Grid.name]: Grid,
      [Popup.name]: Popup,
      [Toast.name]: Toast,
      [Sticky.name]: Sticky,
      [Loading.name]: Loading,
      [Stepper.name]: Stepper,
      [GridItem.name]: GridItem,
      [GoodsAction.name]: GoodsAction,
      [GoodsActionIcon.name]: GoodsActionIcon,
      [GoodsActionButton.name]: GoodsActionButton,
    },
    data() {
      return {
        images: [],
        defaultConsignee: {}, // 收货地址信息
        popupText: '', // 按钮名称
        skuIndex: null, // 规格索引
        skuObj: {
          price: '--',
          codeName: '--'
        }, //  选择规格详情
        goodsValue: 1,//购买数量
        showPopup: false,
        showVideo: false,  // 视频展示
        contentVideo: '',// 视频链接
        goodsDetails: {}, // 商品详情
        limit: 3, // 每页条数
        page: 1, // 页码
        typeList: [],// 今日推荐
        skus: [],// 规格集合
        similarCommodityList: [], // 同类商品
      }
    },
    methods: {


      clickSim(url, id) { // 跳转路由
        if (id) {
          this.$router.push({path: url, query: {id: id}})
        } else {
          this.$router.push({path: url})
        }
      },

      Return() {
        this.$router.go(-1)
      },


      toPath(url, data) { // 路由跳转
        setSessionStorage('popupText',this.popupText);
        if (data) {
          this.$router.push({path: url, query: data}); //跳转地址设置
          return
        }
        this.$router.push(url)
      },

      getDetails(id) { // 查询详情
        this.images = [];
        http.get(`${urls.goods}/${id}`, {}).then(res => {
          if (res.success) {
            this.goodsDetails = res.data.goods;
            this.getArticleList(this.goodsDetails.category.name);
            let id = this.goodsDetails.category.pid;
            this.getRecommend(id);//同类商品推荐
            this.images = this.goodsDetails.gallery.split(',');
            this.skus = res.data.skus || [];
            if (this.skus.length == 0) {
              this.skuObj.price = this.goodsDetails.price
            }
            this.skus = forEach(item => {
              item.codeName = item.codeName.replace(/,/gim, " ");
            });

          }
        }).catch(err => {

        })

      },

      getAddress() { // 查询地址
        http.get(urls.queryAddress, {}).then(res => {
          this.isLoding = false;
          if (res.success) {
            let addressData = res.data || [];
            addressData.forEach(item => {
              if (item.isDefault) {
                this.defaultConsignee = item;
                return
              }
            });
          }
        }).catch(err => {

        })
      },

      getRecommend(id) { // 商品推荐
        http.get(urls.queryGoods, {
          idCategory: id,
          isNew: true,
          page: this.page, // 页码
          limit: this.limit // 条数
        }).then(res => {
          if (res.success) {
            this.typeList = res.data.records || []; // 赋值
          }
        }).catch(err => {

        })
      },

      choodeSku(item, index) { // 选择规格
        this.skuIndex = index;
        this.skuObj = item;
      },

      nowBuy() {  // 立即购买
        this.showPopup = true;
        this.popupText = '立即购买';
      },

      addCart() { // 加入购物车
        this.showPopup = true;
        this.popupText = '加入购物车';
      },

      Submit() { //提交订单
        if (this.popupText == '加入购物车') {
          let params = {};
          params.count = this.goodsValue;
          params.idGoods = this.$route.query.id;
          params.idSku = this.skuObj.id;
          http.post(urls.addCart, params).then(res => {
            if (res.success) {
              Toast.success('购物车添加成功！')
            }
          }).catch(err => {

          })
        } else {
          this.$router.push('/orderConfirm')
        }
      },


      getArticleList(author) { // 视频推荐
        let params = {
          page: 1,
          limit: 3
        };
        http.get(urls.articleList, {...params, author: '推荐'}).then(res => {
          if (res.success) {
            this.similarCommodityList = res.data.records;
          }
        }).catch(err => {

        });

      },
      addReadNum(id) {
        http.get(urls.addReadNum, {id: id}).then(res => {

        }).catch(err => {

        })
      }
    },

    created() {
      let id = this.$route.query.id;
      this.getDetails(id); // 查询订单详情

      this.addReadNum(id);
      if (getSessionStorage('address')) {
        this.showPopup = true;
        this.popupText = getSessionStorage('popupText');
        this.defaultConsignee = JSON.parse(getSessionStorage('address'))
      } else {
        this.getAddress();
      }
    },


    watch: {
      $route() {   // 监听路由参数变化重新加载
        let id = this.$route.query.id;
        this.getDetails(id);
        this.addReadNum(id);
      }
    }

  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .goodsDetails {
    .bgdiv {
      width: 100%;
      height: 300px;
      background-size: 100% 100%;
      .van-swipe img {
        @include wh(100%, 300px)
      }
      header {
        z-index: 100;
        padding-top: 10px;
        .text {
          @include sc(18px, #fff)
        }
        .van-icon {
          position: relative;
          top: 2px;
        }
        width: 100%;
        position: absolute;
        display: flex;
        span {
          flex: 1;
        }
      }
    }
    main {
      position: relative;
      top: -20px;
      background: white;
      padding: 15px;
      border-radius: 15px 15px 0 0;
      margin-bottom: 50px;
      .title {
        overflow: hidden;
        h4 {
          margin: 0;
        }
        span {
          @include sc(14px, #535353)
        }
      }
      section {
        > p {
          text-align: left;
          @include sc(14px, #7E7E7E);
          &:first-child {
            width: 100%;
            font-weight: 600;
            @include sc(14px, #414141);
          }
        }
        .p-title {
          overflow: hidden;
          span {
            &:last-child {
              color: #A6A6A6;
              font-weight: 500;
            }
          }
        }

      }
      table {
        width: 100%;
        tr {
          margin: 10px 0;
          @include sc(12px, #414141);
          font-weight: 600;
          width: 100%;
          td {
            padding: 12px 0;
            width: 18%;
            &:nth-child(2) {
              width: 28%;
            }
          }
          &:first-child {
            font-weight: 500;
            color: #7E7E7E;
          }
        }
      }
    }
    .scroll {
      min-height: 30px;
      width: 355px;
      overflow-x: scroll;
      /deep/ .van-grid-item__content {
        padding: 0 0 16px;
      }
      .grid {
        min-width: 481px !important;
      }
    }
    .vidoes {
      /deep/ .van-grid-item {
        box-shadow: 0 20px 5px rgba(23, 49, 67, 0.15);
        margin: 5px;
        border-radius: 6px;
      }
      img {
        @include wh(150px, 110px)
      }
      span {
        @include sc(14px, #173143);
        font-weight: 600;
        margin: 15px 0 0;
      }
    }
    footer {
      border-top: 1px solid #e4e4e4;
      background: white;
      box-sizing: border-box;
      padding: 0 10px;
      width: 100%;
      position: fixed;
      bottom: 0;
      height: 50px;
      overflow: hidden;
      div {
        margin-top: 5px;
        overflow: hidden;
      }
      span {
        line-height: 38px;
        padding: 0 30px;
        @include sc(12px, #fff);
        &:first-child {
          background-color: #64AEF3;
          border-radius: 19px 0 0 19px;
        }
        &:last-child {
          border-radius: 0 19px 19px 0;
          background-color: #2A91F0;
        }
      }
    }
  }

  .tab-grid {
    margin: 5px;
    img {
      width: 150px;
      height: 125px;
    }
    .tabDiv {
      box-sizing: border-box;
      padding: 0 3px;
      width: 100%;
      color: #fff;
      background-color: #173143;
      p {
        margin: 6px 0;
        &:first-child {
          width: 100%;
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
      }
    }
  }

  .van-popup {
    box-sizing: border-box;
    border-radius: 15px 15px 0 0;
    padding: 20px;
    section {
      /deep/ .van-cell {
        padding: 5px 0;
      }
      h4 {
        margin: 15px 0 8px;
      }
      &:first-child {
        border-bottom: 1px solid #E8E8E8;
        display: flex;
        p {
          margin: 10px 0;
          &:first-child {
            flex: 1;
            img {
              @include wh(95px, 95px)
            }
          }
          &:last-child {
            flex: 2;
            padding-left: 6px;
            span {
              @include sc(12px, #525252);
              display: block;
              margin: 7px 0 10px;
              &:first-child {
                @include sc(18px, #F15D5D);
              }
            }
          }
        }
      }
      &:nth-child(2) {
        p {
          margin: 5px;
          @include sc(14px, #737373)
        }
      }
      &:nth-child(3) {
        span {
          line-height: 36px;
          border-radius: 5px;
          margin: 6px 0;
          text-align: center;
          display: block;
          @include wh(60%, 36px);
          background-color: #F3F3F3;
        }
      }
      .van-stepper {
        margin-top: 18px;
      }
    }
    /deep/ .van-button {
      margin-top: 45px;
    }
    .sku {
      color: white;
      background: #3190e8 !important;
    }

  }

  #details {
    text-align: left !important;
  }

</style>
