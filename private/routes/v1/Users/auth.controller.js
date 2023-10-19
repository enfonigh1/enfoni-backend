const router = require("express").Router();
const User = require("../../../schema/User");
const jwt = require("jsonwebtoken");
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
require("dotenv").config();

// REGISTER ENDPOINT
router.post("/signup", async (req, res) => {
  const { full_name, email, password } = req?.body;
  const college_name = req?.body?.college_name;
  const student_id = req?.body?.student_id;
  const phone_number = req?.body?.phone_number;
  const date_of_graduation = req?.body?.date_of_graduation;


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
    <p>Thank you for registering with <a href="https://enfonigh.com" style="color: green;">Enfonigh</a>. We are excited to have you on board.</p>
    <p>Kindly click on the link below to verify your email address.</p>
    <p>This link expires in 15 minutes.</p>
    <a href="http://localhost:3001/api/v1/verify-email?token=${accessToken}" style="color: green;">Verify Email</a>
    `
      if (saveUser) {
        await sendMail(email, mailBody)

        return res.json({ status: 200, message: "User created successfully" });
      }
    } catch (error) {

    }
  } else {




    const user = new User({
      full_name: full_name,
      email: email,
      password: encrypted(password),
    });
    try {
      const saveUser = await user.save();
      const { accessToken } = await generateTokens(saveUser);
      const mailBody = `
    <h1>Hi ${full_name},</h1>
    <p>Thank you for registering with <a href="https://enfonigh.com" style="color: green;">Enfonigh</a>. We are excited to have you on board.</p>
    <p>Kindly click on the link below to verify your email address.</p>
    <p>This link expires in 15 minutes.</p>
    <a href="https://enfoni.cyclic.app/api/v1/verify-email?token=${accessToken}" style="color: green;">Verify Email</a>
    `
      if (saveUser) {
        await sendMail(email, mailBody).then(res => console.log("Email sent", res)).catch(err => console.log(err))
        return res.json({ status: 200, message: "User created successfully" });
      }

    } catch (error) {

    }
  }
});

router.get("/verify-email", async (req, res) => {
  const token = req?.query?.token;
  // if (!!token) return res.json({ status: 400, message: "Invalid token" });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: verified._id });
    if (user) {
      const update = await User.updateOne({ _id: verified._id }, { $set: { verified: true } });
      if (update) {
        return res.sendFile(__dirname + '/public/index.html')
        // return res.json({ status: 200, message: "Email verified successfully" });
      }
    }
  } catch (error) {
    return res.json({ status: 400, message: "Invalid token" });
  }
})

// LOGIN ENDPOINT
router.post("/signin", async (req, res) => {
  const { email, password } = req?.body;
  const { error } = loginValidation(req.body);
  if (error) {
    return res.json({ status: 400, data: error.details[0].message });
  }

  //check if email exists & comparing passwords
  const user = await User.findOne({ email: email });
  if (!user) return res.json({ status: 400, message: "Invalid username" });

  // Encrypt Password
  const validPass = await bcrypt.compareSync(password, user?.password);
  if (!validPass) return res.json({ status: 400, message: "Invalid password" });
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


module.exports = router;
