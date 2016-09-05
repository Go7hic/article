---
layout: post
title: 优化 Redux 架构的 10 个技巧
datePublished: '2016-069-04 11:21:04'
category: React
---

在我学习 React 那会 Redux 还没出来，只有官方自带的 Flux 架构和一些 Flux 第三方的各种实现。

不过在经历一轮淘汰之后，现在 React 数据管理只剩两个明显的赢家了，那就是 Redux 和  Mobx，而且 Mobx 还不是 Flux 的实现。
Redux 是如此流行以至于其不仅仅用于React 领域了，还能应用于包括 Angular 2 在内的众多框架中。

> 边注：Mobx 很酷，我会更倾向于在简单的UI项目中使用它，因为它没那么复杂和啰嗦。不过苦逼的是有些 Redux 重要的功能 Mobx 是没法给你的。所以根据你的项目需要什么功能选择合适的架构是很重要的。

> 边注：Relay 与 Falcor 也是很流行的解决状态管理的工具，不过不同于Redux或者MobX，它们对于后端有特定的需求，只能基于GraphQL 或者Falcor Server，并且 Relay 中的状态也与服务端持久化存储的某些数据相匹配。换言之，Relay 与 Falcor 并没有提供了可以独立运行在客户端并且支持暂时态的状态管理功能，不过如果你需要同时维护 Client-Only与Server-Persisted的状态，那么混用Redux与 Relay 也是个不错的选择。总之现在还没有明确的状态管理的最佳架构，根据手边的工作选择合适的就好。

Redux的作者Dan Abramov写了几个不错的教程，譬如 [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux) 与 [Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux) ，这二篇都可以引领你一步一步地熟悉并且掌握Redux基础，而本文则是从工程实践经验的角度来介绍一些高级的技巧让你能够更好地使用Redux。

#### 1.Understand the Benefits of Redux

关于 Redux 有两个重要的概念你需要记住：
- Deterministic View Renders：可预测的视图渲染
- Deterministic State Reproduction：可预测的状态重现

可预测对于保证应用的可测试性与诊断调试以及 Bug 修复非常重要。如果你的应用视图与状态是不可预测的，也就意味着你无法了解到视图与状态是否是有效的，乃至于不可预测性本身就是一个Bug。

不过很多东西本质上就是不可确定的，比如用户何时产生输入操作以及网络I/O的变化等等。而在这种情况下我们又该如何保证代码的工作正常呢？那就要从代码隔离下手了。

Redux最主要的目标就是在界面渲染或者通过网络获取数据时将状态管理从 I/O 这样的副作用隔离开来。在隔离了副作用之后，代码会变得清晰很多，也能更加方便l理解和测试你的独立于界面操作与网络请求的业务逻辑代码。

当你的 View Render 和网络I/O 隔离开来了并且状态更新的时候，你可以获取一个可预测的 View Render，意味着：在有相同的状态输入的情况下永远会获得相同的输出结果。

当一个新手在考虑创建视图的时候，他们可能会认为：这部分需要一 user model，这样我才能在Model中发起异步请求然后通过Promise来根据名字更新User Component。另一块需要TODO Items，在获取完毕之后遍历整个数组然后渲染到屏幕上。不过这种模式会存在以下的缺陷：
- 在任意的时间点你并不会拥有用于渲染整个界面的全部数据，很多时候直到组件开始某些操作之前并不会开始数据抓取过程。
- 不同的数据获取可能会在不同的时间点结束，从而会改变View Render序列的渲染顺序。为了能真实了解渲染的顺序，你必须要知道些无法控制的东西：每个异步请求的完成间隔。就譬如在上述描述的场景中，你并不知道User数据与TODO数据哪个会先被获得，就好像薛定谔的猫，谁也不知道会是什么结果。
- 有时候事件监听器也会修改视图状态，这样也会触发另一轮的渲染，如此递归，从而使得渲染序列变得更加不可知。
直接将数据存储在视图状态中并且允许异步的事件监听器去修改这些视图状态最大的问题在于将数据获取、数据处理与视图渲染混合在一起，就好比做一盘乱麻般的意大利面条：
> Nondeterminism = Parallel Processing + Shared State

Flux框架所做的就是严格的隔离规范与顺序操作保证这样一种可控性：

