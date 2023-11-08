const router = require("express").Router();
const User = require("../../../schema/User");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid")
const {
  registerValidation,
  loginValidation,
  emailValidation,
  passwordValidation,
  guestRegisterValidation,
} = require("./validation/validate");
const encrypted = require("../../../helpers/encrpted");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../../../helpers/token");
const sendMail = require("../../../helpers/sendMail");
const RecoveryCode = require("../../../schema/RecoveryCode");
const getFirstName = require("../../../helpers/retrieve_first_name");
const PhotoGrapher = require("../../../schema/PhotoGrapher");
const photographerSender = require("../../../helpers/photographersEmail");
const welcome = require("../../../helpers/welcome");
const onboarded = require("../../../helpers/onboarded");
const password_reset = require("../../../helpers/password_reset");
const Usher = require("../../../schema/Usher");
require("dotenv").config();

// REGISTER ENDPOINT
router.post("/signup", async (req, res) => {
  const { full_name, email, password, usher } = req?.body;
  const college_name = req?.body?.college_name;
  const student_id = req?.body?.student_id;
  const phone_number = req?.body?.phone_number;
  const date_of_graduation = req?.body?.date_of_graduation;
  console.log(req?.body)


  // Validate Request
  const { error } = registerValidation(req.body);
  if (error) {
    return res.json({
      status: 400,
      data: error.details[0].message.replace(/"/g, ""),
    });
  }

  // Check if Email Exist
  const emailExists = await User.findOne({ email: email });
  if (emailExists)
    return res.json({ status: 400, message: "User already exists" });

  // Check if user wants to register and book
  if (college_name && student_id) {
    const user = new User({
      full_name: full_name,
      email: email,
      password: encrypted(password),
      college_name: college_name,
      student_id: student_id,
      phone_number: phone_number,
      date_of_graduation: date_of_graduation,
    });
    try {
      const saveUser = await user.save();
      const { accessToken } = await generateTokens(saveUser);
      console.log(accessToken)
      const mailBody = `
      <h1>Hi ${full_name},</h1>
      <p>Thank you for registering with Enfonigh. We are excited to have you on board.</p>
      <p>Kindly click on the link below to verify your email address.</p>
      <p>This link expires in 15 minutes.</p>
      <a href="http://enfoni.cyclic.app/api/v1/verify-email?token=${accessToken}" style="color: green;">Verify Email</a>
      `
      if (saveUser) {
        await sendMail(email, welcome(accessToken))

        return res.json({ status: 200, message: "User created successfully" });
      }
    } catch (error) {

    }
  } else {

    const user = new User({
      full_name: full_name,
      email: email,
      password: encrypted(password),
      usher: usher
    });
    try {
      const saveUser = await user.save();
      const { accessToken } = await generateTokens(saveUser);
      const mailBody = `
      <h1>Hi ${full_name},</h1>
      <p>Thank you for registering with Enfonigh. We are excited to have you on board.</p>
      <p>Kindly click on the link below to verify your email address.</p>
      <p>This link expires in 15 minutes.</p>
      <a href="https://enfoni.cyclic.app/api/v1/verify-email?token=${accessToken}" style="color: green;">Verify Email</a>
      `
      if (saveUser) {
        await sendMail(email, welcome(accessToken)).then(res => console.log("Email sent")).catch(err => console.log(err))
        return res.json({ status: 200, message: "User created successfully" });
      }

    } catch (error) {

    }
  }
});

router.post("/resend-token", async (req, res) => {
  const { email } = req?.body;
  const { error } = emailValidation(req.body);
  if (error) {
    return res.json({ status: 400, data: error.details[0].message });
  }

  // Check if Email Exist
  const emailExists = await User.findOne({ email: email });
  if (!emailExists)
    return res.json({ status: 400, message: "User does not exist" });

  const { accessToken } = await generateTokens(emailExists);
  const mailBody = `
    <h1>Hi ${emailExists.full_name},</h1>
    <p>Thank you for registering with Enfonigh. We are excited to have you on board.</p>
    <p>Kindly click on the link below to verify your email address.</p>
    <p>This link expires in 15 minutes.</p>
    <a href="https://enfoni.cyclic.app/api/v1/verify-email?token=${accessToken}" style="color: green;">Verify Email</a>
    `
  if (emailExists) {
    await sendMail(email, welcome(accessToken))
    return res.json({ status: 200, message: "User created successfully" });
  }
})

router.get("/verify-email", async (req, res) => {
  const token = req?.query?.token;
  // if (!!token) return res.json({ status: 400, message: "Invalid token" });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: verified._id });
    if (user) {
      const update = await User.updateOne({ _id: verified._id }, { $set: { verified: true } });
      if (update) {
        res.sendFile(__dirname + '/public/index.html')
        sendMail(user?.email, onboarded(user?.full_name))
        return
      }
      // onboarded(user[0]?.full_name)
      // return res.json({ status: 200, message: "Email verified successfully" });

    }
  } catch (error) {
    return res.json({ status: 400, message: "Invalid token" });
  }
})

