// draw.js

const d = window.devicePixelRatio>2||3, // 缩放比例
d2=2*d,
  r = 10; // 内框线圆角 10mm

// 最外层边框 普通蓝牌为 w=440 h=140 r=10+1.5 border-width=1.5

/**
 * 绘制canvas
 * @param {string} carplate 车牌号
 * @param {string} opt 车牌类型
 */
export function draw(carplate, opt) {
  let canvas = document.getElementById("canvas")
  let backgroundColor = "#001B7A", // 底色 普通蓝牌 蓝色
    fontColor = "white"; // 字体颜色 
  let w = 440, // 车牌宽 440mm 480mm-新能源绿牌
    h = 140; // 车牌高 140mm
  if (opt.toLowerCase() === "green") {
    w = 480
  }
  canvas.width = h * d2; // 放大像素
  canvas.height = w * d2
  const ctx = canvas.getContext("2d")
  ctx.translate(h * d2, 0); // 移动原点到等高的位置,旋转后刚好铺满
  ctx.rotate(Math.PI / 180 * 90) // 顺时针旋转90度
  ctx.scale(d2, d2)

  border(ctx, w, h, r, backgroundColor)
  hole(ctx, h)

  province(ctx, carplate)
  canvas.style.display="block"
}

/**
 * 绘制 省 汉字 
 * @param {*} s 牌号全部字符 
 */
function province(ctx, s) {
  const p = "京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新港澳使领学警";
let index=p.indexOf(s[0])
  let row = 0, col = 0
  for (row; row < 4; row++) {
    if (index < (row + 1) * 9) {
      col = index - row * 9
      break
    }
  }

  let img = new Image()
  img.onload = function () {
    // png内文字宽90,高180
    ctx.drawImage(img, 90 * col, 180 * row, 90, 180, 15, 25, 45, 90);
    //  drawLetter(ctx,s)
    letters(ctx, s)
    //  canvas.style.display = "none"
  }
  img.src = "img/word.png"
}

/**
 * 绘制外层蓝色,中间白色,主要区域蓝色,分割的圆点
 * @param {caavas.ctx} ctx 
 * @param {number} w width
 * @param {number} h height
 * @param {number} r GA-2018圆角半径
 * @param {string} color 用于设置fillStyle
 */
function border(ctx, w, h, r, color) {
  ctx.fillStyle = color;
  let offset = 1.5;
  ctx.beginPath()
  roundedRect(ctx, 0, 0, w, h, (r + offset))
  ctx.fill() // 最外层边框
  ctx.beginPath()
  ctx.fillStyle = "white"
  roundedRect(ctx, offset, offset, w - offset * 2, h - offset * 2, r)
  ctx.fill() // 标准中的3cm边框

  offset += 3;
  ctx.beginPath()
  ctx.fillStyle = color
  roundedRect(ctx, offset, offset, w - offset * 2, h - offset * 2, r - 3)
  // 圆点
  ctx.arc(134, 70, 5, 0, Math.PI * 2, true)
  ctx.fill("evenodd") // 镂空 显示下层白色
}

/**
 * 
 * @param {canvas.ctx} ctx 
 * @param {num} h -140cm
 */
function hole(ctx, h) {
  // 螺丝
  let leftX = 100, topY = 12.5, rightX = 100 + 15 + 210, bottomY = h - 12.5
  ctx.strokeStyle = "white"
  ctx.lineWidth = 8
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(leftX, topY)
  ctx.lineTo(leftX + 15, topY)
  ctx.moveTo(leftX, bottomY)
  ctx.lineTo(leftX + 15, bottomY)

  ctx.moveTo(rightX, topY)
  ctx.lineTo(rightX + 15, topY)
  ctx.moveTo(rightX, bottomY)
  ctx.lineTo(rightX + 15, bottomY)
  ctx.stroke()
}


function letters(ctx, s) {
  // 字母和数字
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  for (let i = 1; i < s.length; i++) {
    let index = letters.indexOf(s[i])
    let row = 0, col = 0;
    if (s[i].charCodeAt() >= 48 && s[i].charCodeAt() <= 57) {
      row = 3
      col = index - 26
    } else {
      for (row; row < 4; row++) {
        if (index < (row + 1) * 10) {
          col = index - row * 10
          break
        }
      }
    }
    let img2 = new Image()
    img2.onload = function () {
      // 90*3为png第4个,182*2为png第3行,
      // 15+45+12 15-省的x 45-字母宽 12-间隔
      if (i == 1) {
        ctx.drawImage(img2, 90 * col, 180 * row, 90, 180, 15 + 45 + 12, 25, 45, 90);
      }
      if (i > 1) {
        ctx.drawImage(img2, 90 * col, 180 * row, 90, 180, 151 + (i - 2) * (12 + 45), 25, 45, 90)
      }
    }
    img2.src = "img/letter.png"
  }
}

// x,y-lefttop
function roundedRect(ctx, x, y, width, height, radius) {
  //  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  // ctx.stroke();
}
