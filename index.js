const TelegramBot = require('node-telegram-bot-api')
const nodemailer = require('nodemailer');
const TOKEN ='485746843:AAGCaSU18nlCA8etTC23Vj-OaA_a4s9BJrc'

const bot = new TelegramBot(TOKEN, {polling:true})

 ci = {
    userName: '',
    phoneNumber: '',
    callTime: ''

}
const menu = {
    info: 'Информация',
    callback: 'Подать заявку'
}


getInfoStage = -1
ciStage = true

bot.onText(/\/start/, msg =>{
    const text = `Приветствую!\nЧто вам нужно?`

    bot.sendMessage(msg.chat.id, text,{
        reply_markup:{
            keyboard: [[menu.info, menu.callback]]
        }
    })
})





bot.on('message', msg =>{

    switch (msg.text) {
        case menu.info:
            ciStage = false
            break
        case menu.callback:
            ciStage = true
            bot.sendMessage(msg.chat.id, `Как к вам обращаться?`)
            getInfoStage = 0
            break
        default:
            getInfoStage++
            if(getInfoStage === 1) {
                ci.userName = msg.text
                bot.sendMessage(msg.chat.id, `Очень приятно, ${ci.userName}, оставьте нам номер телефона, по которому мы сможем с вами связаться`)

            }
            if(getInfoStage === 2) {
                ci.phoneNumber = msg.text
                bot.sendMessage(msg.chat.id, `Проверьте введенный номер: ${ci.phoneNumber}, все верно?`, {
                    reply_markup:{
                        inline_keyboard: [
                            [
                                {
                                    text: 'Да, все верно',
                                    callback_data: 'correctNumber'
                                }
                            ],
                            [
                                {
                                    text: 'Изменить номер',
                                    callback_data: 'changeNumber'
                                }
                            ]
                        ]
                    }
                })

                bot.on('callback_query', query => {
                    bot.answerCallbackQuery(query.id)

                    if(query.data === 'correctNumber') {
                        bot.sendMessage(msg.chat.id, `В каком регионе вы находитесь, и какое время для звонка будем удобным для вас?`);
                       getInfoStage = 2

                    }
                    else {
                        bot.sendMessage(msg.chat.id,'Введите номер:')
                        getInfoStage = 1
                    }
                })



            }
            if(getInfoStage === 3) {
                ci.callTime = msg.text
                bot.sendMessage(msg.chat.id, `Наш специалист обязательно с вами свяжется`)
                getInfoStage = -1
            }

            break

    }

})





function sendMail(content) {
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'reviewFromLanding@yandex.ru', // generated ethereal user
                pass: 'pouhbv643a' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'reviewFromLanding@yandex.ru', // sender address
            to: 'rst629@mail.ru', // list of receivers
            subject: 'reviewFromTelegramBot', //c Subject line
            text: `Имя: ${content.userName}\nТелефон: ${content.phoneNumber}\nВремя и регион: ${content.callTime}` // plain text body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });

}