// LOGIN ENDPOINT
router.post("/signin", async (req, res) => {
  const { email, password } = req?.body;
  // const { error } = loginValidation(req.body);
  // if (error) {
  //   return res.json({ status: 400, data: error.details[0].message });
  // }

  //check if email exists & comparing passwords
  const user = await User.findOne({ email: email });
  const photouser = await PhotoGrapher.findOne({ email: email });
  if (!user || !photouser) return res.json({ status: 400, message: "Invalid credentials" });

  // Encrypt Password
  const validPass = await bcrypt.compareSync(password, user?.password);
  if (!validPass) return res.json({ status: 400, message: "Invalid password" });

  if (user?.verified === false) return res.json({ status: 400, message: "Please verify your email address", verified: false });
  const { accessToken, refreshToken } = await generateTokens(user);
  // res?.cookie('token', accessToken, { maxAge: 3600000, httpOnly: true });


  res.header("auth-token", accessToken).json({
    status: 200,
    message: "Login successful",
    name: user?.full_name,
    email: user?.email,
    college_name: user?.college_name,
    student_id: user?.student_id,
    image: user?.image,
    user_id: user?._id,
    admin: user?.admin,
    phone_number: user?.phone_number,
    verified: user?.verified,
    gown: user?.gown,
    photoshoot: user?.photoshoot,
    accessToken,
    refreshToken,
    accessTokenExpiresAt: 2592000,
    refreshTokenExpireAt: 2592000,
  });
});

// send email to user to start password reset process
router.post("/recover_password", async (req, res) => {
  const { email } = req.body;

  //simple validation of the email and password
  const { error } = emailValidation(req.body);
  if (error)
    return res.json({ status: 400, message: error.details[0].message });
  const isUserEmail = await User.findOne({ email: email });
  if (!isUserEmail) {
    return res.json({
      status: 400,
      message: "User does not exist. Please create an account instead",
    });
  }

  let code = `${uuid()}`.substring(0, 6).toUpperCase();
  let first_name = await getFirstName(email);
  let mail_body = `
    <h1>Hi ${first_name},</h1>
    <p>Kindly use the code below to reset your password.</p>
    <p>This code expires in 15 minutes.</p>
    <h2>${code}</h2>
  `;

  // if (email === "") {
  //   return res.status(400).json({ message: "user email not provided." });
  // }

  await sendMail(email, password_reset(code))
    .then(async (result) => {
      // set the code sent to the user
      // this will be validated against to check if user has permission to change
      // password
      const codeCreated = await RecoveryCode.create({ email, code })
      if (codeCreated) {
        return res.status(200).json({
          message: "Code sent successfully",
          data: result,
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Could not send verification code. Try again later.",
        data: err,
      });
    });
});
// Make sure to import the RecoveryCode model

// verify password reset verification code sent to the user
// to allow a user to change their password.
router.post("/verify_code", async (req, res) => {
  const { code, email } = req.body;

  const msInMinute = 60 * 1000;
  const current_date = new Date();

  try {
    const result = await RecoveryCode.findOne(
      { email, code },
      { createdAt: 1 }
    );

    if (!result) {
      return res.status(400).json({ message: "Could not verify code. Please try again" });
    }

    const code_date = new Date(result.createdAt);
    const time_elapsed = current_date - code_date;

    if (Math.abs(time_elapsed / msInMinute) > 15) {
      return res.status(400).json({ message: "Code has expired. Please try again" });
    }

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", data: error });
  }
});


// RESET PASSWORD ENPOINT
router.put("/reset-password", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //simple validation of the email and password
  const { error } = passwordValidation(req.body);
  if (error)
    return res.json({ status: 400, message: error.details[0].message });
  const isUserEmail = await User.findOne({ email: email });
  if (!isUserEmail) {
    return res.json({
      status: 400,
      message: `No user with the email ${email}`,
    });
  }

  let updatePassword = await User.updateOne(
    { email },
    { $set: { password: encryptPassword(password) } }
  );
  if (updatePassword)
    return res.json({ status: 200, message: "Password reset completed" });
  return res.status(400).json({ message: "Failed to reset password" });
});

// GUEST USER SIGNUP ENDPOINT
router.post("/guest-signup", async (req, res) => {
  const { email } = req?.body;
  const { password } = req?.body;
  const { error } = guestRegisterValidation(req.body);
  if (error) {
    return res.json({ status: 400, data: error.details[0].message });
  }

  // Check if Email Exist
  const emailExists = await User.findOne({ email: email });
  if (emailExists)
    return res.json({ status: 400, message: "User already exists" });

  const user = new User({
    ...req?.body,
    password: encrypted(password),
  });
  const saveUser = await user.save();
  if (saveUser) {
    return res.json({ status: 200, message: "User created successfully" });
  }
});


