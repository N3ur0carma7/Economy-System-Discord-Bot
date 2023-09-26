import UserLogs from "../../models/UserLogs";
import { EmbedBuilder } from 'discord.js';

const userBankLogging = async (actionId: any, actionName: any, content: any, logUserId: any, guildId: any) => {
    try {
        let userLogs = await UserLogs.findOne({
            userId: logUserId,
            guildId: guildId,
        });

        if (!userLogs) {
            userLogs = new UserLogs({
                userId: logUserId,
                guildId: guildId,
            });
        }

        userLogs.bankLogs.push({
            actionId: actionId,
            content: content,
            actionName: actionName,
            time: new Date(),
        });

        await userLogs.save();
    } catch (e) {
        console.log(`A critical error occurred while trying to log Bank action : ${e}`);
    }
}

// @ts-ignore
export default userBankLogging;