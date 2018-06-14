<template>
  <div>
    <div>
      <el-button icon="el-icon-plus" @click="addNewSpider">Add</el-button>
      <el-button icon="el-icon-refresh" @click="refreshMainForm">Refresh</el-button>
    </div>
    <div>
      <ul v-if="spiders.length">
        <MainListItem v-for="item in spiders" :key="item.name" :spider="item" @remove="removeSpider">
        </MainListItem>
      </ul>
      <p v-else>
        Nothing left in the list.
      </p>
    </div>
  </div>
</template>

<script>
import MainListItem from './MainForm/MainListItem.vue'
import xmlReader from '../utils/xmlReader'

export default {
  name: 'MainForm',
  mixins: [xmlReader],
  components: {
    MainListItem
  },
  data () {
    return {}
  },
  computed: {
    spiders () {
      return this.$store.state.SpiderList.spiders
    }
  },
  methods: {
    removeSpider (spiderToRemove) {
      this.$store.dispatch('removeSpider', spiderToRemove)
      let xmlwriter = require('../utils/xmlWriter')
      xmlwriter.deleteXml(spiderToRemove.name)
    },
    addNewSpider: function () {
      this.$router.push({ path: '/edit' })
    },
    refreshMainForm () {
      this.$store.dispatch('clearLists')
      this.readStaticFolder('Entry Files')
    }
  }
}
</script>

<style>
</style>