<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer class="footer"></Footer>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import xmlReader from './utils/xmlReader'
//import timerWorker from './utils/timerWorker'
import { setInterval } from 'timers';

export default {
  name: 'data-collecting-tool',
  mixins: [xmlReader],
  data () {
    return {
    }
  },
  computed: {
    timeTable(){
      return this.$store.state.SpiderList.timetable
    }
  },
  components: {
    Header,
    Footer
  },
  methods: {
    checkTimeTable(){
      if(this.timeTable[0] === undefined){
        return
      }
      let now = new Date()
      now.setMilliseconds(0)
      now.setSeconds(0)
      let index = 0
      for(;this.timeTable[index].starttime < now & index < this.timeTable.length-1;){
        index++
      }
      if(this.timeTable[index].starttime.getTime() === now.getTime()){
          let list = this.timeTable[index].list
          this.$store.dispatch('updateTimeTable', list)
          for(let item of list){
            this.$electron.ipcRenderer.send('runSpider', item)
          }
      }
    },
  },
  created () {
    this.$store.dispatch('clearLists')
    this.readStaticFolder('Entry Files')
  },
  mounted(){
    setInterval(this.checkTimeTable, 10000)
  },
}
</script>

<style>
/* CSS */
.footer{
  position:fixed;
  bottom:0;
}
</style>
