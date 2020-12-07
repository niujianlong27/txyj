<template>
  <div class="register">
    <div class="title"><h4>注册天下一家</h4>
      <span class="red" @click="signIn" v-show="stepType == 1">登录</span>

      <span @click="returnStep" v-show="stepType == 2">返回</span>

    </div>
    <section v-if="stepType == 1" class="firstStep">
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell
            center
            v-for="(item, index) in list"
            @click="radio = item.name"
            :key="index"
            clickable
            :icon="item.icon"
            :title="item.name"
          >
            <template #right-icon>
              <van-radio :name="item.name"/>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <van-button color="#2A91F0" @click.stop="nextStep" type="primary" block>下一步</van-button>
    </section>

    <section v-if="stepType == 2 && idType == 4" class="stepTwo">
      <van-form @submit="register" ref="form">
        <template v-for="item in fromData">
          <template v-if="item.type == 'text'">
            <van-field
              center
              :required="item.required"
              :error="false"
              :name="item.eName"
              :label="item.cName"
              v-model="item.value"
              :placeholder="item.placeholder"
              :rules="item.rule"
            >
              <template v-if="item.isButton" #button>
                <van-button :loading="buttonClick" loading-type="spinner" :loading-text="buttonCode"
                            :disabled="buttonClick" @click="sendCode" size="small" native-type="button" type="default">
                  发送验证码
                </van-button>
              </template>
            </van-field>

          </template>
        </template>

        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>

      </van-form>
    </section>

    <section v-if="stepType == 2 && idType!= 4">
      <van-form @submit="register" ref="form">
        <template v-for="item in fromData2">
          <template v-if="item.type == 'text'">
            <van-field
              center
              :required="item.required"
              :error="false"
              :name="item.eName"
              :label="item.cName"
              v-model="item.value"
              :placeholder="item.placeholder"
              :rules="item.rule"
            >
              <template v-if="item.isButton" #button>
                <van-button :loading="buttonClick" loading-type="spinner" :loading-text="buttonCode" @click="sendCode"
                            size="small" native-type="button" type="default">
                  发送验证码
                </van-button>
              </template>
            </van-field>
          </template>

          <template v-if="item.type == 'uploader1'">
            <van-field :name="item.eName" :rules="item.rule" :label="item.cName">
              <template #input>
                <van-uploader :after-read="idafterRead" :max-count="1" v-model="item.value"/>
              </template>
            </van-field>
          </template>

          <template v-if="item.type == 'uploader2'">
            <van-field :name="item.eName" :rules="item.rule" :label="item.cName">
              <template #input>
                <van-uploader :after-read="biafterRead" :max-count="1" v-model="item.value"/>
              </template>
            </van-field>
          </template>

          <template v-if="item.type == 'select'">
            <van-field
              readonly
              clickable
              @clear
              :name="item.eName"
              v-model="item.value"
              :label="item.cName"
              placeholder="请选择"
              @click="item.showPicker = true"
              :error="false"
              :rules="item.rule"
              :required="item.required"
            />

            <van-popup v-model="item.showPicker" position="bottom">
              <van-area @cancel="item.showPicker = false" @confirm="pickConfirm($event,item)" title="标题"
                        :area-list="item.columns"
                        :columns-num="3"/>
            </van-popup>
          </template>
        </template>

        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>

      </van-form>
    </section>
    <!--<footer v-show="hideshow">-->
    <!--<span @click.stop="signIn">去登录</span>-->
    <!--</footer>-->
  </div>

</template>

