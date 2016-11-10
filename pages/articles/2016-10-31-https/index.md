---
layout: post
title: HTTPS 就安全了嘛
datePublished: '2016-10-31 23:21:04'
category: react-native
---

大概从去年开始国内的 HTTPS 越来越普及了，现在国内的主流应用基本都配置了 HTTPS。

这不趁着有空赶紧给自己的博客也加上一个 HTTPS ，但是因为我的博客是放在 GithubPage 上的，也就是自己不能折腾服务去配置，在网络上搜了一下发现国外的 CloudFlare 可以免费配置，赶紧去弄了一吧。
按照这篇文章的步奏基本就可以了： [在GitHub Pages上使用CloudFlare https CDN | ChionLab](https://blog.chionlab.moe/2016/01/28/github-pages-with-https/)

虽然配上了 HTTPS，但是 HTTPS 就一定安全了嘛？其实并不一定，而且主要也取决于你的使用方式。

比如很多网站访问输入不带 https 开头的地址都是会先解析到 http 的，然后再对流量升级切换到 https。也就是说用户从输入域名到显示 https 的内容中间会有一次 http 重定向请求的。这个请求就很容易被窃听了，可以使用 sslstrip 工具来实现，并且可以把所有的 HTTPS 重写为 HTTP，这样下来 HTTPS 的加密功能基本就没用了。这个攻击的方法叫做 HTTP 降级攻击

 HTTP 降级攻击还有一种方法就是利用 js 重写 dom 里面的一些链接，把 HTTPS 的链接改写为 http，不过有些网站虽然用了 HTTPS,但是它们里面的一些资源（video,img,link,script）等可能引用的是 http 这也是不安全的，现在谷歌浏览器好像会直接在控制台返回错误提示。

另外一个攻击 HTTPS 的方法就是攻击证书。攻击证书也有两个方法，一个是用一个证书替换另一个证书，另一个就是使用有缺陷的证书验证。

最后一个比较高级一点的攻击手法就是攻击 SSL/TLS 层。安全套接字层和传输层安全是用于安全上网的加密协议的，但是考虑到任何应用都是没有绝对安全的，所以 SSL/TLS 也是存在安全问题的。

以上只是简单的介绍为了说明即使用了 HTTPS 也不一定你的网站应用就安全了，至于具体的一些攻击手法细节，有很多书上有介绍，我日后有机会再补补吧。写完赶紧去双十一剁手了




