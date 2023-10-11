const { uploadFile } = require("../Firebase/imageUpload.service");
const User = require("../../schema/User");

async function updateUser(req) {
  try {
    const image_url = await uploadFile(req.file, "enfoni");

    const result = await User.updateOne(
      {
        _id: req?.body?.id,
      },
      { image: image_url }
    );

    if (result != null) {
      return { message: "success", image_url };
    }
    return { message: "failed to update profile image, try again" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = { updateUser };
