const
	fetch = require('node-fetch'),
	getAESkey = /"floating-player"[^{|^}]*?"(.*?)"/i,
	getEncryptedCookie = /S=["|'](.*?)["|']/

module.exports = class CloudFlareBypass{
	constructor(userAgent){
		this.userAgent = userAgent
		this.cookie = null
	}

	get(url){
		return new Promise(async (resolve, reject) => {
			try{
				if(this.cookie == null) this.cookie = await getCloudflareCookie(url, this.userAgent)
				resolve(fetch(url, {
					headers: {
						'user-agent': this.userAgent,
						'cookie': this.cookie
					}
				}))
			}catch(err) { reject(err) }
		})	
	}
}

// Generates correct output
function getCloudflareCookie(url, userAgent){
	return new Promise((resolve,reject) => {
		fetch(url, {
			headers: {
				'user-agent': userAgent
			}
		})
		.then(res=>res.text())
		.then(text => {
			let result = text.match(getEncryptedCookie)
			if(result[1]){
				try{
					resolve(getCookie(decrypt(result[1])))
				}catch(err){
					reject(err)
				}
			}else{
				reject('Unable to extract encrypted cookie')
			}
		}).catch(reject)
	})
}

function decrypt(encrypted) {
	let charmap = {}
	let unknown = 0;
	let unknown2 = 0;
	let result = '';
	let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	for (let i = 0; i < 64; i++) {
		charmap[charset.charAt(i)] = i;
	}
	for (let i = 0; i < encrypted.length; i++) {
		let char = charmap[encrypted.charAt(i)];
	    unknown = (unknown << 6) + char;
	    unknown2 += 6;
	    while (unknown2 >= 8) {
	    	let a = (unknown >>> (unknown2 -= 8)) & 0xFF
	        if(a || (i < (encrypted.length - 2)))
	        	(result += String.fromCharCode(a))
	    }
	}
	return result
}
function getCookie(encrypted){
	const [value, key] = encrypted.substr(2).split(/;document.cookie=/)
	.map(x => x.split('+').map(y => y.trim()).map(z => {
		if(z.startsWith("'") && z.endsWith("'") || z.startsWith('"') && z.endsWith('"')) return z.substr(1, z.length-2)
		if(z.includes('substr')){
			const [, str, start, length] = z.split(/["|'](.*?)["|']\.substr\(([\d]+).*?([\d]+)\)/)
			return str.substr(start, length)
		}
		if(z.includes('fromCharCode')){
			const [, code] = z.split(/String\.fromCharCode\((.*?)\)/)
			return String.fromCharCode(parseInt(code))
		}
		if(z.includes('charAt')){
			const [, str, num,] = z.split(/[\"|\'](.*?)[\"|\']\.charAt\(([\d]+)\)/)
			return str.charAt(num)
		}
		if(z.includes('slice')){
			const [, str, i0, i1] = z.split(/["|'](.*?)["|']\.slice\(([\d]+).*?([\d]+)\)/)
			return str.slice(i0, i1)
		}
		return z
	})).map(x => {
		return x.reduce((acc,val) => {
			return acc+val
		}, '').split(';').shift()
	}).map(x => {
		if(!x.includes('sucuri_cloudproxy_uuid_')) return x
		return 'sucuri_cloudproxy_uuid_'+x.split(/sucuri_cloudproxy_uuid_(.*?)=/)[1]
	})
	return `${key}=${value}` //;path=/;max-age=86400
}