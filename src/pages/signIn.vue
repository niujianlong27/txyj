<template>
  <div class="signIn">
    <div>
      <h4 class="left">登录天下一家</h4>
      <span @click.stop="register" class="right">注册</span>
    </div>
    <section>
      <van-form @submit="signIn" ref="form">
        <template v-for="item in fromData">
          <template v-if="item.type == 'text'">
            <van-field
              center
              :error="false"
              :name="item.eName"
              :label="item.cName"
              v-model="item.value"
              :placeholder="item.placeholder"
              :rules="item.rule"
            >
              <template v-if="item.isButton" #button>
                <van-button @click="sendCode" size="small" native-type="button" type="default">发送验证码</van-button>
              </template>
            </van-field>

          </template>
          <template v-if="item.type == 'password'">
            <van-field
              center
              type="password"
              :error="false"
              :name="item.eName"
              :label="item.cName"
              v-model="item.value"
              :placeholder="item.placeholder"
              :rules="item.rule"
            >
              <template v-if="item.isButton" #button>
                <van-button @click="sendCode" size="small" native-type="button" type="default">发送验证码</van-button>
              </template>
            </van-field>

          </template>
        </template>

        <div style="margin: 16px;">

          <van-button block type="info" native-type="submit">
            登录
          </van-button>
        </div>

      </van-form>

    </section>
    <footer v-show="hideshow">
      <van-checkbox v-model="radio">登陆前请确认登陆协议</van-checkbox>
    </footer>
  </div>
</template>

<script>
  import {Form, Field, Button, Checkbox, Toast} from 'vant';
  import {setlocalStorage, getlocalStorage, removelocalStorage} from '../config/Utils'
  import http from '../utils/http';
  import urls from '../utils/urls';
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    name: "signIn",
    components: {
      [Form.name]: Form,
      [Field.name]: Field,
      [Toast.name]: Toast,
      [Button.name]: Button,
      [Checkbox.name]: Checkbox,

    },
    data() {
      return {
        docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
        showHeight: document.documentElement.clientHeight,   //实时屏幕高度
        hideshow: true, //显示或者隐藏footer
        errorMessage: '',
        radio: true,
        fromData: [
          {
            cName: '账号',
            eName: 'mobile',
            type: 'text',
            value: '',
            placeholder: '请输入手机号',
            rule: [{required: true, message: '请输入手机号'}]
          },
          {
            cName: '密码',
            eName: 'password',
            type: 'password',
            value: '',
            placeholder: '请输入登录密码',
            rule: [{required: true, message: '请输入登录密码'}]
          },
        ],
      }
    },
    computed: { //
      ...mapState(["isLogin"])
    },
    methods: {
      ...mapActions([
        'getUserInfo'
      ]),

      ...mapMutations([
        'Is_Login',
        'Set_LoginForm',
      ]),

      signIn(values) { // 登录
        this.Set_LoginForm(values);
        this.getUserInfo();
      },

      register() { // 忘记密码
        this.$router.push('/register')
      },
    },
    watch: {

      showHeight() { // 监听屏幕高度
        if (this.docmHeight > this.showHeight + 130) {
          this.hideshow = false
        } else {
          this.hideshow = true
        }
      }
    },
    mounted() {
      this.Is_Login(false);
      window.onresize = () => { //获取屏幕高度
        return (() => {
          this.showHeight = document.documentElement.clientHeight;
        })();
      }
    },
    created() {
      removelocalStorage("token");
      removelocalStorage("userInfo");
      this.$cookies.remove('autologin');
    }

  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .signIn {
    background-color: white;
    text-align: left;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 20px;
    >div{
      overflow: hidden;
      width: 100%;
      margin: 100px 0 22px;
      line-height: 30px;
      h4 {
        margin: 0;
        display: inline-block;
        font-size: 23px;
      }
      span{
        @include sc(15px,#e44a4a )

      }
    }

    .van-cell {
      height: 60px;
    }
    .van-button {
      margin-top: 50px;
    }
    footer {
      @include cl;
      text-align: center;
      width: 200px;
      bottom: 40px;
      /deep/ .van-checkbox__label {
        @include sw(500, #B9B9B9);
      }
      span {
        @include sw(500, #B9B9B9);
      }

    }
  }

</style>
