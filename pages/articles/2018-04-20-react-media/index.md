---
layout: post
title: React 编写响应式页面
datePublished: '2018-04-20'
category: react
---

我们的前端技术栈一直是 react， 最近一个新项目产品说要兼容下移动端，所以要做响应式，而且为了seo 和在移动端首屏加载更快，加上了react服务端渲染。一开始想着做两套页面，跳不同路由，后来看了设计稿觉得没必要。

服务端渲染还好，之前做过，主要是 react 响应式页面之前还真没做过，虽然说以前写过移动端h5项目，但是上一次写PC项目还要兼容移动端还是几年前的事了。而且那时候是pc和移动端的dom元素一起写，然后通过 css 媒体查询进行区别展示。

一开始我也打算在 react 项目里面这么用，先把PC和移动端显示区别比较大地方写成两个组件，然后都渲染出来，最后在 css 里面通过媒体查询进行显示。但是这样一点也不 react 了啊。没发挥 react 的灵活特性和 all in js，而且还多渲染了组件，所以我就想着有没有在 react 里面通过js判断当前的页面大小来动态显示PC和 移动端的组件。

一查果然发现了一个之前没关注过的api:`Window.matchMedia()`[Window.matchMedia() - Web API 接口 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia)。
看眼例子，这不就是我想要的方式吗：

```
if (window.matchMedia("(min-width: 400px)").matches) {
  /* the view port is at least 400 pixels wide */
} else {
  /* the view port is less than 400 pixels wide */
}
```
而且用法也及其简单，但是因为很多地方要用，所以肯定要自己封装一下的，本着不想重复造轮子的原则，上 Github上搜了一下，发现了 `react-media `[GitHub - ReactTraining/react-media: CSS media queries for React](https://github.com/ReactTraining/react-media)这个项目就是用的  `Window.matchMedia()`实现的，代码简单易懂，还支持 props render，就用他了。

不过这个api不兼容 ie10 以下的浏览器，所以如果要兼容ie9 的朋友，可以考虑 react-media 里面介绍的 `react-responsive` 项目，两者的区别可以看 这个解释[Difference to react-responsive? · Issue #70 · ReactTraining/react-media · GitHub](https://github.com/ReactTraining/react-media/issues/70#issuecomment-347774260)