- 首先，某个时刻我们都有已知并且固定的状态
- 然后，根据该状态进行视图渲染，在视图渲染的过程中并不会受到任何异步监听器的影响，
- 并且保证在相同的状态下会渲染出相同的视图
- Event Listeners负责监听用户输入或者网络请求，在接受到异步的触发之后，会将Actions投递到Dispatcher
- 在某个Action分发之后，状态会根据Action更新到下个已知的状态，仅有通过分发的Action才能修改全局状态

简而概之：flux 是针对 ui 的一个单向数据流的架构
[image:C8225C7F-F4AE-4512-83FD-C5ED5280E72D-332-00003DF20847A099/0A5BB290-3740-40AD-87C2-847662F971DD.png]

在上面的 Flux 架构中，视图负责监听用户输入并且将之转化为Action对象，然后Action对象会被派发(dispatched)到 Store中。
store 会更新应用的状态并且通知视图重新渲染。当然，View并非唯一的输入与事件触发源，不过我们也可以通过设置其他的事件监听器来派发其他的Action对象，如下所示：
[image:6BD48CD2-9C93-4413-B9ED-4A9449043C52-332-00003DF530314FFB/30D76596-B014-4BED-8FEF-13F037FC925A.png]

另外需要注意的是，Flux中的状态更新是事务性的，不同于简单的调用状态更新函数或者直接操作对象值，任何一个 Action 对象都是事务记录。可以把它类比于银行中的交易，当你存入一笔钱到你的账户时，并不会覆盖清除你5分钟之前的交易记录，而会将新的结算信息添加到事务的历史记录中。一个Action对象如下所示：
```
{
  type: ADD_TODO,
  payload: 'Learn Redux'
}
```

Action对象允许我们将所有对于对象的操作全部记录下来，而这些记录可以通过可控的方式进行状态重现，也就是说，在相同的初始状态下只要将相同的事务以相同的顺序进行执行，就能够得到相同的状态结果。总结一下，在这样一种可控的状态管理中，我们能够方便地达成以下目标：

- 易测试性
- 方便地Undo/Redo
- Time Travel Debugging（时间旅行大法）
- 可重现性：即使某个状态已经被清除了，但是只要你保留有事务处理的历史记录，你就可以重现该状态

[image:1C666217-5A90-401C-9EFE-9CADDC636C0B-332-00003DFF0BFAF391/2253454E-0049-4E16-855A-82C8C6B3EDA2.png]

#### 2.Some Apps Don't Need Redux

如果你的 UI 工作流程很简单，用 Redux 就有点大材小用了。比如你打算弄一个剪刀锤子布的小游戏，你觉得你需要 Undo/Redo功能吗？这种游戏每局差不多一分钟左右吧，即使用户把游戏弄崩溃了，也只要简单的重启游戏即可。

当你打算启动一个新项目时，你可以考量以下几点来判断是否需要Redux:
- 用户工作流比较简单
- 用户之间并不会有所协作交互
- 并不需要关心Server Side Events或者WebSockets
- 对于每个 View 而言只需要从单一的数据源抓取数据

这种时候你并不需要花费额外的精力来维持可控的可重现的状态，这时候你就可以尝试使用 MobX。

不过，随着你的应用的功能增加，视图状态复杂度的增加，事务型的状态就有所必要了，而 MobX 并没有提供这种事务型的状态管理。如果：
- 用户工作流比较复杂
- 应用中可能包含很多不同性质的工作流，比如有普通用户与管理员之分
- 用户之间会发生交互
- 使用WebSockets或者SSE
- 对于单个视图也需要从多个 EndPoint 抓取数据
这时候你再引入事务型状态管理模型那就有必要了。Redux 可能就适合你了。

为啥说 WebSockets 与 SSE 状态下建议引入Transactional State呢？随着你不断地增加异步I/O源，你会越来越难以在模糊的状态管理中理解到底会发生啥。在我个人的理解中，大部分的SAAS产品的UI工作流都挺复杂的，那么此时使用类似于Redux这样的事务型状态管理解决方案能够增加应用的健壮性与可扩展性。
#### Understand Reducers
> Redux = Flux + Functional Programming

