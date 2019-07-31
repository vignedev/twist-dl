/*const
	getAESkey = /"floating-player"[^{|^}]*?"(.*?)"/i,
	aesKey = "LXgIVP&PorO68Rq7dTx8N^lP!Fa5sGJ^*XK",
	oldKey = "k8B$B@0L8D$tDYHGmRg98sQ7!%GOEGOX27T",
	crypto = require('crypto-js'),
	aes = require('crypto-js/aes')

function decryptSource(source, key){
    const decrypted = aes.decrypt(source, key).toString(crypto.enc.Utf8)
    if(decrypted == ''){

    }
    return decrypted
}

const test = "U2FsdGVkX19IlBjpNPQJS9uztQ/HU1hvIl/dlLoxhEAzsz2sNb8rT2Ad1KorjL9p"

console.log(
	decryptSource(test, aesKey).split()
)

console.log(
	decryptSource(test, oldKey).split()
)*/

;(async()=>{
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	console.log(
		await(await (await new (require('./lib/cloudflare'))('kaguya-sama').get('https://twist.moe/')).text())
	)
})()

// const retrieved = `e="4sec".substr(0,1) + '6' +  String.fromCharCode(0x61) +  '' +"d" +  '' +"0" + "asucur".charAt(0)+"c".slice(0,1) + '9' +  '44'.slice(1,2)+"fg".charAt(0) +  '' +''+"bsucur".charAt(0)+String.fromCharCode(0x36) + "c" + 'u01'.charAt(2)+ '' + 
// "4sucur".charAt(0)+"5b".charAt(0) +  '' +'7' +  String.fromCharCode(49) + ':g=6'.substr(3, 1) +"8sucur".charAt(0)+"5" +  '' + 
// "asu".slice(0,1) + "dr".charAt(0) + "" +'f' +  "bsucur".charAt(0)+"4sec".substr(0,1) + "c".slice(0,1) + "1sucur".charAt(0)+'6jQ8'.substr(3, 1) +"" +"asec".substr(0,1) + "" +"1".slice(0,1) + "3su".slice(0,1) + '';document.cookie='ssu'.charAt(0) +'su'.charAt(1)+'csucu'.charAt(0)  +'usuc'.charAt(0)+ 'sur'.charAt(2)+'sucuri'.charAt(5) + 'su_'.charAt(2)+'sucuric'.charAt(6)+'lsucuri'.charAt(0) + 'osucuri'.charAt(0) + 'usuc'.charAt(0)+ 'd'.charAt(0)+'psucu'.charAt(0)  +'rsu'.charAt(0) +'sucuo'.charAt(4)+ 'xsucuri'.charAt(0) + 'y'+'_sucu'.charAt(0)  +'u'+'sucuriu'.charAt(6)+'sucuri'.charAt(5) + 'sucurd'.charAt(5) + 'su_'.charAt(2)+'sucuc'.charAt(4)+ 'csuc'.charAt(0)+ '3suc'.charAt(0)+ '9'.charAt(0)+'9'+'c'+''+'d'+''+'2'+'6'+"=" + e + ';path=/;max-age=86400'; location.reload();`
// .substr(2).split(/;document.cookie=/)
// .map(x => x.split('+').map(y => y.trim()).map(z => {
// 	if(z.startsWith("'") && z.endsWith("'") || z.startsWith('"') && z.endsWith('"')) return z.substr(1, z.length-2)
// 	if(z.includes('substr')){
// 		const [, str, start, length] = z.split(/["|'](.*?)["|']\.substr\(([\d]+).*?([\d]+)\)/)
// 		return str.substr(start, length)
// 	}
// 	if(z.includes('fromCharCode')){
// 		const [, code] = z.split(/String\.fromCharCode\((.*?)\)/)
// 		return String.fromCharCode(parseInt(code))
// 	}
// 	if(z.includes('charAt')){
// 		const [, str, num,] = z.split(/[\"|\'](.*?)[\"|\']\.charAt\(([\d]+)\)/)
// 		return str.charAt(num)
// 	}
// 	if(z.includes('slice')){
// 		const [, str, i0, i1] = z.split(/["|'](.*?)["|']\.slice\(([\d]+).*?([\d]+)\)/)
// 		return str.slice(i0, i1)
// 	}
// 	return z
// })).map(x => {
// 	return x.reduce((acc,val) => {
// 		return acc+val
// 	}, '').split(';').shift()
// }).map(x => {
// 	if(!x.includes('sucuri_cloudproxy_uuid_')) return x
// 	return 'sucuri_cloudproxy_uuid_'+x.split(/sucuri_cloudproxy_uuid_(.*?)=/)[1]
// })
// 
// console.log(retrieved)
