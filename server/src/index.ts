import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
import { initSocket } from './socket';

const httpServer = http.createServer(app);

const auth = require("./routes/auth.route")
const user = require("./routes/user.route")
const product = require("./routes/products.route")

app.use("/api/auth", auth)
app.use("/api/user", user)
app.use("/api/product", product)
app.get("/", (req, res) => {
    res.send("Hello World!!");
})

initSocket(httpServer);

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
  