Flux 规定了单向的数据流规范与基于Action对象的事务型状态管理，不过Flux并没有指明应该如何处理Action对象，这也是Redux独有的特点之一。当我们初学Redux状态管理时，不可避免地会接触到Reducer的概念，那么何谓Reducer函数呢？

在函数式编程中，常见的两个辅助函数 `reducer()` 与 `fold()` 常常被用于将列表中的某个值转化为某个单一的输出值。这里就给出了一个基于Array.prototype.reduce()函数的求和Reducer的例子：
```
const initialState = 0;
const reducer = (state = initialState, data) => state + data;
const total = [0, 1, 2, 3].reduce(reducer);
console.log(total); // 6
```
不同于面向某个数组进行操作，Redux提供的Reducer函数主要是面向Action对象流进行操作，我们上文中有提到Action对象大概是这样的:
```
{
  type: ADD_TODO,
  payload: 'Learn Redux'
}
```

我们可以将上述的求和Reducer转化为如下的Redux风格的Reducer:
```
const defaultState = 0;
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD': return state + action.payload;
    default: return state;
  }
};
```
然后我们就可以使用一系列的Action对象进行测试了:
```
const actions = [
  { type: 'ADD', payload: 0 },
  { type: 'ADD', payload: 1 },
  { type: 'ADD', payload: 2 }
];
const total = actions.reduce(reducer, 0); // 3
```

#### 4.Reducers Must be Pure Functions (Reducer一定要是纯函数)
为了能保证可控的状态重现，Reducers必须保证为纯函数，即毫无副作用。所谓纯函数，会有如下特性：

- 相同的输入会有相同的输出
- 没有任何的副作用

需要注意的是，在JavaScript中，所有的传入函数中的非原始类型都会以引用形式传递，换言之，如果你传入了某个Object对象，然后在函数中直接改变了其属性值，那么函数外的该Object对象属性值也会发生变化。这也就是所谓的副作用，如果你不知道某个传入函数中的对象的全部操作记录你也就无法知道该函数的真实返回值。这也就导致了整个函数的不可控性与不确定性。

Reducers应该返回某个新的Object对象，譬如使用Object.assign({}, state, { thingToChange })来修改并且获得某个对象值。

而对于所有的Array参数，它们同样是引用类型传入的，你不能直接使用push()、pop()、.shift()、unshift()、reverse()、splice()或者类似的操作来修改传入的数组。我们应该使用concat()函数来代替push()进行操作，譬如我们需要添加某个Reducer来处理ADD_CHAT事件:
```
const ADD_CHAT = 'CHAT::ADD_CHAT';
const defaultState = {
  chatLog: [],
  currentChat: {
    id: 0,
    msg: '',
    user: 'Anonymous',
    timeStamp: 1472322852680
  }
};

const chatReducer = (state = defaultState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_CHAT:
      return Object.assign({}, state, {
        chatLog: state.chatLog.concat(payload)
      });
    default: return state;
  }
};
```
如你所见，我们可以使用 `Object.assign()` 或者 Array 中的 `concat()` 函数来创建新的对象。如果你希望在JavaScript中如何使用纯函数，那么可以参考master-the-javascript-interview-what-is-a-pure-function这篇文章。

#### 5.Reducer Must be the Single Source of Truth

何谓Single Source of Truth？即应用中的所有状态都存放在单一的存储中，任何需要访问状态的地方都需要通过该存储的引用进行访问。当然，对于不同的业务逻辑/不同的事物可以设置不同的状态源，譬如URL可以认为是用户输入与请求参数的Single Source of Truth。而应用中存在某个Configuration Service用于存放所有的API URLs信息。而如果你选用Redux作为状态管理框架，任何对于状态的访问操作都必须通过Redux。换言之，如果你没有使用单一的状态存储源，你可能会失去如下的特性：

- 可预测的视图渲染
- 可预测的状态重现
- 方便的Undo/Redo
- Time Travel Debugging
- 易测性

#### 6.Use Constants for Action Types

我们希望Action历史记录中的Action易于追踪易于理解，如果所有的Action都是设置了较短的、通用性的譬如CHANGE_MESSAGE这样的名字，也就会难以理解APP中到底发生了啥。而如果Action类型能有更具说明性的命名，譬如:CHAT::CHANGE_MESSAGE，可以让我们在调试的时候更方便地去理解到底发生了啥。因此，我们建议将所有在Reducer中用到的Action声明归结到一个文件中（文中建议是放置到Reducer文件的首部），并且在文件头部显式声明该类型，这会有助于你：
- 保证命名的一致性
- 快速理解Reducer API功能
- 发现Pull Request中所做的修改

