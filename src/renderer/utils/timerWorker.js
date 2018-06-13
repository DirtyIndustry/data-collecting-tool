var timeTable = [{starttime: new Date(), list:[{}]}]

function checkTimeTable(){
    let now = new Date()
    now.setMilliseconds(0)
    now.setSeconds(0)

    if(timeTable[0].starttime <= now){
        console.log(timeTable[0])
        postMessage(timeTable[0])
    }
}

/*
onmessage = function(e) {
    console.log('recived timetable')
    this.timeTable = e.data
}
*/

self.addEventListener('message',function(e){
    console.log('recived timetable')
    this.timeTable = e.data
},false)

setInterval(checkTimeTable, 10000)