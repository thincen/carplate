// cache.js
import Carplate from "./carplate";
import { draw } from './draw.js'
const cacheName = "carplates";
const cacheDom = document.querySelector("#cacheInfo");

class Cache {
    constructor() {
        // [{id,value,comment,category}]
        this.data = JSON.parse(window.localStorage.getItem(cacheName)) || [];
    }

	clearCache(){
        window.localStorage.setItem(cacheName,"[]" )
        this.data=[]
}

    saveToCache() {
        window.localStorage.setItem(cacheName, JSON.stringify(this.data))
    }

    addToCache(value,category, comment) {
        let data = new Carplate(value, category, comment)
        this.data.push(data)
        this.saveToCache()
    }

    renderCache() {
        cacheDom.innerHTML = `<div id="cacheCount" class="tips">
<div >检索到信息${this.data.length}条</div>
<div><button class="btn-danger" id="removeAllCache" >RemoveAll</button></div></div>`;
        if (this.data.length === 0) {
            cacheDom.innerHTML = `
<div class="tips"><br>
<p>---还没有缓存数据---</p>
<br>
<div class="help">
<p>Carplate</p>
感谢 <a href="https://github.com/thincen/carplate"><u>longwosion/carplate</u></a> 分享<br>
根据GA36-2018模仿小区门禁已登记车牌, 识别开闸进入小区
<ul>
<p>初次使用</p>
<li>当前仅支持蓝牌小汽车车牌生成<br><strong style="color:red;">⚠️关闭手机自动旋转;调节屏幕亮度能够帮助识别</strong></li>
<li>离线使用: <br>弹出可离线使用提示后添加到手机主屏幕</li>
<li>缓存车牌: <br>将车牌信息保存到本机</li>
<li>加载缓存: <br>车牌列表加载完成后, 点击对应车牌显示图片</li>
<li>显示车牌:<br>先显示缩略图(其实是canvas), 点击缩略图会放大显示方便识别. <br>点击大图, 回到主页面</li>
</ul>
</div></div>
`
            document.querySelector("#canvas").style.display="none"
            return
        }
        
        let ulDom = document.createElement("ul")
        ulDom.classList.add("list","tips")

        this.data.forEach((item,index) => {
            let liDom = document.createElement("li")
liDom.setAttribute("data-cache-id",index)
            liDom.innerHTML = `
       <div class="col2">
        <div class="row2">
            <p class="cahceDate">${Carplate.toLocalString(item.id)}</p>
            <p class="cacheCategory">${Carplate.category(item.category)}</p>
            <p class="cacheValue">${item.value}</p>
        </div>
        <p class="cacheComment">${item.comment}</p>
       </div>
       <div><button class="cacheDelBtn btn-danger" data-cache-id="${index}" 
       >删除</button></div>`
            ulDom.appendChild(liDom)
            
        })
        cacheDom.appendChild(ulDom)

        document.querySelector("#removeAllCache").addEventListener("click",()=>{
if( !confirm("❌确定删除所有缓存的车牌信息?")  ){return}
            this.clearCache()
            this.renderCache()
        })
        ulDom.addEventListener("click", (e) => {
let id=e.target.dataset.cacheId
//            console.log(e.composedPath())
			if (e.target.nodeName == "BUTTON") {
if( !confirm("❗️确定删除 "+this.data[id].value +" ?")  ){return}
				this.data.splice(parseInt(id), 1)
				this.saveToCache()
				this.renderCache()
                return 
			}
            let index= -1;

            let path=e.composedPath()||e.path
            path.forEach(node=>{
                if(node.nodeName=="LI" && index==-1){
                    index=node.dataset.cacheId
                }
                if (node.className=="list tips"){
                    draw(this.data[index].value,this.data[index].category)
                    let canvas=document.querySelector("#canvas")
                    canvas.style.rotate="-90deg"
                    window.scrollTo(0,document.documentElement.clientHeight)
                    return
                }
            })
		})

    }
}

export default Cache



