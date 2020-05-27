# 第七周总结
## 排版

- 第一代：Normal Flow
    - display: block/inline/inline-block
    - position: relative/absolute
    - float/clear
- 第二代：flex
- 第三代：grid
- 第四代：Houdini

## 渲染 Flex

### 第一步

- 主轴、交叉轴
    - 主轴：Main Axis，元素的排布方向
    - 交叉轴：Cross Axis，与主轴垂直
- 解析 HTML 遇到闭合标签时进行 Layout 逻辑

### 第二步：收集元素进行

- 根据主轴尺寸，把元素分进行
- 若设置了 no-wrap，则强行分配金第一行

### 第三步：计算主轴

- 找出所有 Flex 元素
- 把主轴方向的剩余尺寸按照比例分配给这些元素
- 若剩余空间为负数，所有 Flex 元素为 0，等比压缩剩余元素。

### 第四步：计算交叉轴

- 根据每一行中最大元素的尺寸计算行高
- 根据行高、flex-align、item-align 确定元素具体位置

## 绘制

### 第一步：绘制单个元素

- 安装依赖：images（npm）
- 绘制在一个 viewport 上
- 相关属性：background-color、border、background-image 等

### 第二步：绘制 DOM

- 递归绘制元素
------
## 一、语法研究

- BFC：Block formatting content
- 总体结构
    - @charset
    - @import
    - rules
        - @media
        - @page
        - rule

## 二、研究 @ 规则

> MDN - css - at-rules

- [思维导图](https://www.processon.com/view/link/5ecbe108e401fd268dcfffb1)

## 三、普通规则

- Selector
    - /TR/selector-3/
- Key
    - Properties
    - Variables：/TR/css-variables/
- Value：/TR/css-values-4