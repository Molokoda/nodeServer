const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const userRouter = require('./routes/user.routes.js');

app.use('/public', express.static('public'));

app.use(bodyParser.json());
app.use( bodyParser.urlencoded( {extended: true} ) );
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})


  