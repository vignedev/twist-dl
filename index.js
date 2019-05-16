const
    crypto = require('crypto-js'),  // Perhaps translate into nodev10 crypto?
    aes = require('crypto-js/aes'),
    fetch = require('node-fetch'),
    { AutoComplete, MultiSelect } = require('enquirer'),
    ProgressBar = require('progress'),
    { basename } = require('path'),
    fs = require('fs')
    
const
    baseUrl = 'https://twist.moe',
    aesKey = "k8B$B@0L8D$tDYHGmRg98sQ7!%GOEGOX27T",
    accessToken = "1rj2vRtegS8Y60B3w3qNZm5T2Q0TN2NR"

;(async() => {
    const pickedAnime = await (new AutoComplete({
        name: 'anime', message: 'Pick your anime:', limit: 10,
        choices: (await getJSON('/api/anime')).map(x=>({name:x.title,value:x}))
    })).run()

    const sources = (await getJSON(`/api/anime/${pickedAnime.slug.slug}/sources`)).reduce((acc,val) => {
        acc[`Episode ${val.number}`] = val
        return acc
    }, {})
    const pickedEpisodes = (await (new MultiSelect({ // Choices are broken, they don't read the value field, workaround present
        name: 'episodes', message: 'Select episodes:', limit: 24,
        choices: Object.keys(sources)
    })).run()).map(x=>sources[x])
    
    for(let i = 0; i < pickedEpisodes.length; i++){
        downloadWithFancyProgressbar(decryptSource(pickedEpisodes[i].source), `  Episode ${pickedEpisodes[i].number} (${i+1}/${pickedEpisodes.length}) [:bar] :rate/bps :percent :etas`)
    }
})()

function getJSON(endpoint){
    return new Promise((resolve,reject) => {
        fetch(baseUrl + endpoint, {
            headers:{'x-access-token':accessToken,'user-agent':'twist-cli/0.1'}
        }).then(res => res.json()).then(resolve).catch(reject)
    })
}
function decryptSource(source){
    return aes.decrypt(source, aesKey).toString(crypto.enc.Utf8)
}
function downloadWithFancyProgressbar(url, text){
    return new Promise((resolve,reject) => {
        fetch(baseUrl + url).then(res => {
            let progress = new ProgressBar(text, {
                complete: '=', incomplete: '.', width: 24, total: parseInt(res.headers.get('content-length'))
            })
            const dest = fs.createWriteStream(`${process.cwd()}/${basename(url)}`)
            res.body.pipe(dest)

            res.body.on('data', chunk => progress.tick(chunk.length))
            res.body.on('end', resolve)
            res.body.on('error', reject)
        }).catch(reject)
    })
}