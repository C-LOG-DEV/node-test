
var express = require('express'),
htmlDir = './html/'
var app = express();
const request = require("request")
const bodyParser = require('body-parser')
const API_KEY = 'Bearer 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'

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

// Add contact to SendGrid
app.post('/add-subscriber', function(req, res) {
    let options = {
        method: 'POST',
        url: 'https://api.sendgrid.com/v3/contactdb/recipients',
        headers: {
            'content-type': 'application/json',
            authorization: API_KEY
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
        if (error || body.errors.length) {
            return res.status(500).json({message: body.errors[0].message})
        };

        return res.json('OK')
    });
})

// Send email through SendGrid
app.post('/send-email', function(req, res) {
    let mail = { 
        method: 'POST',
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers: { 
            'content-type': 'application/json',
            authorization: API_KEY
        },
        body: { 
            personalizations: [{ 
                to: [{ 
                    email: 'elia@c-log.io',
                    name: 'Test'
                }],
            }],
            from: { 
                email: req.body.email, 
                name: `${req.body.fname} ${req.body.lname}`
            },
            subject: req.body.subject,
            content: [{
                type: 'text/html',
                value: req.body.message
            }]
        },
        json: true 
    };

    request(mail, function (error, response, body) {
        console.log(error, body, response)
        if (body && body.errors) {
            return res.status(500).json({message: body.errors[0].message})
        };

        return res.json('OK')
    });
})

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Listening on " + port);
});