// ADMIN SIGNUP ENDPOINT
router.post("/admin-signup", async (req, res) => {
  const { email } = req?.body;
  const { password } = req?.body;
  const { error } = guestRegisterValidation(req.body);
  if (error) {
    return res.json({ status: 400, data: error.details[0].message });
  }

  // Check if Email Exist
  const emailExists = await User.findOne({ email: email });
  if (emailExists)
    return res.json({ status: 400, message: "User already exists" });

  const user = new User({
    ...req?.body,
    password: encrypted(password),
    admin: true
  });
  try {
    const saveUser = await user.save();
    if (saveUser) {
      await sendMail()
      return res.json({ status: 200, message: "User created successfully" });
    }
  } catch (err) {
    return res.json({ status: 400, message: err });
  }
});


// FOR PHOTOGRAPHERS

// REGISTER PHOTOGRAPHER
router.post("/register-photographer", async (req, res) => {
  const { full_name, email, password } = req?.body;

  // Validate Request
  const { error } = registerValidation(req.body);
  if (error) {
    return res.json({
      status: 400,
      data: error.details[0].message.replace(/"/g, ""),
    });
  }

  // Check if Email Exist
  const emailExists = await PhotoGrapher.findOne({ email: email });
  if (emailExists)
    return res.json({ status: 400, message: "User already exists" });

  const user = new PhotoGrapher({
    full_name: full_name,
    email: email,
    password: encrypted(password),
  });
  try {
    const saveUser = await user.save();
    const { accessToken } = await generateTokens(saveUser);
    // const mailBody = `
    // <h1>Hi ${full_name?.split(" ")[0]},</h1>
    // <p>Thank you for registering with Enfonigh. We are excited to have you on board.</p>
    // <p>Kindly click on the link below to verify your email address.</p>
    // <p>This link expires in 24 hours.</p>
    // <a href="https://enfoni.cyclic.app/api/v1/verify-email?token=${accessToken}" style="color: green;">Verify Email</a>
    // `
    if (saveUser) {
      await photographerSender(email, welcome(accessToken)).then(res => console.log("Email sent")).catch(err => console.log(err))
      return res.json({ status: 200, message: "User created successfully" });
    }

  } catch (error) {

  }

});

// SAME DAY BOOKING

router.post("same-day-booking", async (req, res) => {
  // check if number exist
  const { phone_number } = req?.body
  const { frame_info } = req?.body
  const numberExist = await User.find({ phone_number })
  if (numberExist) return res.json({ status: 400, message: "User has already booked with this number" })

  const results = new User({
    ...req?.body,
    frame: { ...frame_info }
  })

  if (results) {

  }

})


// RESEND PHOTOGRAPHER TOKEN
router.post("/resend-photographer-token", async (req, res) => {
  const { email } = req?.body;
  const { error } = emailValidation(req.body);
  if (error) {
    return res.json({ status: 400, data: error.details[0].message });
  }

  // Check if Email Exist
  const emailExists = await PhotoGrapher.findOne({ email: email });
  if (!emailExists)
    return res.json({ status: 400, message: "User does not exist" });

  const { accessToken } = await generateTokens(emailExists);
  const mailBody = `
    <h1>Hi ${emailExists.full_name},</h1>
    <p>Thank you for registering with Enfonigh. We are excited to have you on board.</p>
    <p>Kindly click on the link below to verify your email address.</p>
    <p>This link expires in 24 hours.</p>
    <a href="http://localhost:3001/api/v1/verify-email?token=${accessToken}" style="color: green;">Verify Email</a>
    `
  if (emailExists) {
    await sendMail(email, mailBody)
    return res.json({ status: 200, message: "User created successfully" });
  }
})

// VERIFY PHOTOGRAPHER EMAIL
router.get("/verify-photographer-email", async (req, res) => {
  const token = req?.query?.token;
  // if (!!token) return res.json({ status: 400, message: "Invalid token" });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await PhotoGrapher.findOne({ _id: verified._id });
    if (user) {
      const update = await PhotoGrapher.updateOne({ _id: verified._id }, { $set: { verified: true } });
      if (update) {
        return res.sendFile(__dirname + '/public/index.html')
        // return res.json({ status: 200, message: "Email verified successfully" });
      }
    }
  } catch (error) {
    return res.json({ status: 400, message: "Invalid token" });
  }
})


// USHER LOGIN WITH CODE
router.post("/usher/login", async (req, res) => {
  try {
    const { code } = req?.body

    // Check if user exist with code
    const usher = await Usher.findOne({ code: code })
    if (usher) {
      return res.json({ status: 200, data: usher })
    } else {
      return res.json({ status: 400, message: "Invalid QR Code" })
    }
  } catch (error) {
    return res.json({ data: error.message })
  }
})


module.exports = router;
