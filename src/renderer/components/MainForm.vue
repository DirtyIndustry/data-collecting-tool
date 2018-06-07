<template>
  <div>
    <div>
      <input type="button" value="Add" @click="addNewSpider">
      <input type="button" value="Refresh" @click="refreshMainForm">
    </div>
    <div>
      <ul v-if="spiders.length">
        <MainListItem v-for="spider in spiders" :key="spider.name" :spider="spider" @remove="removeSpider">
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

  export default {
    components: {
      MainListItem
    },
    data() {
      return {
        
      };
    },
    computed: {
      spiders(){
        return this.$store.state.SpiderList.spiders
      }
    },
    methods: {
      removeSpider(nameToRemove) {
        this.$store.commit('removeSpider', nameToRemove)
      },
      addNewSpider: function () {
        this.$router.push({ path: '/edit' })
      },
      refreshMainForm() {

      }
    },
  };
</script>

<style>
</style>