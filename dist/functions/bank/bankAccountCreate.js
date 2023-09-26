"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const UserBank_1 = __importDefault(require("../../models/UserBank"));
const userBankLogging_1 = __importDefault(require("../log/userBankLogging"));
const bankAccountCreate = async (interaction) => {
    try {
        let userBank = await UserBank_1.default.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id
        });
        if (userBank) {
            const alreadyHaveAccountEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('Already Have Account Error :')
                .setDescription("Il existe déjà un compte bancaire marqué à votre nom. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [alreadyHaveAccountEmbed],
                ephemeral: true,
            });
            return;
        }
        userBank = new UserBank_1.default({
            userId: interaction.member.id,
            guildId: interaction.guild.id
        });
        const startMoney = 250;
        userBank.bankBalance += startMoney;
        userBank.save();
        const createAccountEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('Created Account :')
            .setDescription(`Votre compte bancaire a bien été créé en votre nom auprès de la banque Kastovienne. \n\nArgent de Départ : **$${userBank.bankBalance}**.`)
            .setColor("Green");
        await interaction.reply({
            embeds: [createAccountEmbed],
            ephemeral: true,
        });
        const actionName = "Account Create :";
        const content = `User <@${interaction.member.id}> created his account.`;
        const logUserId = interaction.member.id;
        const guildId = interaction.guild.id;
        await (0, userBankLogging_1.default)(0, actionName, content, logUserId, guildId);
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
        console.log(`Error with /bank account create: ${e}`);
    }
};
exports.default = bankAccountCreate;
