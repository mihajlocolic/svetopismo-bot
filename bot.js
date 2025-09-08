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

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = interaction.client.command.get(interaction.commandName);
    if(!command) {
        console.error(`Error: No command matching ${command.commandName} was found.`);
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

