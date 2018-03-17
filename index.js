const TelegramBot = require('node-telegram-bot-api')
const TOKEN ='AAGCaSU18nlCA8etTC23Vj-OaA_a4s9BJrc'

const bot = new TelegramBot(TOKEN, {polling:true})

bot.on('message', msg =>{
    bot.sendMessage(msg.chat.id, 'Hello!')
})