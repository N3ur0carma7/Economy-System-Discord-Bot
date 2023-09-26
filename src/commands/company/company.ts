import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';
import companySalaryCreate from "../../functions/company/companySalaryCreate";

const data = {
    name: 'company',
    description: "Managing companies...",
    options: [
        {
            name: 'salary',
            description: "Permet de manage en tant qu'admin les salaires...",
            type: 2,
            options: [
                {
                    name: 'create',
                    description: "Permet de créer un salaire pour une personne.",
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: "L'utilisateur à qui donner le salaire",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'name',
                            description: "Le nom du salaire (si dans une entreprise, préciser le nom)",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: 'amount',
                            description: "Le montant du salaire",
                            type: ApplicationCommandOptionType.Number,
                            required: true,
                        },
                        {
                            name: 'cooldown',
                            description: "Le cooldown du salaire (1d, 7d, 31d)",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'delete',
                    description: "Permet de supprimer le salaire d'une personne.",
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: "L'utilisateur qui verra son salaire enlevé.",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'id',
                            description: "L'ID du salaire (1 ou 2)",
                            type: ApplicationCommandOptionType.Number,
                            choices: [
                                {
                                    name: '1',
                                    value: 1,
                                },
                                {
                                    name: '2',
                                    value: 2,
                                },
                            ],
                            required: true,
                        },
                    ],
                },
                {
                    name: 'force-give',
                    description: "Permet de forcer le bot à donner l'équivalent de x jours de salaire a un utilisateur.",
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: "L'utilisateur qui va recevoir le salaire.",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'times',
                            description: "Le nombre de fois que le membre va recevoir son salaire. (MAX 31)",
                            type: ApplicationCommandOptionType.Number,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'list',
                    description: "Permet de voir votre liste de revenus (avec salaire).",
                    type: 1,
                },
            ],
        },
    ],
};

// @ts-ignore
async function run({ interaction, client }) {
    if (!interaction.inGuild()) {
        const notInGuildEmbed = new EmbedBuilder()
            .setTitle('Not In Guild Error :')
            .setDescription("Tu ne peux pas exécuter cette commande si tu n'est pas dans un serveur Discord.")
            .setColor("Red");
        await interaction.reply({
            embeds: [notInGuildEmbed],
            ephemeral: true,
        });
        return;
    }

    const grpCommand = interaction.options.getSubcommandGroup();
    const command = interaction.options.getSubcommand();


    switch (grpCommand) {
        case 'salary':
            switch (command) {
                case 'create':
                    const user = interaction.options.get('user').value;
                    const amount = interaction.options.get('amount').value;
                    const cooldown = interaction.options.get('cooldown').value;
                    const name = interaction.options.get('name').value;
                    await companySalaryCreate(interaction, client, user, amount, cooldown, name)
            }
    }
}

module.exports = ({ data, run })