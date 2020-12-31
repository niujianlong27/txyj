<template>
  <div class="msgDeatils">
    <page-nav :title="'消息详情'"></page-nav>
    <main>
      <div v-html="content"></div>
    </main>

  </div>

</template>

<script>
  import pageNav from '../../components/pageNav'

  export default {
    name: "msgDeatils",
    components: {
      pageNav
    },
    data() {
      return {
        content: ''
      }
    },
    created() {
      this.content = this.$route.params.content;
    }
  }
</script>

<style scoped lang="scss">
  .msgDeatils, main {
    text-align: left;
    background-color: #F5F5F5;;
  }

  main {
  padding: 10px 20px;
  }

</style>
