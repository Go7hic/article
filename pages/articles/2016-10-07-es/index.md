---
layout: post
title: 使用 Lighthouse 分析现代 web 应用
datePublished: '2016-10-22 11:21:04'
category: javaScript
---

[Lighthouse](https://github.com/GoogleChrome/lighthouse) 是一个分析网络应用和网页，检测现代 web 效果指标和建议开发人员最佳做法的一个工具，谷歌家出品的。如果你想对一个现代 web 应用进行一个综合的评估，可以用这个工具试试。

下面简单讲下它的具体做法：

#### 安装
- 插件形式： [Lighthouse - Chrome 网上应用店](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
- 命令行形式：npm install -g lighthouse

#### 使用

在浏览器里，首先确保你的谷歌浏览器在 52 版本以上，插件安装好以后，打开你想检测的网站，然后点击那个插件图标，点击 Generate report 按钮，这个插件就会对你的页面进行调试，最后生成一个检测报告，里面有各种检测指标和建议，当然有个 options ，你可以选择要检查的指标

安装使用过程很简单的，你主要了解一下它这个工具检测的一些指标，为什么要这么做以及优化升级方案，下面是我对 Lighthouse 项目在 Gthub  页面的检测结果，可以看见 Github 在 PWA（Progressive Web App）方面做的并不好，不过很正常，因为 Github 本来就不是一个 PWA 应用，PWA 就是谷歌推出的一个现代 web 应用方案，不过随着设备硬件的升级，用户对应用体验的追求，我还是很看好 PWA 应用的，从现在开始你也可以开始关注一下  Progressive Web App 这个所谓的现代 web 应用方案了
![Imgur](http://i.imgur.com/Qr6hgMD.jpg)



