import express from 'express'
import Router from './src/routes/music.js'
import pkg from "body-parser";
import cors from './src/cors.js'
import * as http from "http";

const {  json } = pkg
const app = express()
const port = 3000

let addr = http.Server.address();
let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

app.use(json())
app.use(cors())
app.use('/music', Router)

app.listen(port, () => {
  console.log(`listening on port ${bind}`)
})