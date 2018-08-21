
var express = require('express'),
htmlDir = './html/'
var app = express();
const request = require("request")
const bodyParser = require('body-parser')

//Log all requests
//app.use(express.logger());

//Set content directories
app.use(express.static(__dirname + '/html'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use("/image", express.static(__dirname + '/image'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(request, response) {
    response.sendFile(htmlDir + '/index.html');
});

app.post('/add-subscriber', function(req, res) {
    let options = {
        method: 'POST',
        url: 'https://api.sendgrid.com/v3/contactdb/recipients',
        headers: {
            'content-type': 'application/json',
            authorization: 'Bearer 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'
        },
        body: [{
            email: req.body.email,
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            company: req.body.company ? req.body.company : ''
        }],
        json: true
    }

    request(options, function (error, response, body) {
        if (body.errors.length) {
            return res.status(500).json({message: body.errors[0].message})
        };

        return res.json('OK')
    });
})

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Listening on " + port);
});