const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('canvas');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const TOKEN = process.env.DISCORD_TOKEN;

function createDetectorImage(isTrue) {
  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isTrue ? '#00FF00' : '#FF0000';
  ctx.fillRect(0, 0, 400, 200);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = isTrue ? 'TRUE' : 'FALSE';
  ctx.fillText(text, 200, 100);

  return canvas.toBuffer();
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('Lie Detector Bot is online!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    if (message.reference) {
      try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        const isTrue = Math.random() < 0.5;
        const imageBuffer = createDetectorImage(isTrue);
        const attachment = new AttachmentBuilder(imageBuffer, { name: 'detector.png' });

        await repliedMessage.reply({
          files: [attachment]
        });

      } catch (error) {
        console.error('Error fetching replied message:', error);
        message.reply('I need to be mentioned in a reply to a message!');
      }
    } else {
      message.reply('Please reply to a message and mention me to detect if it\'s true or false!');
    }
  }
});

client.login(TOKEN);
