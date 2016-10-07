---
layout: post
title: ES2016 和 ES2017 将加入的一些新特性
datePublished: '2016-10-07 11:21:04'
category: javaScript
---

## 前传
#### 基础知识
ES6作为ECMAScript的最新版本，在ES6发布的近6年后才被正式标准化（2009年12月 vs 2015年6月）。 导致这么长跨度的主要原因有两个：

所有的特性无论先后，都必须等待新的发行版本（release）完全制定完成后才能公布；
有些特性未能完全达成一致，从而造成了整个发行版本的延迟。如果这些特定推迟到下一个发行版本，那么将会耗费更多的时间。
为了避免这种缓慢的发行版本更新策略，从ECMAScript 2016(ES7)开始，版本的发布将会变得更加频繁， 这也意味着未来每个新的发行版本都会包含尽可能少的特性，而发行周期则缩短为1年，并且每年只发行确保一年期限内能够完成的所有特性。 为了向你简要的介绍新的版本发行策略，首先需要介绍的是TC39。

#### 技术委员会39 （Technical Committee 39 - TC39）
TC39（ECMA技术委员为39）是推动JavaScript发展的委员会。 它的成员是都是企业（主要是浏览器厂商）。TC39会定期的开会， 会议的主要成员时是成员公司的代表，以及受邀请的专家。 你可以参考网络上的一个有关TC39会议的会议纪要来了解TC39是如何工作。

在本文中，通常我们用“TC39成员”这个术语来指代一个具体的人，他是由TC39成员公司所委派的会议代表。 有一点值得注意的是，TC39必须达成全员一致的协议：决策只有被所有的成员单位一致同意时才能被做出。

#### TC39的过程
针对ECMAScript特性的每一个提议都需要经历以下几个成熟阶段，从阶段0开始。从一个阶段递交到下一个阶段必须要收到TC39的全员同意。

- Stage 0：strawman 稻草人

在该阶段可以自由的使用任意方式提交推动ECMAScript发展的想法。提议可以来自TC39成员单位，也可以是一个非成员单位， 但需要注册成为了TC39的贡献者。

条件：文档必须要在TC39会议上进行审核，然后将会被添加阶段0的建议页面中。

- Stage 1: proposal 提议

阶段1是对所提交特性的正式建议。

条件：必须要指派具体的人来负责该提议。该负责人或助理负责人必须是TC39的成员。该提议所解决的问题必须通过描述性的文档进行说明。 解决方法必须有例子，API，以及对语义和算法的讨论。最后，存在的潜在问题也必须要得到区分，例如与其他特性之间的关联，以及实现的难度。 Implementation-wise，polyfills和demos也都是必须的。

下一步：对于阶段1的提议的是否接受，TC39表明了其愿意检查、讨论和为提议做出贡献。继续向前，将会是提议的主要变化。

- Stage 2: draft 草案

阶段2是将会出现标准中的第一个版本。此时，将会与出现在标准中的最终特性是差不多的。

条件：此时建议必须要附加更规范化有关特性的语法和语意的说明（使用ECMAScript标准的正式语言）。 描述应该尽可能的完整，但也可以包含待办事项列表和占位符。该特性需要两个实验性的实现， 但其中一个可以在诸如Babel这样的转译器（transpiler）中。

下一步：从该改阶段只接收渐增的变化。

- Stage 3: canidate 候选

此时提议已经接近完成，只需要得到提议实现方的反馈，以及由用户来进一步推动。

条件：标准的文本必须是完备的。指定的审稿人（由TC39指派）和ECMAScript标准的编辑必须在该标准上签字。 必须要至少有两个符合标准的实现（可以不指定默认实现）。

下一步：至此之后，只有对实现和使用过程中出现的重大问题进行修正。

- Stage 4: finished 完成

提议将被包括到标准之中。

条件：在提议进入该阶段时需要满足以下的条件

- Test 262验收测试（主要是用JavaScript代码编写的单元测试来验证语言特性）
- 两个通过测试的符合规范的装运实现（shipping implementations）
- 使用该实现的重要的实践经验
- ECMAScript标准的编辑必须要签署该标准的文本

下一步：该提议会被尽可能快的纳入到ECMAScript标准中。当标准通过长达一年的时间获得通过后，该提议将正式作为标准的其一部分。

#### 不要称它们为ECMAScript 20xx特性
正如你看到的那样，只有到了阶段4，该特性才会被确定加入到标准中。然后会在下一次的ECMAScript发布中出现该提议， 当然也并非是百分百的，也可能需要更长的时间。因此，你不应该称提议为“ES7特性”或者“ES2016特性”等等。我通常喜欢的称法如下：

- ECMAScript建议：某特性。该建议所处的阶段应该在文章的一开始就被说明。
- ES.stage2: 某特性
如果该提议几经进入阶段4，那么我会称他为ES20XX特性，当然最安全的做法是等到标准的编辑已经确认该下一个发布会包含该特性后才行。 例如Object.observe就是ECMAScript提议被进展到阶段2，却又最终被撤回的个例子。

