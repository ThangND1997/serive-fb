import { db } from '../configs/firebase.config.js'
import express from 'express'
import { uuid } from 'uuidv4';

import axios from 'axios';


const router = express.Router()
export default router;

router.get('/read/:id', async (req, res) => {
    try {
      const userRef = db.collection("users").doc(req.params.id);
      const response = await userRef.get();
      res.json(response.data());
    } catch(error) {
      res.send(error);
    }
  });

router.get('/read', async (req, res) => {
    try {
        db.collection('users').onSnapshot((snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            console.log(data)
            res.json(data);
        })
    } catch(error) {
      res.send(error);
    }
    
  });

  router.get('/list-film', async (req, res, next) => {
      const nameSearch = req.query.key || "";
    axios({
      method: 'get',
      url: `https://ophim.cc/_next/data/2uibqhufwNeudgKQPPGsA/tim-kiem.json?keyword=${nameSearch}`,
    })
      .then(function (response) {
        res.json(response.data)
      });  
  });

  router.post('/create', async (req, res) => {
    try {
      console.log(req.body);
      const userJson = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      };
      const usersDb = db.collection('users'); 
      await usersDb.doc(uuid()).set(userJson);
      res.json({message: "created success"});
    } catch(error) {
      res.json(error);
    }
  });

  router.put('/update/:id', async(req, res) => {
    try {
      const id=req.params.id;
      const data = req.body || {}
      // const newFirstName = "hello world!";
      const userRef = await db.collection("users").doc(id)
      .update(data);
      res.json({success: 'ok'});
    } catch(error) {
      res.send(error);
    }
  });

  router.delete('/delete/:id', async (req, res, next) => {
    try {
      const response = await db.collection("users").doc(req.params.id).delete();
      res.send(response);
    } catch(error) {
      res.send(error);
    }
  })

  router.post('/login', async (req, res, next) => {
    try {
      const email = req.body.email || "";
      const password = req.body.password || "";

      if (email === "" || password === "") {
          throw new Error("Missing field")
      }
      
      const userRef = db.collection("users")
      const response = await userRef.where('name', '==', `${email}`);
      res.json(response.get().data());
      
    } catch(error) {
      next(error)
    }  
  })