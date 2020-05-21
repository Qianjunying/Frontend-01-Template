const cssParser = require('./cssParser.js');

function computeCSS(node) {
    let parents = tempParents.slice().reverse();
    if (!node.computedStyle) {
        node.computedStyle = {};
    }

    for (const rule of rules) {
        let selectorArr = rule.selectors[0].split(' ').reverse();
        if (!matchEleAndSelector(node, selectorArr[0])) {
            continue;
        }

        let j = 1;
        for (let i = 0; i < parents.length; i++) {
            const p = parents[i];
            if (matchEleAndSelector(p, selectorArr[j])) {
                j++;
            }
        }
        if (j >= selectorArr.length) {
            // 父元素栈和选择器栈匹配上了            
            const weight=calcSelectorsWeight(selectorArr);
            for (const dec of rule.declarations) {
                let isUpdate=false;
                if (!node.computedStyle[dec.property]) {
                    node.computedStyle[dec.property] = {};
                    isUpdate=true;
                }else{
                    const oldPropWeight=node.computedStyle[dec.property].weight;
                    if (oldPropWeight[0]<weight[0]) {
                        isUpdate=true;
                    }else if (oldPropWeight[0]===weight[0]) {
                        if (oldPropWeight[1]<weight[1]) {
                            isUpdate=true;
                        }else if (oldPropWeight[1]===weight[1]) {
                            if (oldPropWeight[2]<weight[2]) {
                                isUpdate=true;
                            }else if (oldPropWeight[2]===weight[2]) {
                                if (oldPropWeight[3]<weight[3]) {
                                    isUpdate=true;
                                }
                            }
                        }
                    }
                }
                
                if (isUpdate) {
                    (node.computedStyle[dec.property]).value = dec.value;
                    (node.computedStyle[dec.property]).weight = weight;
                }
            }
        }
    }
    return node;
}

function calcSelectorsWeight(selectorArr) {
    let p=[0,0,0,0];

    for (const s of selectorArr) {
        if (s[0]==='#') {
            p[1]+=1;
        }else if (s[0]==='.') {
            p[2]+=1;
        }else{
            p[3]+=1;
        }
    }

    return p;
}

function matchEleAndSelector(ele, selector) {
    if (!ele || !selector) {
        return false;
    }

    if (selector[0] === '#') {
        return (ele.attrs.filter(x => {
            return x.name === 'id' && x.value === selector.slice(1);
        })).length > 0;
    } else if (selector[0] === '.') {
        return (ele.attrs.filter(x => {
            return x.name === 'class' && x.value === selector.slice(1);
        })).length > 0;
    } else {
        return ele.tag === selector;
    }
}


function emit(token) {
    if (token.type === 'startTag' && !token.selfClosingFlag) {
        // 此 token 是开启标签且不是自闭合标签
        let node = {
            type: 'tag',
            tag: token.tagName,
            attrs: token.attrs || [],
            childNodes: [],
        };
        const styledNode = computeCSS(node);

        tempParents.push(styledNode);

    } else if (token.type === 'endTag') {
        // 此 token 是闭合标签
        if (token.tagName !== 'html') {
            const formerObj = tempParents.pop();
            if (token.tagName === 'style') {
                rules = [...cssParser.parse((formerObj.childNodes)[0].data)];
            }
            if (tempParents[tempParents.length - 1]) {
                tempParents[tempParents.length - 1].childNodes.push(formerObj)
            }
        }
        tempParents[tempParents.length - 1].childNodes = tempParents[tempParents.length - 1].childNodes.filter(
            x => !(x.type === 'text' && x.data.match(/\s/)));
    } else if (token.type === 'startTag' && token.selfClosingFlag) {
        // 此 token 是自闭合标签
        // const formerObj = tempParents.pop();
        if (tempParents[tempParents.length - 1]) {
            let node = {
                type: 'tag',
                tag: token.tagName,
                attrs: token.attrs || [],
                childNodes: [],
            };
            const styledNode = computeCSS(node);

            tempParents[tempParents.length - 1].childNodes.push(styledNode);
        }
    } else if (token.type === 'character') {
        // 此 token 是文本字符类型                
        const tail = tempParents[tempParents.length - 1];
        if (tail && tail.childNodes) {
            const tailChildrenTail = tail.childNodes[tail.childNodes.length - 1];
            if (tailChildrenTail && tailChildrenTail.type === 'text') {
                if ((tailChildrenTail.data)[tailChildrenTail.data.length - 1] === ' ' && token.data === ' ') {
                    token.data = '';
                }
                tailChildrenTail.data += token.data;
            } else {
                let textObj = {
                    type: 'text',
                    data: token.data
                };
                // if (tail.tag==='style') {

                // }
                tail.childNodes.push(textObj);
            }
        }
    } else {
        // 未被上述条件捕获的情况
        console.log('漏网之鱼', token);
    }

    // console.log('TOKEN',token, JSON.stringify(tempParents.length));
}

