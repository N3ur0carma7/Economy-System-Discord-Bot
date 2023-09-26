"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron = __importStar(require("node-cron"));
const giveSalary_1 = __importDefault(require("../../functions/scheduled/giveSalary"));
// @ts-ignore
/**
 *
 * @param {client} client
 */
module.exports = async (client) => {
    cron.schedule('0 0 * * *', async () => {
        const partialGuilds = await client.guilds.fetch();
        const guilds = await Promise.all(partialGuilds.map((partialGuild) => partialGuild.fetch()));
        for (const guild of guilds) {
            await guild.members.fetch();
            console.log(`Guild: ${guild.name}`);
            console.log(`Number of members in the guild: ${guild.members.cache.size}`);
            guild.members.cache.forEach((member) => {
                (0, giveSalary_1.default)(member);
            });
        }
    });
};
