<template>
  <div class="goodsCart">


    <div class="Goods">
      <p class="p-header">
        <span class="left">购物车</span>
        <span @click="manage = !manage" class="right">{{manage ? "完成": "管理"}}</span>
      </p>
    </div>
    <template v-if="isLoading">
      <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>

    </template>
    <template v-else>
      <template v-if="list.length > 0">
        <section class="goodsCard">
          <van-checkbox-group @change="checked()" v-model="result" ref="checkboxGroup">
            <van-cell-group :border="false" v-for="(item, index) in list" :key="item.name">
              <div class="cardBox">
                <div class="card">
                  <p @click.stop="clickSim(item.goods.id)"><img :src="item.goods.pic | setImg" alt=""></p>
                  <p>
                    <span @click.stop="clickSim(item.goods.id)">{{item.title}} </span>
                    <span> <van-stepper @change="stpChange(item)" v-model="item.count"
                                        button-size="22"
                                        integer/></span>
                    <span>¥{{item.price | fixNum}}</span>
                  </p>
                </div>
                <div>
                  <van-cell class="cardCheck" :border="false"
                            @click="toggle(index)">
                    <template #title>
                      <van-checkbox :name="item" :ref="'checkboxes'"/>
                    </template>
                  </van-cell>
                </div>
              </div>
            </van-cell-group>

          </van-checkbox-group>
          <p class="p-pay total">
            <span class="left">总计：</span>
            <span class="right">¥{{totalPrice}}</span>
          </p>
          <p class="p-pay pay">
            <span class="left">需支付：</span>
            <span class="right">¥{{totalPrice}}</span>
          </p>
        </section>

      </template>
      <template v-else>
        <div class="noGoods">
          <div>
            <img style="width: 100%;height: 220px" src="../assets/cart.png" alt="">
            <p>你的购物车是空的</p>
          </div>
          <van-button plain hairline type="info" @click="toPath('/home')">去逛逛</van-button>
        </div>
      </template>
    </template>

    <!--购物车-->
    <template v-if="manage">
      <van-submit-bar class="manage" button-text="删除" @submit="Delete">
        <template #default>
          <van-checkbox @click="allChecked" v-model="isChecked">全选</van-checkbox>
          <template>
          </template>
        </template>
      </van-submit-bar>
    </template>
    <template v-else>
      <!--:decimal-length="3" :price="totalPrice"  :label="label"-->
      <van-submit-bar button-text="去支付" @submit="settlement">
        <van-checkbox @click="allChecked" v-model="isChecked">全选</van-checkbox>
      </van-submit-bar>
    </template>

    <foot></foot>
  </div>
</template>

