const { uploadFile } = require("../Firebase/imageUpload.service");
const User = require("../../schema/User");

async function updateUser(req) {
  console.log(req?.body)
  try {
    const image_url = await uploadFile(req.file, "enfoni");

    const result = await User.updateOne(
      {
        _id: req?.body?.id,
      },
      { ...req?.body }
    );

    if (result != null) {
      return { message: "success", data: result };
    }
    return { message: "failed to update profile image, try again" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = { updateUser };
