import express from 'express'
import * as ZingMp3 from 'zingmp3-api-full'
const router = express.Router()
router.get('/get', (req, res, next) => {
    const params = req.query
    ZingMp3.getSong(params.id).then(data => {
        res.json({data})
    })
})

router.get('/search', (req, res, next) => {
    const params = req.query
    ZingMp3.search(params.name).then((model) => {
        // const results = model.data.songs
        res.json({model})
      })
})

router.get('/get-top-100', (req, res, next) => {
    ZingMp3.getTop100().then((data) => {
        console.log(data);
        res.json({data})
      })
})

router.get('/get-detail-playlist', (req, res, next) => {
    const params = req.query
    ZingMp3.getDetailPlaylist(params.id).then((data) => {
        console.log(data);
        res.json({data})
      })
})


export default router;
