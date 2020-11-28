const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const packageJson = require('../package.json')

class Util {
    constructor() {
        this.startTime = new Date()
    }

    printVersion() {
        console.log(chalk.green(`${packageJson.version}`));
    }

    printMethodInfo() {
        console.log(chalk.green(
            `see more detail and examples on https://tinify.cn/developers/reference/nodejs\n
'scale': Scale the picture down. You must provide the target width or height, not both. 
The reduced image will have a certain width or height.

'fit': Scale the picture to fit the given size. You have to provide both width and height. 
The reduced image will not exceed any of these sizes.

'cover': Reduce the size of the picture to scale and cut the image if necessary. 
The results have accurate given size. Which part of the picture will be cut is automatically determined. 
The intelligent algorithm determines the most important region in the image.

'thumb': A more advanced implementation of the thumbnail, but also can detect the simple background of the cut image. 
The image will be reduced to the size of the width and height you provide. 
If an image is detected as an independent object, the algorithm will add more background in the necessary position, or cut out the unimportant parts.

`))
    }

    printHelpInfo() {
        console.log(chalk.green(
            ` Usage: tiny <command>\n
        tiny [-v | --version]                  show version
        tiny [-h | --help]                     show help info
        tiny [-i | --info]                     show resize type detail info
        tiny [-c | --count]                    show compressions this month, at most 500 for free
            
        Config:
        tiny config [-c | --clear]             delete all config params
        tiny config [-D | --delete] <config>   delete config param
        tiny config [-k | --key] <apiKey>      set tinify apiKey
        tiny config [-p | --proxy]  <proxyUrl> set tinify proxy
        tiny config [-d | --dir] <dirPath>     set default compress directory 
        tiny config [-m | --method] <type>     set resize type such, see details with command "tiny -i"
        tiny config [-w | --width]  <width>    set tinify resize width
        tiny config [-h | --height] <height>   set tinify resize height
        tiny config [-l | --list]              show all config
            
        Compress:
        tiny [fromPath] [toPath] [-m | --method] <method> [-w | --width] <width> [-h | --height] <height> 
        usage: compress one image from fromPath to toPath
        eg: tiny tiny.png ./tiny/compress.png

        tiny [fromDir] [toDir] [-m | --method] <method> [-w | --width] <width> [-h | --height] <height>    
        usage: compress all images in fromDir to toDir
        eg: tiny ./originDir ./compressDir
            
        tiny url [-m | --method] <method> [-w | --width] <width> [-h | --height] <height> <imgUrl> <imgUrl>    
        usage: download web images and compress
        eg: tiny url -m fit -w 300 -h 300 http://tiny.com/tiny.png http://tiny.com/tiny2.png
    
Before compress, please set tinify apiKey use 'tiny config -key [apiKey]'
        `))
    }

    print(msg) {
        console.log(chalk.green(msg))
    }

    printError(msg) {
        console.log(chalk.red(msg))
    }

    printConfig(options = {}) {
        this.print(
    `
    key = ${options.key}
    proxy = ${options.proxy}
    dir = ${options.dir}
    width = ${options.width}
    height = ${options.height}
    method = ${options.method}
    `)
    }

    /*
    * @param fromPath [string]
    * @return 0 = file, 1 = dir, -1 = error
    */
    isFileOrDir(fromPath) {
        try {
            let stat = fs.lstatSync(fromPath)
            return stat.isFile() ? 0 : 1
        } catch (e) {
            // lstatSync throws an error if path doesn't exist
            if (e.errno === -2) {
                return -1
            }
        }

        return
    }

    printNoSuchFileOrDir() {
        this.printError(`
        No such file or directory ${fromPath},
        Please check your image file path or directory path`)
    }

    createNewDir(path) {
        fs.mkdirSync(path, { recursive: true })
        this.print(`New directory ${path} is created to store the compressed images`)
    }

    joinPath(dir, fileName) {
        return path.join(dir, fileName)
    }

    calTime() {
        let endTime = new Date()
        let duration = endTime.getTime() - this.startTime.getTime()
        this.print(`All done takes ${duration / 1000} s`)
    }

    parsePath(str) {
        return path.parse(str)
    }
}

module.exports = Util