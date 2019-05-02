---
layout: post
title: 优雅的 React 高阶组件【译】
datePublished: '2017-04-12'
category: React
---

这篇文章的另一个标题也可以是：在 React 中学习带有条件渲染的高阶组件。

### 增长的 React 组件
我们将从React中的一个问题开始，在这个问题中可以使用更高阶的组件作为解决方案。假设我们的应用程序有一个 `TodoList` 组件:
```js
function App(props) {
  return (
    <TodoList todos={props.todos} />
  );
}

function TodoList({ todos }) {
  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```
在我们实际应用场景中并没这么简单，还有其他边缘场景需要考虑，
比如 todos 为 null 的情况，这时候你得修改渲染条件了：
```js
function TodoList({ todos }) {
  if (!todos) {
    return null;
  }

  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```

还有一个情况就是 todos 为空的时候，你也要额外处理一下渲染条件：

```js
function TodoList({ todos }) {
  if (!todos) {
    return null;
  }

  if (!todos.length) {
    return (
      <div>
        <p>You have no Todos.</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```

最后，如果 tods 是异步获取的数据，再请求结束前需要显示 loading 怎么办？这时候又要修改一下了：
```js
function TodoList({ todos, isLoadingTodos }) {
  if (isLoadingTodos) {
    return (
      <div>
        <p>Loading todos ...</p>
      </div>
    );
  }

  if (!todos) {
    return null;
  }

  if (!todos.length) {
    return (
      <div>
        <p>You have no Todos.</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```

 还有一些其他场景就不考虑了，毕竟上面就开始显得复杂了，不过用高阶组件可以解决这种问题。

 ### 开始进入 React 高阶组件
 高阶组件通常将组件和可选参数作为输入并返回输入组件的增强组件。在我们的例子中，目标将是屏蔽TodoList组件中的所有条件渲染边缘case。

 让我们首先从TodoList中删除todos为 null 的 case。

 ```js
 function TodoList({ todos, isLoadingTodos }) {
  if (isLoadingTodos) {
    return (
      <div>
        <p>Loading todos ...</p>
      </div>
    );
  }

  // Removed conditional rendering with null check

  if (!todos.length) {
    return (
      <div>
        <p>You have no Todos.</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```

现在让我们在React中实现我们的第一个高阶组件。高阶组件一般以 with 前缀命名，但它不是强制性的。只是为了和普通 React 组件更容易区分

```js
function withTodosNull(Component) {
  return function (props) {
    return !props.todos
      ? null
      : <Component { ...props } />
  }
}
```
这是一个三元操作符,高阶组件根据 props 来决定是渲染 null 还是组件本身。所有的 props 都向下传递.

改成 ES6 的箭头函数更好看一点:

```js
const withTodosNull = (Component) => (props) =>
  !props.todos
    ? null
    : <Component { ...props } />
```

最终的高阶函数完成了 让我们使用它：

```js
const withTodosNull = (Component) => (props) =>
  ...

function TodoList({ todos }) {
  ...
}

const TodoListWithNull = withTodosNull(TodoList);

function App(props) {
  return (
    <TodoListWithNull todos={props.todos} />
  );
}
```

正如你所看到的，你可以在需要的时候使用它。高阶组件是可重用的。

但是TodoList组件中还有更多的条件渲染。让我们快速实现两个高阶组件，这些组件分别显示 loading和 todos 为空的情况：

```js
const withTodosEmpty = (Component) => (props) =>
  !props.todos.length
    ? <div><p>You have no Todos.</p></div>
    : <Component { ...props } />

const withLoadingIndicator = (Component) => (props) =>
  props.isLoadingTodos
    ? <div><p>Loading todos ...</p></div>
    : <Component { ...props } />
```
不过上面还有一个问题 就是 withLoadingIndicator 把所有的 props 都传给输入组件了，即时显示loading 的时候，我们可以用 es6 的解构来把 props分开：

```js
const withLoadingIndicator = (Component) => ({ isLoadingTodos, ...others }) =>
  isLoadingTodos
    ? <div><p>Loading todos ...</p></div>
    : <Component { ...others } />
```
现在 isLoadingTodos 从 props 里面剥离了出来，只会在高阶组件中用到，其他的属性都传给输入组件。

