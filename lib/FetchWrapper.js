const
    fetch = require('node-fetch'),
    { EventEmitter } = require('events')

class FetchWrapper extends EventEmitter{
    constructor(url, options){
        super()
        this.url = url
        this.options = options
        this.length = null
    }
    async start(){
        let res = await fetch(this.url, { headers: this.options.headers, compress: false })
        if(res.headers.has('content-range') && parseInt(res.headers.get('content-range').split('/').pop(), 10) == this.options.received)
            return this.emit('finished', true)
        if(!res.ok) return this.emit('error', Error(`Server responded with ${res.status} (${res.statusText})`))

        this.length = parseInt(res.headers.get('content-length'))
        res.body.pipe(this.options.stream)
        res.body.on('data', chunk => this.emit('flow', chunk.length))
        res.body.on('end', () => this.emit('finished'))
        res.body.on('error', err => this.emit('error', err))
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
    return (new FetchWrapper(url, options)).start()
}