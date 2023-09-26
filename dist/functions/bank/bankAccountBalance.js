"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const UserBank_1 = __importDefault(require("../../models/UserBank"));
const bankAccountBalance = async (interaction) => {
    try {
        let userBank = await UserBank_1.default.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id
        });
        if (!userBank) {
            const noAccountEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('No Account Error :')
                .setDescription("Tu ne peux pas consulter l'argent que tu possèdes sans compte bancaire *(/Bank Accounts account create)*. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [noAccountEmbed],
                ephemeral: true,
            });
            return;
        }
        const accountBalanceEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('Account Balance :')
            .setDescription(`Tu possède actuellement **$${userBank.bankBalance}** sur ton compte bancaire.`)
            .setColor("Blue");
        await interaction.reply({
            embeds: [accountBalanceEmbed],
            ephemeral: true,
        });
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
        console.log(`Error with /bank account balance: ${e}`);
    }
};
exports.default = bankAccountBalance;