<script>
  import {RadioGroup, Area, Radio, Popup, Uploader, Toast, Picker, Button, Cell, Form, Field, CellGroup} from 'vant';
  import urls from '../utils/urls';
  import http from '../utils/http';
  import {getlocalStorage, removelocalStorage, setlocalStorage} from '../config/Utils'
  import areaList from '../../static/Area'

  export default {
    name: "register",
    components: {
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Area.name]: Area,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Button.name]: Button,
      [Form.name]: Form,
      [Field.name]: Field,
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      [Uploader.name]: Uploader,
      Toast
    },

    data() {
      return {
        docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
        showHeight: document.documentElement.clientHeight,   //实时屏幕高度
        hideshow: true, //显示或者隐藏footer
        time: '', // 定时器
        stepType: 1,
        idType: 1, // 身份类别
        radio: '酒店',
        showPicker: false, // 弹框
        codeNum: 60, //秒数
        buttonCode: '', // 验证码
        buttonClick: false, // 验证码按钮可点击
        idcard: "", // 身份证图片信息缓存
        bizlice: "", // 营业执照图片信息缓存
        fromData: [
          {
            cName: '客户名称',
            eName: 'nickName',
            type: 'text',
            value: '',
            placeholder: '请输入客户名称',
            rule: [{required: true, message: '请输入客户名称'}]
          },
          {
            cName: '账号',
            eName: 'mobile',
            type: 'text',
            value: '',
            placeholder: '请输入手机号',
            rule: [{required: true, message: '请输入手机号'}, {pattern: /^[0-9]{11}$/, message: '请输入正确的手机号'}]
          },
          {
            cName: '验证码',
            eName: 'smsCode',
            type: 'text',
            value: '',
            placeholder: '请输入验证码',
            isButton: true,
            rule: [{required: true, message: '请输入验证码'}]
          },
          {
            cName: '密码',
            eName: 'password',
            type: 'text',
            value: '',
            placeholder: '请设置登录密码',
            rule: [{required: true, message: '请设置登录密码'}]
          },
        ],
        fromData2: [
          {
            required: true,
            cName: '客户名称',
            eName: 'nickName',
            type: 'text',
            value: '',
            placeholder: '请输入客户名称',
            rule: [{required: true, message: '请输入客户名称'}]
          },
          {
            required: true,
            cName: '账号',
            eName: 'mobile',
            type: 'text',
            value: '',
            placeholder: '请输入手机号',
            rule: [{required: true, message: '请输入手机号'}, {pattern: /^[0-9]{11}$/, message: '请输入正确的手机号'}]
          },
          {
            required: true,
            cName: '验证码',
            eName: 'smsCode',
            type: 'text',
            value: '',
            placeholder: '请输入验证码',
            isButton: true,
            rule: [{required: true, message: '请输入验证码'}]
          },
          {
            required: true,
            cName: '密码',
            eName: 'password',
            type: 'text',
            value: '',
            placeholder: '请设置登录密码',
            rule: [{required: true, message: '请设置登录密码'}]
          },
          {
            required: true,
            cName: '我的区域',
            eName: 'area',
            title: '请选择区域',
            type: 'select',
            value: '',
            key: 'text',
            columns: areaList,
            showPicker: false,
            rule: [{required: true, message: '请选择区域'}]
          },
          {
            required: true,
            cName: '业务人员',
            eName: 'relatedname',
            type: 'text',
            value: '',
            placeholder: '请输入业务人员',
            rule: [{required: true, message: '请输入业务人员'}]
          },
          {
            required: true,
            cName: '身份证',
            eName: 'idcard',
            type: 'uploader1',
            value: [],
            placeholder: '请上传身份证',
            rule: [{required: false, message: '请上传身份证'}]
          },
          {
            required: true,
            cName: '营业执照',
            eName: 'bizlice',
            type: 'uploader2',
            value: [],
            placeholder: '请上传营业执照',
            rule: [{required: false, message: '请上传营业执照'}]
          },


        ],
        list: [
          {
            name: '酒店',
            icon: require('../assets/jiudian@3x.png'),

          },
          {
            name: '乡厨',
            icon: require('../assets/xiangchu@3x.png'),

          },
          {
            name: '批发',
            icon: require('../assets/pifa@3x.png'),
          },
          {
            name: '消费者',
            icon: require('../assets/xiaofeizhe@3x.png'),
          }
        ],
        result: [],
        timer: null,
      }
    },
    methods: {
      register() { // 注册
        let formData = this.$refs.form.getValues();
        if (this.idType == 4) {
          http.post(urls.registerPer, {...formData, type: this.idType}).then(res => {
            if (res.success) {
              Toast.success('注册成功');
              this.$router.push('/signIn')
            }
          }).catch(err => {

          })
        } else {
          formData.idcard = this.idcard;
          formData.bizlice = this.bizlice;

          http.post(urls.registerOrg, {...formData, type: this.idType}).then(res => {
            if (res.success) {
              Toast.success('注册成功');
              this.$router.push('/signIn')
            }
          }).catch(err => {

          })


        }
      },
      nextStep() { // 下一步
        switch (this.radio) {
          case('酒店') : {
            this.idType = 1;
          }
            break;
          case('乡厨') : {
            this.idType = 2;
          }
            break;
          case('批发') : {
            this.idType = 3;
          }
            break;
          case('消费者') : {
            this.idType = 4;
          }
            break;
          default:
            this.idType = 1;
        }
        this.stepType = 2;
      },

      sendCode() { // 发送验证码
        let formDatas = this.$refs.form.getValues();
        if (!formDatas.mobile) {
          Toast.fail('请输入手机号');
          return
        }
        http.post(`${urls.sendSmsCode}?mobile=${formDatas.mobile}`, {}).then(res => {

          if (res.success) {

            this.timer = window.setInterval(() => {
              if (this.codeNum <= 1) {
                window.clearInterval(this.timer);
                this.codeNum = 60;
                this.buttonClick = false;
                this.buttonCode = '发送验证码'
              } else {
                this.buttonClick = true;
                this.codeNum = this.codeNum - 1;
                this.buttonCode = `${this.codeNum}s`;
              }
            }, 1000);

          }
        }).catch(err => {

        });
      },

      idafterRead(item) { // 图片上传
        let params = {
          base64: item.content,
          name: item.file.name,
          type: item.file.type
        };
        item.status = 'uploading';
        item.message = '上传中...';
        http.post(urls.upload, params).then(res => {
          if (res.success) {
            item.status = '';
            this.idcard = res.data.realFileName
          } else {
            item.status = 'failed';
            item.message = '上传失败';
          }
        }).catch(err => {

        });

      },


      biafterRead(item) { // 图片上传
        let params = {
          base64: item.content,
          name: item.file.name,
          type: item.file.type
        };
        item.status = 'uploading';
        item.message = '上传中...';
        http.post(urls.upload, params).then(res => {
          if (res.success) {
            item.status = '';
            this.bizlice = res.data.realFileName
          } else {
            item.status = 'failed';
            item.message = '上传失败';
          }
        }).catch(err => {

        });

      },




      pickConfirm(values, item) { // 选择框确定按钮
        item.value = `${values[0].name}${values[1].name}${values[2].name}`;

        item.showPicker = false;
      },

      returnStep() {
        this.stepType = 1;
        this.buttonClick = false;
        this.codeNum = 60;
        window.clearInterval(this.timer);
      },
      signIn() {
        this.$router.push('/signIn')
      }
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
      window.onresize = () => { //获取屏幕高度
        return (() => {
          this.showHeight = document.documentElement.clientHeight;
        })();
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';

  .register {
    background-color: white;
    text-align: left;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 20px;
    .title {
      overflow: hidden;
      margin-top: 100px;
      line-height: 30px;

      h4 {
        margin-top: 0;
        display: inline-block;
        font-size: 23px;
      }
      span {
        float: right;
        position: relative;
        top: 5px;
        @include sc(15px, #7A7A7A);
      }
      .red {
        @include sc(15px, #e44a4a)
      }
    }

    .firstStep {
      .van-cell__title {
        font-weight: 600;
        padding-left: 10px;
        @include sc(16px, #222224)
      }
      .van-cell {
        margin: 20px 0;
        height: 71px;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
      }
    }
    .stepTwo {
      .van-cell {
        height: 60px;
      }
    }
    .van-field__button {
      .van-button {
        margin-top: 0;
        color: #2A91F0;
        border: none;
      }
    }
    .van-button {
      margin-top: 50px;
    }
    footer {
      //@include cl;
      text-align: center;
      width: 100%;
      margin: 20px 0;
      span {
        @include sw(500, #B9B9B9);
      }

    }

  }

</style>
