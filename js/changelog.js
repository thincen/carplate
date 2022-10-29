// changelog.js
// ios safari foxfire 都不支持零宽断言, 换种写法
// asset changelog.md?raw 也不能在此引入

function getTxtByReg(tag,raw){
	let reg=/^<li>.+<\/li>/
	switch(tag){
		case "h1":
			reg=/^#\s(.+)/
			break
		case "h2":
			reg=/^##\s(.+)/
			break
		case "h3":
			reg=/^###\s(.+)/
			break
		case "li":
			reg=/^-\s(.+)/
			break
	}
	let txt=raw.match(reg)
	if(txt!=null){
		return `<${tag}>${txt[1]}</${tag}>`
	}
	return ""
}

	export function parseChangelogMD(mdraw) {
		// delete blank line
		let strs = mdraw.replace(/^\s+/gm, ``).split(`\n`)
		for (let i = 0; i < strs.length; i++) {
			let reg=/^\[#\d+\]:\shttps:.+$/
			if (strs[i].match(reg)!=null){
				strs[i]=""
			}
			// Features|Fixed
			let h3=getTxtByReg("h3",strs[i])
			if(h3!=""){
				let preline=getTxtByReg("isParsed",strs[i-1])
				if (preline != "") {
					strs[i]=`</ul>${h3}`
				}else{
					strs[i]=`${h3}<ul>`
				}
				continue
			}
			// Changelog
			let h1=getTxtByReg("h1",strs[i])
			if(h1!=""){
				strs[i]=h1
				continue
			}
			// version (date)
			let h2=getTxtByReg("h2",strs[i])
			if(h2!=""){
				strs[i]=h2
				continue
			}
			// details
			let li=getTxtByReg("li",strs[i])
			if(li!=""){
				strs[i]=li
				continue
			}
		
	}
		let reg=/\((\[#\d+\])\)/gm
		let idarray=strs.join("").match(reg)
		let res=strs.join("")
		idarray.forEach(id => {
			let reg=/\d+/
			let idnum=id.match(reg)[0]
			res=res.replace("[#"+idnum+"]","<a href=https://github.com/thincen/carplate/issues/"+idnum+">#"+idnum+"</a>")
		});
		res=res+"</ul>"
		return res
	}
