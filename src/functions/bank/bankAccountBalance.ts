import { EmbedBuilder } from 'discord.js';
import UserBank from '../../models/UserBank'

const bankAccountBalance = async (interaction: { member: { id: any; }; guild: { id: any; }; reply: (arg0: { embeds: EmbedBuilder[]; ephemeral: boolean; }) => any; followUp: (arg0: { embeds: EmbedBuilder[]; ephemeral: boolean; }) => any; }) => {
    try {
        let userBank = await UserBank.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id
        });

        if (!userBank) {
            const noAccountEmbed = new EmbedBuilder()
                .setTitle('No Account Error :')
                .setDescription("Tu ne peux pas consulter l'argent que tu possèdes sans compte bancaire *(/Bank Accounts account create)*. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [noAccountEmbed],
                ephemeral: true,
            });
            return;
        }

        const accountBalanceEmbed = new EmbedBuilder()
            .setTitle('Account Balance :')
            .setDescription(`Tu possède actuellement **$${userBank.bankBalance}** sur ton compte bancaire.`)
            .setColor("Blue");
        await interaction.reply({
            embeds: [accountBalanceEmbed],
            ephemeral: true,
        });
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
        console.log(`Error with /bank account balance: ${e}`);
    }
}

export default bankAccountBalance;