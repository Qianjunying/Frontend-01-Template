```javascript
function encodeUTF8(character) {
    if (!character || typeof character !== 'string') {
        throw new Error('请输入字符！')
    }
    let res = character.split('').map(x => {
        return toBinary(x.charCodeAt());
    }).join('');

    let codeLength = res.length;
    return '0'.repeat(8 - (codeLength % 8 === 0 ? 8 : codeLength % 8)) + res; // 若位数不够，则用“0”补位，再返回。
}

// 将十进制码点转为二进制形式。
function toBinary(num) {
    if (num === 0) {
        return '0';
    }
    let res = '';
    while (num > 0) {
        res = num % 2 + res;
        num = Math.floor(num / 2);
    }
    return res;
}
```