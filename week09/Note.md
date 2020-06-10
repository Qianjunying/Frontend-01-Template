# 第九周总结
## 抽奖代码

    ```js
    let list = `user1
    user2
    user3
    user4
    user5
    user6
    user7
    user8
    user9
    user10
    user11
    user12
    user13
    user14
    user15
    user16
    user17
    user18
    user19
    user20
    user21
    user22`.split('\n');

    let winners = [];

    for (let i = 0; i < 10; i++) {
        let rdm = Math.floor(Math.random() * list.length);
        winners.push(list[rdm]);
        list[rdm] = list[list.length - 1];
        list.pop();
    }
    console.log(winners);
    ```

- Math.random() 伪随机？

## Animation

- 定义 @keyframes
- Animation 属性
    - animation-name
    - animation-duration
    - animation-timing-function
    - animation-delay
    - animation-iteration-count
    - animation-direction

## Transition

- 属性
    - transition-property
    - transition-duration
    - transition-timing-function
    - transition-delay
- cubic-bezier.com

### 贝塞尔曲线拟合抛物线

## 颜色

- CMYK 和 RGB
- HSL 和 HSV

## 形状

- border
- box-shadow
- border-radius
- data uri + svg
- data:image/svg+xml,<svg></svg>

## XML 与 SGML

- DTD

## 标签语义

## DOM

### node

- Element
    - HTMLElement
    - SVGElement
- Document
- CharacterData
    - Text
    - Comment
    - ProcessingInstruction
- DocumentFragment
- DocumentType

### DOM 操作

#### 导航类

- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling

#### 修改类

- appendChild
- insertChild
- removeChild
- replaceChild

#### 高级操作

- compareDocumentPosition
- contains
- isEqualNode
- isSameNode
- cloneNode
