---
layout: post
datePublished: '2016-08-27'
title: React 最佳实践
category: react
---

React 是目前最火的一个前端技术解决方案，而且我觉得在很长的一段时间内不会被淘汰。下面这些最佳实践很多人肯定也是这样做的，但是也许过段时间就行不通了，只是先记录下来，有空再更新。

### 使用 ES6（用Babel 编译）
ES6 新增了很多很棒的功能，比如 Promise，Generators，箭头函数等等，你甚至可以用 ES7 的 async/await。
#### 使用 Webpack
Webpack 现在是项目构建打包最流行的一个工具了，他的热重载，模块打包技术等都很强大
#### 时刻关注你打包后文件的体积
很多时候我们都说 web pack 打包后的 bundle 文件有点大。在我们引入模块组件的时候需要注意如果只是需要某个文件里某个小功能，可以只引入改功能块，没必要引入整个文件大小。比如：
import Foo from 'foo' 可不可以改成 import Foo from 'foo/Foo'
#### 使用 JSX
很多前端对 JSX 比较反感，但是不知道我为啥没那么讨厌 JSX，尤其是写了段时间 react-native后感觉写 JSX 就很习惯了。而且我觉得 JSX 很灵活也很强大，推荐用 React 系的还是让自己接受JSX 语法，君不见 Vue2 也支持JSX 的写法了。

### 让你的组件尽可能的小
有个规则就是如果你的 render 方法有超过 10 行那么可能是有点大了。React 最重要的思想就是可重用性，所以如果你把所有的代码都写在一个文件里那就体会不到 React 的乐趣了

### 使用 ShouldComponentUpdate
每当组件里的 state 发生了改变，react 都会重新 render 一次。所以每次发生个动作页面基本上都要重新 render 一次。这对性能是有影响的，所以我们要学会使用ShouldComponentUpdate  [Component Specs and Lifecycle | React](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate)

### 使用「聪明」和「愚蠢」的组件
你可能并不需要在每个对象上面都有 state，理想情况下你可以有个「聪明」的父级试图和笨一点的子组件来接收 props，里面可以不用包含任何逻辑。比如：

```js
const DumbComponent = ({props}) => {
    return (<div />)
}
```

### 在 constructor 方法里面绑定函数
在组件里面记住最好在 constructor 方法里绑定组件.

```js
export default class BindFunctionExample extends React.Component {
	constructor() {
		super();
		this.state = {
			hidden: true,
		};
		this.toggleHidden = this.toggleHidden.bind(this);
	}
	
	toggleHidden() {
    		const hidden = !this.state.hidden;
    		this.setState({hidden})
	}
	render(){
		return(
			<button onClick={this.toggleHidden} />
		);
	}
	
}
```

### 使用 Redux/Flux
用 Redux或者 Flux 处理你的数据，不过我个人建议使用 Redux

### 使用 normalizr
https://github.com/paularmstrong/normalizr  在你处理数据的时候，如果后端返回的 JSON 数据结构比较复杂，Normalizr 可以帮你处理复杂的数据结构。

### 文件结构
如果你用 redux 架构，那么比较常用的项目目录结构有两种，一种是：

```
——src
	——actions
	——client.js
	——components
	——containers
	——reducers
	——routes
	——store
	——views
```
另一种是：
```
——src
	——auth
		——actions
		——components
		——reducers
		——views
	——client.js
	——components
	——containers
	——products
		——actions
		——components
		——reducers
		——views
	——routes
	——store
```
以上两种方式个人觉得如果项目功能比较复杂，模块比较多可以考虑第二种目录结构

### 一些有用的函数
下面这个函数是对象比较函数，主要用处是检查 state或 props 在 shouldComponentUpdate 的时候是否发生了改变

```js
export const isObjectEqual = (obj1, obj2) => {
  if(!isObject(obj1) || !isObject(obj2)) {
      return false;
  }

  if (obj1 === obj2) {
      return true;
  }

  const item1Keys = Object.keys(obj1).sort();
  const item2Keys = Object.keys(obj2).sort();

  if (!isArrayEqual(item1Keys, item2Keys)) {
      return false;
  }
  return item2Keys.every(key => {
    const value = obj1[key];
    const nextValue = obj2[key];

    if (value === nextValue) {
        return true;
    }
    return Array.isArray(value) &&
        Array.isArray(nextValue) &&
        isArrayEqual(value, nextValue);
  });
};
```

下面这个函数功能是 动态创建 reducers

```js
export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer
        ? reducer(state, action.payload)
        : state;
  };
}
```
使用：

```js
import {createReducer} from '../../utils';
// Add the following for IE compatability
Object.assign = Object.assign || require('object-assign'); 

const initialState = {
   'count': 0,
   'receiving': false,
   'pages': 0,
   'documents': []
};

export default createReducer(initialState, {
  ['RECEIVED_DOCUMENTS']: (state, payload) => {
    return {
      'count': payload.count,
      'pages': payload.pages,
      'documents': payload.documents,
      'receiving': false
    };
  },
  ['RETRIVING_DOCUMENTS']: (state, payload) => {
    return Object.assign({}, state, {
      'receiving': true
    });
  }
});
```
下面这个是帮助创建 constans 的：

```js
export function createConstants(...constants) {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant;
    return acc;
  }, {});
}
```
动态的改变 state 值：

```js
export default class SetValueExample extends React.Component {
	constructor() {
		super();
		this.state = {
			myName: '',
		};
	}
	setValue(field, event) {
		var object = {};
		object[field] = event.target.value;
		this.setState(object);
	}
	render(){
		return(
			<input value={this.state.myName} onChange={this.setValue.bind(this, 'myName')} />
		);
	}
}
```

