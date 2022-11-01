import { ZingMp3 } from "zingmp3-api-full"
import express from 'express'

const router = express.Router()
export default router;

router.get('/song/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    ZingMp3.getSong(id).then((data) => {
        res.json(data)
      })
  } catch (error) {
    next(error.messeage);
  }
});

router.get('/view-song', async (req, res, next) => {
    try {
      const name = req.query.name;
      ZingMp3.search(name).then((data) => {
        res.json(data)
      })
    } catch (error) {
      next(error.messeage);
    }
  });

  router.get('/top-100', async (req, res, next) => {
    try {
      ZingMp3.getTop100().then((data) => {
        res.json(data)
      })
    } catch (error) {
      next(error.messeage);
    }
  });

  router.get('/chart-home', async (req, res, next) => {
    try {
        ZingMp3.getChartHome().then((data) => {
        res.json(data)
      })
    } catch (error) {
      next(error.messeage);
    }
  });

  router.get('/new-release-chart', async (req, res, next) => {
    try {
        ZingMp3.getNewReleaseChart().then((data) => {
        res.json(data)
      })
    } catch (error) {
      next(error.messeage);
    }
  });

  router.get('/song-info/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
        ZingMp3.getInfoSong(id).then((data) => {
        res.json(data)
      })
    } catch (error) {
      next(error.messeage);
    }
  });