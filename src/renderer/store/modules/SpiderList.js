var state = {
    spiders: new Array(),
    spiderToEdit: null,
    filelist: [],
    timetable: []
}

const mutations = {
    clearFileList () {
        state.filelist.splice(0, state.filelist.length)
    },
    clearSpiderList () {
        state.spiders.splice(0, state.spiders.length)
    },
    clearTimeTable (state) {
        state.timetable.splice(0, state.timetable.length)
    },
    spiderListAdd (state, spider) {
        state.spiders.push(spider)
        function SortByName (x, y) {
            return ((x.name === y.name) ? 0 : ((x.name > y.name) ? 1 : -1))
        }
        state.spiders.sort(SortByName)
    },
    fileListAdd (state, spider) {
        state.filelist.push(spider.name.toLowerCase())
    },
    timeTableAdd (state, spider) {
        function getStartTime (spider) {
            let result = new Date()
            let target = new Date(spider.starttime)
            result.setMilliseconds(0)
            result.setSeconds(0)

            switch (spider.repeat) {
                case 'Yearly':
                    result.setMonth(target.getMonth())
                    result.setDate(target.getDate())
                    result.setHours(target.getHours())
                    result.setMinutes(target.getMinutes())
                    if (result <= new Date()) {
                        result.setFullYear(result.getFullYear() + 1)
                    }
                    break
                case 'Monthly':
                    result.setDate(target.getDate())
                    result.setHours(target.getHours())
                    result.setMinutes(target.getMinutes())
                    if (result <= new Date()) {
                        result.setMonth(result.getMonth() + 1)
                    }
                    break
                case 'Weekly':
                    result.setHours(target.getHours())
                    result.setMinutes(target.getMinutes())
                    let diff = target.getDay() - result.getDay()
                    if (diff < 0) {
                        result.setDate(result.getDate() + diff + 7)
                    } else if (diff > 0) {
                        result.setDate(result.getDate() + diff)
                    } else if (result <= new Date()) {
                        result.setDate(result.getDate() + 7)
                    }
                    break
                case 'Daily':
                    result.setHours(target.getHours())
                    result.setMinutes(target.getMinutes())
                    if (result <= new Date()) {
                        result.setDate(result.getDate() + 1)
                    }
                    break
                case 'Hourly':
                    result.setMinutes(target.getMinutes())
                    if (result <= new Date()) {
                        result.setHours(result.getHours() + 1)
                    }
                    break
                case 'Never':
                default:
                    result.setFullYear(target.getFullYear())
                    result.setMonth(target.getMonth())
                    result.setDate(target.getDate())
                    result.setHours(target.getHours())
                    result.setMinutes(target.getMinutes())
                    break
            }
            return result
        }
        function SortByTime (x, y) {
            return ((x.starttime === y.starttime) ? 0 : ((x.starttime > y.starttime) ? 1 : -1))
        }
        let time = getStartTime(spider)
        let checkpoint = state.timetable.find((item) => {
            return item.starttime.getTime() === time.getTime()
        })
        if (checkpoint === undefined) {
            state.timetable.push({ starttime: time, list: [spider] })
            state.timetable.sort(SortByTime)
        } else {
            checkpoint.list.push(spider)
        }
    },
    spiderListRemove (state, spider) {
        state.spiders = state.spiders.filter(item => {
            return item.name !== spider.name
        })
    },
    fileListRemove (state, spider) {
        state.filelist.splice(state.filelist.indexOf(spider.name), 1)
    },
    timeTableRemove (state, spider) {
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
    timeTableShift(state){
        state.timetable.shift()
    },
    switchActive (state, msg) {
        let s = state.spiders.find(spider => {
            return spider.name === msg.name
        })
        s.active = !s.active
    },
    setSpiderToEdit (state, msg) {
        state.spiderToEdit = msg
    },
}

const actions = {
    clearLists (context) {
        context.commit('clearFileList')
        context.commit('clearSpiderList')
        context.commit('clearTimeTable')
    },
    addSpider (context, spider) {
        context.commit('spiderListAdd', spider)
        context.commit('fileListAdd', spider)
        context.commit('timeTableAdd', spider)
    },
    removeSpider (context, spider) {
        context.commit('spiderListRemove', spider)
        context.commit('fileListRemove', spider)
        context.commit('timeTableRemove', spider)
    },
    updateTimeTable(context, list){
        context.commit('timeTableShift')
        for(let item of list){
            context.commit('timeTableAdd', item)
        }
    }
}

export default {
    state,
    mutations,
    actions,
}