## ES2016
#### 1.乘方运算符

    >6 ** 2
    36

和 Math.pow(6, 2)的结果是一样的

Example:

    let squared = 3 ** 2; // 9
    
    let num = 3;
    num **= 2;
    console.log(num); // 9

#### 2.Array.prototype.includes
Array.prototype.includes() 返回一个 布尔值

用法：
Array.prototype.includes(value : any) : boolean

    > ['a', 'b', 'c'].includes('a')
    true
    > ['a', 'b', 'c'].includes('d')
    false

includes 方法和数组里的 indexOf 有点类似，唯一有点不同的就是 includes()可以查找判断 NaN，indexOf() 方法不支持
   
    > [NaN].includes(NaN)
    true
    > [NaN].indexOf(NaN)
    -1

另外 includes 方法不区分 +0和-0

    > [-0].includes(+0)
    true

## ES2017
#### Object.entries() 和 Object.values()

Object.entries() 返回一个所有元素为键值对的数组，其中键值对来自于给定的对象上面可直接枚举属性的属性名与属性值，这些键值对的顺序以键（属性名）为参考，与手动遍历该对象属性时的一致。
[Object.entries() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

    let obj = { one: 1, two: 2 };
    for (let [k,v] of Object.entries(obj)) {
        console.log(`${JSON.stringify(k)}: ${JSON.stringify(v)}`);
    }
    // Output:
    // "one": 1
    // "two": 2

将Object转化为Map对象

new Map() 构造函数接受一个包含键值对元素的可迭代数组。 借助Object.entries方法你可以很容易的将Object转换为Map:

    var obj = { foo: "bar", baz: 42 }; 
    var map = new Map(Object.entries(obj));
    console.log(map); // Map { foo: "bar", baz: 42 }

Object.values()返回的数组元素的值和单独访问对象属性的值是一样的。数组元素的值在数组的顺序，和使用for-in循环遍历的一样。
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values

    > Object.values({ one: 1, two: 2 })
    [ 1, 2 ]

#### 新的字符串方法 padStart 和 padEnd

ECMAScript 2017 新加了两个字符串的方法 padStart 和 padEnd

    > 'x'.padStart(5, 'ab')
    'ababx'
    > 'x'.padEnd(5, 'ab')
    'xabab'

padStart() 方法会用第二个参数中指定的填充字符串，在当前字符串的头部不断填充，直到它达到第一个参数中指定的目标长度。

*参数*

- targetLength
当前字符串需要填充到的目标长度。如果当前字符串原本就达到了该长度，那么该方法什么都不会做，直接返回原字符串。
- padString 可选
填充字符串。如果在填充过程中发现用不完这一整个填充字符串，则优先用左侧部分，能用多少用多少。该参数为可选参数，默认值为空格 " " (U+0020).

    'abc'.padStart(10);         // "       abc"
    'abc'.padStart(10, "foo");  // "foofoofabc"
    'abc'.padStart(6,"123465"); // "123abc"

一个简单的 panStart 实现

    String.prototype.padStart =
    function (maxLength, fillString=' ') {
        let str = String(this);
        if (str.length >= maxLength) {
            return str;
        }
    
        fillString = String(fillString);
        if (fillString.length === 0) {
            fillString = ' ';
        }
    
        let fillLen = maxLength - str.length;
        let timesToRepeat = Math.ceil(fillLen / fillString.length);
        let truncatedStringFiller = fillString
            .repeat(timesToRepeat)
            .slice(0, fillLen);
        return truncatedStringFiller + str;
    };

padEnd() 方法会用第二个参数中指定的填充字符串，在当前字符串的尾部不断填充，直到它达到第一个参数中指定的目标长度。
参数

- targetLength
当前字符串需要填充到的目标长度。如果当前字符串原本就达到了该长度，那么该方法什么都不会做，直接返回原字符串。
- padString 可选
填充字符串。如果在填充过程中发现用不完这一整个填充字符串，则优先用左侧部分，能用多少用多少。该参数为可选参数，默认值为空格 " " (U+0020).

    'abc'.padEnd(10);         // "abc       "
    'abc'.padEnd(10, "foo");  // "abcfoofoof"
    'abc'.padEnd(6,"123465"); // "abc123"

#### Object.getOwnPropertyDescriptors()

Object.getOwnPropertyDescriptors() 方法用来获取一个对象的所有自身属性的描述符。
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors

    const obj = {
        [Symbol('foo')]: 123,
        get bar() { return 'abc' },
    };
    console.log(Object.getOwnPropertyDescriptors(obj));
    
    // Output:
    // { [Symbol('foo')]:
    //    { value: 123,
    //      writable: true,
    //      enumerable: true,
    //      configurable: true },
    //   bar:
    //    { get: [Function: bar],
    //      set: undefined,
    //      enumerable: true,
    //      configurable: true } }

参考 [Read Exploring ES2016 and ES2017 | Leanpub](https://leanpub.com/exploring-es2016-es2017/read#leanpub-auto-dont-call-them-ecmascript-20xx-features)