import express from 'express'
import { createTransport } from 'nodemailer'
import cors from 'cors'
import { Router } from "express";
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const router = Router()

// server used to send send emails
const app = express();
const __dirname = dirname( fileURLToPath(import.meta.url) )
dotenv.config()
console.log(__dirname)
const PORT = process.env.PORT || 8500;
app.use(cors());
app.use(express.json());
app.use("/", router);


// console.log(process.env.EMAIL_USER);
// console.log(process.env.EMAIL_PASS);

const jereMail = "oyhamburo.jeremias@gmail.com"

const contactEmail = createTransport({
  service: 'gmail',
  auth: {
    user: jereMail,
    pass: "mwmqkpojuczeocdk"
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: jereMail,
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});




app.use(express.static(join(__dirname, '../dist')))

app.listen(PORT, () => console.log("Server Running in Port " + PORT));