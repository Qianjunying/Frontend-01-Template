const http=require('http');

const sever=http.createServer((req,res)=>{
    console.log('收到请求！',Date.now());
    console.log(req.headers);
    
    
    res.writeHead(200,{'Content-Type':'text/plain','Who':'Badd'});
    res.end(`<html maaa="a">
    <head>
        <style>
            #container{
                width: 500px;
                height: 300px;
                display: flex;
            }
            #container #my-id{
                width: 200px;
            }
            #container .c1{
                flex: 1;
            }
        </style>
    </head>
    <body>
        <div id="container">
            <div id="my-id"></div>
            <div class="c1"></div>
        </div>
    </body>
    </html>`);
})

sever.listen(8989)