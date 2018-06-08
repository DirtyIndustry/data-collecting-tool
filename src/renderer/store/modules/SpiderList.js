const state = {
    spiders: [
        { name: 'My journey with Vue', url: "www.google.com", repeat: "Monthly", active: true },
        { name: 'Blogging with Vue', url: "www.baidu.com", repeat: "Weekly", active: true },
        { name: 'Why Vue is so fun', url: "www.bing.com", repeat: "Daily", active: true },
    ],
    spiderToEdit:null,
    filelist:[]
}

const mutations = {
    clearSpiderList(){
        state.spiders = []
    },
    addSpider(state, msg) {
        state.spiders.push(msg)
        state.filelist.push(msg.name)
        function SortByName(x,y){
            return ((x.name === y.name) ? 0 : ((x.name > y.name) ? 1 : -1 ))
        }
        state.spiders.sort(SortByName)
    },
    removeSpider(state, msg) {
        state.filelist.splice(state.filelist.indexOf(msg),1)
        state.spiders = state.spiders.filter(spider => {
            return spider.name !== msg
        })
    },
    switchActive(state,msg){
        let s = state.spiders.find(spider => {
            return spider.name === msg.name
        })
        s.active = !s.active
    },
    updateActive(state,msg){
        state.active = msg
    },
    setSpiderToEdit(state,msg){
        state.spiderToEdit = msg
    },
}

export default {
    state,
    mutations
}