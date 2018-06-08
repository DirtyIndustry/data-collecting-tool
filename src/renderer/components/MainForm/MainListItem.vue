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
      this.$store.commit('switchActive', this.spider)
      let xmlwriter = require('../../utils/xmlWriter')
      xmlwriter.writeXml(this.spider)
    },
    editSpider() {
      this.$store.commit('setSpiderToEdit', this.spider)
      this.$router.push({ path: '/edit' })
    }
  }
}
</script>

<style>
</style>