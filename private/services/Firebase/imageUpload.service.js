/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const app = require("../../config/firebase.config");

const storage = getStorage(app);

async function uploadFile(file, base_dir_name) {
  let imageUrl = "";

  try {
    const name = file.originalname.replace(/ /g, "_").split(".")[0];
    const type = file.originalname.split(".")[1];
    const fileName = `${name}.${type}`;

    const storageRef = ref(storage, `${base_dir_name}/${fileName}`);

    const metadata = {
      contentType: file.mimetype,
    };

    await uploadBytes(storageRef, file.buffer, metadata).then(
      // eslint-disable-next-line no-unused-vars
      async (snapshot) => {
        await getDownloadURL(storageRef).then((url) => {
          imageUrl = url;
        });
      }
    );

    return imageUrl;
  } catch (error) {
    return "";
  }
}

module.exports = { uploadFile };
