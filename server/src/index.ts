import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const mongoose = require('mongoose')
import { initSocket } from './socket';
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const httpServer = http.createServer(app);

const user = require("./routes/user.route")
const product = require("./routes/products.route")

mongoose.connect('mongodb://localhost:27017/auction')
    .then(() => {
        console.log("DB connected...");
    })
    .catch((err: Error) => {
        console.log("DB connection lost...", err.message);
    });

app.use("/api/user", user)
app.use("/api/product", product)
app.get("/", (req, res) => {
    res.send("Hello World!!");
})

initSocket(httpServer);

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
  