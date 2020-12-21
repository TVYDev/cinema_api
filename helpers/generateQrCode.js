const QRCode = require('qrcode');

module.exports = async function (name, text) {
  try {
    await QRCode.toFile(`${process.env.FILE_GENERATED_PATH}/${name}`, text);
    return true;
  } catch (error) {
    return false;
  }
};
