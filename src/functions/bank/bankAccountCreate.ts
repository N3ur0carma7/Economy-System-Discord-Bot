import { EmbedBuilder } from 'discord.js';
import UserBank from "../../models/UserBank";
import userBankLogging from "../log/userBankLogging";

const bankAccountCreate = async (interaction: { member?: any; guild: any; reply: any; followUp: any; }) => {
    try {
        let userBank = await UserBank.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id
        });

        if (userBank) {
            const alreadyHaveAccountEmbed = new EmbedBuilder()
                .setTitle('Already Have Account Error :')
                .setDescription("Il existe déjà un compte bancaire marqué à votre nom. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red")
            await interaction.reply({
                embeds: [alreadyHaveAccountEmbed],
                ephemeral: true,
            });
            return;
        }

        userBank = new UserBank({
            userId: interaction.member.id,
            guildId: interaction.guild.id
        });

        const startMoney = 250;

        userBank.bankBalance += startMoney;
        userBank.save();
        const createAccountEmbed = new EmbedBuilder()
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

        await userBankLogging(0, actionName, content, logUserId, guildId);

    } catch (e) {
        const failEmbed = new EmbedBuilder()
            .setTitle("Code Error :")
            .setDescription("Une erreur est survenue dans le code. Veillez contacter <@580160894395219968>")
            .setColor("Red")
        try {
            await interaction.reply({
                embeds: [failEmbed],
                ephemeral: true
            });
        } catch (e) {
            await interaction.followUp({
                embeds: [failEmbed],
                ephemeral: true
            });
        }
        console.log(`Error with /bank account create: ${e}`);
    }
}

export default bankAccountCreate;