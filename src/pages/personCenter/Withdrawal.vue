<template>
  <div class="Withdrawal">
    <page-nav :title="'提现至银行卡'"></page-nav>
    <main>
      <van-cell class="cell" :icon="require('../../assets/yinhangka.png')" :title="value" is-link
                @click="showPicker = true"
                value="请选择"/>
      <van-popup round position="bottom" v-model="showPicker">
        <van-picker
          show-toolbar
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>
      <section>
        <p>提现金额</p>
        <div>
          <span>￥</span>
          <van-field v-model="number" type="number">
            <template #button>
            <span class="button">
              全部
            </span>
            </template>
          </van-field>
        </div>
        <van-button @click="toWithdrawal()" color="#2A91F0" round block type="info" native-type="submit">
          提现
        </van-button>
      </section>
    </main>

  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Popup, Cell, Picker, Field, Button} from 'vant';

  export default {
    name: "Withdrawal",
    components: {
      [Popup.name]: Popup,
      [Cell.name]: Cell,
      [Picker.name]: Picker,
      [Field.name]: Field,
      [Button.name]: Button,
      pageNav
    },
    data() {
      return {
        number: '￥',
        showPicker: false,
        value: '提现到建设银行',
        columns: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
      }
    },
    methods: {
      onConfirm(value) {
        this.value = value;
        this.showPicker = false;
      },
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    padding: 10px 10px 0;
    .cell {
      height: 50px !important;
      background-color: #F9F9F9 !important;
    }
    section {

      background-color: white;
      padding: 30px;
      p {
        text-align: left;
      }
      > div {
        > span {
          font-size: 40px;
          position: relative;
          top: -18px;
        }
        /deep/ .van-field {
          width: 80%;
          display: inline-block;
          border-bottom: 1px solid #D8D8D8;
        }
        /deep/ .van-field__control {
          font-size: 40px;
        }
        .button {
          color: #2086EA;
        }
      }
      /deep/ .van-button {
        margin-top: 30px;
      }

    }
  }

</style>
