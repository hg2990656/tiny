const Configstore = require('configstore')
const packageJson = require('../package.json')
const config = new Configstore(packageJson.name, {
    key: '',
    proxy: '',
})

class Config {
    constructor() {
    }

    // set tinify apiKey to compress images
    setKey(apiKey) {
        config.set('key', apiKey)
    }

    getKey() {
        return config.get('key')
    }

    setProxy(proxyUrl) {
        config.set('proxy', proxyUrl)
    }

    getProxy() {
        return config.get('proxy')
    }

    // set default diretory path to save the compressed images
    setDir(path) {
        config.set('dir', path)
    }

    getDir() {
        return config.get('dir')
    }

    // set default image width after resize
    setWidth(width) {
        config.set('width', width)
    }

    getWidth() {
        return config.get('width')
    }

    // set default image height after resize
    setHeight(height) {
        config.set('height', height)
    }

    getHeight() {
        return config.get('height')
    }

    // set resize method of scale, fit, cover, thumb
    setMethod(method) {
        config.set('method', method)
    }

    getMethod() {
        return config.get('method')
    }

    deleteParam(param) {
        config.delete(param)
    }

    clearConfig() {
        config.clear()
    }

    getAllConfig() {
        let [key, proxy, dir, width, height, method] = [this.getKey(), this.getProxy(), this.getDir(), this.getWidth(), this.getHeight(), this.getMethod()]
        return {
            key,
            proxy,
            dir,
            width,
            height,
            method
        }
    }
}

module.exports = Config;
