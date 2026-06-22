import "./env.mjs";
import { REST, Routes } from "discord.js";
import { commands } from "./commands.mjs";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function main() {
  const token = requireEnv("DISCORD_BOT_TOKEN");
  const clientId = requireEnv("DISCORD_CLIENT_ID");
  const guildId = process.env.DISCORD_GUILD_ID;

  const rest = new REST({ version: "10" }).setToken(token);

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log(`Registered ${commands.length} guild command(s) for ${guildId}.`);
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });
  console.log(`Registered ${commands.length} global command(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
