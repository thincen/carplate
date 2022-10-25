# Carplate

根据 `GA36-2018` 生成小区门禁已登记车牌, 识别手机屏幕开闸
![preview](https://s3.bmp.ovh/imgs/2022/10/25/79d81f5ff9737069.gif)


## 开发测试

```shell
# yarn golbal add vite
# yarn add vite-plugin-pwa -D
yarn
yarn dev --host
yarn build
```

## 初次使用

- 离线使用pwa: 弹出可离线使用提示后添加到手机主屏幕
- 缓存车牌: 将车牌信息保存到本机
- 加载缓存: 车牌列表加载完成后, 点击对应车牌显示图片
- 显示车牌: 先显示缩略图(其实是canvas), 点击缩略图会放大显示方便识别. 点击大图, 回到主页面

## [Changelog](./public/changelog.md)

感谢 [longwosion/carplate](https://github.com/thincen/carplate) 分享

