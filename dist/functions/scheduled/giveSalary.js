"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserSalaries_1 = __importDefault(require("../../models/UserSalaries"));
const UserCooldowns_1 = __importDefault(require("../../models/UserCooldowns"));
const UserBank_1 = __importDefault(require("../../models/UserBank"));
const userBankLogging_1 = __importDefault(require("../log/userBankLogging"));
const giveSalary = async (member) => {
    if (member.user.bot) {
        return;
    }
    const userId = member.user.id;
    const guildId = member.guild.id;
    console.log(userId);
    const query = { userId: userId, guildId: guildId };
    try {
        let userBank = await UserBank_1.default.findOne(query);
        if (!userBank) {
            return;
        }
        let userSalaries = await UserSalaries_1.default.findOne(query);
        if (!userSalaries || userSalaries.salaries.length === 0) {
            return;
        }
        let userCooldowns = await UserCooldowns_1.default.findOne(query);
        const currentDate = new Date();
        for (const salary of userSalaries.salaries) {
            if (!userCooldowns) {
                userCooldowns = new UserCooldowns_1.default({
                    userId: userId,
                    guildId: guildId,
                    salariesCooldowns: [
                        {
                            salaryId: salary.id,
                            salaryName: salary.name,
                            endsAt: Date.now() + salary.cooldown,
                        }
                    ]
                });
                await userCooldowns.save();
                userBank.bankBalance += salary.amount;
                await userBank.save();
                await (0, userBankLogging_1.default)(1, `Salary "${salary.name}" :`, `**+$${salary.amount}** ont été récupérés d'un salaire.`, userId, guildId);
            }
            else {
                for (const cooldown of userCooldowns.salariesCooldowns) {
                    if (cooldown.endsAt.toDateString() > currentDate.toDateString()) {
                    }
                    else {
                        cooldown.endsAt.setTime(cooldown.endsAt.getTime() + salary.cooldown);
                        userBank.bankBalance += salary.amount;
                        await cooldown.save();
                        await userBank.save();
                        await (0, userBankLogging_1.default)(1, `Salary "${salary.name}" :`, `**+$${salary.amount}** ont été récupérés d'un salaire.`, userId, guildId);
                    }
                }
            }
        }
    }
    catch (e) {
        console.log(`An error occurred while trying to give salary to ${member.user.username} : ${e}`);
    }
};
exports.default = giveSalary;
