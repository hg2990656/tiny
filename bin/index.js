#!/usr/bin/env node
const Config = require("../lib/config")
const Tiny = require("../lib/tiny");
const Util = require("../lib/util");
const config = new Config()
const util = new Util()

/*
* @param argv [array]
* argv is the params after tiny, eg: tiny -v, then argv is ['-v']
*/
function run(argv) {
    if (argv.length === 0) {
        util.printHelpInfo()
        return
    }

    switch (argv[0]) {
        case '-v':
        case '--version':
            util.printVersion()
            break
        case '-h':
        case '--help':
            util.printHelpInfo()
            break
        case 'config':
            setConfig(argv.slice(1))
            break
        case '-c':
        case '--count':
            let key = config.getKey()
            let tiny = new Tiny({ key })
            tiny.validate()
            break
        case '-i':
        case '--info':
            util.printMethodInfo()
            break
        default:
            compress(argv)
            break
    }
}

/*
* @param argv [array]
* argv is the params after tiny when compress
* eg: tiny -u http://www.tiny.com/tiny.png, 
* then argv is ['-u', 'http://www.tiny.com/tiny.png']
*/
function compress(argv) {
    if (!config.getKey()) {
        util.print(`Please set key before compression`)
    } else {
        let options = config.getAllConfig()
        let tiny = new Tiny(options)

        if (argv[0] === 'url') {
            let json = checkResizeType(argv.slice(1))
            if (!json.err) {
                let index = json.len || 0
                tiny.compressWebImages(argv.slice(index + 1), json)
            } else {
                util.printError(json.err)
            }
        } else {
            // init the fromPath and toPath
            let [fromPath, toPath] = argv
            let params
            if (!toPath || toPath === '-m') {
                toPath = options.dir || "./tiny"
                params = argv.slice(1)
            } else {
                params = argv.slice(2)
            }

            let option
            if (params.length > 0) {
                option = checkResizeType(params)
                if (option.err) {
                    util.printError(option.err)
                    return
                }
            }

            // check file or direcroty whether exists and get it's type
            // 0 = file, 1 = dir, -1 = no such file or dir
            let fromPathType = util.isFileOrDir(fromPath)
            if (fromPathType === -1) {
                util.printNoSuchFileOrDir()
                return
            }

            let obj = util.parsePath(toPath)
            let checkDir
            if (!obj.ext) {
                // tiny ng.png ./tiny
                // obj: { root: '', dir: '.', base: 'tiny', ext: '', name: 'tiny' }
                checkDir = toPath
            } else {
                // tiny bg.png ./tiny/hah.png
                // obj: { root: '', dir: './tiny', base: 'hah.png', ext: '.png', name: 'hah' }
                checkDir = obj.dir
            }

            let toPathType = util.isFileOrDir(checkDir)
            if (fromPathType === 1 && toPathType === 0) {
                util.printError(`The dest path must be dir when fromPath is dir`)
                return
            } else if (toPathType === -1) {
                util.createNewDir(checkDir)
                toPathType = 1
            }

            util.print("Start compression...")

            // compress one image file or all images in directory
            if (fromPathType === 0) {
                let imgName = util.parsePath(fromPath).base
                // if toPathType = 1, then the toPath is dir
                if (toPathType === 1 && !obj.ext) {
                    toPath = util.joinPath(toPath, imgName)
                }

                tiny.compressImage(fromPath, toPath, option)
            } else if (fromPathType === 1 && toPathType === 1) {
                // fromPath is dir and toPath is dir
                tiny.compressDirImages(fromPath, toPath, option)
            }
        }
    }
}

/*
 * @param args [array]
 * eg: tiny url -m fit -w 300 -h 300 <url> <url>
 * args will be [-m fit -w 300 -h 300 <url> <url>]  
 */
function checkResizeType(args) {
    let [m, method, w, width, h, height] = args
    let err
    if (!m) {
        err = `please set urls or -m method to compress.
        eg: tiny url <url> <url> or tiny url -m cover <url> <url>`
    }

    if (m === '-m' || m === '--method') {
        switch (method) {
            case 'scale':
                if (w && h
                    && (w === '-w' || w === '-width')
                    && (h === '-h' || h === '-height')) {
                    err = `error: can not provide both width and height when method is scale`
                } else {
                    if ((w === '-w' || w === '-width')
                        && !isNaN(Number(width))) {
                        return {
                            method,
                            width: Number(width),
                            len: 4 // -m scale -w 100
                        }
                    } else if ((w === '-h' || w === '--height')
                        && !isNaN(Number(width))) {
                        return {
                            method,
                            height: Number(width),
                            len: 4
                        }
                    } else {
                        err = `Please set -w width or -h height, just one of them.`
                    }
                }
                break
            case 'fit':
            case 'thumb':
            case 'cover':
                if (w && h && width && height
                    && (w === '-w' || w === '-width')
                    && (h === '-h' || h === '-height')) {
                    if (isNaN(Number(width)) || isNaN(Number(height))) {
                        err = `error: width and height must be number`
                    } else {
                        return {
                            method,
                            width: Number(width),
                            height: Number(height),
                            len: 6 // -m fit -w 100 -h 100
                        }
                    }
                } else {
                    err = `error: width and height are both needed when method is ${method}`
                }
                break
            default:
                err = `error: method is needed when set -m. eg: tiny ./bg.png -m scale -w 100`
                break
        }
    }

    return {
        err
    }
}

/*
* @param params [array]
* param can be --key, --proxy, --dir, --width, --height
*/
function setConfig(params) {
    let param = params[0]
    switch (param) {
        case '-c':
        case '--clear':
            config.clearConfig()
            util.print(`Clear all config params successfully`)
            break
        case '-D':
        case '--delete':
            if (params[1]) {
                config.deleteParam(params[1])
                util.print(`Delete config ${params[1]} successfully`)
            } else {
                util.printError(`Please set config param to delete`)
            }
            break
        case '-k':
        case '--key':
            let key = params[1] || ""
            config.setKey(key)
            util.print(`Set tinify apiKey ${key} successfully`)
            break
        case '-p':
        case '--proxy':
            let proxy = params[1] || ""
            config.setProxy(proxy)
            util.print(`Set tinify proxy ${proxy} successfully`)
            break
        case '-d':
        case '--dir':
            let dir = params[1] || "./tiny"
            config.setDir(dir)
            util.print(`Set default tinify compression dir ${dir}`)
            break
        case '-m':
        case '--method':
            let method = params[1] || 'scale'
            config.setMethod(method)
            util.print(`Set default tinify resize method as ${method}`)
            break
        case '-w':
        case '--width':
            let width = params[1]
            config.setWidth(width)
            util.print(`Set default tinify image width ${width}`)
            break
        case '-h':
        case '--height':
            let height = params[1]
            config.setHeight(height)
            util.print(`Set default tinify image height ${height}`)
            break
        case '-l':
        case '--list':
            util.printConfig(config.getAllConfig())
            break
        default:
            util.printHelpInfo()
            break
    }
}

run(process.argv.slice(2));
