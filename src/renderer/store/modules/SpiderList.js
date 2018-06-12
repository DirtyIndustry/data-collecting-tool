var state = {
    spiders: new Array(),
    spiderToEdit: null,
    filelist: [],
    timetable: []
}

const mutations = {
    clearFileList() {
        state.filelist.splice(0, state.filelist.length)
    },
    clearSpiderList() {
        state.spiders.splice(0, state.spiders.length)
    },
    clearTimeTable(state) {
        state.timetable.splice(0, state.timetable.length)
    },
    spiderListAdd(state, spider) {
        state.spiders.push(spider)
        function SortByName(x, y) {
            return ((x.name === y.name) ? 0 : ((x.name > y.name) ? 1 : -1))
        }
        state.spiders.sort(SortByName)
    },
    fileListAdd(state, spider) {
        state.filelist.push(spider.name.toLowerCase())
    },
    timeTableAdd(state, spider) {
        let checkpoint = state.timetable.find(function (item) {
            return item.starttime === spider.starttime
        })
        if (checkpoint === undefined) {
            state.timetable.push({ starttime: spider.starttime, list: [spider] })
        } else {
            checkpoint.list.push(spider)
        }
    },
    spiderListRemove(state, spider) {
        state.spiders = state.spiders.filter(item => {
            return item.name !== spider.name
        })
    },
    fileListRemove(state, spider) {
        state.filelist.splice(state.filelist.indexOf(spider.name), 1)
    },
    timeTableRemove(state, spider) {
        for (let i = 0; i < state.timetable.length; i++) {
            let index = state.timetable[i].list.indexOf(spider)
            if (index > -1) {
                if (state.timetable[i].list.length === 1) {
                    state.timetable.splice(i, 1)
                    return
                } else {
                    state.timetable[i].list.splice(index, 1)
                    return
                }
            }
        }
    },
    switchActive(state, msg) {
        let s = state.spiders.find(spider => {
            return spider.name === msg.name
        })
        s.active = !s.active
    },
    setSpiderToEdit(state, msg) {
        state.spiderToEdit = msg
    },
}

const actions = {
    clearLists(context) {
        context.commit('clearFileList')
        context.commit('clearSpiderList')
        context.commit('clearTimeTable')
    },
    addSpider(context, spider) {
        context.commit('spiderListAdd', spider)
        context.commit('fileListAdd', spider)
        context.commit('timeTableAdd', spider)
    },
    removeSpider(context, spider) {
        context.commit('spiderListRemove', spider)
        context.commit('fileListRemove', spider)
        context.commit('timeTableRemove', spider)
    }
}

export default {
    state,
    mutations,
    actions,
}