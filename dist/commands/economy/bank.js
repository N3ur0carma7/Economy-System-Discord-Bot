"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const bankAccountBalance_1 = __importDefault(require("../../functions/bank/bankAccountBalance"));
const bankAccountCreate_1 = __importDefault(require("../../functions/bank/bankAccountCreate"));
const bankAccountDelete_1 = __importDefault(require("../../functions/bank/bankAccountDelete"));
const bankAccountLogs_1 = __importDefault(require("../../functions/bank/bankAccountLogs"));
const bankAccountShow_1 = __importDefault(require("../../functions/bank/bankAccountShow"));
const bankDaily_1 = __importDefault(require("../../functions/bank/bankDaily"));
const data = {
    name: 'bank',
    description: 'Interact with the bank',
    options: [
        {
            name: 'account',
            description: "Interact with Bank Accounts",
            type: 2,
            options: [
                {
                    name: 'create',
                    description: "Permet de créer un compte bancaire de la Banque Kastovienne.",
                    type: 1,
                },
                {
                    name: 'balance',
                    description: "Permet de voir l'argent sur son Compte de Dépot",
                    type: 1,
                },
                {
                    name: 'show',
                    description: "Permet de montrer l'argent que l'on possède dans le chat.",
                    type: 1,
                },
                {
                    name: 'delete',
                    description: "Permet de supprimer son compte bancaire sous acceptation d'un banquier.",
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: "La personne à qui il faut supprimer le compte bancaire.",
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'logs',
                    description: "Permet de voir les logs bancaires d'une personne.",
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: "Le personne à qui il faut vérifier les logs.",
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'action-filter',
                            description: "Le filtre à appliquer pour les actions.",
                            type: discord_js_1.ApplicationCommandOptionType.Number,
                            choices: [
                                {
                                    name: 'Account Create',
                                    value: 0,
                                },
                                {
                                    name: 'Account Add Money',
                                    value: 1,
                                },
                                {
                                    name: 'Account Remove Money',
                                    value: 2,
                                },
                                {
                                    name: 'Account Money Share',
                                    value: 3,
                                },
                                {
                                    name: 'Account Delete',
                                    value: 4,
                                },
                                {
                                    name: 'Account Salaries Information',
                                    value: 5,
                                },
                            ],
                        },
                    ]
                },
            ],
        },
        {
            name: 'daily',
            description: "Récupère ta récompense quotidienne !",
            type: 1,
        },
    ],
};
// @ts-ignore
async function run({ interaction }) {
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
        case 'account':
            switch (command) {
                case 'create':
                    await (0, bankAccountCreate_1.default)(interaction);
            }
            switch (command) {
                case 'balance':
                    await (0, bankAccountBalance_1.default)(interaction);
            }
            switch (command) {
                case 'show':
                    await (0, bankAccountShow_1.default)(interaction);
            }
            switch (command) {
                case 'delete':
                    const user = interaction.options.get('user').value;
                    await (0, bankAccountDelete_1.default)(interaction, user);
            }
            switch (command) {
                case 'logs':
                    const user = interaction.options.get('user').value;
                    const actionFilter = interaction.options.get('action-filter')?.value;
                    await (0, bankAccountLogs_1.default)(interaction, user, actionFilter);
            }
    }
    switch (command) {
        case 'daily':
            await (0, bankDaily_1.default)(interaction);
    }
}
module.exports = { data, run };
