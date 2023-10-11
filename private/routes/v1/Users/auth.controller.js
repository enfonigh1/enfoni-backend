const router = require("express").Router();
const User = require("../../../schema/User");
const {
  registerValidation,
  loginValidation,
  emailValidation,
  passwordValidation,
  guestRegisterValidation,
} = require("./validation/validate");
const encrypted = require("../../../helpers/encrpted");
const bcrypt = require("bcrypt");
const generateTokens = require("../../../helpers/token");
const sendMail = require("../../../helpers/sendMail");

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
    const saveUser = await user.save();
    if (saveUser) {
      return res.json({ status: 200, message: "User created successfully" });
    }
  } else {
    const user = new User({
      full_name: full_name,
      email: email,
      password: encrypted(password),
    });
    const saveUser = await user.save();
    if (saveUser) {
      return res.json({ status: 200, message: "User created successfully" });
    }
  }
});

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
  const accessToken = await generateTokens(user);
  req.session.token = accessToken;
  const token = req?.session?.token;

  return res.json({
    status: 200,
    message: "Login successful",
    token: token,
    name: user?.full_name,
    email: user?.email,
    college_name: user?.college_name,
    student_id: user?.student_id,
    image: user?.image,
    user_id: user?._id,
    admin: user?.admin,
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
  const saveUser = await user.save();
  if (saveUser) {
    return res.json({ status: 200, message: "User created successfully" });
  }
});


module.exports = router;
