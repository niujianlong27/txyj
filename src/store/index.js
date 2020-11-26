import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'
import actions from './action'
import getters from './getters'
import cookie from "vue-cookies"

Vue.use(Vuex);

const state = {
  catalog: {},//商品分类列表
  isLogin:false, // 是否登录
  loginForm:{},// 登录信息
  active:0, // 导航栏标记
  chooseCart:[]
};
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
