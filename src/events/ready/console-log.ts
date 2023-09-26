module.exports = (client: { user: { username: any; }; }) => {
    console.log(`Logged in as ${client.user.username}`);
};