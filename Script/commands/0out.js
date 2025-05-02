const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "فاصي",
  version: "1.0.2",
  credits: "dz_bot",
  description: "يحذف كامل ملفات الأوامر .js من مجلد commands",
  usage: "[خاص بالأدمن فقط]"
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  // نجيب قائمة الأدمن من config.js
  const adminIDs = global.config.ADMINBOT;

  if (!adminIDs.includes(senderID)) {
    return api.sendMessage("❌ هاذا الأمر خاص بالأدمن لي راهو فـ config.js برك!", threadID);
  }

  try {
    const commandsFolder = path.join(__dirname);
    const files = fs.readdirSync(commandsFolder).filter(file => file.endsWith(".js") && file !== "فاصي.js");

    if (files.length === 0) {
      return api.sendMessage("✅ ماكان حتى أوامر باش نفاصيهم!", threadID);
    }

    files.forEach(file => fs.unlinkSync(path.join(commandsFolder, file)));
    api.sendMessage(`✅ تفصاو ${files.length} أوامر من مجلد commands!`, threadID);
  } catch (err) {
    console.error("❌ خطأ أثناء عملية الفاصي:", err);
    api.sendMessage("❌ صرا خطأ كي كنت نحاول نفاصي الملفات.", threadID);
  }
};
