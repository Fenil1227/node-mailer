const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../env.js");
//send mail from testing account
const signup = async (req, res) => {
  // ** testing account //
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  // send mail with defined transport object
  let message = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Successfully Register", // plain text body
    html: "<b>Successfully Register</b>", // html body
  };

  //   let info = await transporter.sendMail({
  //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //     to: "bar@example.com, baz@example.com", // list of receivers
  //     subject: "Hello ✔", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: "<b>Hello world?</b>", // html body
  //   });

//passport js with jwt and social media auth

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        msg: "You should receive an email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  // res.status(201).json("signup successfully");
};

// send mail from real gmail account
const getbill = (req, res) => {
  const { userEmail } = req.body;

  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name: "Fenil S",
      intro: "Your bill has arrived",
      table: {
        data: [
          {
            item: "Node mailer stack book",
            description: "A Backend app",
            price: "$10.99",
          },
        ],
      },
      outro: "Looking forward to do more business",
    },
  };
  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: userEmail,
    subject: "Place Order",
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "you should receive mail",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
  // res.status(201).json("getbill successfully");
};

module.exports = {
  signup,
  getbill,
};
