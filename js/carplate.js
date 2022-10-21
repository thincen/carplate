// controller.js
// 页面交互逻辑

// import { draw } from './js/draw.js'

class Carplate {
	/**
	 * 构造车牌对象
	 * @param {string} value 车牌号
	 * @param {string} category 车牌类型: bluewhite/greenblack
	 * @param {string} comment 车牌信息,备注车库位置等
	 */
	constructor(value,category="blueWhite",comment=""){
		// if(id==0){
			this.id=Math.round(new Date().getTime()/1000);
		// }
		// this.id=id;
		this.value=value;
		this.category=category;
		this.comment=comment;
	}

	/**
	 * format time to string  方便渲染
	 * @returns string "2022-10-15 09:55:07"
	 */
	static toLocalString(id) {
		let now = new Date(id * 1000),
			year = now.getFullYear(),
			month = now.getMonth() + 1,
			day = now.getDate();
		return `${year}/${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : day} ${now.toLocaleTimeString('chinese', { hour12: false })}`
	}

	timestamp() {
		return this.id
	}

	static category(category){
		switch (category){
			case "blueWhite":
				return "蓝底白字"
			case "greenBlack":
				return "绿底黑字"
		}
	}
}

export default Carplate;