<script>
  import foot from '../components/foot'
  import {
    Checkbox,
    Cell,
    Stepper,
    Toast,
    Loading,
    CellGroup,
    CheckboxGroup,
    SubmitBar,
    Button,
    GridItem,
    Grid
  } from 'vant';
  import http from '../utils/http';
  import urls from '../utils/urls';
  import {getlocalStorage, mul} from "../config/Utils";
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "ShopCart",
    components: {
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Stepper.name]: Stepper,
      [Button.name]: Button,
      [Toast.name]: Toast,
      [SubmitBar.name]: SubmitBar,
      [GridItem.name]: GridItem,
      [Grid.name]: Grid,
      [Loading.name]: Loading,
      foot
    },
    data() {
      return {
        list: [],//列表数据
        result: [],  // 选中商品
        groupChecked: false,//每组供应商之间的全选
        isChecked: false, // 底部结算导航设置全选
        manage: false, //  判断结算 和管理 底部栏显示
        totalPrice: 0, // 总金额
        label: ' ', //底部导航栏左侧提示信息设置
        isLoading: false, // 加载状态

      }
    },
    computed: {
      ...mapState(['active']),
    },
    methods: {

      ...mapMutations([
        'Set_ChooseCart'
      ]),
      getGoodsList() {  // 查询购物车
        let params = {};
        http.get(urls.queryCartByUser, params).then(res => {
          this.isLoading = false;
          if (res.success) {
            this.list = res.data || [];

          }
        }).catch(err => {
        })

      },
      toggle(index) {
        this.$refs.checkboxes[index].toggle();
      },

      checked: function () { //商品改变选中触发
        if (this.result.length === this.list.length) {
          this.isChecked = true // 全选控制
        } else {
          this.isChecked = false
        }
        this.getTotalPrice()
      },

      getTotalPrice() { // 价格、商品数量汇总
        let totalPrice = 0; // 总价格
        this.result.forEach(resultItem => { // 循环选中的数据 获取总价格
          totalPrice += mul(resultItem.count, resultItem.price)
        });
        this.totalPrice = totalPrice; //
      },

      allChecked() { // 底部导航栏 全选功能
        this.$refs.checkboxGroup.toggleAll(this.isChecked);
      },

      stpChange(item) { //步进器改变
        http.post(`${urls.updateCart}/${item.id}/${item.count}`, {}).then(res => {
          if (res.success) {
            this.getTotalPrice();

          }
        }).catch(err => {

        })

      },
      settlement() { // 提交订单
        if (this.result.length == 0) {
          Toast('请选择商品！');
          return
        }
        this.Set_ChooseCart(this.result);
        console.log(this.result);
        this.$router.push({path: '/orderConfirm'})

      },

      Delete() { //删除购物车
        if (this.result.length == 0) {
          Toast('请选择商品！');
          return
        }
        let ids = this.result.map(item => {
          return item.id
        });
        http.delete(urls.deleteCart, ids).then(res => {
          if (res.success) {
            this.manage = false;
            this.isLoading = true;
            this.getGoodsList();
            this.result = [];
          }
        }).catch(err => {

        })
      },

      clickSim(data) { //跳转商品详情
        this.$router.push({path: '/goodsDetails', query: {id: data}})
      },

      toPath(url) { // 路由跳转
        this.$router.push(url)
      }
    },
    mounted() {
      this.Set_ChooseCart([]);
    },
    created() {
      this.isLoading = true;
      let token = getlocalStorage("token");
      this.getGoodsList();
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  .goodsCart {
    box-sizing: border-box;
    background-color: #F4F4F4;
    .Goods {
      padding: 0 10px;
      .p-header {
        overflow: hidden;
        border-bottom: 1px solid #ECECEC;
        padding: 16px 0;
        margin: 0;
        span {
          &:first-child {
            @include sc(16px, #565656);
            font-weight: 600;
          }
          &:last-child {
            @include sc(12px, #7A7A7A);
          }
        }
      }
    }
    .goodsCard {
      padding: 0 10px 100px;
      background-color: #F4F4F4;
    }

    .van-cell-group {
      margin-top: 10px;
      padding: 16px 7px 8px 13px;
      .cardBox {
        box-sizing: border-box;
        display: flex;
        @include wh(100%, 100%);
        background-color: #ffffff;
        > div {
          flex-shrink: 0;
          &:first-child {
            width: calc(100% - 35px);
          }
          &:last-child {
            width: 35px;
            position: relative;

          }
        }
        .card {
          display: flex;
          padding-left: 5px;
          box-sizing: border-box;
          p {
            box-sizing: border-box;
            margin: 0;
            flex-shrink: 0;
            padding: 0 5px;
            &:first-child {
              padding: 0;
              width: 32%;
              img {
                @include wh(84px, 84px)
              }
            }
            &:nth-child(2) {
              width: 52%;
              span {
                margin-bottom: 16px;
                display: block;
                text-align: left;
                font-size: 14px;
                &:nth-child(1) {
                  @include sw(500, #24272C);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                &:nth-child(2) {
                  color: #A6A6A6;
                }
                &:last-child {
                  color: #FF6464;
                  margin-bottom: 5px;
                }
              }
            }
          }
        }
        .cardCheck {
          padding: 0;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -55%)
        }
      }
    }
    .p-pay {
      overflow: hidden;
      span {
        font-size: 16px;
      }
    }
    .pay {
      font-weight: 600;
      color: #000000;
    }
    .total {
      color: #A9A9A9;
    }

  }

  /deep/ .van-submit-bar {
    bottom: 50px;
    .van-checkbox {
      position: absolute;
      left: 10px;
    }
  }


</style>
