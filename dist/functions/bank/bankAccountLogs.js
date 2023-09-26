"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const UserLogs_1 = __importDefault(require("../../models/UserLogs"));
const bankAccountLogs = async (interaction, user, actionFilter) => {
    try {
        if (!interaction.member.roles.cache.some(r => ["Kastov en chef de l'économie", "Banquier"].includes(r.name))) {
            const noPermissionEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('No Permission Error :')
                .setDescription("Vous ne possédez pas les permissions nécessaires afin d'exécuter cette commande. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [noPermissionEmbed],
                ephemeral: true,
            });
            return;
        }
        async function obtainLogsWithFilter(userId, guildId, filter) {
            let query = {
                userId,
                guildId,
            };
            if (filter) {
                let query = {
                    userId,
                    guildId,
                    bankLogs: [
                        {
                            actionId: filter,
                        },
                    ],
                };
            }
            let userLogs = await UserLogs_1.default.findOne(query);
            if (!userLogs) {
                const noBankLogsEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle('No Bank Logs Error :')
                    .setDescription(`Le membre <@${user}> ne possède pas de logs de son compte bancaire. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*`)
                    .setColor("Red");
                await interaction.reply({
                    embeds: [noBankLogsEmbed],
                    ephemeral: true,
                });
                return;
            }
            const bankLogsEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('Bank logs :')
                .setDescription(`Voici les logs bancaires de <@${user}> :`)
                .setColor("Blue");
            if (actionFilter) {
                const newArr = userLogs.bankLogs.filter(object => {
                    return object.actionId === actionFilter;
                });
                newArr.forEach((log, index) => {
                    bankLogsEmbed.addFields({ name: `${index + 1}. ${log.actionName}`, value: `${log.content} \nTime : ${log.time.toDateString()}` });
                });
            }
            else {
                userLogs.bankLogs.forEach((log, index) => {
                    bankLogsEmbed.addFields({ name: `${index + 1}. ${log.actionName}`, value: `${log.content} \nTime : ${log.time.toDateString()}` });
                });
            }
            await interaction.reply({
                embeds: [bankLogsEmbed],
                ephemeral: true,
            });
        }
        await obtainLogsWithFilter(user, interaction.guild.id, actionFilter);
    }
    catch (e) {
        const failEmbed = new discord_js_1.EmbedBuilder()
            .setTitle("Code Error :")
            .setDescription("Une erreur est survenue dans le code. Veillez contacter <@580160894395219968>")
            .setColor("Red");
        try {
            await interaction.reply({
                embeds: [failEmbed],
                ephemeral: true
            });
        }
        catch (e) {
            await interaction.followUp({
                embeds: [failEmbed],
                ephemeral: true
            });
        }
        console.log(`Error with /bank account logs: ${e}`);
    }
};
exports.default = bankAccountLogs;
