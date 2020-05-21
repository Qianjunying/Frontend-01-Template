const http=require('http');

const sever=http.createServer((req,res)=>{
    console.log('收到请求！',Date.now());
    console.log(req.headers);
    
    
    res.writeHead(200,{'Content-Type':'text/plain','Who':'Badd'});
    res.end(`<html maaa="a">
    <head>
        <style>
            body div #myId{
                width: 100px;
                background-color: #ff5000;
            }
            body div img{
                width: 30px;
                background-color: #ff1111;
            }
        </style>
    </head>
    <body>
        <div>
            <img id="myId"/>
            <img />
        </div>
    </body>
    </html>`);
})

sever.listen(8989)