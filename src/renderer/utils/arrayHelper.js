Array.prototype.remove = function (val) {
    let index = this.indexOf(val)
    if (index > -1) {
        this.splice(index, 1)
    }
}
Array.prototype.insertBehind = function(item, value){
    let index = this.indexOf(item)
    if(index > -1){
        this.splice(index,0,value)
    }
}