"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const UserSalaries_1 = __importDefault(require("../../models/UserSalaries"));
const UserBank_1 = __importDefault(require("../../models/UserBank"));
const ms_typescript_1 = require("ms-typescript");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const userBankLogging_1 = __importDefault(require("../log/userBankLogging"));
const companySalaryCreate = async (interaction, client, user, amount, cooldown, name) => {
    try {
        if (!interaction.member.roles.cache.some(r => ["Kastov en chef de l'économie"].includes(r.name))) {
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
        const User = client.users.cache.get(user);
        if (User.bot) {
            const userIsBotEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('User is Bot Error :')
                .setDescription("Vous ne pouvez pas donner un salaire à un bot. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [userIsBotEmbed],
                ephemeral: true,
            });
            return;
        }
        let userBank = await UserBank_1.default.findOne({
            userId: user,
            guildId: interaction.guild.id,
        });
        if (!userBank) {
            const noAccountEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('No Account Error :')
                .setDescription("Tu ne peux pas créer un salaire pour une personne qui n'a pas de compte bancaire. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [noAccountEmbed],
                ephemeral: true,
            });
            return;
        }
        let userSalaries = await UserSalaries_1.default.findOne({
            userId: user,
            guildId: interaction.guild.id,
        });
        const msCooldown = (0, ms_typescript_1.toMs)(cooldown);
        if (isNaN(msCooldown)) {
            const badCooldownFormatEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('Bad Cooldown Format Error :')
                .setDescription("Merci de rentrer une durée correcte (voir description de l'option). \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [badCooldownFormatEmbed],
                ephemeral: true,
            });
            return;
        }
        if (msCooldown < 8.64e+7 || msCooldown > 2.679e+9) {
            const tooLowOrHighCooldownEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('Too Low or High Cooldown Error :')
                .setDescription("Le cooldown ne peut pas être en-dessous de 1 jour ou au-dessus de 31 jours. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [tooLowOrHighCooldownEmbed],
                ephemeral: true,
            });
            return;
        }
        if (userSalaries) {
            if (userSalaries.salaries.length >= 2) {
                const tooManySalariesEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle('Too Many Salaries Error :')
                    .setDescription(`Le membre <@${user}> possède déjà plus de 2 salaires. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*`)
                    .setColor("Red");
                await interaction.reply({
                    embeds: [tooManySalariesEmbed],
                    ephemeral: true,
                });
                return;
            }
            if (userSalaries.salaries.length === 1) {
                const id = 1;
            }
            else {
                const id = 2;
            }
            userSalaries.salaries.push({
                id: 2,
                name,
                amount,
                cooldown: msCooldown,
            });
            await userSalaries.save();
        }
        else if (!userSalaries) {
            userSalaries = new UserSalaries_1.default({
                userId: user,
                guildId: interaction.guild.id,
                salaries: [
                    {
                        id: 1,
                        name,
                        amount,
                        cooldown: msCooldown,
                    }
                ]
            });
            await userSalaries.save();
        }
        const dUser = interaction.channel.guild.members.cache.get(user);
        const readableCooldown = (0, pretty_ms_1.default)(msCooldown, { verbose: true });
        let errTrigger = 0;
        const userDMEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('Company Important Notification :')
            .setDescription(`Un salaire viens d'être créé en votre nom, en voici son contenu : \n
              Membre : <@${user}> \n
              Nom de salaire : **${name}** \n
              Montant du salaire : **$${amount}/${readableCooldown}**`)
            .setColor("DarkAqua");
        await dUser.send({
            embeds: [userDMEmbed],
        });
        if (errTrigger === 1) {
            const failedDMEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('Failed DM Error :')
                .setDescription(`Un salaire pour <@${user}> avec comme nom **${name}** pour **$${amount}** tous les **${readableCooldown}** a bien été créé. mais une erreur est survenue lors de la tentative de DM du membre. Merci de DM manuellement le membre et contacter <@580160894395219968>`)
                .setColor("DarkOrange");
            await interaction.reply({
                embeds: [failedDMEmbed],
                ephemeral: true,
            });
        }
        else {
            const salaryCreateEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('Salary Create :')
                .setDescription(`Un salaire pour <@${user}> avec comme nom **${name}** pour **$${amount}** tous les **${readableCooldown}** a bien été créé. Le propriétaire du compte en a été notifié.`)
                .setColor("Green");
            await interaction.reply({
                embeds: [salaryCreateEmbed],
                ephemeral: true,
            });
        }
        const actionId = 5;
        const actionName = `Salary Create - ${name}`;
        const content = `Un salaire du nom de **${name}** a été créé pour <@${user}> avec un montant de **$${amount}/${readableCooldown}**`;
        const logUserId = user;
        const logGuildId = interaction.guild.id;
        await (0, userBankLogging_1.default)(actionId, actionName, content, logUserId, logGuildId);
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
        console.log(`Error with /company salary create: ${e}`);
    }
};
exports.default = companySalaryCreate;
