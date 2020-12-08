<template>
  <div class="returnInformation">
    <page-nav :title="'退货信息'"></page-nav>
    <main>
      <section @click="clickItem()">
        <div>
          <img width="90px" height="92px" :src="goodsDetails.pic | setImg" alt="">
        </div>
        <div>
          <p><span class="title">{{goodsDetails.name}}</span></p>
          <p>{{goodsDetails.descript}}</p>
          <p><span>¥ {{goodsDetails.price}} </span> <span>x {{count}}</span></p>
        </div>
      </section>
      <section>
        <van-form @submit="onSubmit2" ref="form">
          <template v-for="item in formData">
            <template v-if="item.type == 'number'">
            <van-field
              @input="input"
              v-model="item.value"
              :name="item.eName"
              :label="item.cName"
              placeholder="请输入"
              :required="item.required"
              :error="false"
              :rules="item.rule"
              type="digit"
              :error-message="eMessage"
            />
            </template>
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
                  @change="change"
                  @cancel="item.showPicker = false"
                  @confirm="pickConfirm($event,item)"
                />

              </van-popup>
            </template>
            <template v-if="item.type == 'textarea'">
              <van-field
                v-model="item.value"
                :name="item.eName"
                :label="item.cName"
                placeholder="请输入"
                :required="item.required"
                :error="false"
                autosize
                type="textarea"
                rows="4"
                :rules="item.rule"
              >
              </van-field>
            </template>
          </template>
        </van-form>
      </section>
      <p>退款金额：<span class="red">￥ {{allPrice}}</span> </p>

      <div style="margin-top: 30px;">
        <van-button round block type="info" @click="buttonClick">
          提交申请
        </van-button>
      </div>

    </main>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Form, Field, RadioGroup, Radio, Toast, Calendar, Picker, Popup, Button} from 'vant';
  import urls from '../../utils/urls';
  import http from '../../utils/http';
  import {mul} from "../../config/Utils";

  export default {
    name: "returnInformation",
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
      let validator = (val) => {
        if (val == 0) {
          this.eMessage = "商品退货数量不能为0";
          return false
        }
        if (Number(val) > Number(this.count)) {
          this.eMessage = "商品退货数量不能大于订单数量";
          return false
        } else {
          return true
        }
      };
      return {
        goodsDetails: {}, // 商品信息
        count: 0,//订单商品数量
        eMessage: '', // 提示信息
        allPrice: 0, //总价格
        formData: [ // 表单输入
          {
            required: true,
            cName: '退款原因',
            eName: 'reason',
            title: '退款原因',
            type: 'select',
            key: 'colValue',
            columns: ['1222', '12', '3', '4', '4'],
            showPicker: false,
            value: '',
            rule: [{required: true, message: '请选择退款原因'}]
          },
          {
            required: true,
            cName: '退款数量',
            eName: 'count',
            title: '退款数量',
            type: 'number',
            key: 'colValue',
            rule: [{required: true, validator: validator, message: '请输入退货数量'}],
            value: '',
          },

          {
            required: false,
            cName: '退款说明',
            eName: 'regTele',
            type: 'textarea',
            value: '',
            rule: [{required: false, message: '请输入退款说明'}]
          },
        ],
      }
    },
    methods: {

      change() {

      },
      buttonClick() {
        this.$refs.form.submit(); // 触发onSubmit
      },

      onSubmit2() { // 提交
        let formData = this.$refs.form.getValues();
        let params = {...formData};
        params.idOrder = this.$route.query.idOrder;
        params.orderSn = this.$route.query.orderSn;
        params.items=[{
          count:formData.count,
          idGoods:this.$route.query.id
        }];
        console.log(params);
        // {
        //   "idOrder": 0,
        //   "items": [
        //   {
        //     "count": 0,
        //     "idGoods": 0
        //   }
        // ],
        //   "orderSn": "string",
        //   "reason": "string"
        // }
        // http.post(urls.refund, params).then(res => {
        //
        // }).catch(err => {
        //
        // })

      },
      pickConfirm(item, index) {

      },

      input(value) {  // 退款数量变化
        this.eMessage = "";
        this.allPrice = mul(value, this.goodsDetails.price); // 计算退款金额
      },

      getDetails(id) { // 查询商品
        const toast = Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: false,
          message: '数据加载中',
        });
        http.get(`${urls.goods}/${id}`, {}).then(res => {
          toast.clear();
          if (res.success) {
            this.goodsDetails = res.data.goods;
          }
        }).catch(err => {

        })

      },
    },
    created() {
      this.getDetails(this.$route.query.id);
      this.count = this.$route.query.count;
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    background-color: #F5F5F5;
    padding: 0 10px;
    section {
      background-color: #ffffff;
      border-radius: 5px;
      padding: 10px;
      margin-top: 12px;
      &:first-child {
        display: flex;

        > div {
          flex: 1;
          flex-shrink: 0;
          &:first-child {
            flex: 1;
          }
          &:last-child {
            overflow: hidden;
            flex: 2;
            padding-left: 5px;
            text-align: left;
            box-sizing: border-box;
            p {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin: 10px 0;
              @include sc(12px, #5F5F5F);
              .title {
                font-weight: 600;
                @include sc(14px, #5F5F5F)
              }
              &:nth-child(2) {
                @include sc(12px, #898989)
              }
              &:nth-child(3) {
                overflow: hidden;
                span {
                  &:first-child {
                    @include sc(15px, #FF6464)
                  }
                  &:nth-child(2) {
                    @include sc(13px, #959595);
                    margin-left: 5px;
                  }
                }
              }
            }
            .red {
              @include sc(12px, #FF6464)
            }
          }
        }
      }
    }
    > p {
      box-sizing: border-box;
      width: 100%;
      text-align: right;
      padding-right: 30px
    }
  }

</style>
