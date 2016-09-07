---
layout: post
title: 论如何优雅的在手机端 input 框输入数字
datePublished: '2016-09-06 11:21:04'
category: HTML5
---

# 
现在越来越多的移动 手机上的 web 页面，人们对体验也越来越有追求了，除了性能上的体验，有些交互上的体验也值得注意，比如在手机上常见的input 输入框。
很多的应用里面的输入框，比如输入的内容只能是数字，但是点击输入框的时候可能弹出的并不是数字键盘，所以你还得切换到数字键，虽然只是一个小地方但是也是值得优化的。下面我分别用 iOS和安卓手机大概测试了不同的 input  type 值对应的键盘类型，综合出来可以得出怎样设置input 才能让用户在输入数字的时候感到舒服。

#### 测试
- type= text，很常见的输入类型，个人认为除了一些数字（年龄,价格，电话号码）都可以用 text 作为输入类型类型。

![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/ios1.png)


![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/an1.png)

- type = number 规范里面讲的是 number 输入类型的值适合 floating point number [Data types (common microsyntaxes) - HTML5](https://www.w3.org/TR/html-markup/datatypes.html#common.data.float)

![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/ios2.png)


![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/an2.png)

- type=phone 输入电话号码类型，其实如果你的输入值是纯数字的，没有小数负数啥的，用这个也挺好的，因为安卓和 iOS 都是显示的大的数字键盘

![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/ios3.png)


![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/an3.png)

- type=text && pattern=[0,9]* 这个是text类型加上一个正则验证的，可以看到都有 大的数字键盘。

![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/ios4.png)


![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/an4.png)

- type=number && pattern="[0-9]*"  number输入类型并加上正则验证，两边都有大的数字键盘，但是 iOS 只有纯数字，输入小数还是不方便，而且这个情况下修改正则后 iOS 的大数字键盘就没了，上面 type=text 的情况就不会。

![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/ios5.png)


![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/an5.png)

- type=number && && pattern="[0-9]{2}"  我这里只是换了一个正则，发现 iOS下就没数字大键盘了，不过有小的数字键盘，安卓下面依然是好的

![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/an6.png)


![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/an6.png)

- type=text && inputmode="numeric" text的输入类型加上inputmode，inputmode( [HTML Standard](https://html.spec.whatwg.org/multipage/forms.html#attr-fe-inputmode-state-numeric) )是个新的属性，目的是可以设置键盘显示的内容，但是目前浏览器的支持性不好，基本不能用

![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/ios7.png)


![static/img/typenumber/ios1.png](https://raw.githubusercontent.com/dyygtfx/article/master/static/img/an7.png)

#### 最后
通过上面的测试对比，你可以根据自己的需求，选择适合你的input 设置，如果你需要的是输入电话号码数字，那么用 tel 肯定是最合适的。


附测试代码: 
https://gist.github.com/dyygtfx/9844f6bc72471e4efe005ab43156184b