import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'

export function deleteXml (filename) {
    fs.unlink(path.join(__static, 'Entry Files', filename + '.xml'), err => {
        if (err) {
            return console.log(err)
        }
    })
}

export function writeXml (spider) {
    let filepath = path.join(__static, 'Entry Files', spider.name + '.xml')
    let xmlValues = new xml2js.Builder({ rootname: 'spider' })
    let xmlString = xmlValues.buildObject(spider)



    fs.writeFile(filepath, xmlString, err => {
        if (err) {
            return console.log(err)
        }
    })
}


