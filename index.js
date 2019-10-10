const
    { red, yellow, cyan } = require('ansi-colors'),
    crypto = require('crypto-js'),  // Perhaps translate into nodev10 crypto?
    aes = require('crypto-js/aes'),
    fetch = require('node-fetch'),
    url = require('url'),
    { AutoComplete, MultiSelect } = require('enquirer'),
    ProgressBar = require('progress'),
    path = require('path'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2), {alias: {
        anime: 'a', episode: 'e', output: 'o', help: 'h', silent: 's'
    }})
    
const
    baseUrl = 'https://twist.moe',
    aesKey = "LXgIVP&PorO68Rq7dTx8N^lP!Fa5sGJ^*XK",
    accessToken = "1rj2vRtegS8Y60B3w3qNZm5T2Q0TN2NR",
    userAgent = `twist-dl/${require('./package.json').version}`,
    interactive = typeof (argv.anime) === typeof (argv.episode) || argv._.length == 0

if (!interactive || argv.help){
    console.error(`Usage: twist-dl -a <anime name> -e <episode> [-o <output>] [url]

Options:

  -a, --anime       Name of the anime, can be partial
  -e, --episode     Which episode to download (1 = episode 1)
  -o, --output      Folder in which it'll be downloaded in, use - to output to stdout
  -h, --help        Displays this message
  -s, --silent      Suppress any (except of donation message) output`)
    process.exit(1)
}

;(async() => {
    try{
        // if link is present
        if(argv._.length !== 0 && argv._[0].includes('twist.moe/a/')){
            const { pathname } = url.parse(argv._[0])
            const [, type, anime, episode ] = pathname.split('/')
            if(type !== 'a' || typeof(anime) === 'undefined' || typeof(episode) === 'undefined') throw new Error('Invalid URL')

            argv.anime = anime
            if(typeof(argv.episode) === 'undefined') argv.episode = episode
        }

        const animeList = await getJSON('/api/anime')
        const selectedAnime = argv.anime ? animeList.find(x => x.slug.slug.includes(argv.anime.toLowerCase()) || x.title.toLowerCase().includes(argv.anime.toLowerCase())) : await (new AutoComplete({
            name: 'anime', message: 'Pick your anime:', limit: 10,
            choices: animeList.map(x => ({ name: x.title, value: x }))
        })).run()

        const sourceList = await getJSON(`/api/anime/${selectedAnime.slug.slug}/sources`)
        const sources = sourceList.reduce((acc, val) => {
            acc[`Episode ${val.number}`] = val
            return acc
        }, {})

        let source = argv.episode == 'latest' ? sources[Object.keys(sources).pop()] : sources[`Episode ${argv.episode}`]
            
        if (!source && !interactive) throw new Error('Episode not available or series wasn\'t found.')

        const pickedEpisodes = argv.episode ? (typeof(argv.episode) === 'string' && argv.episode != 'latest' ? getArrayOfEpisodes(sources, argv.episode) : [source]) : (await (new MultiSelect({ // Choices are broken, they don't read the value field, workaround present
            name: 'episodes', message: 'Select episodes:', /*limit: 24,*/
            choices: Object.keys(sources)
        })).run()).map(x => sources[x])

        // use console.error so we don't write to stdout but stderr (in case of piping)
        console.error(`\n  ${cyan('twist-dl')} is currently under developement, if any problems occur, please ${red('submit an issue')} on the GitHub's repo.`)
        console.error(`  ${red('Remember: ')} If you have some money to spare, donate it to twist.moe so they can the servers up and running! \n`)
        console.error(`  ${yellow(selectedAnime.title)}\n`)

        for (let i = 0; i < pickedEpisodes.length; i++) {
            try{
                if(argv.output == '-')
                    await downloadAndPipeIntoStdout(decryptSource(pickedEpisodes[i].source))
                else
                    await downloadWithFancyProgressbar(decryptSource(pickedEpisodes[i].source), `  Episode ${pickedEpisodes[i].number} (${i + 1}/${pickedEpisodes.length}) [:bar] :rate/bps :percent :etas`)
            }catch(err){
                console.error(`${red('error: ')} Failed to download episode ${pickedEpisodes[i].number}\n`,err)
            }
        }
    }catch(err){
        console.error(red('error: '), err)
    }
})()

/* Helper Functions */
function getJSON(endpoint){
    return new Promise((resolve,reject) => {
        fetch(baseUrl + endpoint, {
            headers: { 'x-access-token': accessToken, 'user-agent': userAgent }
        }).then(res => {
            if(!res.ok) return reject(`Server responded with ${res.status} (${res.statusText})`)
            return res.json()
        }).then(resolve).catch(reject)
    })
}
function decryptSource(source){
    return aes.decrypt(source, aesKey).toString(crypto.enc.Utf8).trim()
}
function downloadWithFancyProgressbar(url, text){
    return new Promise((resolve,reject) => {
        fetch(baseUrl + url, { headers: { 'user-agent': userAgent, 'referer': baseUrl } }).then(res => {
            if(!res.ok) return reject(`Server responded with ${res.status} (${res.statusText})`)
            let progress = argv.silent ? { tick:()=>{/* stub */} } : new ProgressBar(text, {
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
        fetch(baseUrl + url, { headers: { 'user-agent': userAgent, 'referer': baseUrl } }).then(res => {
            if(!res.ok) return reject(`Server responded with ${res.status} (${res.statusText})`)
            res.body.pipe(process.stdout)
            res.body.on('end', resolve)
            res.body.on('error', reject)
        }).catch(reject)
    })
}

function getArrayOfEpisodes(source, input){
    const rawEpisodes = input.split(',').map(x => parseRange(x.trim())).reduce((acc,val) => acc.concat(...val), [])
    const uniqueEpisodes = uniqueArray(rawEpisodes.sort()).map(x => `Episode ${x}`)

    return uniqueEpisodes.map(x => source[x])

    function parseRange(range){
        const [ start, end ] = range.split(`-`)
        if(typeof(end) === 'undefined') return [start]
        if(parseInt(start, 10) >= parseInt(end, 10)) throw new Error('End point is smaller than start point')
        return Array(end-start+1).fill().map((x,i) => parseInt(start)+i)
    }
}

function uniqueArray(array){
    const filter = {}
    array.forEach(x => filter[x] = null)
    return Object.keys(filter)
}