#### 7.Use Action Creators to Decouple Action Logic from Dispatch Callers(使用Action Creators来将Action逻辑与Dispatch调用解耦合)

有时候，当我跟别人说你并不能在Reducer中进行类似于ID生成或者获取当前时间等操作时，很多人以一种关怀智障的表情看着我。不过平心而论，最合适的来处理有副作用的逻辑而不是在每次需要构建该Action的时候就写一遍代码的地方当属Action Creator。Action Creator的优点可列举如下：

- 不需要在很多地方导入声明在Reducer文件中的Action类型常量
- 在实际的分发Action之前可以进行些简单的计算或者输入转换
- 减少模板代码的数量

这里我们尝试使用Action Creator来创建ADD_CHATAction对象：
````
// Action creators can be impure.
export const addChat = ({
  // cuid is safer than random uuids/v4 GUIDs
  // see usecuid.org
  id = cuid(),
  msg = '',
  user = 'Anonymous',
  timeStamp = Date.now()
} = {}) => ({
  type: ADD_CHAT,
  payload: { id, msg, user, timeStamp }
});
```
这里我们使用cuid来为每条聊天记录构建标识，使用Date.now()来生成时间戳。这些带有副作用的操作是绝对不能运行在Reducer中的，否则就会破坏Reducer的事务型状态管理的特性。

##### Reduce Boilerplate with Action Creators
有些人可能会认为使用Action Creator会增加项目中的代码的数量，不过作者认为恰恰相反的是，通过引入Action Creator可以方便地减少Reducer中的代码的数量。

譬如我们需要添加两个功能，允许用户自定义它们的用户名与在线状态，那么我们可能需要添加两个Action Type到Reducer中：
```
const chatReducer = (state = defaultState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_CHAT:
      return Object.assign({}, state, {
        chatLog: state.chatLog.concat(payload)
      });
    case CHANGE_STATUS:
      return Object.assign({}, state, {
        statusMessage: payload
      });
    case CHANGE_USERNAME:
      return Object.assign({}, state, {
        userName: payload
      });
    default: return state;
  }
};
```

对于一个需要处理复杂逻辑的Reducer，这些细微的功能需求可能使其迅速变得庞杂。而作者在日常的工作中会构建很多比这个更加复杂的Reducer，里面充斥着大量重复冗余的代码。而我们又该如何简化这些代码呢？我们可以尝试将所有对于简单状态的改变合并到单个Action中完成：
```
const chatReducer = (state = defaultState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_CHAT:
      return Object.assign({}, state, {
        chatLog: state.chatLog.concat(payload)
      });

    // Catch all simple changes
    case CHANGE_STATUS:
    case CHANGE_USERNAME:
      return Object.assign({}, state, payload);

    default: return state;
  }
};
```
尽管我们需要添加额外的注释，这种样子实现也会比原来两个单独的Case处理要减少很多的代码。

另外我们会关注到在Reducer文件中经常出现的关键字：switch，可能你在其他文章中有看到过，应该避免使用switch语句，特别是需要避免对于落空状态的依赖与处理，否则会让整个Case的处理变得异常肿胀。不过作者认为：
- Reducers的一个重要特性就是可组合性，因此我们完全可以通过组合Reducer来避免过于肿胀的Case处理出现。当你觉得某个Case列表太长的时候，将其切分到不同的Reducer中即可。
- 保证每个Case处理的最后都添加一个返回语句，这样就不会陷入未命中的情况了。
最后，与上面Reducer相匹配的Action Creator，应该遵循如下写法：
```
export const changeStatus = (statusMessage = 'Online') => ({
  type: CHANGE_STATUS,
  payload: { statusMessage }
});

