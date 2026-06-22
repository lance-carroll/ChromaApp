import { SlashCommandBuilder } from "discord.js";

export const campaignCommand = new SlashCommandBuilder()
  .setName("campaign")
  .setDescription("Link a Discord channel to a Chroma campaign and manage pending posts.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("link")
      .setDescription("Link this channel to a campaign invite code.")
      .addStringOption((option) =>
        option
          .setName("invite_code")
          .setDescription("The campaign invite code from the web app.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("posts")
      .setDescription("List pending posts for the linked campaign."),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("resolve")
      .setDescription("Resolve your next queued post in the linked campaign."),
  );

export const accountCommand = new SlashCommandBuilder()
  .setName("account")
  .setDescription("Link your Discord account to your Chroma web account.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("link")
      .setDescription("Claim a one-time account link code from the web app.")
      .addStringOption((option) =>
        option
          .setName("code")
          .setDescription("The link code shown in the web app.")
          .setRequired(true),
      ),
  );

export const commands = [campaignCommand.toJSON(), accountCommand.toJSON()];
