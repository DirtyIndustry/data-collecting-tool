import fs from 'fs'
import path from 'path'

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
            let result = this.Xml2Obj(xml)
            this.$store.dispatch('addSpider', result)
        },
        Xml2Obj (xml) {
            let result = {}
            let xmlDoc = xml.toString()
            if (xmlDoc.startsWith('<?')) {
                xmlDoc = xmlDoc.split('?>')
                xmlDoc = xmlDoc[xmlDoc.length - 1]
                xmlDoc = this.trimString(xmlDoc)
            }
            let endindex = xmlDoc.indexOf('>')
            let rootname = xmlDoc.substring(1, endindex)
            let startindex = ('<' + rootname + '>').length
            endindex = xmlDoc.indexOf('</' + rootname + '>')
            let root = xmlDoc.substring(startindex, endindex)
            root = this.trimString(root)
            let childnodes = this.GetChildNodes(root)
            for(let childnode of childnodes){
                if (childnode.childnodes.length > 0){ // is Array
                    result[childnode.nodename] = []
                    for(let grandchild of childnode.childnodes){
                        let obj = {}
                        for(let propnode of grandchild.childnodes){
                            obj[propnode.nodename]=this.parseValue(propnode.nodebody)
                        }
                        result[childnode.nodename].push(obj)
                    }
                }else if (childnode.nodeprops.length > 0){ // is Object
                    result[childnode.nodename] = this.Prop2Obj(childnode)
                } else { // is Property
                    result[childnode.nodename] = this.parseValue(childnode.nodebody)
                }
            }
            return result
        },
        GetChildNodes(node) {
            let childnodelist = []
            let restNodeDoc = node
            for (; restNodeDoc !== '';) {
                let nodename = ''
                let nodebody = ''
                let props = []
                let childnodes = []

                let endindex = restNodeDoc.indexOf('>')
                let nodehead = restNodeDoc.substring(1, endindex)
                if(nodehead.includes(' ')){ // has props
                    nodehead.trim()
                    let nodeheadarray = nodehead.split(' ')
                    nodename = nodeheadarray[0]
                    for(let i = 1; i < nodeheadarray.length; i++){
                        let proparray = nodeheadarray[i].split('=')
                        let prop = { propname: proparray[0], propvalue: proparray[1].substring(1, proparray[1].length-1)}
                        props.push(prop)
                    }
                } else { // dosen't have prop
                    nodename = nodehead
                }
                let startindex = endindex + 1
                endindex = restNodeDoc.indexOf('</' + nodename + '>')
                if (endindex === -1){ // not a valid node
                    break
                }
                nodebody = restNodeDoc.substring(startindex, endindex)
                nodebody = this.trimString(nodebody)
                childnodes = this.GetChildNodes(nodebody)
                restNodeDoc = restNodeDoc.substring(endindex + nodename.length + 3)
                restNodeDoc = this.trimString(restNodeDoc)
                let nodeobj = { nodename: nodename, nodebody: nodebody, nodeprops: props, childnodes: childnodes }
                childnodelist.push(nodeobj)
            }
            return childnodelist
        },
        Prop2Obj(node){
            let result = {}
            for(let prop of node.nodeprops){
                result[prop.propname] = this.parseValue(prop.propvalue)
            }
            return result
        },
        trimString (arg) {
            for (; arg.startsWith('\n');) {
                arg = arg.substring(1)
            }
            for (; arg.endsWith('\n');) {
                arg = arg.substring(0, arg.length - 1)
            }
            return arg.trim()
        },
        parseValue(value){
            let result = value
            if (result.toLowerCase() === 'true'){
                result = true
            }else if(result.toLowerCase() === 'false'){
                result = false
            }else if(!isNaN(result)){
                result = parseInt(result)
            }
            return result
        },
    },
}
