---
layout: post
title: 2017年值得学习的JavaScript框架和内容【译】
datePublished: '2016-12-25 11:21:04'
category: JavaScript
---
![Imgur](http://i.imgur.com/XKDi6mZ.jpg)

原文地址：https://medium.com/javascript-scene/top-javascript-frameworks-topics-to-learn-in-2017-700a397b711#.kfsrt6z9a

这是一篇译文，作者列举了在2017年值得投入和学习的 JS 框架和内容，当然有很多在2016年就开始很火了。

推荐的内容很多，如果你有兴趣或者为了找工作需要可以都去学习，但不是每个都是必须要去学习的，不要强迫自己学习一切，像标了* 号的就是可选的，相反没有标记 * 号的都是推荐应该学习的。

### JavaScript & DOM Fundamentals
在你试图使用JavaScript试图找到一份工作之前,你应该有一个好的JavaScrit基础知识:

**ES6**:当前版本的JavaScript是ES2016(又名ES7)，但很多开发人员仍然没有打算去学习 ES6。是时候去学习了。

**内置方法**: 学习标准数据类型的方法(特别是 arrays, objects, strings, 以及 numbers).

**Functions & pure functions**: 或许你觉得自己已经很了解函数了，但是总有些小技巧是你没有接触过的。另外不仅仅是对于基本的函数的用法，我们还要对函数式编程的思想，譬如纯函数高阶函数等有所掌握。

**Closures**: 在学习闭包的过程中了解JavaScript传统的函数作用域。

**Callbacks**: 回调是JavaScript异步编程的基本概念，某个回调函数会在某个异步操作结束后被调用，就好比领导对你说：好好干你的工作，做好了跟我汇报下。

**Promises**: Promise是处理将来值的方法之一，当某个函数返回的是Promise对象时，你可以调用该对象的then函数来获取异步传入的值。而调用者是通过传入的resolve回调来传值，譬如doSomething().then(value => console.log(value));
```
const doSomething = (err) => new Promise((resolve, reject) => {
  if (err) return reject(err);

  setTimeout(() => {
    resolve(42);
  }, 1000);
});

const log = value => console.log(value);

// Using returned promises
doSomething().then(
  // on resolve:
  log, // logs 42
  // on reject (not called this time)
  log
);

// remember to handle errors!
doSomething(new Error('oops'))
  .then(log) // not called this time
.catch(log); // logs 'Error: oops'
```

**Ajax & 服务端API调用**: 绝大部分有趣的应用都需要与服务端通过网络进行交互，你应该了解基本的HTTP Client知识。

**Classes** (note: 避免类继承. 参考 How to Use Classes and Sleep at Night.)

**函数式编程基础**: 函数式编程基于数据函数的组合来构建业务逻辑，避免了共享状态与可变数据，这一点会避免很多的问题。

**Generators & async/await**: 个人观点，最好的异步代码的写法就是用写同步代码的方式去写异步代码。不可否认这些都存在学习曲线，不过磨刀不误砍柴工
**Performance: RAIL** — **参考 “PageSpeed Insights” & “WebPageTest.org”

**Progressive Web Applications (PWAs)**: 参考[ “Native Apps are Doomed”& “Why Native Apps Really Are Doomed”](https://medium.com/javascript-scene/native-apps-are-doomed-ac397148a2c0)

**Node & Express**: Node允许你在服务端运行JavaScript程序，而Express则是目前最为流行的基于NodeJS的Web框架。

**Lodash**: 一个非常好用的、模块清晰的JavaScript辅助工具，其也遵循了很多函数式编程的理念，你可以通过 lodash/fp导入。

### 工具
**Chrome Dev Tools:DOM inspect & JS debugger**: Chrome Dev Tools算是最为优秀的调试工具了，Firefox也有很多不错的扩展。

**npm**: 官方开源的JavaScript包管理工具。

**git & Build software better, togetherGitHub:** 分布式版本管理系统，很适合团队协作。

**Babel**: 能够将ES6代码编译到ES5使之能够兼容老版本浏览器。

**Webpack**: 最著名的模块打包工具之一，Github上有不少优秀的模板配置

**Atom, VSCode, or WebStorm + Vim**: 你需要为自己选择合适的编辑器来辅助你快速开发。Atom与VSCode都是非常优秀的 JavaScript 编辑器，WebStorm也不错但是它是收费版本。如果你打算直接在服务端开发的话，Vim 是个不错的选择。

**ESLint**: ESLint能够帮助开发者更快地发现语法错误与样式问题，在Code Review与TDD之后这是个不错的减少Bug的方法。

**Tern.js**: 基于编辑器插件的标准JavaScript类型推导工具，不需要任何编译步骤或者注解支持。

**Yarn***: 类似于NPM的工具，不过安装起来更为可靠快速。

**TypeScript***: JavaScript的静态类型支持，不过需要特别注意的是，除非你在学习Angular 2，不然我觉得你如果要选用Angular 2的话还是要慎重考虑。我个人很喜欢TypeScript，也很钦佩他们团队的优秀工作，不过任然有很多的权衡，可以参阅 “The Shocking Secret About Static Types” & “You Might Not Need TypeScript”.

**Flow***: JavaScript静态类型检测工具，可以阅读 “TypeScript vs Flow” 来对于这二者有个大概的了解，如果你打算Flow的话也是推荐我的编辑器Nuclide。


### React

React 是个专注于构建用户视图层的JavaScript库，其基于单向数据流的设计思想，也就意味着：

1. React 以Props的形式将参数传入Components，并且在数据发生变化的时候选择性重渲染部分DOM。在重渲染阶段发生的数据变化并不会立刻触发重渲染，而是在下一个绘制阶段的时候才会进行重渲染。
2. 渲染完毕之后，就进入了事件处理，React使用特殊的合成事件帮助开发者监听与响应事件，将所有的节点上的事件交托单一事件监听器处理以获得更好的性能体验。你可以在这些事件的监听函数中通过外部传入的回调重新设置Props或者直接修改内部State。
3. 对于数据的任何变化都会重复步骤1。

这种单向数据流与当时以Angular 1 / Knockout为代表的双向数据绑定形成对比，双向数据绑定中如果发现绑定的数据发生变化则会立刻触发重渲染，而无论当前是否处于渲染流程中，这一点也就导致了Reflows与Repaints的性能表现非常差。

React并没有预置专门的数据管理系统，不过官方推荐基于Flux的解决方案。React 的单向数据流的概念借鉴了很多函数式编程的设计思想，并且对于不可变数据结构的应用也在很大程度上改变了我们对前端框架的认识。如果你希望了解更多关于React与Flux架构的知识，推荐阅读 [“The Best Way to Learn to Code is to Code: Learn App Architecture by Building Apps”](https://medium.com/javascript-scene/the-best-way-to-learn-to-code-is-to-code-learn-app-architecture-by-building-apps-7ec029db6e00)。

- **create-react-app***: 官方出品的快速脚手架搭建工具。
- **react-router***: 方便的React路由解决方案。
- **Next.js***: 非常简单的通用React应用开发框架。
- **velocity-react***: 非常不错的React动画辅助库。

### Redux
Redux 为应用提供了事务式的，确定性的状态管理支持。在Redux中，我们仅可以通过Action来修改当前的应用状态。如果你希望深入了解为啥这么做，可以参阅 “10 Tips for Better Redux Architecture.” 或者跟着 Dan Abramov的官方课程:

[“Getting Started with Redux”](https://egghead.io/courses/getting-started-with-redux)
[“Building React Applications with Idiomatic Redux”](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)

实际上即使你不使用Redux，也很推荐学习 Redux 的设计思想，它可以给你很多关于状态管理的最佳实践，告诉你纯函数的价值所在，以及告诉你何谓Reducers，何谓General-Purpose函数。在Redux的工程实践中，对于异步Action的处理也是值得讨论的：

**redux-saga***: A synchronous-style side-effect library for Redux. Use this to manage I/O (such as handling network requests).

#### Angular 2*
Angular 2 是 Google的当初很流行的 Angular 框架的继承者。鉴于当年疯狂的流行度，学会这个会是你简历上浓墨重彩的一笔，不过我还是推荐先学习React。我个人也认为React 是优于 Angular 2 的 [React over Angular 2 ](https://medium.com/javascript-scene/angular-2-vs-react-the-ultimate-dance-off-60e7dfbc379c)因为:

-它更简单
-社区很强大

###  RxJS*

RxJS 是对JavaScript 一系列响应式编程工具的集合。可以把它当作streams 领域的 Lodash。它把响应式编程正式带入到了JavaScript 。ECMAScript Observables是stage-1阶段的草稿，RxJS 5+则是当前的标准实现。

虽然我个人非常喜欢RxJS，但是如果你想在工程中使用RxJS的话还是需要考虑下，因为其内置了很多的Operators，其会增加你的代码打包体积。为了减小打包体积，可以不用引入全部的模块，可以像下面这样做：
```
import { Observable } from 'rxjs/Observable';
// then patch import only needed operators:
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

const foo = Observable.from([1, 2, 3]);
foo.map(x => x * 2).subscribe(n => console.log(n));
```
使用部分文件引入的方式能够让你依赖rxjs打包后的代码体积减少200k左右。

### 为什么没有列出「你喜欢的框架」？

有不少人问我为啥没有把他们喜欢的框架也列举出来，其中我很重要的一个考虑点就是：这个在真实的工作中会所有帮助吗？

当然，这一点见仁见智，我也是打算从一些所谓的人气投票中一窥变化。首先，我会去Google Trends中查看各个框架关联关键词的被搜索情况: 

![Imgur](http://i.imgur.com/yvEkr8c.png)

另一个很有帮助的网站就是http://Indeed.com，会聚合不同站点上对于不同职位的开发者的需求信息，可以看出目前招聘上对于前端开发者技能需求的情况为: 

![Imgur](http://i.imgur.com/3w5WaSE.png)

除了 jQuery，Angular和 React 依然占据主导地位

你可能会发现 Angular（Angular 1+Angular 2）还是高于React的，不过我个人还是会推荐 React，有如下几个原因吧：

[More people are interested in learning React than Angular](https://medium.com/@sachagreif/the-state-of-javascript-front-end-frameworks-1a2d8a61510)
[React significantly leads Angular in user satisfaction](https://medium.com/@sachagreif/the-state-of-javascript-front-end-frameworks-1a2d8a61510)

### 值得观察的框架(Frameworks to Watch)
#### Vue.js*
Vue在2016年得到了爆发式的发展，在Github 上获取了很多的关注，如果能持续的发展下去，在2017年能发展的更好，但是我不觉得能颠覆React和Angular，如果你已经了学习了 React和angular可以学习下vue
#### MobX*
一个很牛逼的数据管理的库，仅次于 Redux，增长也很快速，在2017年期待能发展的更好。




以上是原文作者对2017年前端技术的推荐，基本上没啥新东西，都是在2016年就很流行的或者获取了很多关注的，有机会我也写下
我对2017年前端技术的推荐。