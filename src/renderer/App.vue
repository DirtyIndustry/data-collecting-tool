<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import xmlReader from './utils/xmlReader'

export default {
  name: 'data-collecting-tool',
  mixins: [xmlReader],
  data () {
    return {
      directorySelected: '',
      isLoading: false
    }
  },
  components: {
    Header,
    Footer
  },
  methods: {

  },
  created () {
    /*let spider = {
      name: "New Spider into Vue",
      url: "www.taobao.com",
      repeat: "Yearly",
      active: true
    };
    this.$store.commit("addSpider", spider);*/
    this.$store.commit('clearSpiderList')
    this.readStaticFolder('Entry Files')
  }
}
</script>

<style>
/* CSS */
</style>
