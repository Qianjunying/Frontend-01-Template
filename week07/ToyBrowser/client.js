const net = require('net');
const htmlParser = require('./htmlParser.js');

class Req {
    constructor(opt) {
        this.method = opt.method || 'GET';
        this.host = opt.host;
        this.port = opt.port || 80;
        this.path = opt.path || '/';
        this.headers = opt.headers || {};
        this.body = opt.body || {};

        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'x-www-form-urlencoded'
        }

        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers['Content-Type'] === 'x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(x => `${x}=${encodeURIComponent(this.body[x])}`).join('&');
        }

        this.headers['Content-Length'] = this.bodyText.length;
    }

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(x=>`${x}:${this.headers[x]}`).join('\r\n')}\r\n\r\n${this.bodyText}`;
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResParser();
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }

            connection.on('data', data => {
                parser.receive(data.toString())
                if (parser && parser.body && parser.body.isFinished) {
                    resolve(parser.response);
                }
                connection.end();
            });

            connection.on('err', err => {
                reject(err);
                connection.end();
            })
        });

    }
}

class ResParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_HEADER_NAME = 1;
        this.WAITING_HEADER_VALUE = 2;
        this.WAITING_BODY = 3;

        this.currentStatus = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.body = null;
    }

    get response() {
        this.statusLine.match(/HTTP\/1\.1 (\d+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.body.content.join('')
        }
    }
    receive(str) {
        for (let i = 0; i < str.length; i++) {
            this.receiveChar(str.charAt(i));
        }
    }
    receiveChar(char) {
        if (this.currentStatus === this.WAITING_STATUS_LINE) {
            if (char === '\r') {} else if (char === '\n') {
                this.currentStatus = this.WAITING_HEADER_NAME;
            } else {
                this.statusLine += char;
            }
        } else if (this.currentStatus === this.WAITING_HEADER_NAME) {
            if (char === '\r') {} else if (char === '\n') {
                this.currentStatus = this.WAITING_BODY;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.body = new ChunkBodyParser();
                }
            } else if (char === ':') {

            } else if (char === ' ') {
                this.currentStatus = this.WAITING_HEADER_VALUE;
            } else {
                this.headerName += char;
            }
        } else if (this.currentStatus === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {} else if (char === '\n') {
                this.currentStatus = this.WAITING_HEADER_NAME;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;
            }
        } else if (this.currentStatus === this.WAITING_BODY) {
            this.body.receiveBodyChar(char);
        }

    }
}

class ChunkBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_CHUNK = 1;
        this.leftLength = 0;
        this.content = [];
        this.isFinished = false;

        this.currStatus = this.WAITING_LENGTH;
    }

    receiveBodyChar(char) {
        if (this.currStatus === this.WAITING_LENGTH) {
            if (char === '\r') {} else if (char === '\n') {
                this.currStatus = this.WAITING_CHUNK;
                if (this.leftLength === 0) {
                    this.isFinished = true;
                }
            } else {
                this.leftLength *= 16;
                this.leftLength += parseInt(char, 16)
            }
        } else if (this.currStatus === this.WAITING_CHUNK) {

            if (this.leftLength > 0) {
                this.content.push(char);
                this.leftLength--;
            } else {
                if (char === '\r') {} else if (char === '\n') {
                    this.currStatus = this.WAITING_LENGTH;
                }
            }

        }
    }
}

void async function () {
    let req = new Req({
        method: 'POST',
        host: '127.0.0.1',
        port: 8989,
        headers: {
            'target': 'P6'
        },
        body: {
            title: 'king'
        }
    });

    let res = await req.send();
    let dom = htmlParser.parse(res.body)
    console.log('=====数据开始=====');
    console.log(JSON.stringify(dom));
    console.log('=====数据结束=====');
}()


























// const client = net.createConnection({
//     host: '127.0.0.1',
//     port: 8989
// }, () => {
//     console.log('已连接到服务器！');
//     // client.write('POST / HTTP/1.1\r\n');
//     // client.write('Content-Type: application/x-www-form-urlencoded\r\n');
//     // client.write('Content-Length: 8\r\n');
//     // client.write('\r\n');
//     // client.write('who=badd\r\n');
//     let req=new Req({
//         method:'POST',
//         host:'127.0.0.1',
//         port:8989,
//         headers:{
//             'target':'P6'
//         },
//         body:{
//             title:'king'
//         }
//     });
//     client.write(req.toString());

// });
// client.on('data', data => {
//     console.log('=====数据开始=====');
//     console.log(data.toString());
//     console.log('=====数据结束=====');
//     client.end();
// });

// client.on('err', err => {
//     console.log('报错：', err);
// })

// client.on('end', () => {
//     console.log('断开连接！');
// })