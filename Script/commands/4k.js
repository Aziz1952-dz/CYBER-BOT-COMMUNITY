module.exports.config = {
    name: "تغيير_الاسم",
    version: "1.0.0",
    hasPermssion: 1,
    credits: " by aziz",
    description: "تغيير اسماء جميع المجموعات دفعة واحدة",
    commandCategory: "النظام",
    usages: "[الاسم الجديد]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const name = args.join(" ");
    if (!name) {
        return api.sendMessage("⚠️ الرجاء كتابة الاسم الجديد للمجموعات", event.threadID);
    }

    const allThreads = await api.getThreadList(100, null, ["INBOX"]);
    const groupThreads = allThreads.filter(thread => thread.isGroup);
    
    let successCount = 0;
    let failCount = 0;

    api.sendMessage(`⏳😐 جاري تغيير اسم ${groupThreads.length} مجموعة...`, event.threadID);

    for (const thread of groupThreads) {
        try {
            await api.setTitle(name, thread.threadID);
            successCount++;
            // Add delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
            failCount++;
        }
    }

    return api.sendMessage(
        `✅ تم تغيير اسم المجموعات بنجاح\n` +
        `🎯 نجح في: ${successCount} مجموعة\n` +
        `❌ فشل في: ${failCount} مجموعة`,
        event.threadID
    );
};
