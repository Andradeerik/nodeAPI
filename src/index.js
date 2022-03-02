const express = require('express');
const app = express();
app.use(express.json());

// starting the server
app.listen(3000, () => {
    console.log(`Server on port ${3000}`);
});

app.post('/image/transform', (req, res) => {
    let authorization = req.headers.authorization;
    let separateStrings = authorization.split(' ')[1]
    let bufferAuth = new Buffer.from(separateStrings, 'base64');
    let decodedString = bufferAuth.toString('ascii');
    let decodedStringArray = decodedString.split(':');
    let authUser = decodedStringArray[0];
    let authPassword = decodedStringArray[1];
    let bufferLiink = new Buffer.from(req.body.link);
    let base64data = bufferLiink.toString('base64');
    if (!authorization) {
        return res.status(401).send('Unauthorized');
    } else {
        if (authUser === 'test' && authPassword === 'password') {
            return res.status(201).json({ "base64": base64data });
        } else {
            return res.status(401).send('Unauthorized');
        }
    }
});

app.post('/object/clean', (req, res) => {
    // Validate the request
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Bad request',
            message: 'The request body must not be empty'
        });
    } else {
        // iterate over the object and check if the key is a null
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === null) {
                delete req.body[key];
            } else {
                // if the value is an object, iterate over it and check if the key is a null
                if (typeof req.body[key] === "object") {
                    Object.keys(req.body[key]).forEach(key2 => {
                        console.log(key2);
                        if (req.body[key][key2] === null) {
                            delete req.body[key][key2];
                        }
                    });
                }
            }
        });
        return res.status(201).json(req.body);
    }
})