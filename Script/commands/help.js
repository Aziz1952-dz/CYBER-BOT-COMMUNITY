module.exports.config = {
  name: "help",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CYBER BOT",
  description: "تعرف على الأوامر",
  commandCategory: "نظام",
  usages: "[اسم الأمر]",
  cooldowns: 5
};

module.exports.languages = {
  "ar": {
    "moduleInfo": "اسم: %1\nوش يدير: %2\nكيفاه تستعملو: %3\nالصنف: %4\nتوقيت الإنتظار: %5 ثانية\nاللازم تستعملو: %6",
    "helpList": "كاين %1 أمر فالبوت. باش تعرف تستعمل واحد: %2help اسم_الأمر",
    "user": "مستخدم عادي",
    "adminGroup": "أدمين فالمجموعة",
    "adminBot": "أدمين البوت"
  }
};

module.exports.run = function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());

  if (!command) {
    let msg = "⛩️ قائمة الأوامر:\n\n";
    for (let [name, value] of commands) {
      msg += `• ${name}\n`;
    }
    msg += `\nاستعمل: help [اسم الأمر] باش تعرف التفاصيل.`;
    return api.sendMessage(msg, threadID, messageID);
  }

  const info = getText(
    "moduleInfo",
    command.config.name,
    command.config.description,
    command.config.usages || "ماكاش تعليمات",
    command.config.commandCategory,
    command.config.cooldowns,
    (command.config.hasPermssion == 0) ? getText("user") :
    (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")
  );

  return api.sendMessage(info, threadID, messageID);
};
