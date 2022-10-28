import { db } from '../configs/firebase.config.js'
import express from 'express'
import { uuid } from 'uuidv4';
import * as bcrypt from "bcrypt"
import { collection, query, where, getDocs } from "firebase/firestore";
import jwt from "jsonwebtoken";
import {authorization} from "../middleware/authorization.js"

const router = express.Router()
export default router;

router.get('/read/:id', authorization, async (req, res) => {
    try {
      const userRef = db.collection("users").doc(req.params.id);
      const response = await userRef.get();
      res.json(response.data());
    } catch(error) {
      res.send(error);
    }
  });

router.get('/read', authorization, async (req, res) => {
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

  router.post('/create', async (req, res) => {
    try {
      const saltRound = 10;

      bcrypt.genSalt(saltRound, (err, salt) => {
        bcrypt.hash(req.body.password, salt, async (err, hash_password) => {
          req.body.password = hash_password
          const userJson = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address
          };
          const usersDb = db.collection('users');
          await usersDb.doc(uuid()).set(userJson);
          res.json({ message: "created success" });
        })
      })
    } catch (error) {
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
      const datas = [];
      const email = req.body.email || "";
      const password = req.body.password || "";

      if (email === "" || password === "") {
        throw new Error("Missing field")
      }

      const q = query(collection(db, "users"), where("email", "==", email));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const id = doc.id
        datas.push({
          id,
          ...doc.data()
        })
      });

      if (datas.length < 1) {
        throw new Error("Email is incorrect. Please try again")
      }
      const data = datas[0];
      const isValidatePassword = await bcrypt.compareSync(password, data.password)
      if (!isValidatePassword) {
        throw new Error("Password incorrect. Please try again");
      }
      let payload = {
        userId: data.id
      }
      let token = jwt.sign(payload, 'secret', { expiresIn: "10h" });

      res.json({ login: "success", token , id: data.id})

    } catch (error) {
      next(error)
    }  
  })