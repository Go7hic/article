---
layout: post
title: 一次 H5 活动页面的图片优化
datePublished: '2016-11-26 11:21:04'
category: web 优化
---

上周做了一个 APP 里的 HTML5 活动页面，因为后端那边忙不能及时给我提供数据，所以有时间想着怎么把这个活动页面做好一点。

之前我们的活动页面包括 H5 页面已经做过一些优化，但是有两个东西我一直想尝试并没有去落地，就是 webp 和 类似 medium 那样的图片加载效果，刚好这次打算用到活动页面里面来试一下。
先说下怎么实现类似 medium 那种图片加载效果

首先我们去看一下 medium 的效果并扒下源码，发现文章里的图片 HTML 结果基本上是这个样子的，figure 是一个 H5的新标签，用来包含一组独立的内容(图片，音频等)，
其中 aspectRatioPlaceholder-fill 元素是个占位符，并将它的 padding-bottom设置成百分比和图片长宽一致，
就是图片还没加载出的时候显示图片宽度和高度，避免页面塌陷又突然张开体验不好，
然后 progressiveMedia-thumbnail 这个图片是一个很小很小的类似缩略图，先加载这个小图片并用 canvas 元素生成一个高斯模糊的背景覆盖在前面的小图片上，
然后插入原图等到后面的原图加载完毕则把前面的这些缩略图 canvas 等隐藏，最后显示原大图。

PS: medium 细节做的不错，还加了一个禁止 js 情况下(noscript)的展示情况

```
<figure name="a7a6" id="a7a6" class="graf graf--figure graf--layoutConstrainedHeightPreview graf-after--h3 graf--last">
  <div class="aspectRatioPlaceholder is-locked" style="max-width: 331.31531531531533px; max-height: 240px;">
    <div class="aspectRatioPlaceholder-fill" style="padding-bottom: 72.39999999999999%;"></div>
    <div class="progressiveMedia js-progressiveMedia graf-image is-canvasLoaded is-imageLoaded" data-image-id="1*eXEz9RrAjIWLz0MtQqq6Pg.jpeg" data-width="4597" data-height="3330" data-scroll="native">
      <img src="https://cdn-images-1.medium.com/freeze/max/30/1*eXEz9RrAjIWLz0MtQqq6Pg.jpeg?q=20" crossorigin="anonymous" class="progressiveMedia-thumbnail js-progressiveMedia-thumbnail">
      <canvas class="progressiveMedia-canvas js-progressiveMedia-canvas" width="75" height="52"></canvas>
      <img class="progressiveMedia-image js-progressiveMedia-image" 
            data-src="https://cdn-images-1.medium.com/max/331/1*eXEz9RrAjIWLz0MtQqq6Pg.jpeg" 
            src="https://cdn-images-1.medium.com/max/331/1*eXEz9RrAjIWLz0MtQqq6Pg.jpeg">
      <noscript class="js-progressiveMedia-inner">&lt;img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/331/1*eXEz9RrAjIWLz0MtQqq6Pg.jpeg"&gt;</noscript>
     </div>
   </div>
  </figure>
```
medium 用 canvas 来做那种模糊的效果估计是考虑到它的浏览器兼容性相对好一点，因为我这是移动端基本上兼容性的问题不考虑，所以想着可以不用 canvas 来做这个效果，直接用 css3 的 blur滤镜来实现这个模糊的效果。
我的实现代码：
```
<div class="container">
    <div class="img-placeholder"></div>
    <img class="img img-small J-webp" src="/pj_appinvite/public/images/perch.jpg" data-large="/pj_appinvite/public/images/body.jpg" alt="">
  </div>
```
```css
.container {
  background-color: #f6f6f6;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

.container img {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  width: 100%;
  transition: opacity 1s linear;
}

.container img.loaded {
  opacity: 1;
}

.img-small {
  filter: blur(50px);
  transform: scale(1);
}
```

```js
const imgSmall = document.querySelector('.img-small')
const loadImage = (() => {
  const img = new Image()
  img.src = imgSmall.src
  img.addEventListener('load', (e) => {
    imgSmall.classList.add('loaded')
  }, false)
  const imgLarge = new Image()
  
  imgLarge.src = imgSmall.dataset.large
  imgLarge.addEventListener('load', (e) => {
    imgLarge.classList.add('loaded')
  }, false)
  imgSmall.parentNode.appendChild(imgLarge)
})()
```

关于这样做的优点我就不说了，不过这里我觉得还有可以优化的地方，比如一开始加载的缩略图，因为现在就一个页面缩略图是自己弄得，但是
如果真的用到一个完整的网站里面去，这个缩略图肯定不能人工手动去制作，可以利用一些云存储服务提供的功能定制缩略图的大小。
还一个就是，缩略图虽然一般情况下是很小的，但是如果换成 base64 格式是不是速度会更快一点，或者换成 webp 方案的在某些情况下是不是也刚快一点。这些都是可以优化的地方。

