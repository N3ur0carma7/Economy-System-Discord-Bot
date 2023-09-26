"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const UserBank_1 = __importDefault(require("../../models/UserBank"));
const userBankLogging_1 = __importDefault(require("../log/userBankLogging"));
const bankAccountShow = async (interaction) => {
    try {
        let userBank = await UserBank_1.default.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id,
        });
        if (!userBank) {
            const noAccountEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('No Account Error :')
                .setDescription("Tu ne peux pas montrer l'argent que tu possèdes sans compte bancaire *(/bank Accounts account create)*. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [noAccountEmbed],
                ephemeral: true,
            });
            return;
        }
        const confirmButton = new discord_js_1.ButtonBuilder()
            .setLabel('Oui')
            .setStyle(discord_js_1.ButtonStyle.Success)
            .setCustomId('confirm');
        const cancelButton = new discord_js_1.ButtonBuilder()
            .setLabel('Non')
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setCustomId('cancel');
        const buttonRow = new discord_js_1.ActionRowBuilder().addComponents(confirmButton, cancelButton);
        const confirmationEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('Confirmation :')
            .setDescription("Êtes-vous sûr de vouloir montrer l'argent de votre compte bancaire en public ?")
            .setColor("Yellow");
        const reply = await interaction.reply({
            embeds: [confirmationEmbed],
            components: [buttonRow],
            ephemeral: true,
        });
        const filter = (i) => i.user.id === interaction.user.id;
        const collector = reply.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            filter,
            time: 30000,
        });
        let trigger = 0;
        collector.on('collect', async (interaction) => {
            if (trigger === 1) {
                return;
            }
            if (interaction.customId === 'confirm') {
                const balanceShareEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle('Balance Share :')
                    // @ts-ignore
                    .setDescription(`<@${interaction.user.id}> a partagé son solde bancaire. \nIl possède : **$${userBank.bankBalance}**`)
                    .setColor("DarkGreen");
                interaction.reply({
                    embeds: [balanceShareEmbed],
                });
                const actionName = "Account Balance Share :";
                const content = `User <@${interaction.member.id}> shared his account balance in <#${interaction.channel.id}>.`;
                const logUserId = interaction.member.id;
                await (0, userBankLogging_1.default)(3, actionName, content, logUserId, interaction.guild.id);
                trigger = 1;
                return;
            }
            if (interaction.customId === 'cancel') {
                const balanceShareCancelEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle('Cancellation :')
                    .setDescription("L'action a bien été annulée.")
                    .setColor("DarkRed");
                const failEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle("Code Error :")
                    .setDescription("Une erreur est survenue dans le code. Veillez contacter <@580160894395219968>")
                    .setColor("Red");
                interaction.reply({
                    embeds: [failEmbed],
                    ephemeral: true,
                });
                trigger = 1;
            }
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
            console.log(`Failed to process interaction.reply: ${e}`);
        }
        console.log(`Error with /bank daily: ${e}`);
    }
};
exports.default = bankAccountShow;
