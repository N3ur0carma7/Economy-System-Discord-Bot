"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const companySalaryCreate_1 = __importDefault(require("../../functions/company/companySalaryCreate"));
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
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'name',
                            description: "Le nom du salaire (si dans une entreprise, préciser le nom)",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: 'amount',
                            description: "Le montant du salaire",
                            type: discord_js_1.ApplicationCommandOptionType.Number,
                            required: true,
                        },
                        {
                            name: 'cooldown',
                            description: "Le cooldown du salaire (1d, 7d, 31d)",
                            type: discord_js_1.ApplicationCommandOptionType.String,
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
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'id',
                            description: "L'ID du salaire (1 ou 2)",
                            type: discord_js_1.ApplicationCommandOptionType.Number,
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
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'times',
                            description: "Le nombre de fois que le membre va recevoir son salaire. (MAX 31)",
                            type: discord_js_1.ApplicationCommandOptionType.Number,
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
        const notInGuildEmbed = new discord_js_1.EmbedBuilder()
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
                    await (0, companySalaryCreate_1.default)(interaction, client, user, amount, cooldown, name);
            }
    }
}
module.exports = ({ data, run });
