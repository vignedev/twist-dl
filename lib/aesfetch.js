const cloudflare = require('./cloudflare')
const getKey = /name:"floating-player",.*?:"(.{35})"/

module.exports = {
	getAESkey: (userAgent) => {
		const CF = new cloudflare(userAgent)
		return new Promise(async (resolve,reject) => {
			try{
				const index = await (await CF.get('https://twist.moe/')).text()
				const jsFiles = index.split(/href="(.*?)"/g).filter(x=>x.endsWith('.js'))

				let retrieved = null

				for(const i in jsFiles){
					let js = await (await CF.get('https://twist.moe' + jsFiles[i])).text()
					const match = js.match(getKey)
					if(match == null) continue
					retrieved = match[1]
				}
				if(retrieved != null && retrieved.length == 35){
					resolve(retrieved)
				}else{
					reject('Failed to extract AES key')
				}
			}catch(err){
				reject(err)
			}
		})
	}
}

/*
 
[ Connect to twist.moe ]
 |
 |_ [ Get sucuri challange ]
 |
[ Connect to twist.moe (with sucuri cookie) ]
 |
 |_ [ Find all references to JS files ]
 	 |
	 |_ [ Search through all to find the key ]
*/