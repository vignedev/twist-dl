const
    https = require('https'),
    { EventEmitter } = require('events')

class NativeWrapper extends EventEmitter{
    constructor(url, options){
        super()
        this.url = url
        this.options = options
        this.length = null
    }
    async start(){
        let res = await (
            ( () => new Promise((resolve) => {
                https.get(this.url, {headers: this.options.headers}, resolve)
                    .on('error', err => this.emit('error', err))
            }) )()
        )
        if(res.statusCode.toString()[0] != '2') return this.emit('error', Error(`Server responded with ${res.status} (${res.statusText})`))
        if(res.headers['content-range'] && parseInt(res.headers['content-range'].split('/').pop(), 10) == this.options.received)
            return this.emit('finished', true)
        this.length = parseInt(res.headers['content-length'])
        
        res.pipe(this.options.stream)
        res.on('data', chunk => this.emit('flow', chunk.length))
        res.on('end', () => this.emit('finished'))
        res.on('error', err => this.emit('error', err))
        return this
    }
}

module.exports = async (url, options) => {
    if(!url || url.trim() === '') throw Error('Invalid URL')
    Object.assign({
        headers: {},
        received: 0,
        stream: process.stdout
    }, options)
    return (new NativeWrapper(url, options)).start()
}