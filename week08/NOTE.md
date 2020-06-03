# 第八周总结
## 选择器语法

- 简单选择器
    - `*`
    - `div`、`svg | a`
    - `.class`
    - `#id`
    - `[attr=value]`
    - `:hover`
    - `::before`
- 复合选择器：
    - 多个简单选择器无缝结合在一起
    - `*`、标签必须写在最前面
- 复杂选择器：把多个选择器用符号连接
    - `空格`
    - `>`
    - `~`
    - `+`
    - `||`

## 选择器优先级

- 四元组计算法：[行内，id，class/attr，标签]

## 伪类

- 链接/行为
    - `:any-link`
    - `:link :visited`
    - `:hover`
    - `:active`
    - `:focus`
    - `:target`
- 树结构
    - `:empty`
    - `:nth-child()`
    - `:nth-last-child()`
    - `:first-child`、`:last-child`、`:only-child`
- 逻辑型
    - `:not`
    - `:where`、`:has`

## 伪元素

- `::before`
- `::after`
- `::firstLine`
- `::firstLetter`

## 盒模型

- DOM 树中存储的是元素和其他类型的节点
- CSS 选择器选中的元素，在排版时可能产生多个盒
    - inline 元素分行时
    - 一个元素带着两个伪元素
- 排版和渲染的基本单位时盒
- box-sizing
    - content-box
    - border-box

## 正常流

- 把所有的文字和盒子收进行里
- 计算盒子在行中的排布
- 计算行的排布
- Inline Formatting Context 和 Block Formatting Context

### 行模型

- 如果一个 line-box 没有任何内容，那么它的基线位于 line-box 的底部