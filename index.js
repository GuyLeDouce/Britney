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

const responsePhrases = [
  "meow",
  "meow meow meow",
  "meow meow meow... meow",
  "meow? meow meow!",
];
let lastResponse = null;

function pickResponse() {
  if (responsePhrases.length === 1) return responsePhrases[0];
  let next = responsePhrases[Math.floor(Math.random() * responsePhrases.length)];
  while (next === lastResponse) {
    next = responsePhrases[Math.floor(Math.random() * responsePhrases.length)];
  }
  lastResponse = next;
  return next;
}

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
  const isMentioned = message.mentions.has(client.user);
  const nameRegex =
    /\b(brit|britney|brittney|brittany|britany|britni|britnee|brittnie)\b(?:'s|\u2019s)?/i;
  const hasName = nameRegex.test(message.content);

  let isReplyToBot = false;
  if (message.reference?.messageId) {
    try {
      const repliedTo = await message.channel.messages.fetch(
        message.reference.messageId,
      );
      isReplyToBot = repliedTo.author?.id === client.user.id;
    } catch {
      // Ignore fetch failures; treat as not a bot reply.
    }
  }

  if (!hasSticker && !isMentioned && !isReplyToBot && !hasName) return;

  await message.reply(pickResponse());
});

client.login(token);
