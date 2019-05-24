const
    { red } = require('ansi-colors'),
    crypto = require('crypto-js'),  // Perhaps translate into nodev10 crypto?
    aes = require('crypto-js/aes'),
    fetch = require('node-fetch'),
    { AutoComplete, MultiSelect } = require('enquirer'),
    ProgressBar = require('progress'),
    path = require('path'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2), {alias: {
        anime: 'a', episode: 'e', output: 'o', help: 'h'
    }})
    
const
    baseUrl = 'https://twist.moe',
    aesKey = "k8B$B@0L8D$tDYHGmRg98sQ7!%GOEGOX27T",
    accessToken = "1rj2vRtegS8Y60B3w3qNZm5T2Q0TN2NR",
    userAgent = `twist-dl/${require('./package.json').version}`,
    interactive = typeof (argv.anime) === typeof (argv.episode)

if (!interactive || argv.help){
    console.error(`Usage: twist-dl -a <anime name> -e <episode> [-o <output>]

Options:

  -a, --anime       Name of the anime, can be partial
  -e, --episode     Which episode to download (1 = episode 1)
  -o, --output      Folder in which it'll be downloaded in, use - to output to stdout
  -h, --help        Displays this message`)
    process.exit(1)
}

;(async() => {
    try{
        const animeList = await getJSON('/api/anime')
        const selectedAnime = argv.anime ? animeList.find(x => x.title.toLowerCase().includes(argv.anime.toLowerCase())) : await (new AutoComplete({
            name: 'anime', message: 'Pick your anime:', limit: 10,
            choices: animeList.map(x => ({ name: x.title, value: x }))
        })).run()

        const sourceList = await getJSON(`/api/anime/${selectedAnime.slug.slug}/sources`)
        const sources = sourceList.reduce((acc, val) => {
            acc[`Episode ${val.number}`] = val
            return acc
        }, {})

        let source = sources[`Episode ${argv.episode}`]
        if (!source && !interactive) throw new Error('Episode not available or series wasn\'t found.')
        const pickedEpisodes = argv.episode ? [source] : (await (new MultiSelect({ // Choices are broken, they don't read the value field, workaround present
            name: 'episodes', message: 'Select episodes:', limit: 24,
            choices: Object.keys(sources)
        })).run()).map(x => sources[x])

        for (let i = 0; i < pickedEpisodes.length; i++) {
            if(argv.output == '-')
                await downloadAndPipeIntoStdout(decryptSource(pickedEpisodes[i].source))
            else
                await downloadWithFancyProgressbar(decryptSource(pickedEpisodes[i].source), `  Episode ${pickedEpisodes[i].number} (${i + 1}/${pickedEpisodes.length}) [:bar] :rate/bps :percent :etas`)
        }
    }catch(err){
        console.error(red('error: '), err)
    }
})()

/* Helper Functions */
function getJSON(endpoint){
    return new Promise((resolve,reject) => {
        fetch(baseUrl + endpoint, {
            headers: { 'x-access-token': accessToken, 'user-agent': userAgent}
        }).then(res => res.json()).then(resolve).catch(reject)
    })
}
function decryptSource(source){
    return aes.decrypt(source, aesKey).toString(crypto.enc.Utf8)
}
function downloadWithFancyProgressbar(url, text){
    return new Promise((resolve,reject) => {
        fetch(baseUrl + url, { headers: { 'user-agent': userAgent} }).then(res => {
            let progress = new ProgressBar(text, {
                complete: '=', incomplete: '.', width: 24, total: parseInt(res.headers.get('content-length'))
            })
            const dest = fs.createWriteStream(`${path.resolve(process.cwd(), argv.output || '')}/${path.basename(url)}`)
            res.body.pipe(dest)

            res.body.on('data', chunk => progress.tick(chunk.length))
            res.body.on('end', resolve)
            res.body.on('error', reject)
        }).catch(reject)
    })
}
function downloadAndPipeIntoStdout(url){
    return new Promise((resolve,reject) => {
        fetch(baseUrl + url).then(res => {
            res.body.pipe(process.stdout)
            res.body.on('end', resolve)
            res.body.on('error', reject)
        }).catch(reject)
    })
}