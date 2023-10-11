const { uploadFile } = require("../Firebase/imageUpload.service");
const Frame = require("../../schema/userFrame");

async function bookPhotoshoot(req) {
  try {
    const image_url = await uploadFile(req.file, "photoshoot");
    const { id, picture, student_id, full_name, college_name } = req?.body;

    const result = await Frame.create({
      id,
      full_name,
      college_name,
      student_id,
      image: image_url,
    });

    if (result != null) {
      return { message: "success" };
    }
    return { message: "failed to update profile image, try again" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = { bookPhotoshoot };
