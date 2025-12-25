const {SlashCommandBuilder, EmbedBuilder, Colors, MessageFlags} = require('discord.js');
const packageInfo = require('../package.json');
const botVersion = packageInfo.version;



module.exports = {
    data: new SlashCommandBuilder()
        .setName("помоћ")
        .setDescription("Приказ помоћи за коришћење бота."),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const embed = new EmbedBuilder()
            .setTitle("Помоћ за коришћење бота")
            .setColor(Colors.Red)
            .setDescription("Овде можете пронаћи информације о доступним командама и њиховој употреби.")
            .addFields(
                { name: "/књиге", value: "Приказује списак свих доступних књига у Светоме Писму и њихове скраћенице." },
                { name: "/претрага <књига (скраћеница)> <глава> <почетни-стих> <завршни-стих (опционо)>", value: "Претражује и приказује стихове из Светог Писма на основу унетих параметара.\n"}
            )
            .setFooter({text:`Свето Писмо Бот - v${botVersion}`});

        await interaction.editReply({embeds: [embed]});
    }
}