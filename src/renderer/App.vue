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
//import timerWorker from './utils/timerWorker'
import { setInterval } from 'timers';

export default {
  name: 'data-collecting-tool',
  mixins: [xmlReader],
  data () {
    return {
      worker: undefined,
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
      let now = new Date()
      now.setMilliseconds(0)
      now.setSeconds(0)
      if(this.timeTable[0].starttime <= now){
          let list = this.timeTable[0].list
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
    /*
    this.worker = new Worker('./utils/timerWorker.js')
    this.worker.addEventListener('message', (event)=>{
      let list = event.data
      for(let i = 0; i < list.length; i++){
        this.$electron.ipcRenderer.send('runSpider', list[i])
      }
    })
    setInterval(()=>{
      console.log('post timetable')
      this.worker.postMessage(this.$store.state.SpiderList.timetable)
    }, 5000)
    */
    setInterval(this.checkTimeTable, 10000)
  },
}
</script>

<style>
/* CSS */
</style>
