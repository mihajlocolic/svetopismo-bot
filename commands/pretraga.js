const {SlashCommandBuilder, EmbedBuilder, Colors, MessageFlags, InteractionContextType} = require('discord.js');
require('dotenv').config();
const connection = require('../db.js');


// const abbreviationVariations = [
//     "Мт", "Матеј", "Мк", "Марко", "Лк", "Лука", "Јн", "Јован"
// ];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("претрага")
        .setDescription("Команда за претрагу стихова.")
        .addStringOption(option => 
            option.setName("књига")
                .setDescription("Параметар за жељену књигу.")
                .setRequired(true)

        )
        .addNumberOption(option =>
            option.setName("глава")
                .setDescription("Параметар за жељену главу.")
                .setRequired(true)
        )
        .addNumberOption(option => 
            option.setName("почетни-стих")
                .setDescription("Параметар за почетни стих.")
                .setRequired(true)
        )
        .addNumberOption(option => 
            option.setName("завршни-стих")
                .setDescription("Параметар за завршни стих. (Није обавезно)")
                .setRequired(false)
        ),
    async execute(interaction) {

        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const inputBook = interaction.options.getString("књига");
        const inputChapter = interaction.options.getNumber("глава");
        const inputStartVerse = interaction.options.getNumber("почетни-стих");
        const inputEndVerse = interaction.options.getNumber("завршни-стих");

        try {
             if(inputEndVerse != null) {
                await interaction.editReply(`Ви сте тражили: ${inputBook} ${inputChapter} : ${inputStartVerse} - ${inputEndVerse}`);
                console.log(`Корисник ${interaction.user.tag} је извршио команду /претрага са параметрима: ${inputBook} ${inputChapter} : ${inputStartVerse} - ${inputEndVerse}.`);  
            } else {
                await interaction.editReply(`Ви сте тражили: ${inputBook} ${inputChapter} : ${inputStartVerse}`);
                console.log(`Корисник ${interaction.user.tag} је извршио команду /претрага са параметрима: ${inputBook} ${inputChapter} : ${inputStartVerse}`);
            }
        } catch(error) {
            console.log(error);
        }
    },
};

