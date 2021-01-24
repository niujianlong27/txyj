<template>
  <div id="app">

    <!--<transition :name="transitionName">-->
    <!--<router-view class="Router"></router-view>-->
    <!--</transition>-->

    <!--这里是需要keepalive的-->
    <keep-alive>
      <router-view class="Router" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <!-- 这里不会被keepalive -->
    <!--"-->
    <router-view v-if="!$route.meta.keepAlive" class="Router"></router-view>
  </div>
</template>

<script>
  import urls from './utils/urls';
  import http from './utils/http';
  import {setlocalStorage, removelocalStorage} from "./config/Utils";
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    name: 'App',
    data: function () {
      return {
        transitionName: 'switch',
      }
    },

    methods: {

      ...mapMutations([
        'Set_Active'
      ]),
      // ...mapActions([
      //   'getCatalogList'
      // ]),
      setActive(url) {
        if (url == '/home') {
          this.Set_Active(0)
        } else if (url == '/videoRecommend') {
          this.Set_Active(1)
        } else if (url == '/shopCart') {
          this.Set_Active(2)
        }
        else if (url == '/personCenter') {
          this.Set_Active(3)
        }
      }
    },
    created() {
      let url = window.location.href;
      let arr = url.split('/');
      let str = `/${arr[arr.length - 1]}`;
      this.setActive(str)
    },
    watch: {
      $route(to, from) {   // 监听路由变化重新赋值
        this.setActive(to.path)
      }
    }
  }
</script>

<style>
  * {
    touch-action: auto;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif, PingFangSC-Medium, PingFang SC;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    font-size: 16px;
  }

  .Router {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    transition: all .3s ease;
    -webkit-transition: all .3s ease;
    -moz-transition: all .3s ease;
    background-color: #F5F5F5;

  }

  .slideleft-enter,
  .slideright-leave-active {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }

  .slideleft-leave-active,
  .slideright-enter {
    opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
  }

  .switchenter,
  .switch-leave-active {
    transition: 0s;
    opacity: 0;
  }


</style>
