<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import xmlReader from "./utils/xmlReader";

export default {
  name: "data-collecting-tool",
  mixins: [xmlReader],
  data() {
    return {};
  },
  computed: {
    spiderlist() {
      return this.$store.state.SpiderList.spiders;
    }
  },
  components: {
    Header,
    Footer
  },
  methods: {},
  created() {
    this.$store.dispatch("clearLists");
    this.readStaticFolder("Entry Files");
  },
};
</script>

<style>
/* CSS */
</style>
