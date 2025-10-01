const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Only members with ban perms can use
    .addUserOption(option =>
      option
        .setName("target")
        .setDescription("The user to ban")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") || "No reason provided";

    // Check if bot has permission
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: "❌ I don't have permission to ban members.", ephemeral: true });
    }

    const targetMember = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!targetMember) {
      return interaction.reply({ content: "❌ That user is not in this server.", ephemeral: true });
    }

    try {
      await targetMember.ban({ reason });

      const banEmbed = new EmbedBuilder()
        .setColor("#e6350e")
        .setTitle("🔨 User Banned")
        .addFields(
          { name: "User", value: `${target.tag}`, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Reason", value: reason }
        )
        .setThumbnail(target.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: "bot0" });

      await interaction.reply({ embeds: [banEmbed] });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: "❌ Failed to ban this user. Check my permissions and role hierarchy.", ephemeral: true });
    }
  }
};
