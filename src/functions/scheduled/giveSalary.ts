import UserSalaries from "../../models/UserSalaries";
import UserCooldowns from "../../models/UserCooldowns";
import UserBank from "../../models/UserBank";
import { toMs } from 'ms-typescript';
import userBankLogging from "../log/userBankLogging";
import {GuildMember} from "discord.js";


const giveSalary = async (member: GuildMember) => {
    if (member.user.bot) {
        return;
    }

    const userId = member.user.id;
    const guildId = member.guild.id;

    console.log(userId);

    const query = {userId: userId, guildId: guildId};

    try {
        let userBank = await UserBank.findOne(query);

        if (!userBank) {
            return;
        }

        let userSalaries = await UserSalaries.findOne(query);

        if (!userSalaries || userSalaries.salaries.length === 0) {
            return;
        }

        let userCooldowns = await UserCooldowns.findOne(query);

        const currentDate = new Date();

        for (const salary of userSalaries.salaries) {
            if (!userCooldowns) {
                userCooldowns = new UserCooldowns({
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

                await userBankLogging(1, `Salary "${salary.name}" :`, `**+$${salary.amount}** ont été récupérés d'un salaire.`, userId, guildId);
            } else {
                for (const cooldown of userCooldowns.salariesCooldowns) {
                    if (cooldown.endsAt.toDateString() > currentDate.toDateString()) {
                    } else {
                        cooldown.endsAt.setTime(cooldown.endsAt.getTime() + salary.cooldown);

                        userBank.bankBalance += salary.amount;

                        await cooldown.save();
                        await userBank.save();

                        await userBankLogging(1, `Salary "${salary.name}" :`, `**+$${salary.amount}** ont été récupérés d'un salaire.`, userId, guildId);
                    }
                }


            }
        }
    } catch (e) {
        console.log(`An error occurred while trying to give salary to ${member.user.username} : ${e}`);
    }
}
export default giveSalary;
