const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
// starting the server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});
app.post('/image/transform', (req, res) => {
    let authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).send('Unauthorized');
    } else {
        let separateStrings = authorization.split(' ')[1]
        let bufferAuth = new Buffer.from(separateStrings, 'base64');
        let decodedString = bufferAuth.toString('ascii');
        let decodedStringArray = decodedString.split(':');
        let authUser = decodedStringArray[0];
        let authPassword = decodedStringArray[1];

        if (authUser === 'test' && authPassword === '123456') {
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    error: 'Bad request',
                    message: 'The request body must not be empty'
                });
            } else {
                let bufferLiink = new Buffer.from(req.body.link);
                console.log("hola");
                let base64data = bufferLiink.toString('base64');
                return res.status(201).json({ "base64": base64data });
            }
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
        let obj = req.body;
        function removeNull (object) {
            let objectNew = {};
            Object.entries(object).forEach(([key, value]) => {
                if (value === Object(value)) {
                    objectNew[key] = removeNull(value);
                } else if (value != null) {
                    objectNew[key] = object[key];
                }
            });
            return objectNew

        }
        return res.status(201).json(removeNull(obj));
    }
})