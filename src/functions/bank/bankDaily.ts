import { EmbedBuilder } from 'discord.js';
import UserBank from "../../models/UserBank";
import userBankLogging from "../log/userBankLogging";
const dailyAmount = 45;

const bankDaily = async (interaction: { member: { id: any; }; guild: { id: any; }; reply: (arg0: { embeds: EmbedBuilder[]; ephemeral: boolean; }) => any; followUp: (arg0: { embeds: EmbedBuilder[]; ephemeral: boolean; }) => any; }) => {
    try {
        let userBank = await UserBank.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id,
        });

        if (!userBank) {
            const noAccountEmbed = new EmbedBuilder()
                .setTitle('No Account Error :')
                .setDescription("Tu ne peux pas récolter l'argent quotidien sans compte bancaire *(**/Bank Accounts account create**)*. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [noAccountEmbed],
                ephemeral: true,
            });
            return;
        }

        const lastDailyDate = userBank.lastDaily?.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
            const dailyAlreadyCollectedEmbed = new EmbedBuilder()
                .setTitle('Daily Already Collected Error :')
                .setDescription("Tu as déjà récolté ta récompense quotidienne aujourd'hui. Reviens demain ! \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [dailyAlreadyCollectedEmbed],
                ephemeral: true,
            });
            return;
        }

        userBank.bankBalance += dailyAmount;
        userBank.lastDaily = new Date();

        await userBank.save();

        const dailyCollectedEmbed = new EmbedBuilder()
            .setTitle('Daily Collected:')
            .setDescription(`Tu as récupéré ta récompense quotidienne, tu as obtenu **+$45**.`)
            .setColor("Green");
        await interaction.reply({
            embeds: [dailyCollectedEmbed],
            ephemeral: true,
        });

        const actionId = 1;
        const actionName = "Daily Money :";
        const content = `User <@${interaction.member.id}> recieved his daily money +$${dailyAmount}. Balance : **$${userBank.bankBalance}**.`;
        const logUserId = interaction.member.id;
        const guildId = interaction.guild.id;

        await userBankLogging(actionId, actionName, content, logUserId, guildId);
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
        console.log(`Error with /bank daily: ${e}`);
    }
}

export default bankDaily;