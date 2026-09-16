# Promise 源码学习实现

这是一个基于 JavaScript 手写实现的 Promise 学习项目，重点用于理解 Promise 的状态管理、异步处理、链式调用以及微任务执行机制。

该项目通过自定义 `MyPromise` 类，实现了核心的 Promise 行为，并通过浏览器页面演示调用方式。

## 项目简介

Promise 是 JavaScript 中处理异步编程的重要机制。这个项目通过手写源码的方式，帮助学习者理解以下概念：

- Promise 的三种状态：`pending`、`fulfilled`、`rejected`
- 状态变更与不可逆性
- `.then()` 的链式调用
- 错误捕获与 `.catch()`
- 异步任务的调度与回调执行
- 微任务队列的实现思路

## 项目结构

```text
.
├── 01-promise源码.js      # Promise 核心实现源码
├── 02-pomiseCOPY.js       # 参考或副本版本，便于对照学习
├── 02.html                # 浏览器演示页面
├── README.md               # 项目说明文档
└── .gitignore              # Git 忽略配置（如存在）
```

## 核心特性

- 手写 Promise 状态机
- 支持 `resolve` / `reject`
- 支持链式 `.then()` 调用
- 支持 `.catch()` 方法
- 支持 `Promise.resolve()` 与 `Promise.reject()`
- 支持 `Promise.all()` 与 `Promise.race()` 的基础实现思路
- 支持微任务调度（`queueMicrotask` / `MutationObserver` / `process.nextTick` / `setTimeout`）

## 快速开始

### 1. 直接在浏览器中运行

打开项目中的 `02.html` 文件即可看到示例效果。

```html
<script src="01-promise源码.js"></script>
```

### 2. 示例代码

```javascript
const p = new MyPromise((resolve, reject) => {
  if (Math.random() < 0.5) {
    resolve('成功');
  } else {
    reject('失败');
  }
});

p.then(
  (value) => {
    console.log('成功回调：', value);
  },
  (reason) => {
    console.log('失败回调：', reason);
  }
);
```

## 学习重点

### 1. 状态管理

Promise 的状态在创建后只能从 `pending` 转为 `fulfilled` 或 `rejected`，并且一旦变更，后续状态不能再修改。

### 2. 回调队列

`then()` 方法会将回调函数存入队列，待 Promise 状态确定后再统一执行，这也是 Promise 事件回调的核心机制。

### 3. 链式调用

每次 `.then()` 返回一个新的 Promise，并通过返回值继续链式调度，让异步流程可以依次串联。

### 4. 微任务

Promise 的回调通常放在微任务队列中，不同于 `setTimeout` 的宏任务。因此它更适合处理异步链式逻辑。

## 适用场景

这个项目非常适合用于：

- 学习 JavaScript 异步机制
- 理解 Promise 的内部原理
- 复习事件循环与微任务执行顺序
- 进行源码级别的前端学习与研究

## 说明

本项目用于学习和研究，属于手写版本，不是浏览器原生 Promise 的完整生产级实现。若需要完整的 Promise/A+ 规范支持，还需要继续补充大量边界情况，例如：

- 处理 thenable 递归解析
- 完整的 Promise/A+ 规范细节
- 解决多重回调与循环引用
- 更严谨的错误处理逻辑
- 对 `all`、`race`、`finally` 等方法的完整实现

## 结语

通过这个项目，读者可以从源码角度深入理解 Promise 是如何实现异步回调、状态管理和链式执行的。它是前端学习中非常有价值的实践项目。

如果你正在学习 JavaScript 异步编程，这个仓库是一个很好的入门案例。
