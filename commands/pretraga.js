const {SlashCommandBuilder, EmbedBuilder, Colors, MessageFlags, InteractionContextType} = require('discord.js');
const { pool } = require('../db.js');
require('dotenv').config();


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

        await interaction.deferReply();

        const inputBook = interaction.options.getString("књига");
        const inputChapter = interaction.options.getNumber("глава");
        const inputStartVerse = interaction.options.getNumber("почетни-стих");
        const inputEndVerse = interaction.options.getNumber("завршни-стих");

        try {
             if(inputEndVerse != null) {

                // Do the mysql query.
                const verse = await getUserRequestedVerses(inputBook, inputChapter, inputStartVerse, inputEndVerse);

              
                if(verse != null || verse != undefined) {
                    const verseStartIndex = verse.verses.indexOf(`${inputStartVerse}.`);
                    const verseEndIndex = verse.verses.indexOf(`${inputEndVerse + 1}.`);
                    if(!verse.verses.includes(`${inputStartVerse}.`) || !verse.verses.includes(`${inputEndVerse}.`)) {
                        await interaction.editReply(`Погрешан унос стихова, молим Вас проверите да ли сте исправно унели почетни и завршни стих у књизи ${verse.bookTitle}, глава ${inputChapter}.`);
                    } else {

                        const embed = new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setTitle(`${verse.bookTitle} ${verse.bookChapter} : ${verse.chapterStart} - ${verse.chapterEnd}`)
                            .setDescription((verse.verses.substring(verseStartIndex, verseEndIndex).length > 4000) ? verse.verses.substring(verseStartIndex, verseEndIndex).substring(0, 3997) + "..." : verse.verses.substring(verseStartIndex, verseEndIndex));

                        await interaction.editReply({embeds: [embed]});
                        console.log(`Корисник ${interaction.user.tag} је извршио команду /претрага са параметрима: ${inputBook} ${inputChapter} : ${inputStartVerse} - ${inputEndVerse}.`);  
                    }
                } else {
                    await interaction.editReply(`Нису пронађени стихови за унос: ${inputBook} ${inputChapter} : ${inputStartVerse} - ${inputEndVerse}.`);
                }
            } else {

                // Do the mysql query.
                const verse = await getUserRequestedVerses(inputBook, inputChapter, inputStartVerse, null);

                if(verse != null || verse != undefined) {
                    
                    if(!verse.verses.includes(`${inputStartVerse}.`)) {
                        await interaction.editReply(`Погрешан унос стихова, молим Вас проверите да ли сте исправно унели почетни и завршни стих у књизи ${verse.bookTitle}, глава ${inputChapter}.`);
                    
                    } else {

                        const embed = new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setTitle(`${verse.bookTitle} ${verse.bookChapter} : ${verse.chapterStart}`)
                            .setDescription(verse.verses.substring(verse.verses.indexOf(`${inputStartVerse}.`), verse.verses.indexOf(`${inputStartVerse + 1}.`)));

                        await interaction.editReply({embeds: [embed]});
                        console.log(`Корисник ${interaction.user.tag} је извршио команду /претрага са параметрима: ${inputBook} ${inputChapter} : ${inputStartVerse}`);
                    }
                } else {
                    await interaction.editReply(`Нису пронађени стихови за унос: ${inputBook} ${inputChapter} : ${inputStartVerse}.`);
                }
            }
        } catch(error) {
            console.log(error);
        }
    },
};

async function getUserRequestedVerses(book, chapter, startVerse, endVerse) {
    try {
        const [rows] = await pool.promise().query(
            "SELECT glave.stihovi, knjige.knjiga_ime FROM glave JOIN knjige ON glave.knjiga_id = knjige.knjiga_id WHERE glava_broj = ? AND glave.knjiga_id = (SELECT knjiga_id FROM knjige WHERE skracenica = ?)",
            [chapter, book]
        );

        if(rows[0] != null || rows[0] != undefined) {
            const verse = new Verse(rows[0].knjiga_ime, chapter, startVerse, (endVerse) ? endVerse : null, rows[0].stihovi);
            return verse;
        } else {
            return null;
        }

    } catch (error) {
        console.error(error);
    }
}