export const changeUserName = (userName = 'Anonymous') => ({
  type: CHANGE_USERNAME,
  payload: { userName }
});
```
如代码所示，Action Creator不再仅仅单纯地构造出某个Action对象，还将传入的参数转化为了Reducer中所需要的形式，从而简化了Reducer中的代码。

#### 8.Use ES6 Parameter Defaults for Signature Documentation

如果你使用例如 Sublime Text 或者 Atom 这样流行的编辑器，它会自动地读取 ES6 的默认解构值并且帮你在调用某个 Action Creator 时推导出必须的参数有哪些，这样你就能方便地使用智能提示与自动完成功能了。这一特性能够简化开发者额外的认知压力，他们不用再烦恼于因为总是记不住Payload的形式而不得不经常翻阅源代码了。所以这里推荐你可以使用类似于Tern、TypeScript或者Flow这样的类型推导插件或者强类型语言。不过笔者是更推荐使用ES6在解构赋值中提供的默认解构值的特性作为函数签名，而不是使用类型注解，原因如下：

- 这样就可以只学习标准的JavaScript而不需要再去学习Flow或者TypeScript这样的JavaScript超集
* 
- 越少的语法能保证越好的可读性
- 使用默认值有助于在CI时避免类型错误，也能在运行时避免触发大量的undefined参数赋值
* 
#### 9.使用Selectors来进行状态统计与解耦合
假如你已经构建好了一个数万行代码的复杂的聊天APP应用，然后该死的产品经理跟你说需要添加一个新的需求进去，而不得不要修改你现有的状态树中的数据结构。不方，这里介绍的Selector即是一种有效地将状态树的结构与应用的其他部分解耦和的工具。


[image:AAC38E03-CA99-475D-897B-2FC3652C4FF9-339-000001C757CED51C/2BB47F24-88D1-4DCC-A571-A8FE59FC2C1D.png]

基本上对于我写的每个Reducer，我都会创建一个对应的Selector来将所有需要用于构建View的变量导出，对于简单的Chat Reducer，可能要如下所写：
```
export const getViewState = state => Object.assign({}, state, {
  // return a list of users active during this session
  recentlyActiveUsers: [...new Set(state.chatLog.map(chat => chat.user))]
});
```
如果你将需要对状态所做的简单的计算放置到Selector中，你可以得到如下的遍历：

遵循了职责分割的原则，减少了Reducer与Components的复杂度
将应用的其他部分与状态结构解耦和

#### 10. Use TDD: Write Tests First(使用TDD，优先编写测试用例)
很多的研究都有专门对比过Test-First、Test-After以及No-Test这三个不同的开发模式，结果都表明的：大部分研究都表明在开发之前先编写测试用例能够减少40-80% Bug出现的比率。即使在编写本文中所有的例子之前，我都会先写好对应的测试用例。

为了避免过于简单的测试用例，我编写了如下的工厂方法来产生预测值：
```
const createChat = ({
  id = 0,
  msg = '',
  user = 'Anonymous',
  timeStamp = 1472322852680
} = {}) => ({
  id, msg, user, timeStamp
});

