// draw.js

let d = window.devicePixelRatio < 2 || 3; // 缩放比例
d *= 2
let r = 10; // 内框线圆角 10mm

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
  if (opt.toLowerCase() === "greenblack") {
    w = 480
  }
  canvas.width = w * d; // 放大像素
  canvas.height = h * d
  const ctx = canvas.getContext("2d")
  ctx.scale(d, d)

  if (opt.toLowerCase() === "greenblack") {
    drawEVCar(ctx, carplate)
    canvas.style.display = "block"
    return
  }
  // blueWhite
  border(ctx, w, h, r, backgroundColor)
  hole(ctx, h)

  province(ctx, carplate)
  canvas.style.display = "block"
}

/**
 * 绘制 省 汉字 
 * @param {*} s 牌号全部字符 
 */
function province(ctx, s) {
  const p = "京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新港澳使领学警";
  let index = p.indexOf(s[0])
  let row = 0, col = 0
  for (row; row < 4; row++) {
    if (index < (row + 1) * 9) {
      col = index - row * 9
      break
    }
  }

  let img = new Image()
  img.onload = function () {
    // png内文字宽90,高180,x=15,y=25
    ctx.drawImage(img, 90 * col, 180 * row, 90, 180, 15, 25, 45, 90);
    letters(ctx, s)
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

function drawEVCar(ctx, s) {
  // 背景框
  let bgimg = new Image()
  bgimg.onload = function () {
    ctx.drawImage(bgimg, 0, 0, 1695, 498, 0, 0, 480, 140)
    let img = new Image()
    img.onload = function () {
      evword(ctx, s, img)
      evletters(ctx, s, img)
    }
    img.src = "img/green.png"
  }
  bgimg.src = "img/evbg.png" // 1695*498
}
function evword(ctx, s, img) {
  const p = "京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新";
  let index = p.indexOf(s[0])
  let row = 4, col = 0
  // 第5行起 7行止
  for (row; row < 8; row++) {
    if (index < (row - 4 + 1) * 9) {
      col = index - (row - 4) * 9
      break
    }
  }
  ctx.drawImage(img, 45 * col, 90 * row, 45, 90, 15.5, 25, 45, 90);
}
function evletters(ctx, s, img) {
  // 字母和数字
  let letters = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  for (let i = 1; i < s.length; i++) {
    let index = letters.indexOf(s[i])
    let row = 0, col = 0;
    // A-Z
    if (s[i].charCodeAt() >= 65 && s[i].charCodeAt() <= 90) {
      for (row=1; row < 4; row++) {
        if (index < (row + 1) * 10) {
          col = index - row * 10
          break
        }
      }
    }else{
      col=index
    }
    if (i == 1) {
      ctx.drawImage(img, 43 * col, 90 * row, 43, 90, 15.5 + 45 + 9, 25, 43, 90);
    }
    if (i > 1) {
      ctx.drawImage(img, 43 * col, 90 * row, 43, 90, 161.5 + (i - 2) * (9 + 43), 25, 43, 90)
    }
  }
}