下面我们使用所有的高级组件在 TodoList 里：

```js
onst withTodosNull = (Component) => (props) =>
  ...

const withTodosEmpty = (Component) => (props) =>
  ...

const withLoadingIndicator = (Component) => ({ isLoadingTodos, ...others }) =>
  ...

function TodoList({ todos }) {
  ...
}

const TodoListOne = withTodosEmpty(TodoList);
const TodoListTwo = withTodosNull(TodoListOne);
const TodoListThree = withLoadingIndicator(TodoListTwo);

function App(props) {
  return (
    <TodoListThree
      todos={props.todos}
      isLoadingTodos={props.isLoadingTodos}
    />
  );
}
```

让我们看下 TodoList 里面还有什么内容：
```js

function TodoList({ todos, isLoadingTodos }) {
  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```
是不是很酷，我们把所有 的条件渲染都屏蔽了，只剩下渲染 todos 的内容。虽然这篇文章教导 HOC 利用条件渲染。但是你也可以用 HOC处理其他问题。

上面还有个小问题，就是把所有的组件都手动包一层有点烦:

```js
const TodoListOne = withTodosEmpty(TodoList);
const TodoListTwo = withTodosNull(TodoListOne);
const TodoListThree = withLoadingIndicator(TodoListTwo);
```
我们可以重构下：

```js
const TodoListWithConditionalRendering = withLoadingIndicator(withTodosNull(withTodosEmpty(TodoList)));
```

虽然看起来简单了，但是可读性还是不行，我们可以根据 React 函数式的特性来优化一下。

### 使用 Recompose 

上面代码用 Recompose 优化一下：

```js
import { compose } from 'recompose';

...

const withConditionalRenderings = compose(
  withLoadingIndicator,
  withTodosNull,
  withTodosEmpty
);
```

现在，可以使用该函数将需要成为增强组件的输入组件与所有条件渲染一起传递.

```js
const TodoListWithConditionalRendering = withConditionalRenderings(TodoList);
```

这很方便，不是吗？您可以使用 compose 将您的输入组件传递给所有更高阶的组件功能。输入组件获取每个函数中组件的增强版本.

```js
import { compose } from 'recompose';

const withTodosNull = (Component) => (props) =>
  ...

const withTodosEmpty = (Component) => (props) =>
  ...

const withLoadingIndicator = (Component) => ({ isLoadingTodos, ...others }) =>
  ...

function TodoList({ todos }) {
  ...
}

const withConditionalRenderings = compose(
  withLoadingIndicator,
  withTodosNull,
  withTodosEmpty
);

const TodoListWithConditionalRendering = withConditionalRenderings(TodoList);

function App(props) {
  return (
    <TodoListWithConditionalRendering
      todos={props.todos}
      isLoadingTodos={props.isLoadingTodos}
    />
  );
}
```

现在您可以使用该函数在您的输入组件中传递，该组件需要通过所有有条件的呈现来成为增强的组件。

### 重用抽象的高阶组件

面的组件适应于特定的渲染, 不能用在其他地方. 考虑到长期的使用,应该抽象出来,以便于其他的组价也可以使用

在 withTodoNull 中添加一个 optional 负载,这个负载是一个函数,负责返回 true 或者 false, 用于决定最终的渲染结果:
```js
const withTodosNull = (Component, conditionalRenderingFn) => (props) =>
  conditionalRenderingFn(props)
    ? null
    : <Component { ...props } />
```

现在这个函数的名字就有点误导了, 改为:
```js
const withCondition = (Component, conditionalRenderingFn) => (props) =>
  conditionalRenderingFn(props)
    ? null
    : <Component { ...props } />
```
现在就可以用这个抽象的条件判断组件来实现具体的逻辑
```js
const withCondition = (Component, conditionalRenderingFn) => (props) =>
  conditionalRenderingFn(props)
    ? null
    : <Component { ...props } />

const conditionFn = (props) => !props.todos;

const TodoListWithCondition = withCondition(TodoList, conditionFn);
```