// 解析函数
function parse(htmlStr) {
    let state = dataState;
    for (let i = 0; i < htmlStr.length; i++) {
        const char = htmlStr[i];
        // console.log('CHAR', JSON.stringify(char));
        state = state(char);
        // console.log('state :>> ', state);
        // console.log('==========');
    }

}

// 起始状态
function dataState(char) {
    if (char === '<') {
        return tagOpenState;
    } else if (char === EOF) {
        // emit a eof token
        emit({
            type: 'EOF'
        })
        return;
    } else if (char === '\u0009' || char === '\u000a' || char === '\u000c' || char === '\u0020') {
        if (char === '\u0020') {
            emit({
                type: 'character',
                data: ' '
            });
        }

        return dataState;
    } else {
        // emit the current input character as a character token
        emit({
            type: 'character',
            data: char
        });
        // currToken.type = 'character';
        // if (!currToken.data) {
        //     currToken.data = '';
        // }
        // currToken.data += char;
        return dataState;
    }
}

// 左尖括号 < 后面
function tagOpenState(char) {
    if (char === '/') {
        return endTagOpenState;
    } else if (char.match(/^[a-zA-Z]$/)) {
        currToken = {};
        currToken.type = 'startTag';
        currToken.tagName = '';
        return tagNameState(char);
    } else if (char === EOF) {
        // eof-before-tag-name parse error
        emit({
            type: 'character',
            data: '<'
        });
        emit({
            type: 'EOF'
        });
        return;
    } else {
        // invalid-first-character-of-tag-name parse error
        emit({
            type: 'character',
            data: '<'
        });
        return dataState(char);
    }
}

// 闭合标签的 </ 后面
function endTagOpenState(char) {
    if (char.match(/^[a-zA-Z]$/)) {
        currToken = {
            type: 'endTag',
            tagName: '',
        }
        return tagNameState(char);
    } else if (char === '>') {
        // missing-end-tag-name parse error
        return dataState;
    } else if (char === EOF) {
        // eof-before-tag-name parse error
        emit({
            type: 'character',
            data: '<'
        });
        emit({
            type: 'character',
            data: '/'
        });
        emit({
            type: 'EOF'
        });
        return;
    } else {
        // invalid-first-character-of-tag-name parse error
        // Create a comment token whose data is the empty string.
        currToken = {
            type: 'comment',
            data: ''
        }
        // Reconsume in the bogus comment state.
        // return bogusCommentState;
    }
}

// 标签名
function tagNameState(char) {
    if (char === '\u0009' || char === '\u000a' || char === '\u000c' || char === '\u0020') {
        // 制表符、换行符、Form 换行符、空格
        return beforeAttrNameState;
    } else if (char === '/') {
        return selfClosingStartTagState;
    } else if (char === '>') {
        emit(currToken);
        return dataState;
    } else if (char === EOF) {
        // eof-in-tag parse error
        emit({
            type: 'EOF'
        });
        return;
    } else {
        currToken.tagName += char;
        return tagNameState;
    }
}

// 标签的特性名的左侧
function beforeAttrNameState(char) {
    if (char === '\u0009' || char === '\u000a' || char === '\u000c' || char === '\u0020') {
        // 制表符、换行符、Form 换行符、空格
        return beforeAttrValueState;
    } else if (char === '/' || char === '>' || char === EOF) {
        return afterAttrNameState(char);
    } else if (char === '=') {
        // unexpected-equals-sign-before-attribute-name parse error
        if (!currToken.attrs) {
            currToken.attrs = [];
        }
        currToken.attrs.push({
            name: char,
            value: ''
        })

        return attrNameState;
    } else {
        currAttr = {
            name: '',
            value: ''
        };
        return attrNameState(char);
    }
}

// 遇到了 / 字符，说明是自闭合标签
function selfClosingStartTagState(char) {
    if (char === '>') {
        currToken.selfClosingFlag = true;
        emit(currToken);
        return dataState;
    } else if (char === EOF) {
        // eof-in-tag parse error
        emit({
            type: 'EOF'
        });
        return;
    } else {
        // unexpected-solidus-in-tag parse error
        return beforeAttrNameState(char);
    }
}

