import 'dotenv/config';
import { Client } from 'discord.js';
import { CommandKit } from 'commandkit';
import mongoose from "mongoose";


const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent'],
});

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`
});

(async () => {
    // @ts-ignore
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database.');

    await client.login(process.env.TOKEN);
})();

export default client;