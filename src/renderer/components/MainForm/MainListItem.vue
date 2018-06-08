<template>
  <li>
    <table border="1">
      <tr>
        <td rowspan="3">
          <input type="checkbox" :checked="spider.active" @click="switchActive">
        </td>
        <td>{{spider.name}}</td>
        <td rowspan="3">
          <button>Run</button>
          <button @click="editSpider">Mod</button>
          <button @click="$emit('remove', spider.name)">Del</button>
        </td>
      </tr>
      <tr>
        <td>{{spider.url}}</td>
      </tr>
      <tr>
        <td>{{spider.repeat}}</td>
      </tr>
    </table>
  </li>
</template>

<script>
export default {
  props: {
    spider: {
      type: Object,
      required: true
    }
  },
  methods: {
    switchActive() {
      this.$store.commit("switchActive", this.spider);
      let fs = require("fs");
      let path = require("path");
      let xml2js = require("xml2js");
      let filename = path.join(
        __static,
        "Entry Files",
        this.spider.name + ".xml"
      );
      let xmlValues = new xml2js.Builder({ rootname: "spider" });
      let xmlString = xmlValues.buildObject(this.spider);
      fs.writeFile(filename, xmlString, err => {
        if (err) {
          return console.log(err);
        }
      });
    },
    editSpider() {
      this.$store.commit("setSpiderToEdit", this.spider);
      this.$router.push({ path: "/edit" });
    }
  }
};
</script>

<style>
</style>