import * as cron from 'node-cron';
import giveSalary from "../../functions/scheduled/giveSalary";
import {Guild, GuildMember} from "discord.js";
import client from "../../index";


// @ts-ignore
/**
 *
 * @param {client} client
 */
module.exports = async (client: { guilds: { fetch: () => any; cache: Guild[]; }; }) => {
    cron.schedule('0 0 * * *', async () => {
        const partialGuilds = await client.guilds.fetch();
        const guilds = await Promise.all(
            partialGuilds.map((partialGuild: { fetch: () => any; }) => partialGuild.fetch()),
        );

        for (const guild of guilds) {
            await guild.members.fetch();
            console.log(`Guild: ${guild.name}`);
            console.log(`Number of members in the guild: ${guild.members.cache.size}`);
            guild.members.cache.forEach((member: GuildMember) => {
                giveSalary(member);
            });
        }
    });
}
