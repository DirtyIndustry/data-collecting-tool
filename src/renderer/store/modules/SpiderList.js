const state = {
    spiders: [
        { name: 'My journey with Vue', url: "www.google.com", repeat: "Monthly", active: true },
        { name: 'Blogging with Vue', url: "www.baidu.com", repeat: "Weekly", active: true },
        { name: 'Why Vue is so fun', url: "www.bing.com", repeat: "Daily", active: true },
    ],
    filelist:[]
}

const mutations = {
    addSpider(state, msg) {
        state.spiders.push(msg)
    },
    removeSpider(state, msg) {
        state.spiders = state.spiders.filter(spider => {
            return spider.name !== msg
        })
    },
    switchActive(state,msg){
        let s = state.spiders.find(spider => {
            return spider.name === msg.name
        })
        s.active = !s.active
    }
}

export default {
    state,
    mutations
}