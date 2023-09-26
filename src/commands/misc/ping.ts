const data = {
    name: 'ping',
    description: 'Pong!',
};

// @ts-ignore
function run({ interaction, client }) {
    interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
}

module.exports = { data, run };