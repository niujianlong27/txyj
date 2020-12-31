<template>
  <div class="myMessage">
    <page-nav :title="'消息通知'"></page-nav>
    <main>
      <template v-if="isLoding">
        <van-loading color="#1989fa" size="24px">数据加载中...</van-loading>
      </template>
      <template v-else>
        <template v-if="listData.length == 0">
          <van-empty description="暂无数据"/>
        </template>
        <template v-else>

          <section @click="toPath(item.content)" :key="item.id" v-for="item in listData">
            <p>
              {{item.createTime | setDate}}
            </p>
            <div class="details">
              <div style="overflow: hidden">
                <h3 class="left">{{item.title}}</h3>
                <span class="red right">{{item.isDefault ? '已读' : '未读'}}</span>
              </div>
              <p class="content">
                虾蟹等产品因为原因位，所以此产品针对性价格
                下调，原价为100，1111111111111现价90
                {{item.content}}
              </p>
            </div>
          </section>
          <!--</van-list>-->
        </template>
      </template>

    </main>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import urls from '../../utils/urls';
  import http from '../../utils/http';
  import {
    Checkbox,
    Cell,
    Empty,
    Stepper,
    CellGroup,
    Button,
    List,
    Loading,
    CheckboxGroup,
    SubmitBar,
    Toast
  } from 'vant';

  export default {
    name: "myMessage",
    components: {
      pageNav,
      [Checkbox.name]: Checkbox,
      [Loading.name]: Loading,
      [CheckboxGroup.name]: CheckboxGroup,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Stepper.name]: Stepper,
      [SubmitBar.name]: SubmitBar,
      [Button.name]: Button,
      [Empty.name]: Empty,
      [List.name]: List,
      [Toast.name]: Toast,
    },
    data() {
      return {
        isLoding: false,//整个页面加载
        loading: false,//数据滚动加载
        finished: false,//全部加载完成
        listData: [], //收藏数据列表

      }
    },
    methods: {
      onLoad() {

      },
      toPath(data) {
        this.$router.push({
          path: `/msgDeatils/${data}`,
        })
      },

      getMessage() {
        http.get(urls.queryByUser).then(res => {
          this.isLoding = false;
          if (res.success) {
            this.loading = false;
            this.listData = res.data || []
          }
        }).catch(err => {

        })
      }

    },
    mounted() {
      this.isLoding = true;
      this.getMessage()
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';

  main {
    padding: 10px;
    section {
      margin-bottom: 30px;
    }
    .details {
      text-align: left;
      background-color: white;
      border-radius: 5px;
      padding: 20px;
      > div {
        line-height: 25px;
      }
      > p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    h3 {
      color: #5F5F5F;
      margin: 0;
      font-weight: 600;
    }
  }

  .red {
    color: #E54343;
  }


</style>
