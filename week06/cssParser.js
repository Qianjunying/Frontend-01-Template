let CSS = require('css');

// let cssStr = "body div #myId{width:100px;background-color:#ff5000;}body div img{width:30px;background-color:#ff1111;}";

let rules = [];

module.exports.parse = cssStr => {
    
    let ast = CSS.parse(cssStr);
    
    return ast.stylesheet.rules
}