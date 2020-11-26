<template>
  <div class="addSettlement">
    <page-nav :title="title"></page-nav>
    <main>
      <p class="title">填写真实信息</p>
      <section>
        <van-form @submit="onSubmit1" ref="form1">
          <van-field
            @input="onBlur"
            v-model="name"
            required
            name="name"
            label="真实姓名"
            placeholder="请输入"
            :error="false"
            :rules="[{ required: true, message: '请输入真实姓名'}]"
          />

          <van-field
            @input="onBlur"
            v-model="idCard"
            required
            name="idCard"
            label="身份证号"
            placeholder="请输入"
            :error="false"
            :rules="[{ required: true, message: '请输入身份证号'}]"
          />
        </van-form>
      </section>

      <p class="title">请输入你的银行卡信息</p>
      <section>
        <van-form @submit="onSubmit2" ref="form2">
          <template v-for="item in formData">
            <template v-if="item.type == 'select'">
              <van-field
                readonly
                clickable
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
                <van-picker
                  show-toolbar
                  :title="item.title"
                  :value-key="item.key"
                  :columns="item.columns"
                  @cancel="item.showPicker = false"
                  @confirm="pickConfirm($event,item)"
                />

              </van-popup>
            </template>
            <template v-if="item.type== 'date'">
              <van-field
                readonly
                clickable
                :name="item.eName"
                v-model="item.value"
                :label="item.cName"
                placeholder="点击选择时间"
                @click="item.showPicker = true"
              />
              <van-calendar v-model="item.showPicker" @confirm="onConfirm($event,item)"/>

            </template>
            <template v-if="item.type == 'text'">
              <van-field
                v-model="item.value"
                :name="item.eName"
                :label="item.cName"
                placeholder="请输入"
                :required="item.required"
                :error="false"
                :rules="item.rule"
              >
                <template v-if="item.isButton" #button>
                  <van-button @click="sendCode"  :loading="buttonClick" :loading-text="buttonCode" round size="small" plain hairline native-type="button"  type="info">
                    获取
                  </van-button>
                  <!--<van-button :loading="buttonClick" loading-type="spinner" :loading-text="buttonCode" @click="sendCode"-->
                              <!--size="small" native-type="button" type="default">-->
                    <!--发送验证码-->
                  <!--</van-button>-->
                </template>
              </van-field>
            </template>
          </template>
        </van-form>
      </section>
      <div style="margin: 40px auto 0;width: 90%">
        <van-button color="#2A91F0" round block type="info" @click="createFrom" native-type="submit">
          确定绑卡
        </van-button>
      </div>
    </main>

  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Form, Field, RadioGroup, Radio, Toast, Calendar, Picker, Popup, Button} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "addSettlement",
    components: {
      pageNav,
      [Form.name]: Form,
      [Field.name]: Field,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Calendar.name]: Calendar,
      [Picker.name]: Picker,
      [Popup.name]: Popup,
      [Button.name]: Button,
      [Toast.name]: Toast,
    },
    data() {
      return {
        codeNum: 60, //秒数
        buttonCode: '', // 验证码
        buttonClick: false, // 验证码按钮可点击
        id: '',
        invoiceId: '',
        name: "", // 姓名
        idCard: '',// 身份证号
        state: '',//新增或修改状态
        formTrue1: false,//表单验证通过
        formData1: {},//表单1
        formData2: {},//表单2
        title: '绑定银行卡',
        statementName: "", // 结算中心标题
        //
        // "": "string",
        // "": "string",
        // "createTime": "2020-10-09T01:43:40.949Z",
        // "id": 0,
        // "": "string",
        // "idUser": 0,
        // "isDefault": true,
        // "isDelete": true,
        // "modifyTime": "2020-10-09T01:43:40.949Z",
        // "name": "string",
        // "": "string
        formData: [
          {
            required: true,
            cName: '银行卡号',
            eName: 'cardNum',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请输入银行卡号'}, {pattern: /^[0-9]+$/, message: '请输入银行卡号'}]
          },
          {
            required: true,
            cName: '选择银行',
            eName: 'bankName',
            title: '请选择银行名称',
            type: 'select',
            key: 'text',
            columns: [{values: [{text: '中国银行', key: 0}]}],
            showPicker: false,
            value: '',
            rule: [{required: true, message: '请选择银行'}]
          },
          {
            required: true,
            cName: '手机号码',
            eName: 'tel',
            type: 'text',
            value: '',
            rule: [{required: true, message: '请输入手机号码'},{pattern: /^[0-9]{11}$/, message: '请输入正确的手机号'}]
          },
          {
            required: true,
            cName: '短信验证',
            eName: 'smsCode',
            type: 'text',
            value: '',
            placeholder: '请输入验证码',
            isButton: true,
            rule: [{required: true, message: '请输入验证码'}]
          },

        ],
      }
    },
    methods: {
      sendCode() { // 获取验证码
        let formDatas = this.$refs.form2.getValues();
        if (!formDatas.tel) {
          Toast.fail('请输入手机号');
          return
        }
        http.post(`${urls.sendSmsCode}?mobile=${formDatas.tel}`, {}).then(res => {
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
      getBank() {  // 查询银行名称
      },
      onBlur() {
        // this.$refs.form1.submit(); // 触发onSubmit
      },

      onConfirm(value, item) { // 时间选择
        item.showPicker = false;
        if (item.type === 'date') {
          item.value = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
          return
        }
        item.value = value;
      },

      pickConfirm(value, item) { // 选择框确定按钮
        item.showPicker = false;
        if (item.eName == 'bankName') {  // 银行名称
          item.value = value[0].text
        }
      },

      onSubmit1() { //表单1
        this.formData1 = this.$refs.form1.getValues();
        this.formTrue1 = true;
      },
      onSubmit2() { // 表单2 提交
        this.formData2 = this.$refs.form2.getValues();
        if (this.formTrue1) {
          http.post(urls.bankcardSave, {...this.formData1, ...this.formData2}).then(res => {
            if (res.success){
              Toast.success('新增成功');
              this.$router.go(-1);
            }
          }).catch(err => {

          })
        }
      },

      createFrom() { // 提交表单
        this.$refs.form1.submit(); // 触发onSubmit
        this.$refs.form2.submit(); // 触发onSubmit
      },

    },

    created() {
      this.state = this.$route.query.state;
      this.getBank();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    /deep/ .van-popup {
      height: 60%;
    }
    background-color: #F5F5F5;
    padding: 0 20px 50px;
  }

  .title {
    width: 100%;
    @include sc(14px, #9A9A9A);
    text-align: left;
  }

  section {
    box-sizing: border-box;
    padding: 1px 5px 1px 16px;
    margin-top: 10px;
    border-radius: 7px;
    background-color: #FFFFFF;
    text-align: left;
    p {
      padding-left: 6px;
      margin: 12px 0;
      span {
        &:first-child {
          color: #373737;
          font-weight: 500;
        }
      }
      @include sc(12px, #898989)
    }
    .van-cell {
      padding: 10px 0 10px 13px;
    }
    /deep/ .van-button--small {
      height: 0.25rem;
      padding: 0 12px;
    }

  }

</style>
