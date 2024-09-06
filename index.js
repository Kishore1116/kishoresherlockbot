require('dotenv').config();
const { Telegraf } = require('telegraf');
const { exec } = require('child_process');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('👋 Welcome! I can help you search for a username across various social networks. Just send me a username to get started!');
});

bot.on('text', (ctx) => {
    const username = ctx.message.text.trim();

    
    if (!username || username.length < 3) {
        return ctx.reply('❌ Please enter a valid username (at least 3 characters).');
    }

    ctx.reply('🔍 Searching for the username... This might take a few minutes, so please be patient. ⏳');

    
    const command = `sherlock ${username}`;

    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Sherlock: ${error}`);
            return ctx.reply('⚠️ An error occurred while searching. Please try again later.');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return ctx.reply('⚠️ An error occurred while searching. Please try again later.');
        }

        
        const messages = stdout.match(/[\s\S]{1,4000}/g); 

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
