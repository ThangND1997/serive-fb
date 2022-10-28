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