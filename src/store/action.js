import {getCatalog, getUserinfo} from '../utils/service';
import {Set_Catalog, Is_Login} from './mutation-type.js'
import cookie from "vue-cookies"
import {Toast} from 'vant';
import {setlocalStorage, removelocalStorage} from "../config/Utils";
import router from '../router';

export default {
  async getCatalogList({commit, state}) { // 设置菜单分类
    let data = await getCatalog();
    commit(Set_Catalog, JSON.parse(JSON.stringify(data)))
  },

  async getUserInfo({commit, state}) {
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '正在登录',
    });
    let res = await getUserinfo(state.loginForm);
    if (res.success) {
      toast.clear();
      setlocalStorage("token", res.data.token); // token
      setlocalStorage("userInfo", res.data.user); // 用户信息
      Toast.success("登录成功");
      commit(Is_Login, true);
      router.push({path: "/home"});
    } else {
      Toast.fail(res.msg);
    }
  }
}
