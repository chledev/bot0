const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete a number of messages from the current channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Requires manage messages
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete (1–100)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    // Check bot permissions
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ I don't have permission to manage messages!",
        ephemeral: true,
      });
    }

    // Validate amount
    if (amount <= 0 || amount > 100) {
      return interaction.reply({
        content: "⚠️ You must provide a number between 1 and 100.",
        ephemeral: true,
      });
    }

    try {
      const deletedMessages = await interaction.channel.bulkDelete(amount, true);

      const successEmbed = new EmbedBuilder()
        .setColor("#b434eb")
        .setTitle("🧹 Messages Deleted")
        .setDescription(`**Successfully removed** ${deletedMessages.size} messages.`)
        .setFooter({ text: "bot0" })
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Something went wrong while deleting messages. Note: I can't delete messages older than 14 days.",
        ephemeral: true,
      });
    }
  },
};
