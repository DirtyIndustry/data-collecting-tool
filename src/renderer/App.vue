<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from './components/common/Header.vue'
  import Footer from './components/common/Footer.vue'
  export default {
    name: 'data-collecting-tool',
    components:{
      Header,
      Footer
    }
  }
</script>

<style>
  /* CSS */
</style>
