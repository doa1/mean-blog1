const express = require("express");

//init the app
let app = express();
//enable middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'))
    //init server
    //routes come here 
var indexRouter = require('./routes/index');
app.use('/', indexRouter)
port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Magic started on port ${port}`);
})
