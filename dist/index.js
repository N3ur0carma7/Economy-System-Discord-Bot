"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const commandkit_1 = require("commandkit");
const mongoose_1 = __importDefault(require("mongoose"));
const client = new discord_js_1.Client({
    intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent'],
});
new commandkit_1.CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`
});
(async () => {
    // @ts-ignore
    await mongoose_1.default.connect(process.env.MONGODB_URI);
    console.log('Connected to database.');
    await client.login(process.env.TOKEN);
})();
exports.default = client;
