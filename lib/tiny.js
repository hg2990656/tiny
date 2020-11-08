const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const tinify = require("tinify")
const Util = require("./util")
const util = new Util()

class Tiny {
    constructor(options = {}) {
        this.dir = options.dir || "./tiny"
        this.config = options
        tinify.key = options.key
        tinify.proxy = options.proxy
    }

    compressImage(fromPath, toPath, options = {}) {
        console.log("compress a image from", fromPath, "to", toPath)

        this.createTask(fromPath, toPath, { ...this.config, ...options }).then((destPath) => {
            util.calTime()
        })
    }

    compressDirImages(fromDir, toDir, options) {
        console.log("compress images from", fromDir, "to", toDir)

        let tasks = []
        fs.readdir(fromDir, (err, files) => {
            if (err) {
                console.log(chalk.red(`${err}`))
            } else {
                files.forEach((fileName) => {
                    let originPath = path.join(fromDir, fileName)
                    let destPath = path.join(toDir, fileName)

                    tasks.push(this.createTask(originPath, destPath, { ...this.config, ...options }))
                })

                Promise.all(tasks).then(() => {
                    util.calTime()
                })
            }
        })
    }

    compressWebImages(urls, options = {}) {
        let num = urls.length
        if (num === 0) {
            util.printError(`error: no images urls have been set`)
            return
        }

        util.print("Start compression...")
        let index = 0
        urls.forEach((url) => {
            let fileName = Date.now().toString() + ".png"
            let destPath = util.joinPath(this.dir, fileName)

            let source = tinify.fromUrl(url)
            let resized
            options = { ...this.config, ...options }
            if (options.method) {
                resized = source.resize(this.setResizeOpt(options))
            }

            let origin = resized ? resized : source
            origin.toFile(destPath)
                .then(() => {
                    util.print(`Compress to ${destPath} successfully`)
                    index++
                    if (index === num) {
                        util.calTime()
                    }
                })
                .catch(e => {
                    util.printError(`Compress Fail: ${e.message}`)
                })
        })
    }

    setResizeOpt(options) {
        let { method, width, height } = options
        switch (options.method) {
            case 'scale':
                if (width) {
                    return {
                        method, width
                    }
                } else if (height) {
                    return {
                        method, height
                    }
                }
            case 'fit':
            case 'thumb':
            case 'cover':
                return {
                    method, width, height
                }
            default:
                break
        }
    }

    createTask(originPath, destPath, options) {
        return new Promise((resolve, reject) => {
            let source = tinify.fromFile(originPath)
            let resize
            if (options.method) {
                resize = source.resize(this.setResizeOpt(options))
            } else {
                resize = source
            }

            resize.toFile(destPath)
                .then(() => {
                    util.print(`Compress to ${destPath} successfully`)
                    resolve(destPath)
                })
                .catch(e => {
                    util.printError(`Compress Fail: ${e.message}`)
                    reject(e)
                })
        })
    }

    validate() {
        tinify.validate(function (err) {
            if (err) {
                util.printError(`Validation of API key failed. Make sure your key is avaliable`)
            } else {
                util.print(`compressions this month is ${tinify.compressionCount}`)
            }
        })
    }
}

module.exports = Tiny