// 标签的特性名
function attrNameState(char) {
    if (char === '\u0009' || char === '\u000a' || char === '\u000c' || char === '\u0020' || char === '/' ||
        char === '>' || char === EOF) {
        return afterAttrNameState(char)
    } else if (char === '=') {
        // console.log('CURRATTR',currAttr);
        return beforeAttrValueState;
    } else if (char.match(/[A-Z]/)) {
        currAttr.name += (char.toLowerCase());
        return attrNameState;
    } else if (char === `'` || char === `"` || char === `<`) {
        // unexpected-character-in-attribute-name parse error
        currAttr.name += char;
        return attrNameState;
    } else {
        // console.log('ATTRNAME',char);
        currAttr.name += char;
        return attrNameState;
    }
}

// 标签特性名的右侧
function afterAttrNameState(char) {
    if (char === '\u0009' || char === '\u000a' || char === '\u000c' || char === '\u0020') {
        // 制表符、换行符、Form 换行符、空格
    } else if (char === '/') {
        return selfClosingStartTagState;
    } else if (char === '=') {
        return beforeAttrValueState;
    } else if (char === '>') {
        emit(currToken);
        return dataState;
    } else if (char === EOF) {
        // eof-in-tag parse error
        emit({
            type: 'EOF'
        });
        return;
    } else {
        if (!currToken.attrs) {
            currToken.attrs = [];
        }
        currToken.attrs.push({
            name: '',
            value: ''
        })
        return attrNameState(char);
    }
}

// 标签特性值的左侧
function beforeAttrValueState(char) {
    if (char === '\u0009' || char === '\u000a' || char === '\u000c' || char === '\u0020') {
        // 制表符、换行符、Form 换行符、空格
        // return;
    } else if (char === '"') {
        return DQAttrValueState;
    } else if (char === "'") {
        return SQAttrValueState;
    } else if (char === '>') {
        // missing-attribute-value parse error
        emit(currToken);
        return dataState;
    } else {
        return NQAttrValueState(char);
    }
}

// 双引号特性值
function DQAttrValueState(char) {
    if (char === '"') {
        if (!currToken.attrs) {
            currToken.attrs = [];
        }
        currToken.attrs.push(currAttr);
        currAttr = {
            name: '',
            value: ''
        };
        return afterQAttrValueState;
    } else if (char === '&') {
        // Set the return state to the attribute value (double-quoted) state.
        // Switch to the character reference state.
    } else if (char === EOF) {
        // eof-in-tag parse error
        emit({
            type: 'EOF'
        });
        return;
    } else {
        currAttr.value += char;
        return DQAttrValueState;
    }
}

// 单引号特性值
function SQAttrValueState(char) {
    if (char === "'") {
        return afterQAttrValueState;
    } else if (char === '&') {
        // Set the return state to the attribute value (single-quoted) state.
        // Switch to the character reference state.
    } else if (char === EOF) {
        // eof-in-tag parse error
        emit({
            type: 'EOF'
        });
        return;
    } else {
        currAttr.value += char;
    }
}

// 无引号特性值
function NQAttrValueState(char) {
    if (char === '\u0009' || char === '\u000a' || char === '\u000c' || char === '\u0020') {
        // 制表符、换行符、Form 换行符、空格
        return beforeAttrNameState;
    } else if (char === '&') {
        // Set the return state to the attribute value (unquoted) state.
        // Switch to the character reference state.
    } else if (char === '>') {
        emit(currToken);
        return dataState;
    } else if (char === '"' || char === "'" || char === '<' || char === '=' || char === '`') {
        // unexpected-character-in-unquoted-attribute-value parse error
        currAttr.value += char;
    } else if (char === EOF) {
        // eof-in-tag parse error
        emit({
            type: 'EOF'
        });
        return;
    } else {
        currAttr.value += char;
    }
}

// 带引号的特性值的右侧
function afterQAttrValueState(char) {
    if (char === '\u0009' || char === '\u000a' || char === '\u000c' || char === '\u0020') {
        return beforeAttrNameState;
    } else if (char === '/') {
        return selfClosingStartTagState;
    } else if (char === '>') {
        emit(currToken);
        return dataState;
    } else if (char === EOF) {
        // eof-in-tag parse error
        emit({
            type: 'EOF'
        });
        return;
    } else {
        // missing-whitespace-between-attributes parse error
        return beforeAttrNameState(char);
    }
}

const EOF = Symbol('EOF');
let currToken = {}; // 当前正在解析的 token
let currAttr = {
    name: '',
    value: ''
};
let tempParents = [];
let rules = [];

module.exports.parse = html => {
    parse(html)
    return tempParents[0];
}