# Range API
- 如何把一个元素的子元素逆序？

    ```jsx
    let ul = document.getElementById('ul');
    let len = ul.childNodes.length - 1;
    while (len > 0) {
        ul.appendChild(ul.childNodes[len]);
        len--;
    }
    // -------------------
    //documentFragment?

    // -----------------

    ```

- DOM 树中的一段

```jsx
var range = new Range();
range.setStart(ele, 9);
range.setEnd(ele, 4);
// 或
var range = document.getSelection().getRangeAt(0);
```

- 辅助 API
    - `setStartBefore`
    - `setEndBefore`
    - `setStartAfter`
    - `setEndAfter`
    - `selectNode`
    - `selectNodeContents`
- 能力
    - `range.extractContents()`
    - `range.insertNode()`
- 场景
    - 大量结点
    - 精准操作

# CSSOM

- `documen.styleSheets`
- 加 styleSheets 的两种方式
    - style 标签
    - link 标签
        - 还可以这样：<link rel='stylesheet' title='x' href='data:text/css,p%7Bcolor:red%7D'>

## CSS Rules

- `document.styleSheets[0].cssRules`
- `document.styleSheets[0].insertRule("p{color:pink;}",0)`
- `document.styleSheets[0].removeRule(0)`

### 结构

- 选择器字符串
- 样式键值对

## getComputerStyle

- 可以取到伪元素

# CSS View

```jsx
let childWindow = window.open('about:blank','_blank','width=100,height=100,left=100,top=100');
childWindow.moveBy(-50,-50)
childWindow.resizeBy(50,50)
```

```jsx
window.scroll(0,50);
window.scrollBy(30,30);
// 元素上的 API 和 window 不太一样
```

`ele.getClientRects();`

`getBoundingClientRect();`

# 所有 API

- 打开 `about:blank`
- `let names = Object.getOwnPropertyNames(window);`