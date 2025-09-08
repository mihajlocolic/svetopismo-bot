const {SlashCommandBuilder, EmbedBuilder, Colors} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.CONN_URL,
    port: 3306,
    user: process.env.CONN_USER,
    password: process.env.CONN_PASSWORD,
    database: process.env.CONN_DB
});


connection.connect(function(error) {
    if(error) {
        console.error('Error connecting: ' + error.stack);
        return;
    }

    console.log('Connected as id ' + connection.threadId);
});


module.exports = {
    data: new SlashCommandBuilder()
        .setName('knjige')
        .setDescription('Приказ свих доступних књига.'),
    async execute(interaction) {

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        await wait(4000);

        let allBooksList = [];
        let embed = new EmbedBuilder();

        connection.query("SELECT knjiga_broj, knjiga_ime, skracenica FROM knjige", async function(error, results) {
            if(error){
                interaction.reply("Упс, дошло је до грешке.");
                throw error;
            } 
                embed 
                .setTitle("Доступне књиге")
                .setColor(Colors.Red);
            for(const result of results) {
                allBooksList.push(result);
            }

            let bookListStr;
            for(const book of allBooksList) {
                bookListStr += book + '\n';
            }

            
            embed.setDescription(bookListStr);

            await interaction.editReply({embeds: [embed]});

        });
    }
};

