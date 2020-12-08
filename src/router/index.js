import Vue from 'vue'
import Router from 'vue-router'
import {Toast} from 'vant';

import signIn from '../pages/signIn'
import register from '../pages/register'
import home from '../pages/home/home';
import moreGoods from '../pages/home/moreGoods';

import myMessage from '../pages/home/myMessage';
import shopCart from '../pages/shopCart'
import receiptAddress from '../pages/receiptAddress'
import videoRecommend from '../pages/videos/videoRecommend'
import videoDetails from '../pages/videos/videoDetails'

import chooseInvoice from '../pages/personCenter/chooseInvoice'
import addSettlement from '../pages/personCenter/addSettlement'
import goodsDetails from '../pages/goodsType/goodsDetails'
import myOrders from '../pages/personCenter/myOrders'
import personCenter from '../pages/personCenter/personCenter'
import orderConfirm from '../pages/goodsType/orderConfirm'
import onlineService from '../pages/personCenter/onlineService'
import confirmReceipt from '../pages/personCenter/confirmReceipt'
import feedback from '../pages/personCenter/feedback'
import returnGoods from '../pages/personCenter/returnGoods'
import myReward from '../pages/personCenter/myReward'
import Withdrawal from '../pages/personCenter/Withdrawal'
import returnInformation from '../pages/personCenter/returnInformation'
import myRanking from '../pages/personCenter/myRanking'
import paySuccess from '../pages/personCenter/paySuccess'


import {getlocalStorage, setSessionStorage, removeSessionStorage} from "../config/Utils";


const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) { //解决连续点击同一路由控制台报错
  this.isleft = false;
  this.isright = false;
  return originalPush.call(this, location).catch(err => err)
};

// 需要左方向动画的路由用this.$router.togo('****')
Router.prototype.togo = function (path) {
  this.isleft = true;
  this.isright = false;
  this.push(path)
};

// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function (path) {
  this.isright = true;
  this.isleft = false;
  this.push(path)
};
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function () {
  this.isright = true;
  this.isleft = false;
  this.go(-1)
};
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function () {
  this.isright = true;
  this.isleft = false
};
Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    //地址为空时跳转home页面
    {
      path: '',
      redirect: '/home',
    },
    //地址为空时跳转home页面
    //首页商城列表页
    {
      path: '/home', // 首页
      name: "home",
      component: home,
      meta: {
        title: '首页',
        // keepAlive: true
      }
    },
    {
      path: '/register', // 注册
      name: "register",
      component: register,
      meta: {
        title: '注册',
        // keepAlive: true
      }
    },
    {
      path: '/moreGoods', //更多商品
      name: "moreGoods",
      component: moreGoods,
      meta: {
        title: '更多商品',
        // keepAlive: false
      }
    },

    {
      path: '/videoRecommend', //视频推荐
      name: "videoRecommend",
      component: videoRecommend,
      meta: {
        title: '视频推荐'
      }
    },
    {
      path: '/shopCart',  // 购物车
      name: "shopCart",
      component: shopCart,
      meta: {
        title: '购物车',
      }
    },
    {
      path: '/personCenter', // 个人中心
      name: "personCenter",
      component: personCenter,
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/signIn', // 登录注册
      name: "signIn",
      component: signIn,
      meta: {
        title: '登录注册'
      }
    },
    {
      path: '/receiptAddress', //收货地址
      name: "receiptAddress",
      component: receiptAddress,
      meta: {
        title: '收货地址',
        requireAuth: true
      }
    },
    {
      path: '/goodsDetails', //商品详情
      name: "goodsDetails",
      component: goodsDetails,
      meta: {
        title: '商品详情',
        requireAuth: true,
      }
    },
    {
      path: '/orderConfirm', //订单确认
      name: "orderConfirm",
      component: orderConfirm,
      meta: {
        title: '订单确认',
        requireAuth: true
      }
    },

    {
      path: '/myOrders', //我的订单
      name: "myOrders",
      component: myOrders,
      meta: {
        title: '我的订单',
        requireAuth: true
      }
    },
    {
      path: '/onlineService', //在线客服
      name: "onlineService",
      component: onlineService,
      meta: {
        title: '在线客服',
        requireAuth: true
      }
    },

    {
      path: '/chooseInvoice', //选择发票
      name: "chooseInvoice",
      component: chooseInvoice,
      meta: {
        title: '选择发票',
        requireAuth: true
      }
    },

    {
      path: '/confirmReceipt', //确认收货
      name: "confirmReceipt",
      component: confirmReceipt,
      meta: {
        title: '确认收货',
        requireAuth: true
      }
    },
    {
      path: '/addSettlement', //添加结算中心
      name: "addSettlement",
      component: addSettlement,
      meta: {
        title: '添加结算中心',
        requireAuth: true
      }
    },
    {
      path: '/feedback', //意见反馈
      name: "feedback",
      component: feedback,
      meta: {
        title: '意见反馈',
        requireAuth: true
      }
    },
    {
      path: '/returnGoods', //退货列表
      name: "returnGoods",
      component: returnGoods,
      meta: {
        title: '退货列表',
        requireAuth: true
      }
    },
    {
      path: '/myReward', //我的奖励
      name: "myReward",
      component: myReward,
      meta: {
        title: '我的奖励',
        requireAuth: true
      }
    },
    {
      path: '/Withdrawal', //提现至银行卡
      name: "Withdrawal",
      component: Withdrawal,
      meta: {
        title: '提现至银行卡',
        requireAuth: true
      }
    },
    {
      path: '/returnInformation', //退货信息
      name: "returnInformation",
      component: returnInformation,
      meta: {
        title: '退货信息',
        requireAuth: true
      }
    },
    {
      path: '/myMessage', //消息通知
      name: "myMessage",
      component: myMessage,
      meta: {
        title: '消息通知',
        requireAuth: true
      }
    },
    {
      path: '/myRanking', //我的排名
      name: "myRanking",
      component: myRanking,
      meta: {
        title: '我的排名',
        requireAuth: true
      }
    },
    {
      path: '/videoDetails', //视频详情
      name: "videoDetails",
      component: videoDetails,
      meta: {
        title: '视频详情',
        requireAuth: true
      }
    },
    {
      path: '/paySuccess', //支付成功
      name: "paySuccess",
      component: paySuccess,
      meta: {
        title: '支付成功',
        requireAuth: true
      }
    },

  ],
});

router.beforeEach((to, from, next) => {
  if ( (from.path == '/myOrders' && to.path == '/personCenter') || (from.path == '/paySuccess' && to.path == '/home') ) {
    removeSessionStorage('tabActive');
  }


  if (from.path == '/orderConfirm') {
    if (!(to.path == '/receiptAddress')) { // 订单确认页面前往的不是地址设置页面，清空缓存的地址信息
      removeSessionStorage('address');
    }
  }
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  window.scrollTo(0, 0);
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    // if (getlocalStorage("token")) {
    next();
    // } else {
    //   Toast("请先登录");
    //   next({
    //     path: '/signIn',
    //   })
    // }
  } else {
    next()
  }
});
export default router;


