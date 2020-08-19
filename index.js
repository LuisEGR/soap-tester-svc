const http = require('http');
const soap = require('soap');
const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')

var myService = {
    FieldwyService: {
        FieldwyPort: {
            ENVIAR: function (args) {
                console.log('args :', args);
                return {
                    errorMessage: "Recibí:" + JSON.stringify(args),
                    error: false
                }
            },
        }
    }
};

var xml = require('fs').readFileSync('myservice2.wsdl', 'utf8');

//http server example
// var server = http.createServer(function (request, response) {
//     response.end('404: Not Found: ' + request.url);
// });

// server.listen(8000);
// soap.listen(server, '/wsdl', myService, xml);

//express server example
var app = express();

app.use(basicAuth({
    users: { 'strat': 'strat_testpwd' }
}))

//body parser middleware are supported (optional)
app.use(bodyParser.raw({ type: function () { return true; }, limit: '50mb' }));

app.use('*', (req, res, next) => {
    console.log("\n\n\nNewRequest-----", (new Date()).toISOString());
    console.log("RequestHeaders:\n", req.headers);
    console.log("RequestBody:\n", req.body);
    if(req.body && req.body.length){
        let body = Buffer.from(req.body).toString('utf-8');
        console.log('body :\n', body);
    }


    next();
})

let port = process.env.PORT||8001;

app.listen(port, function () {
    //Note: /wsdl route will be handled by soap module
    //and all other routes & middleware will continue to work
    soap.listen(app, '/wsdl', myService, xml);
});