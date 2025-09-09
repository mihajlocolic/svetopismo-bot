const fs = require('node:fs');
const path = require('node:path');
const {Client, Events, GatewayIntentBits, Collection, MessageFlags} = require('discord.js');
const dotenv = require('dotenv').config(); 

const botToken = process.env.BOT_TOKEN;


const client = new Client({intents: [GatewayIntentBits.Guilds]});   

client.once(Events.ClientReady, readyClient => {
    console.log(`[Ready] Logged in as ${readyClient.user.tag}`);
});


client.commands = new Collection();
const folderPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(folderPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if(!command) {
        console.error(`Error: No command matching ${commands.commandName} was found.`);
        return;
    }

    try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Дошло је до грешке приликом извршавања команде.', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'Дошло је до грешке приликом извршавања команде.', flags: MessageFlags.Ephemeral });
		}
	}
});


client.login(botToken);

