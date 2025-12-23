const {SlashCommandBuilder, EmbedBuilder, Colors, MessageFlags, InteractionContextType} = require('discord.js');
require('dotenv').config();
const connection = require('../db.js');


// Класа у коју се убацују подаци и преко које се приказују тражени подаци кориснику.
class Verse {
    constructor(bookTitle, bookChapter, chapterStart, chapterEnd, verses) {
        this.bookTitle = bookTitle;
        this.bookChapter = bookChapter;
        this.chapterStart = chapterStart;
        this.chapterEnd = chapterEnd;
        this.verses = verses;
    } 
}


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

                // Do the mysql query.
                const verse = await getUserRequestedVerses(inputBook, inputChapter, inputStartVerse, inputEndVerse);

                await interaction.editReply(`${verse.bookTitle} ${verse.bookChapter} : ${verse.chapterStart} - ${verse.chapterEnd}\n${verse.verses}`);
                console.log(`Корисник ${interaction.user.tag} је извршио команду /претрага са параметрима: ${inputBook} ${inputChapter} : ${inputStartVerse} - ${inputEndVerse}.`);  
            } else {

                // Do the mysql query.
                const verse = await getUserRequestedVerses(inputBook, inputChapter, inputStartVerse, null);

                await interaction.editReply(`${verse.bookTitle} ${verse.bookChapter} : ${verse.chapterStart}\n${verse.verses}`);
                console.log(`Корисник ${interaction.user.tag} је извршио команду /претрага са параметрима: ${inputBook} ${inputChapter} : ${inputStartVerse}`);
            }
        } catch(error) {
            console.log(error);
        }
    },
};

async function getUserRequestedVerses(book, chapter, startVerse, endVerse) {
    try {
        const [rows] = await connection.promise().query(
            "SELECT glave.stihovi, knjige.knjiga_ime FROM glave JOIN knjige ON glave.knjiga_id = knjige.knjiga_id WHERE glava_broj = ? AND glave.knjiga_id = (SELECT knjiga_id FROM knjige WHERE skracenica = ?)",
            [chapter, book]
        );

        const verse = new Verse(rows[0].knjiga_ime, chapter, startVerse, (endVerse) ? endVerse : null, rows[0].stihovi);
        return verse;

    } catch (error) {
        console.error(error);
    }
}