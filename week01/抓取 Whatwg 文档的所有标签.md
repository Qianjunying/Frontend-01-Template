# 抓取 Whatwg 文档的所有标签
1. 打开 Chrome 开发者工具，选中【The elements of HTML】节点。
2. Console 中输入：
    ```javascript
    let nodeList = $0.querySelectorAll('li>ol>li>a>code');
    let arr = Array.prototype.map.call(nodeList,x ⇒ x.innerHTML);
    let tagSet = new Set(arr);
    arr = [...tagSet];
    ```