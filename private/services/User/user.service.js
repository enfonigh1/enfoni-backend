const { uploadFile } = require("../Firebase/imageUpload.service");
const User = require("../../schema/User");
const sendMail = require("../../helpers/sendMail");
const UserCode = require("../../schema/UserCode");

async function updateUser(req) {
  // console.log(req?.body)
  try {
    // const image_url = await uploadFile(req.file, "enfoni");

    const result = await User.updateOne(
      {
        _id: req?.body?.id,
      },
      { ...req?.body }
    );

    const results = await User.findOne({ _id: req?.body?.id });
    // console.log(results)


    if (result != null) {
      const mailBody = `<h1>Hello ${results?.full_name}</h1>
      <p>Your order has been received and your code is ${results?.id?.slice(0, 6)?.toUpperCase()}
      please keep this code safe as it will be used to track your order</p>
      `
      sendMail(results?.email, mailBody).then(async (res) => {
        try {

          const result = await UserCode.create({ id: req?.body?.id, code: req?.body?.id?.slice(0, 6)?.toUpperCase() })
          console.log(result)
          if (result) {
            return { status: 200, mesage: "success" };
          }
        } catch (error) {
          return { message: "an error occurred, please try again" };
        }
      })
      return { status: 200, data: result };
    }
    return { message: "failed to update profile image, try again" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

async function pushCodeBook(req) {
  const results = await User.find({ _id: req?.body?.id })

  try {
    if (results && results?.gown === true || results?.photoshoot === true) {
      if (req?.body?.code === results?._id?.slice(0, 6)?.toUpperCase()) {
        const result = await User.updateOne(
          {
            _id: req?.body?.id,
          },
          { gown: true, photoshoot: true }
        );
        return { status: 200, data: result };
      } else {
        return { status: 400, data: "Invalid code" };
      }
    }
    // return { status: 200, data: result };
    // return { status: 400, data: "Invalid code" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = { updateUser, pushCodeBook };
