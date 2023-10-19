const { uploadFile } = require("../Firebase/imageUpload.service");
const User = require("../../schema/User");
const sendMail = require("../../helpers/sendMail");

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


    if (result != null) {
      const mailBody = `<h1>Hello ${results?.full_name}</h1>
      <p>Your order has been received and your code is ${results?.id?.slice(0, 6)?.toUpperCase()}
      please keep this code safe as it will be used to track your order</p>
      `
      sendMail(results?.email, mailBody)
      return { status: 200, data: result };
    }
    return { message: "failed to update profile image, try again" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = { updateUser };
