<template>
  <div class="feedback">
    <page-nav :title="'意见反馈'"></page-nav>
    <main>
      <section>
        <p>反馈意见</p>
        <div>
          <van-field
            v-model="message"
            rows="5"
            type="textarea"
            placeholder="请写下您对本产品的建议或意见"
          />
        </div>
        <p>联系方式</p>
        <div>
          <van-field v-model="phone" placeholder="手机号/邮箱"/>
        </div>
      </section>

      <van-button @click="save" color="#2A91F0" type="primary" round block>提交信息</van-button>
    </main>
  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Field, Toast, Button} from 'vant';
  import http from '../../utils/http';
  import urls from '../../utils/urls';

  export default {
    name: "feedback",
    components: {
      pageNav,
      Toast,
      [Field.name]: Field,
      [Button.name]: Button,
    },
    data() {
      return {
        phone: '',
        message: ''
      }
    },
    methods: {
      save() {
        if (this.phone && this.message) {
          http.post(urls.feedbackSave, {
            callInfo: this.phone,
            opinion: this.message
          }).then(res => {
            if (res.success) {
              Toast.success('反馈意见提交成功！');
              this.phone = '';
              this.message = '';
            }
          }).catch(err => {

          })

        } else {
          Toast(' 请填写反馈意见及联系方式！')
        }

      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .feedback {
    background-color: #F5F5F5;
    main {
      padding: 10px 10px;
      background-color: #F5F5F5;
      section {
        border-radius: 5px;
        background-color: #fff;
        padding: 1px 10px 16px;
        text-align: left;
        /deep/ .van-field {
          background-color: #E7E7E7;
        }
      }
      .van-button {
        margin-top: 50px;
      }
    }

  }

</style>
