<template>
  <div class="receiptAddress">
    <page-nav :title="title"></page-nav>
    <main>
      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <template v-if="addressData.length > 0">

          <section @click.stop="chooseAddress(item)" v-for="item in addressData" :key="item.id">
            <p>{{item.name}} {{item.tel}}
            </p>
            <p>{{item.wholeAddressInfo}}</p>
            <div>
              <p v-if="item.isDefault">
                <van-icon name="passed"/>
                已设为默认
              </p>
              <p>
                <span @click.stop="Overlay(item)">修改</span>
                <span @click.stop="deleteArea(item)">删除</span>
              </p>
            </div>
          </section>
        </template>
        <template v-else>
          <van-empty description="暂无数据"/>
        </template>
      </template>
      <van-button color="#2A91F0" type="primary" @click.stop="addAddress" block>新增地址</van-button>
    </main>

    <van-overlay :show="show" @click.stop="show = false">
      <div @click.stop class="block">
        <p>{{modelTitle}}</p>
        <van-form @submit="register" ref="address">
          <van-field
            v-model="signInData.name"
            name="name"
            required
            label="姓名"
            :colon="colon"
            placeholder="请输入收货人姓名"
            :error="false"
            :rules="[{ required: true, message: '请输入收货人姓名' }]"
          />
          <van-field
            v-model="signInData.tel"
            type="text"
            name="tel"
            label="手机"
            :colon="colon"
            required
            :error="false"
            placeholder="请输入手机号码"
            :rules="[{required: true, message: '请输入手机号'}, {pattern: /^[0-9]{11}$/, message: '请输入正确的手机号'}]"
          />


          <van-field
            readonly
            :colon="colon"
            clickable
            name="address"
            :value="signInData.address"
            label="地区"
            required
            :error="false"
            placeholder="请选择 （省-市-区）"
            @click="showArea = true"
            :rules="[{ required: true, message: '请选择省市区' }]"
          />


          <van-popup v-model="showArea" position="bottom">
            <van-area @cancel="showArea = false" @confirm="onConfirm" title="标题" :area-list="areaList"
                      :columns-num="3"/>
          </van-popup>
          <van-field
            v-model="signInData.addressDetail"
            type="text"
            name="addressDetail"
            label="地址"
            :colon="colon"
            required
            :error="false"
            placeholder="请输入收货人详细地址"
            :rules="[{ required: true, message: '请输入收货人详细地址' }]"
          />

          <van-field :colon="colon" name="isDefault" label="设为默认">
            <template #input>
              <van-switch v-model="signInData.isDefault" size="20"/>
            </template>
          </van-field>

          <div style="margin: 16px 0">
            <van-button color="#2A91F0" block type="info" native-type="submit">
              {{buttonText}}
            </van-button>
          </div>
        </van-form>
      </div>
    </van-overlay>
  </div>
</template>