上面讲了实现类似 medium 那种图片加载效果，下面再记录下使用 webp 的方案。

webp 方案在一开始做 HTML5 页面优化的时候就考虑了，但是在 iOS 上面的兼容问题一直没有正式用，但是我觉得不能因为 iOS 不支持，就不管安卓用户的体验，而且如果实现
成本不高的话完全可以做的。所以我这就先用个活动试验了一下

关于 webp 的兼容性可以在 caniuse 上看到：

```
WebP image format ✔ 61.31% ◒ 1.31% [Unofficial / Note]
  Image format that supports lossy and lossless compression, as well as animation and alpha transparency. #Other

  IE ✘
  Edge ✘
  Firefox ✘
  Chrome ✘ 4+ ◒ 9+¹ ✔ 23+
  Safari ✘
  Opera ✘ 9+ ◒ 11.1+¹ ✔ 12+

    ¹Partial support in older Chrome, Opera and Android refers to browsers not supporting lossless and alpha versions of WebP.
  ⓘ  Animated WebP images are supported in Chrome 32+ and Opera 19+.
```

因为涉及到兼容性问题，所以主要考虑的问题就是怎么做好 检测方案和切换方案。
关于检测方案，google 官方也提供了方法，我这就直接借鉴过来了，大概逻辑就是 先请求一个 webp 格式的1x1大小图片，在
监听图片 onload 或者 onerror 的时候判断。我们只要把第一次检测结果存起来就可以知道用户的设备支不支持 webp 格式了。
这里我们用 localStorage 来存储用户是否支持 webp 格式的结果，localStorage的兼容性比 webp 好多啦，完全不用担心会存储结果不正确的
问题。下面是基本代码：


```js
// 检查是否支持 webp，并将结果存在 localStorage 里
;(function () {
  if (!window.localStorage || typeof localStorage !== 'object') return
  const name = 'webpsupport'
  if (!localStorage.getItem(name) ||
    (localStorage.getItem(name) !== 'true' &&
      localStorage.getItem(name) !== 'false')) {
    var img = new Image()
    img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA=='
    img.onload = function () {
      localStorage.setItem(name, 'true')
    }
    img.onerror = function () {
      localStorage.setItem(name, 'false')
    }
  }
}())
```
为了避免额外的请求，我们把检测用的图片换成 base64 格式的。检测方案基本搞定了下面就是怎么用了，在支持和不支持之间怎么切换，我还是在上面那个活动页面的代码
基础上修改。


```HTML
<div class="container">
    <div class="img-placeholder"></div>
    <img class="img img-small J-webp" src="/pj_appinvite/public/images/perch.jpg" data-large="/pj_appinvite/public/images/body.jpg" data-largewebp="/pj_appinvite/public/images/body.jpg.webp" alt="">
  </div>
```

```js

  function getWebpSrc(imgsrc,webpimgsrc) {
    var needwebp = false,
        src = ''
    if (window.localStorage && typeof localStorage === 'object') {
      needwebp = localStorage.getItem('webpsupport') === 'true'
    }
    src = needwebp ? webpimgsrc : imgsrc
    return src
  }

  const imgSmall = document.querySelector('.img-small')
  const loadImage = (() => {
    const img = new Image()
    img.src = imgSmall.src
    img.addEventListener('load', (e) => {
      imgSmall.classList.add('loaded')
    }, false)
    const imgLarge = new Image()
    imgLarge.src = getWebpSrc(imgSmall.dataset.large,imgSmall.dataset.largewebp)
  
    imgLarge.addEventListener('load', (e) => {
      imgLarge.classList.add('loaded')
    }, false)
    imgSmall.parentNode.appendChild(imgLarge)
  })()
```

我分别把jpg, webp 格式的图片通过 data 属性存起来，然后通过 getWebpSrc 函数去 localStorage里取该用户设备支不支持
webp，如果支持我们就取 webp 格式的链接，不支持则取 jpg 格式的，一开始我只是把 jpg 格式的图片放在 data 属性里，
然后在 getWebpSrc函数里通过给支持 webp 格式的在 jpg 图片后面添加 .webp 格式后缀即可，但是因为我们的图片上传到又拍云
之后在构建那一层给图片地址加了一串 hash 字符串，导致不能简单添加后缀就可以实现，所以还是选择把两个图片格式的地图都存起来，这样稳一点。

还有一点就是因为我这里是一个页面，没有用到图片懒加载的效果，所以如果在用到懒加载的页面可以把 getWebpSrc 函数加到那个懒加载图片的实现代码里。

最后一点就是现在 webp 格式的图片我都是通过 cwebp 命令在终端生成的，所以这部分还是得我们手工完成，如果有图片云服务商提供
生成 webp 格式的方案就好了。

整个活动页面加上这两个优化点再结合之前做的我感觉已经差不多了