const createState = ({
  userName = 'Anonymous',
  chatLog = [],
  statusMessage = 'Online',
  currentChat = createChat()
} = {}) => ({
  userName, chatLog, statusMessage, currentChat
});
```
注意这两个私有的默认值，意味着我可以创建任何我感兴趣的测试数据来覆盖单独的属性。

下面是我使用的例子：
```js
describe('chatReducer()', ({ test }) => {
  test('with no arguments', ({ same, end }) => {
    const msg = 'should return correct default state';

    const actual = reducer();
    const expected = createState();

    same(actual, expected, msg);
    end();
  });
});
```

这里我是使用Tape作为默认的TestRunner，之前我也有2~3年的时间在使用Mocha与Jasmine，还有很多其他的框架。

你应该能够注意到我倾向于使用嵌套的测试用例编写方式，可能是受之前使用Mocha与Jasmine较多的影响，我习惯先在外层声明某个测试组件，然后在内层声明组件的传入参数。这里我分别给出对于Action Creator、Selector的测试用例。

你已经看了一个reducer 的测试了，让我们再看一下其他例子。

#### Action Creator Tests

```
describe('addChat()', ({ test }) => {
  test('with no arguments', ({ same, end}) => {
    const msg = 'should add default chat message';

    const actual = pipe(
      () => reducer(undefined, addChat()),
      // make sure the id and timestamp are there,
      // but we don't care about the values
      state => {
        const chat = state.chatLog[0];
        chat.id = !!chat.id;
        chat.timeStamp = !!chat.timeStamp;
        return state;
      }
    )();

    const expected = Object.assign(createState(), {
      chatLog: [{
        id: true,
        user: 'Anonymous',
        msg: '',
        timeStamp: true
      }]
    });

    same(actual, expected, msg);
    end();
  });


  test('with all arguments', ({ same, end}) => {
    const msg = 'should add correct chat message';

    const actual = reducer(undefined, addChat({
      id: 1,
      user: '@JS_Cheerleader',
      msg: 'Yay!',
      timeStamp: 1472322852682
    }));
    const expected = Object.assign(createState(), {
      chatLog: [{
        id: 1,
        user: '@JS_Cheerleader',
        msg: 'Yay!',
        timeStamp: 1472322852682
      }]
    });

    same(actual, expected, msg);
    end();
  });
});
```

这个例子有个很有趣的地方在于，`addChat()`  Action Creator 本身非纯函数。也就是说除非你传入特定的值进行覆盖，否则你并不能预测它到底会生成怎样的属性。因此在这里我们使用了pipe函数，将那些我们不关注的变量值忽略掉。我们只会关心这些值是否存在，但是并不会关心这些值到底如何。对于pipe函数的详细用法可以如下所示:

A pipe is a functional utility that lets you shuttle some input value through a series of functions which each take the output of the previous function and transform it in some way. I use lodash pipe from `lodash/fp/pipe`, which is an alias for `lodash/flow`. Interestingly, `pipe()` itself can be created with a reducer function:

```
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const fn1 = s => s.toLowerCase();
const fn2 = s => s.split('').reverse().join('');
const fn3 = s => s + '!'

const newFunc = pipe(fn1, fn2, fn3);
const result = newFunc('Time'); // emit!
```
我倾向于用许多 `pipe()` 在 reducer文件里面让状态转换更简单。所有的状态转换无非是数据流的移动，从一个数据表示到下一个。那也是 `pipe()`擅长的。

注意 action creator 允许我们覆盖所有的默认值，所以我们可以通过特定的id和时间戳和测试特定的值。

#### Selector Tests
最后，我们测试这个状态选择器并确定这个计算值是正确的：
```
describe('getViewState', ({ test }) => {
  test('with chats', ({ same, end }) => {
    const msg = 'should return the state needed to render';
    const chats = [
      createChat({
        id: 2,
        user: 'Bender',
        msg: 'Does Barry Manilow know you raid his wardrobe?',
        timeStamp: 451671300000
      }),
      createChat({
        id: 2,
        user: 'Andrew',
        msg: `Hey let's watch the mouth, huh?`,
        timeStamp: 451671480000 }),
      createChat({
        id: 1,
        user: 'Brian',
        msg: `We accept the fact that we had to sacrifice a whole Saturday in
              detention for whatever it was that we did wrong.`,
        timeStamp: 451692000000
      })
    ];

    const state = chats.map(addChat).reduce(reducer, reducer());

    const actual = getViewState(state);
    const expected = Object.assign(createState(), {
      chatLog: chats,
      recentlyActiveUsers: ['Bender', 'Andrew', 'Brian']
    });

    same(actual, expected, msg);
    end();
  });
});
```-
注意在这个测试里，我们用了 `Array.prototype.reduce()`  去减少 `addChat()` actions。Redux reducers 最牛逼的一个地方就是它和普通的 reducers 函数一样，意味着你可以做任何 其他 reducers 函数做的事。

别的也不太多说

#### Redux Rules

如果你用 redux 的姿势正确，你将会获得巨大的好处：
- 消除时间依赖的bug
* 可预测的试图渲染
* 可预测的状态复制
* Enable easy undo/redo features
* 调试简单
* 拥有时间旅行功能

但是在拥有上面这些功能之前，你需要记住下面这些规则：

- Reducer 一定得是纯函数
* Reducers 的状态一定要是单一来源
* Reducer 状态应该总是可序列化的
* Reducer 状态不应该包含功能
同时也要记住：
- 有的App是没必要用 Redux 的
* actions types 要用常量
* 给 ES6 的参数设置默认值
* 使用 selectors 计算和分离状态
* 使用 TDD

