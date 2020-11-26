<template>
  <div class="onlineService">
    <page-nav :title="'在线客服'"></page-nav>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'

  export default {
        name: "onlineService",
        components:{
          pageNav
        },
        data() {
            return {}
        },
    }
</script>

<style scoped lang="scss">
  .onlineService{
    background-color: #F5F5F5;
  }

</style>
