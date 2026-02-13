const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("Missing BOT_TOKEN env var.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const allowedPhrases = new Set([
  "meow",
  "meow meow meow",
  "meow meow meow... meow",
  "meow? meow meow!",
]);

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Presence (optional)
  client.user.setPresence({
    status: "online", // online | idle | dnd
    activities: [{ name: "vibing", type: ActivityType.Playing }],
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const hasSticker = message.stickers?.has("1471848176183934976");

  if (!hasSticker && !message.mentions.has(client.user)) return;

  const mentionRegex = new RegExp(`<@!?${client.user.id}>`, "g");
  const cleaned = message.content
    .replace(mentionRegex, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!hasSticker && !allowedPhrases.has(cleaned)) return;

  await message.reply("meow");
});

client.login(token);
