import express from 'express'
import Router from './src/routes/music.js'
import pkg from "body-parser";
import cors from './src/cors.js'

const {  json } = pkg
const app = express()
const port = 3000

app.use(json())
app.use(cors())
app.use('/music', Router)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})