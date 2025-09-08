const {REST, Routes} = require('discord.js');
require('dotenv').config(); 
const fs = require('node:fs');
const path = require('node:path');

const botToken = process.env.BOT_TOKEN;
const clientId = process.env.APP_ID;
const guildId = process.env.GUILD_ID;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`WARNING: Command at ${filePath} is missing required data or execute property.`);
    }
}


const rest = new REST().setToken(botToken);

(async () => {
    try {
        console.log(`Started loading ${commands.length} application / commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {
                body: commands
            },
        );

        console.log(`Successfully reloaded ${data.length} application / commands.`);
    } catch (error) {
        console.error(error);
    }
});
