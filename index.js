const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("Missing BOT_TOKEN env var.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Presence (optional)
  client.user.setPresence({
    status: "online", // online | idle | dnd
    activities: [{ name: "vibing", type: ActivityType.Playing }],
  });
});

client.login(token);
