module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "تم التعديل باللهجة الجزائرية",
    description: "ترحيب بالأعضاء الجدد مع صورة/فيديو عشوائي",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "joinMedia");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    const path2 = join(path, "random");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });
};

module.exports.run = async function({ api, event }) {
    const { threadID } = event;
    const { join } = global.nodemodule["path"];
    const { createReadStream, readdirSync, existsSync } = global.nodemodule["fs-extra"];

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        const botName = global.config.BOTNAME || "البوت تاعي";
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${botName}`, threadID, api.getCurrentUserID());

        return api.sendMessage(
            {
                body: `مرحبا بيكم خاوتي! راني فرحان نكون معاكم في هاد القروب.\nأي حاجة تحتاجوها، كتبولي ${global.config.PREFIX}help\nالبوت: ${botName}`,
                attachment: createReadStream(__dirname + "/cache/joinMedia/botWelcome.mp4")
            },
            threadID
        );
    } else {
        try {
            const threadInfo = await api.getThreadInfo(threadID);
            const threadName = threadInfo.threadName;
            const memberCount = threadInfo.participantIDs.length;
            let mentions = [], names = [];

            for (const p of event.logMessageData.addedParticipants) {
                names.push(p.fullName);
                mentions.push({ tag: p.fullName, id: p.userFbId });
            }

            const msg = `أهلا وسهلا بيك ${names.join(', ')}!\nراك/راكم وليتو فرد/فرد من عايلتنا فـ "${threadName}"!\nعددكم في القروب: ${memberCount} عضو.\nكيما يقولو: الدار داركم!\n${global.config.PREFIX}help باش تشوف الأوامر.`;

            const mediaFolder = join(__dirname, "cache", "joinMedia", "random");
            let attachment = null;

            if (existsSync(mediaFolder)) {
                const files = readdirSync(mediaFolder);
                if (files.length > 0) {
                    const randomFile = files[Math.floor(Math.random() * files.length)];
                    attachment = createReadStream(join(mediaFolder, randomFile));
                }
            }

            return api.sendMessage({ body: msg, attachment, mentions }, threadID);
        } catch (err) {
            console.error("خطأ في كود الترحيب:", err);
        }
    }
};
