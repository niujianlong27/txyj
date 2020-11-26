import axios from 'axios';
import router from '../router';
import {Toast, Notify} from 'vant';
import {getlocalStorage, removelocalStorage, setlocalStorage} from '../config/Utils'
import Qs from 'qs'
import Vue from 'vue'
import cookie from "vue-cookies"
import {Is_Login} from "../store/mutation-type";

Vue.use(Toast);
//请求超时120s
axios.defaults.timeout = 120000;
//请求base url
axios.defaults.baseURL = null;
axios.defaults.withCredentials = true;//让axios携带cookie

//设置post请求是的header信息
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.transformRequest = [function (data) {
//   let ret = '';
//   for (let it in data) {
//     ret += encodeURIComponent(it) + '=' + encodeURIComponent(JSON.stringify(data[it])) + '&'
//   }
//   console.log(ret);
//   return ret
// }];
// //http request 拦截器
axios.interceptors.request.use( // 请求数据设置
  config => {
    let token = getlocalStorage('token');
    if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers = {
        'Authorization': token
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
);

axios.interceptors.response.use( // 响应数据设置
  response => {
    if (!(response.data.success)) {
      Toast.fail(response.data.msg);
    }
    return response
  },
  error => {
    console.log(error.response)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          //如果后台返回401，则清空本地用户信息信息并跳转至登录页
          removelocalStorage("token");
          removelocalStorage("userInfo");
          router.push({
            path: '/signIn',
          });
          return Promise.reject(error.response.data.message);
          break;
        case 500:
          if (error.response.data.message) {
            if (error.response.data.message.indexOf('relogin') > -1) {
              // removelocalStorage("token");
              // removelocalStorage("userInfo");
              // router.push({
              //   path: '/signIn',
              // });
              return Promise.reject(error.response.data.message)
            } else {
              // removelocalStorage("token");
              // removelocalStorage("userInfo");
              // router.push({
              //   path: '/signIn',
              // });
              Toast.fail(error.response.data.message);
              return Promise.reject(error.response.data.message);

            }
          }
          break;
        default:
          return Promise.reject(error.response.data.message)
      }
    }
    // if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
    //   Notify('请求超时');
    // }
    // return Promise.reject(err)
  }
);


export default {
  get: function (url, params = {}) {
    let param = {...params};
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params,
      }).then(response => {
        resolve(response.data);
      })
        .catch(err => {
          reject(err)
        })
    })
  },
  post: function (url, data) {
    return new Promise((resolve, reject) => {
      axios.post(url, data)
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err)
        })
    })
  },
  post2: function (url, data) {
    return new Promise((resolve, reject) => {
      axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        resolve(response.data);
      }, err => {
        console.log(err);
        reject(err)
      })
    })
  },
  delete: function (url, data) {
    return new Promise((resolve, reject) => {
      axios.delete(url,
        {data: data})
        .then(response => {
          resolve(response.data);
        }, err => {
          console.log(err);
          reject(err)
        })
    })
  }


}
