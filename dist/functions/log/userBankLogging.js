"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserLogs_1 = __importDefault(require("../../models/UserLogs"));
const userBankLogging = async (actionId, actionName, content, logUserId, guildId) => {
    try {
        let userLogs = await UserLogs_1.default.findOne({
            userId: logUserId,
            guildId: guildId,
        });
        if (!userLogs) {
            userLogs = new UserLogs_1.default({
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
    }
    catch (e) {
        console.log(`A critical error occurred while trying to log Bank action : ${e}`);
    }
};
// @ts-ignore
exports.default = userBankLogging;
