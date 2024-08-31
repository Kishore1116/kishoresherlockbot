require('dotenv').config();
const { Telegraf } = require('telegraf');
const { exec } = require('child_process');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('👋 Welcome! I can help you search for a username across various social networks. Just send me a username to get started!');
});

bot.on('text', (ctx) => {
    const username = ctx.message.text.trim();

    // Validate the username
    if (!username || username.length < 3) {
        return ctx.reply('❌ Please enter a valid username (at least 3 characters).');
    }

    ctx.reply('🔍 Searching for the username... This might take a few minutes, so please be patient. ⏳');

    // Use the global `sherlock` command
    const command = `sherlock ${username}`;

    // Execute Sherlock command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Sherlock: ${error}`);
            return ctx.reply('⚠️ An error occurred while searching. Please try again later.');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return ctx.reply('⚠️ An error occurred while searching. Please try again later.');
        }

        // Split the output if it's too long
        const messages = stdout.match(/[\s\S]{1,4000}/g); // Splits the output into chunks of 4000 characters

        if (messages) {
            messages.forEach((message, index) => {
                ctx.reply(`🔎 Search results part ${index + 1} for "${username}":\n${message}`);
            });
        } else {
            ctx.reply(`❌ No results found for "${username}".`);
        }
    });
});

bot.launch();

console.log('🚀 Bot is running...');
