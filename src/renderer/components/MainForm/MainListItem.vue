<template>
    <el-card class="item-card" shadow="hover">
        <el-row type="flex" align="middle" justify="center">
      <el-col :span="2">
          <el-checkbox :checked="spider.active" @click="switchActive"></el-checkbox>
      </el-col>
      <el-col :span="18">
        <el-row>{{spider.name}}</el-row>
        <el-row>{{spider.url}}</el-row>
        <el-row>{{spider.repeat}}</el-row>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" align="middle" justify="center">
          <el-button type="success" @click="runSpider">Run</el-button>
        </el-row>
        <el-row type="flex" align="middle" justify="center">
          <el-button round size="mini" type="info" @click="editSpider">Mod</el-button>
          <el-button round size="mini" type="danger" @click="$emit('remove', spider)">Del</el-button>
        </el-row>
      </el-col>
      </el-row>
    </el-card>
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
      let xmlwriter = require("../../utils/xmlWriter");
      xmlwriter.writeXml(this.spider);
    },
    editSpider() {
      this.$store.commit("setSpiderToEdit", this.spider);
      this.$router.push({ path: "/edit" });
    },
    runSpider() {
      this.$electron.ipcRenderer.send("runSpider", this.spider);
    }
  }
};
</script>

<style>
.item-card {
  margin: 10px 0;
}
</style>