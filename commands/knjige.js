const {SlashCommandBuilder, EmbedBuilder, Colors, MessageFlags} = require('discord.js');
require('dotenv').config();
const connection = require('../db.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('књиге')
        .setDescription('Приказ свих доступних књига.'),
    async execute(interaction) {

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        let allBooksList = [];
        let embed = new EmbedBuilder();
        embed.setTitle("Доступне књиге");
        embed.setColor(Colors.Red);
        
        try {
            const [results] = await connection.promise().query(
                "SELECT knjiga_broj, knjiga_ime, skracenica FROM knjige"
            );

            for(const result of results) {
                allBooksList.push(result);
            }

            let knjigeNovogZaveta = "";
            let knjigeStarogZaveta = "";
            for(const book of allBooksList) {
                if (book.knjiga_broj >= 40) {
                    knjigeNovogZaveta += book.knjiga_broj + ".  " + book.knjiga_ime + "  [" + book.skracenica + "]\n";
                } else {
                    knjigeStarogZaveta += book.knjiga_broj + ".  " + book.knjiga_ime + "  [" + book.skracenica + "]\n";
                }   
            }

            embed.setDescription("**КЊИГЕ СТАРОГ ЗАВЕТА**\n" + knjigeStarogZaveta + "\n**КЊИГЕ НОВОГ ЗАВЕТА**\n" + knjigeNovogZaveta);


            console.log(`Корисник ${interaction.user.tag} је извршио команду /књиге.`);
            await interaction.editReply({embeds: [embed]});
            //console.log(results);

        } catch(error) {
            console.error(error);
        }
       
    },
};