为了利于实现柯理化, 把负载的函数也分开传递:

```js
const withCondition = (conditionalRenderingFn) => (Component) => (props) =>
    conditionalRenderingFn(props)
        ? null
        : <Component { ...props } />
```

在使用时传递条件函数就可以了:
```js
import { compose } from 'recompose';

...

const conditionFn = (props) => !props.todos;

const withConditionalRenderings = compose(
    withLoadingIndicator,
    withCondition(conditionFn),
    withTodosEmpty
);

const TodoListWithConditionalRendering = withConditionalRenderings(TodoList);
```

### Maybe 和 Either 高阶组件

您可以使用函数式编程（FP）的命名约定和原则来正确命名抽象的高阶组件。熟悉FP的开发人员将通过查看其名称来了解HOC的用例。

我们来看看withCondition高阶组件:
```js
const withCondition = (conditionalRenderingFn) => (Component) => (props) =>
  conditionalRenderingFn(props)
    ? null
    : <Component { ...props } />
```

该组件不返回任何内容或输入组件。在函数式编程中，这种类型，没有任何东西或值，被称为Maybe（或Option）。道这个之后，你可以重命名这个高阶组件为withMaybe。
```js
const withMaybe = (conditionalRenderingFn) => (Component) => (props) =>
  conditionalRenderingFn(props)
    ? null
    : <Component { ...props } />
```
两个组件返回其一的在函数式编程中称为 Either。
```js
const withEither = (conditionalRenderingFn, EitherComponent) => (Component) => (props) =>
  conditionalRenderingFn(props)
    ? <EitherComponent />
    : <Component { ...props } />
```

现在，您可以通过传递条件函数和EitherComponent在应用程序中使用它:

```js
import { compose } from 'recompose';

...

const EmptyMessage = () =>
  <div>
    <p>You have no Todos.</p>
  </div>

const LoadingIndicator = () =>
  <div>
    <p>Loading todos ...</p>
  </div>

const isLoadingConditionFn = (props) => props.isLoadingTodos;
const nullConditionFn = (props) => !props.todos;
const isEmptyConditionFn = (props) => !props.todos.length

const withConditionalRenderings = compose(
  withEither(isLoadingConditionFn, LoadingIndicator),
  withMaybe(nullConditionFn),
  withEither(isEmptyConditionFn, EmptyMessage)
);

const TodoListWithConditionalRendering = withConditionalRenderings(TodoList);
```
现在每个高阶组件都会接收除输入组件之外的payload。payload 用于另一个高阶函数，以保持高阶组件可用 compose 组合。

下面就是最终版本：
```js
import { compose } from 'recompose';

const withMaybe = (conditionalRenderingFn) => (Component) => (props) =>
  conditionalRenderingFn(props)
    ? null
    : <Component { ...props } />

const withEither = (conditionalRenderingFn, EitherComponent) => (Component) => (props) =>
  conditionalRenderingFn(props)
    ? <EitherComponent />
    : <Component { ...props } />

const EmptyMessage = () =>
  <div>
    <p>You have no Todos.</p>
  </div>

const LoadingIndicator = () =>
  <div>
    <p>Loading todos ...</p>
  </div>

const isLoadingConditionFn = (props) => props.isLoadingTodos;
const nullConditionFn = (props) => !props.todos;
const isEmptyConditionFn = (props) => !props.todos.length

const withConditionalRenderings = compose(
  withEither(isLoadingConditionFn, LoadingIndicator),
  withMaybe(nullConditionFn),
  withEither(isEmptyConditionFn, EmptyMessage)
);

const TodoListWithConditionalRendering = withConditionalRenderings(TodoList);

function App(props) {
  return (
    <TodoListWithConditionalRendering
      todos={props.todos}
      isLoadingTodos={props.isLoadingTodos}
    />
  );
}

function TodoList({ todos }) {
  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```

原文地址：https://www.robinwieruch.de/gentle-introduction-higher-order-components/?utm_source=mybridge&utm_medium=blog&utm_campaign=read_more