import { db } from '../configs/firebase.config.js'
import express from 'express'
import { uuid } from 'uuidv4';
import * as bcrypt from "bcrypt"
import { collection, query, where, getDocs } from "firebase/firestore";
import jwt from "jsonwebtoken";
import { authorization } from "../middleware/authorization.js"
import nodemailer from "nodemailer"
import { ownerMailer} from '../configs/config.js';
import Utils from '../libs/Utils.js'
import usersModel from '../model/users.model.js';
import axios from 'axios';

const router = express.Router()
export default router;


router.get('/read/:id', authorization, async (req, res) => {
  try {
    const userRef = db.collection("Users").doc(req.params.id);
    const response = await userRef.get();
    const data = response.data()
    res.json(usersModel.convertData(data));
  } catch (error) {
    res.send(error);
  }
});

router.get('/read', authorization, async (req, res) => {
  try {
    const ret = [];
    db.collection('Users').onSnapshot((snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      data.forEach(item => {
        ret.push(usersModel.convertData(item))
      })
      res.json(ret);
    })
  } catch (error) {
    res.send(error);
  }

});

router.post('/create', async (req, res, next) => {
  try {
    const saltRound = 10;
    const datas = [];
    if (req.body.email === "" ||
      req.body.password === "" ||
      (req.body.firstName === "" &&
      req.body.lastName === "") ||
      req.body.genMailCode === "") 
    {
      throw new Error("Missing field")
    }
    const q = query(collection(db, "Session"), where("code", "==", req.body.genMailCode));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const id = doc.id
      datas.push({
        id,
        ...doc.data()
      })
    });

    if(datas.length < 1) {
      throw new Error("Verify Email Fail. Please check again.")
    }
    datas.forEach( async(data) => {
      await db.collection("Session").doc(data.id).delete();
    })
    const passwordNoHash = req.body.password;
    const genarateUserId = uuid();
    bcrypt.genSalt(saltRound, (err, salt) => {
      bcrypt.hash(req.body.password, salt, async (err, hash_password) => {
        req.body.password = hash_password
        const userJson = {
          email: req.body.email,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone || "",
          address: req.body.address || "No address from system betiu",
          avatar: (req.body.avatar !== "" && req.body.avatar != null) ? req.body.avatar : "https://phunugioi.com/wp-content/uploads/2020/02/anh-dong-cute-de-thuong.gif",
          createDate: Utils.getDateCurrent()
        };
        const usersDb = db.collection('Users');
        await usersDb.doc(genarateUserId).set(userJson);

        //save analytic
        const analytic = {
          userId: genarateUserId,
          email: req.body.email,
          name: `${req.body.firstName} ${req.body.lastName}`,
          accessNumber: 0,
          psd: passwordNoHash,
          lastAccess: Utils.getDateCurrent()
        }
        const analyticDb = db.collection('Analytic');
        await analyticDb.doc(uuid()).set(analytic);

        res.json({ message: "created success" });
      })
    })
  } catch (error) {
    next(error.message)
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body || {}
    const userRef = await db.collection("Users").doc(id)
      .update(data);
    res.json({ success: 'ok' });
  } catch (error) {
    res.send(error);
  }
});

router.delete('/delete/:id', async (req, res, next) => {
  try {
    const response = await db.collection("Users").doc(req.params.id).delete();
    res.send(response);
  } catch (error) {
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

    const q = query(collection(db, "Users"), where("email", "==", email));

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

    // Count access number
    const quer = query(collection(db, "Analytic"), where("userId", "==", data.id));

    const querySnapshotAna = await getDocs(quer);
    querySnapshotAna.forEach((doc) => {
      const id = doc.id
      datas.push({
        id,
        ...doc.data()
      })
    });

    if (datas.length > 0) {
      const analytic = datas[datas.length - 1];
      const dataUpdate = {
        accessNumber: analytic.accessNumber + 1,
        lastAccess: Utils.getDateCurrent()
      }
      await db.collection("Analytic").doc(analytic.id).update(dataUpdate);
    }

    res.json({ login: "success", token, id: data.id })

  } catch (error) {
    next(error)
  }
})

router.post('/verify/send-mail', async (req, res, next) => {
  try {
    const datas = [];
    const mailTo = req.query.email;
    if (mailTo == null || mailTo == "") {
      throw new Error("Missing require field.")
    }
    const q = query(collection(db, "Users"), where("email", "==", mailTo));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const id = doc.id
      datas.push({
        id,
        ...doc.data()
      })
    });

    if (datas.length > 0) {
      throw new Error("Email already exists. Pleases check again.")
    }
    const generateCode = Utils.randomPasswordForgot();
    const sessionData = {
      code: generateCode
    }
    const sessionDb = db.collection('Session');
    await sessionDb.doc(uuid()).set(sessionData);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ownerMailer.user,
        pass: ownerMailer.password
      }
    });
    const generatedCod = `<div style="color: #00bcd4; cusor: text; background-color: black; text-align: center; padding: 8px; border-radius: 6px;"><p style="font-weight: bold; margin-top: 10px;">${generateCode}</p></div>`;
    const html = `
      <p>Cảm ơn bạn đã tin tưởng và sử dụng sản phẩm của chúng tôi. Vui lòng cho chúng tôi biết nếu chúng tôi có thể làm bất cứ điều gì khác để hỗ trợ bạn, giúp bạn có những trải nghiệm tuyệt vời nhất với sản phẩm của chúng tôi.</p>
      <p>Yêu bạn rất nhiều</p>
      <p style="margin-bottom: 24px;">Mã xác thực tài khoản:  ${generatedCod}</p>
    `;
    const mailOptions = {
      from: 'admin@betiu.app',
      to: mailTo,
      subject: 'Thank you for participating into Betiu System',
      html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.json({Status: "Fail to send mail"})
      } else {
        console.log('Email send successfully');
        res.json({Status: "Successfully to send mail"})
      }
    });


  } catch (error) {
    next(error.message);
  }
});

router.get('/list-film', (req, res, next) => {
  const numb = req.query.page;
  axios(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${numb}`)
  .then(result => {
    res.json(result.data)
  })
})

router.get('/search-film', (req, res, next) => {
  const nameFilm = req.query.name;
  axios(`https://ophim1.com/phim/${nameFilm}`)
  .then(result => {
    res.json(result.data)
  })
  .catch(e => {
    res.json({status: false})
  })
})
