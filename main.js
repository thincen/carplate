import './style.css'
import version from '/version.info?raw'
import logs from '/changelog.md?raw'

import { registerSW } from 'virtual:pwa-register'

import { draw } from './js/draw.js'
import Cache from './js/cache.js';
import {parseChangelogMD} from './js/changelog.js';

const updateWS = registerSW(
	{
		onNeedRefresh() {
			alert("🎉这是我的一个测试.onNeedRefresh\n收到此条消息说明版本已更新\n\n如果你的本机缓存受到破坏是未修复的错误")
		},
		onOfflineReady() {
			alert("离线功能初始完成,添加到桌面享受原生应用体验")
		}
	});

let canvas = document.getElementById("canvas")
let cache = new Cache()


window.onload = () => {
	cache.renderCache()
	renderVersion()
}

function renderVersion() {
	let infos = version.split(","),
		hash = infos[0], date = infos[1], tag = infos[2].replace(/\s+/g,"")
	let s = `Commit: <a id="commitLink" href="javascript:void(0);" >${hash}</a> | Date: ${date}`
	if (tag.length != 0) {
		s = `<a href="https://github.com/thincen/carplate/tree/main" >${tag}</a> | ${s}`
	}
	document.querySelector("#version").innerHTML = s

	// show changelog
	let fieldlogDom=document.querySelector("#field-log")
	document.querySelector("#commitLink").addEventListener("click",()=>{
		fieldlogDom.style.visibility="visible"
		document.querySelector("#field-cache").style.display="none"
		document.querySelector(".changelog").innerHTML=parseChangelogMD(logs)
document.querySelector(".close").addEventListener("click",()=>{
		document.querySelector("#field-cache").style.display="block"
fieldlogDom.style.visibility="hidden"
})
	})
}

// checkbox slide
let c = document.querySelector("#cacheCheckbox")
c.addEventListener("change", () => {
	if (!c.checked) {
		document.querySelector(".checkbox").style.backgroundColor = "#ccc"
		document.querySelector(".checkbox").style.borderColor = "#6c5ce7"
	} else {
		document.querySelector(".checkbox").style.backgroundColor = "#6c5ce7"
	}
})

let inputCar = document.querySelector("#carplate")

document.querySelector(".submit").addEventListener("click", (e) => {
	if (!validateCarplateInputValue()) { return }
	let s = inputCar.value.toUpperCase()
	let t = document.getElementById("type").value
	let c = document.querySelector("#comment").value
	c = c.replace(/<script.+>/gmi, "")
	let checked = document.querySelector("#cacheCheckbox").checked
	let cacheLen = cache.data.length
	if (checked) {
		let isCached = false
		for (let i = 0; i < cacheLen; i++) {
			if (s == cache.data[i].value) {
				isCached = true
				break
			}
		}
		if (!isCached) {
			cache.addToCache(s, t, c)
			cache.renderCache()
		}
	}
	draw(s, t)
	canvas.style.rotate = "-90deg"
	window.scrollTo(0, document.documentElement.clientHeight)
})

canvas.addEventListener("click", function () {
	var dataImg = new Image()
	dataImg.src = canvas.toDataURL('image/png')
	dataImg.classList = "resImg"
	dataImg.style.height = window.innerHeight - 4 + "px"
	dataImg.style.borderRadius = window.innerHeight / 440 * 10 + "px"
	dataImg.style.height = document.body.clientHeight
	dataImg.style.rotate = "180deg"
	document.body.appendChild(dataImg)
	document.getElementById("app").style.display = "none"
	document.getElementById("canvas").style.display = "none"
	document.body.style.backgroundColor = "black"

	dataImg.addEventListener("click", function () {
		document.getElementById("app").style.display = "block"
		canvas.style.display = "none"
		dataImg.remove();
		document.body.removeAttribute("style")
	})
})

function validateCarplateInputValue() {
	let s = inputCar.value.toUpperCase()
	let t = document.getElementById("type").value
	let isBlue = t.indexOf("blue") < 0 ? false : true
	let isGreen = t.indexOf("green") < 0 ? false : true
	const p = "京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新港澳使领学警";
	const l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	const n = "1234567890"
	s = s.replace(/\s+/gm, '')
	if ((s.length != 7 && isBlue) || (s.length != 8 && isGreen)) {
		alert(`输入车牌长度为${s.length},和车牌类型不符`)
		return false;
	}
	if (p.indexOf(s[0]) < 0) {
		alert(`不支持"${s[0]}"为第1个字符的车牌`)
		return false;
	}
	if (l.indexOf(s[1]) < 0) {
		alert(`不支持"${s[1]}"为第2个字符的车牌?`)
		return false;
	}
	for (let i = 2; i < s.length; i++) {
		if ((isBlue || isGreen) && (l + n).indexOf(s[i]) < 0) {
			alert(`
暂不支持包含特殊字符"${s[i]}"的车牌`)
			return false
		}
	}
	inputCar.value = s
	return true
}
