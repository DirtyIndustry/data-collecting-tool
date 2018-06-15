import fs from 'fs'
import path from 'path'

export function deleteXml (filename) {
    fs.unlink(path.join(__static, 'Entry Files', filename + '.xml'), err => {
        if (err) {
            return console.log(err)
        }
    })
}

export function writeXml (spider) {
    let filepath = path.join(__static, 'Entry Files', spider.name + '.xml')

    let xmlString = Obj2Xml(spider)

    fs.writeFile(filepath, xmlString, err => {
        if (err) {
            return console.log(err)
        }
    })
}

function Obj2Xml(obj){
    let result = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    result += Obj2Node(obj, 'root')
    return result
}

function Obj2Node(obj, rootstring){
    let result = '<'+rootstring+'>\n'
    for(let prop of Object.keys(obj)){
        if (obj[prop] instanceof Array){
            result += '<'+prop+'>\n'
            for(let item of obj[prop]) {
                result += Obj2Node(item, 'item')
            }
            result += '</'+prop+'>\n'
        } else if (obj[prop] instanceof Object){
            result += '<'+prop+' '
            for(let innerprop of Object.keys(obj[prop])){
                result += innerprop + '=\'' +obj[prop][innerprop] +'\' '
            }
            result += '>\n'
            result += '</'+prop+'>\n'
        } else {
            result += '<'+prop+'>'
            result += obj[prop]
            result += '</'+prop+'>\n'
        }
    }
    result += '</'+rootstring+'>'
    return result
}