<script>
  import pageNav from '../components/pageNav'
  import {
    Icon,
    Area,
    List,
    Button,
    Overlay,
    Loading,
    Popup,
    Empty,
    Form,
    Toast,
    Field,
    AddressEdit,
    Switch,
    Picker
  } from 'vant';
  import http from '../utils/http';
  import urls from '../utils/urls';
  import {setSessionStorage, deepCopy} from "../config/Utils";
  import areaList from '../../static/Area'

  export default {
    name: "receiptAddress",
    components: {
      pageNav,
      [List.name]: List,
      [Icon.name]: Icon,
      [Loading.name]: Loading,
      [Button.name]: Button,
      [Overlay.name]: Overlay,
      [Form.name]: Form,
      [Empty.name]: Empty,
      [Field.name]: Field,
      [AddressEdit.name]: AddressEdit,
      [Popup.name]: Popup,
      [Area.name]: Area,
      [Switch.name]: Switch,
      [Picker.name]: Picker,
      [Toast.name]: Toast,

    },
    data() {
      return {
        areaList: areaList,
        formData: {},// 表单数据
        addressData: [], // 收货地址
        title: '收货地址',
        buttonText: "确认添加",
        show: false, // 弹框显示
        colon: true, // 是否显示冒号

        signInData: { // 表单数据
          name: '',  // 收货人
          tel: '', // 手机号码
          addressDetail: '', //详细地址
          address: '',
          isDefault: false, // 是否默认
        },
        updateId: '',// 修改的id
        province: "", // 省
        city: "", // 市
        district: "", // 区
        value: '',
        state: "", // 新增修改状态
        showArea: false, // 控制是否显示地址选择框
        modelTitle: '', // 弹框标题
        isLoding: false,//整个页面加载

        page: 1
      }
    },
    methods: {
      getAddress() { // 查询地址
        http.get(urls.queryAddress, {}).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.addressData = res.data || [];
          }

        }).catch(err => {

        })
      },

      onConfirm(values) { // 选择地址确认
        this.province = "";
        this.city = "";
        this.district = "";
        this.signInData.address = values
          .filter((item) => !!item)
          .map((item) => item.name)
          .join('/');

        if (values[0]) { // 给省市区乡赋值
          this.province = values[0].name;
        }
        if (values[1]) {
          this.city = values[1].name;
        }
        if (values[2]) {
          this.district = values[2].name;
        }
        this.showArea = false;
      },


      addAddress() { // 新增收货地址
        this.show = true;
        this.state = "add";
        this.updateId = "";
        for (let key in this.signInData) {
          this.signInData[key] = ''
        }
        this.modelTitle = '新增收货地址';
        this.buttonText = "确认添加"
      },

      Overlay(data) { // 修改收货地址
        this.signInData = deepCopy(data);
        this.updateId = this.signInData.id;
        this.signInData.address = `${this.signInData.province}/${this.signInData.city}/${this.signInData.district}`;
        this.state = "update";
        this.show = true;
        this.modelTitle = '修改收货地址';
        this.buttonText = "确认修改"
      },

      register() { // 确认
        this.formData = this.$refs.address.getValues();
        this.addDetails();
      },

      addDetails() { // 保存地址
        let params = {...this.formData};
        params.province = this.province;
        params.city = this.city;
        params.district = this.district;

        if (this.state == 'update') {
          params.id = this.updateId
        }
        http.post(urls.saveAddress, params).then(res => {
          if (res.success) {
            let msg = this.state == 'update' ? "地址修改成功！" : '地址添加成功！'
            Toast.success(msg);
            this.getAddress();
            this.show = false;
          }
        }).catch(err => {

        })
      },

      deleteArea(data) { //删除
        http.delete(`${urls.deleteAddress}/${data.id}`, {}).then(res => {
          if (res.success) {
            this.getAddress();
            Toast.success('删除成功！');
          }
        })

      },

      chooseAddress(data) {
        if (this.$route.query.from) {
          setSessionStorage('address', data);
          this.$router.go(-1)
        }
      }
    },
    mounted() {
      this.isLoding = true;
      this.getAddress();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';

  .receiptAddress {
    background: #F5F5F5;
    main {
      background: #F5F5F5;
      padding-bottom: 10px;
      > /deep/ .van-button--block {
        @include wh(335px, 46px);
        margin: 20px auto;
        background: rgba(16, 15, 101, 1);
        border-radius: 5px;
        border: none;
      }
    }
  }

  /deep/ .van-cell__title {
    text-align: left;
    width: 70px;
  }

  .block {
    width: 325px;
    background-color: #fff;
    padding: 0 10px;
    border-radius: 5px;
    @include center;
    top: 40%;
    /deep/ .van-button--block {
      margin: 0 auto;
      @include wh(260px, 45px);
    }
  }

  section {
    margin-bottom: 10px;
    p {
      margin: 10px 0;
    }
    padding: 1px 20px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    font-weight: 500;
    @include sc(14px, rgba(83, 83, 83, 1));
    text-align: left;
    div {
      display: flex;
      font-size: 12px;
      p {
        flex: 1;
        color: #E44A4A;
        margin: 10px 0;
        &:last-child {
          text-align: right;
          span {
            margin-right: 10px;
            &:first-child {
              color: #878787;
            }
          }
        }
        .van-icon {
          top: 2px;
        }
      }
    }
  }

</style>
