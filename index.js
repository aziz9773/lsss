const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(``);
  console.log(``);
});


client.on('messageCreate', async message => {
  if (message.content === '!pol.00') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder(' Place Select')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#f8ca3d')
        .setThumbnail('')
        .setTitle('LSPD RULES')
        .setDescription('**جميع القوانين التابعة لقطاع LSPD**')
        .setImage('https://cdn.discordapp.com/attachments/1267300441872400498/1300913666044071986/lapd_vd-wallpaper-3840x2160.jpg?ex=672291c3&is=67214043&hm=89e0143edd440549fb65442a2f84e3700bd9c90fd52621dbcca3d5e05380442b&')
        .setFooter({ text: 'LSPD DEPARTMENT' })
        .setTimestamp();

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#f8ca3d')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: 'LSPD Rules' })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
