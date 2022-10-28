import express from 'express'
import User from './src/routes/user.js'
import Music from './src/routes/music.js'
import pkg from "body-parser";
import cors from './src/cors.js'

const { json } = pkg
const app = express()
app.use(json())
app.use(cors())
app.use('/api/v1', User)
app.use('/api/v1', Music)

app.listen(process.env.PORT || 3001, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});