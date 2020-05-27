function getStyle(node) {
    if (!node.style) {
        node.style = {}
    }

    for (const prop in node.computedStyle) {
        if (node.computedStyle.hasOwnProperty(prop)) {
            const styleValueObj = node.computedStyle[prop]; // CSS 属性的值，是一个对象，其中有 value 和 weight 属性。
            node.style[prop] = styleValueObj.value;

            if (node.style[prop].toString().match(/px$/)) {
                node.style[prop] = parseInt(node.style[prop]);
            }

            if (node.style[prop].toString().match(/^[0-9\.]+$/)) {
                node.style[prop] = parseInt(node.style[prop])
            }

        }
    }
    console.log(node.attrs[0].value,JSON.stringify(node.style));
    
    return node.style;
}

module.exports = node => {
    if (!node.computedStyle || (Object.keys(node.computedStyle)).length < 1) {
        return;
    }

    let nodeStyle = getStyle(node);
    if (nodeStyle.display !== 'flex') {
        return;
    }

    let tagChildren = node.childNodes.filter(x => x.type === 'tag');

    tagChildren.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
    });

    let style = nodeStyle;
    ['width', 'height'].forEach(x => {
        if (style[x] === 'auto' || style[x] === '') {
            style[x] = null;
        }
    });

    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }

    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }

    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }

    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }

    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }

    let mainSize = 0; // 代表 width 或 height
    let mainStart = ''; // 代表 left 或 right 或 top 或 bottom
    let mainEnd = ''; // 同 mainStart
    let mainSign = 0; // 代表方向，从左到右或从右到左
    let mainBase = 0; // 排版的起点

    let crossSize = 0;
    let crossStart = '';
    let crossEnd = '';
    let crossSign = 0;
    let crossBase = 0;

    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        let temp = crossStart;
        crossStart = crossEnd;
        crossEnd = temp;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    let isAutoMainSize = false; // 节点元素是否设置了 mainSize
    if (!style[mainSize]) {
        style[mainSize] = 0;
        for (let i = 0; i < tagChildren.length; i++) {
            const child = tagChildren[i];
            let childStyle = getStyle(child);
            if (childStyle[mainSize] !== null || childStyle[mainSize] !== (void 0)) {
                style[mainSize] += childStyle[mainSize]
            }
        }
        isAutoMainSize = true;
    }

    let flexLine = [];
    let flexLines = [flexLine];

    let mainSpace = style[mainSize];
    let crossSpace = 0;

    for (let i = 0; i < tagChildren.length; i++) {
        const child = tagChildren[i];
        let childStyle = getStyle(child);

        if (childStyle[mainSize] === null) {
            childStyle[mainSize] = 0;
        }

        if (childStyle.flex) {
            flexLine.push(child);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= childStyle[mainSize];
            if (childStyle[crossSize] !== null && childStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, childStyle[crossSize])
            }
            flexLine.push(child);
        } else {
            if (childStyle[mainSize] > style[mainSize]) {
                childStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < childStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [child];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(child);
            }
            if (childStyle[crossSize] !== null && childStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, childStyle[crossSpace])
            }

            mainSpace = childStyle[mainSize];
        }

    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currMain = mainBase;
        for (let i = 0; i < tagChildren.length; i++) {
            const child = tagChildren[i];
            let childStyle = getStyle(child);

            if (childStyle.flex) {
                childStyle[mainSize] = 0;
            }

            childStyle[mainSize] = childStyle[mainSize] * scale;

            childStyle[mainStart] = currMain;
            childStyle[mainEnd] = childStyle[mainStart] + mainSign * childStyle[mainSize];
            currMain = childStyle[mainEnd];
        }
    } else {
        flexLines.forEach(tagChildren => {
            let mainSpace = tagChildren.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < tagChildren.length; i++) {
                const child = tagChildren[i];
                let childStyle = getStyle(child);

                if ((childStyle.flex !== null) && (childStyle.flex !== (void 0))) {
                    flexTotal += childStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                let currMain = mainBase;
                for (let i = 0; i < tagChildren.length; i++) {
                    const child = tagChildren[i];
                    let childStyle = getStyle(child);
                    if (childStyle.flex) {
                        childStyle[mainSize] = (mainSpace / flexTotal) * childStyle.flex;
                    }
                    childStyle[mainStart] = currMain;
                    childStyle[mainEnd] = childStyle[mainStart] + mainSign * childStyle[mainSize];
                    currMain = childStyle[mainEnd]
                }
            } else {
                let step=0;
                if (style.justifyContent === 'flex-start') {
                    currMain = mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'flex-end') {
                    currMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'center') {
                    currMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'space-between') {
                    currMain = mainBase;
                    step = mainSpace / (tagChildren.length - 1) * mainSign;
                }
                if (style.justifyContent === 'space-around') {
                    step = mainSpace / (tagChildren.length) * mainSign;
                     currMain = step / 2 + mainBase;
                }

                for (let i = 0; i < tagChildren.length; i++) {
                    const child = tagChildren[i];
                    let childStyle = getStyle(child);

                    childStyle[mainStart] = currMain;
                    childStyle[mainEnd] = childStyle[mainStart] + mainSign * childStyle[mainSize];
                    currMain = childStyle[mainEnd] + step;
                }
            }
        });
    }

    if (!style[crossSize]) {
        crossSpace=0;
        style[crossSize]=0;
        for (let i = 0; i < flexLines.length; i++) {
            const line = flexLines[i];
            style[crossSize]=style[crossSize]+line.crossSpace;
        }
    }else{
        crossSpace=style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            const line = flexLines[i];
            crossSpace-=line.crossSpace;
        }
    }

    if (style.flexWrap==='wrap-reverse') {
        crossBase=style[crossSize];
    }else{
        crossBase=0;
    }

    let lineSize=style[crossSize]/flexLines.length;

    let step=0;
    if (style.alignContent==='flex-start') {
        crossBase+=0;
        step=0;
    }
    if (style.alignContent==='flex-end') {
        crossBase+=crossSign*crossSpace;
        step=0;
    }
    if (style.alignContent==='center') {
        crossBase+=crossSign*crossSpace/2;
        step=0;
    }
    if (style.alignContent==='space-between') {
        crossBase+=0;
        step=crossSpace/(flexLines.length-1);
    }
    if (style.alignContent==='space-around') {
        step=crossSpace/(flexLines.length);
        crossBase+=crossSign*step/2;
    }
    if (style.alignContent==='stretch') {
        crossBase+=0;
        step=0;
    }

    flexLines.forEach(line=>{
        let lineCrossSize=style.alignContent==='stretch'?line.crossSpace+crossSpace/flexLines.length:line.crossSpace;

        for (let i = 0; i < line.length; i++) {
            const itm = line[i];
            let itmStyle=getStyle(itm);

            let align=itmStyle.alignSelf||style.alignItems;

            if (itmStyle[crossSize]===null) {
                itmStyle[crossSize]=(align==='strech')?lineCrossSize:0;
            }

            if (align==='flex-start') {
                itmStyle[crossStart]=crossBase;
                itmStyle[crossEnd]=itmStyle[crossStart]+crossSign*itmStyle[crossSize];
            }

            if (align==='flex-end') {
                itmStyle[crossEnd]=crossBase+crossSign*lineCrossSize;
                itmStyle[crossStart]=itmStyle[crossEnd]-crossSign*itmStyle[crossSize];
            }

            if (align==='center') {
                itmStyle[crossStart]=crossBase+crossSign*(lineCrossSize-itmStyle[crossSize])/2;
                itmStyle[crossEnd]=itmStyle[crossEnd]-crossSign*itmStyle[crossSize];
            }

            if (align==='stretch') {
                itmStyle[crossStart]=crossBase;
                itmStyle[crossEnd]=itmStyle[crossEnd]+crossSign*((itmStyle[crossSize]!==null&&itmStyle[crossSize]!==(void 0))?itmStyle[crossSize]:lineCrossSize);
                itmStyle[crossSize]=crossSign*(itmStyle[crossEnd]-itmStyle[crossStart]);
            }
        }
        crossBase+=crossSign*(lineCrossSize+step)
    });

    console.log(JSON.stringify(tagChildren));
    
}