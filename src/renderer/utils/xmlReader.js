import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'

export default {
    name: 'xmlReader',
    methods: {
        showDirectoryDialog () {
            const dialog = require('electron').remote.dialog
            dialog.showOpenDialog({ properties: ['openDirectory'] }, filename => {
                if (filename.length === 1) {
                    return filename[0]
                } else {
                    return null
                }
            })
        },
        readStaticFolder (arg) {
            let folderpath
            if (arg === null | arg === '') {
                folderpath = __static
            } else {
                folderpath = path.join(__static, arg)
            }
            try {
                fs.mkdirSync(folderpath)
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err
                }
            }
            fs.readdir(folderpath, (err, file) => {
                if (err) {
                    return alert(err)
                }
                for (let filename of file) {
                    const stat = fs.statSync(path.join(folderpath, filename))
                    if (stat.isFile()) {
                        if (path.extname(filename).toLowerCase() === '.xml') {
                            this.readXml(path.join(folderpath, filename))
                        }
                    }
                }
            })
        },
        readXml (filepath) {
            let xml = fs.readFileSync(filepath)
            xml2js.parseString(
                xml,
                {
                    explicitArray: false,
                    explicitRoot: false,
                    valueProcessors: [this.convertProcessor]
                },
                (err, obj) => {
                    if (err) {
                        return console.log(err)
                    }
                    this.$store.commit('addSpider', obj)
                }
            )
        },
        convertProcessor (value, name) {
            if (name === 'active') {
                if (value === 'true') return true
                else return false
            } else {
                return value
            }
        }
    },
}
