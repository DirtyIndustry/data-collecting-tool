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
import fs from "fs";
import path from "path";

export default {
  name: "data-collecting-tool",
  data() {
    return {
      directorySelected: "",
      isLoading: false
    };
  },
  components: {
    Header,
    Footer
  },
  methods: {
    showFileDialog() {
      const dialog = require("electron").remote.dialog;
      dialog.showOpenDialog({ properties: ["openDirectory"] }, filename => {
        if (filename.length === 1) {
          this.directorySelected = filename[0];
          this.listingFile(this.directorySelected);
        }
      });
    },
    listingFile(filepath) {
      this.isLoading = true;
      //const fs = require('fs')
      //const path = require('path')
      fs.readdir(filepath, (err, file) => {
        if (err) {
          this.isLoading = false;
          return alert(err);
        }

        for (let filename of file) {
          const stat = fs.statSync(path.join(filepath, filename));
          if (stat.isFile()) {
            if (path.extname(filename).toLowerCase() === ".xml") {
              this.readXml(filename);
            }
          }
        }
        this.isLoading = false;
      });
    },
    readStatics() {
      this.directorySelected = path.join(__static, "Entry Files");
      this.listingFile(this.directorySelected);
    },
    readXml(file) {
      let xml = fs.readFileSync(path.join(this.directorySelected, file));
      let xml2js = require("xml2js");
      let spider;
      xml2js.parseString(
        xml,
        { explicitArray: false, explicitRoot: false, valueProcessors: [xml2js.processors.parseBooleans] },
        (err, obj) => {
          if (err) {
            return console.log(err);
          }
          spider = obj
        }
      );
      this.$store.commit('addSpider', spider)
    }
  },
  mounted() {
    /*let spider = {
      name: "New Spider into Vue",
      url: "www.taobao.com",
      repeat: "Yearly",
      active: true
    };
    this.$store.commit("addSpider", spider);*/
    this.$store.commit("clearSpiderList");
    this.readStatics();
  }
};
</script>

<style>
/* CSS */
</style>
