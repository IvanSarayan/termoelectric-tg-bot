
process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api')
const nodemailer = require('nodemailer');
const fs = require('fs')
const TOKEN ='485746843:AAGCaSU18nlCA8etTC23Vj-OaA_a4s9BJrc'

const bot = new TelegramBot(TOKEN, {polling:true})

 ci = {
    userName: '',
    phoneNumber: '',
    callTime: ''

}
const menu = {
    info: 'Информация',
    callback: 'Подать заявку',
    kit: 'Маркетинг-кит',
    compare: 'Сравнение с другими системами отопления',
    questions: 'Частые вопросы',
    mainMenu: 'В главное меню',
    compare1: 'Теплый пол',
    compare2: 'Газовое отопление',
    compare3: 'Электрокотел',
    compare4: 'Электроконвектор',
    quest1: 'За счет чего экономия?',
    quest2: 'Что если в моем городе нет дилера?',
    quest3: 'Сложно ли установить систему?',
    quest4: 'До скольки градусов нагревается радиатор?',
    quest5: 'Безопасна ли наша система?',
    quest6: 'Как устроен процесс покупки системы Термоэлектрик?',
}

getInfoStage = -1
ciStage = true
pnKey = true
cnKey = true
const firstGreetings = `Приветствую!\nЧто вам нужно?`
const chooseAction = `Выберите действие`

bot.onText(/\/start/, msg =>{

    getInfoStage = 100
    bot.sendMessage(msg.chat.id, firstGreetings,{
        reply_markup:{
            keyboard: [[menu.info, menu.callback]]
        }
    })
})

bot.on('message', msg =>{

    switch (msg.text) {
        case menu.info:
            ciStage = false
            showInfoMenu(msg)
            break
        case menu.callback:
            ciStage = true
            pnKey = true
            cnKey = true
            bot.sendMessage(msg.chat.id, `Как к вам обращаться?`)
            getInfoStage = 0
            break
        case menu.kit:
            giveKit(msg)
            break
        case menu.mainMenu:
            showMainMenu(msg)
            break
        case menu.compare:
            showCompareMenu(msg)
            break
        case menu.compare1:
            showComparePhoto(msg,'1')
            break
        case menu.compare2:
            showComparePhoto(msg,'2')
            break
        case menu.compare3:
            showComparePhoto(msg,'3')
            break
        case menu.compare4:
            showComparePhoto(msg,'4')
            break
        case menu.quest1:
            showAnswer(msg, 1)
            break
        case menu.quest2:
            showAnswer(msg, 2)
            break
        case menu.quest3:
            showAnswer(msg, 3)
            break
        case menu.quest4:
            showAnswer(msg, 4)
            break
        case menu.quest5:
            showAnswer(msg, 5)
            break
        case menu.quest6:
            showAnswer(msg, 6)
            break

        case menu.questions:
            showQuestionMenu(msg)
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
                        if(pnKey === true) {
                            bot.sendMessage(msg.chat.id, `В каком регионе вы находитесь, и какое время для звонка будем удобным для вас?`);
                            getInfoStage = 2
                            pnKey = false
                        }

                    }
                    if(query.data === 'changeNumber') {
                        if(cnKey === true) {
                            bot.sendMessage(msg.chat.id, 'Введите номер:')
                            getInfoStage = 1
                            cnKey = false
                        }
                    }
                })



            }
            if(getInfoStage === 3) {
                ci.callTime = msg.text
                bot.sendMessage(msg.chat.id, `Наш специалист обязательно с вами свяжется`)
                sendMail(ci)
                getInfoStage = 100

            }

            break

    }

})

function showComparePhoto (msg, index) {
    fs.readFile(`${__dirname}/img/compare${index}.jpg` , (error,img) => {
        if (error) throw new Error(error)
        bot.sendPhoto(msg.chat.id, img)
    })

}

function showAnswer (msg, key) {
    if(key === 1) {
        bot.sendMessage(msg.chat.id, `Наша компания осуществляет доставку транспортными компаниями в любую точку России и СНГ.`)
    }
    if(key === 2) {
        bot.sendMessage(msg.chat.id, `Наша компания осуществляет доставку транспортными компаниями в любую точку России и СНГ.`)
    }
    if(key === 3) {
        bot.sendMessage(msg.chat.id, `Установка системы TE требует только подвода электрического кабеля.\nДля установки газовой, либо электрокотла, требуется установить котлы, протянуть трубы к радиаторам и залить теплоноситель. У нас же достаточно протянуть кабель питания от вашего щита управления (счетчика).`)
    }
    if(key === 4) {
        bot.sendMessage(msg.chat.id, `Максимальная температура нагрева внешней поверхности радиатора: +85С.`)
    }
    if(key === 5) {
        bot.sendMessage(msg.chat.id, `Система прошла тестирование и полностью соответствует стандарту качества IP65 (Пылезащита и защитой от водяных струй с любого направления).
Ingress Protection Rating (в переводе с английского языка — степень защиты от проникновения) — система классификации степеней защиты оболочки электрооборудования и других устройств от проникновения твёрдых предметов, пыли и воды в соответствии с международным стандартом IEC 60529 (DIN 40050, ГОСТ 14254-96). IP65 - Пылезащищённое c защитой от водяных струй с любого направления`)
    }
    if(key === 6) {
        fs.readFile(`${__dirname}/img/paymentSystem.jpg` , (error,img) => {
            if (error) throw new Error(error)
            bot.sendPhoto(msg.chat.id, img)
        })
    }
}

function showQuestionMenu (msg) {
    bot.sendMessage(msg.chat.id, 'Выберите вопрос',{
        reply_markup:{
            keyboard: [
                [menu.quest1,menu.quest2],
                [menu.quest3,menu.quest4],
                [menu.quest5,menu.quest6],


                [menu.mainMenu]
            ]
        }
    })
}

function showCompareMenu (msg) {
    bot.sendMessage(msg.chat.id, 'Выберите тип отопления',{
        reply_markup:{
            keyboard: [
                [menu.compare1, menu.compare2 , menu.compare3 , menu.compare4],
                [menu.mainMenu]
            ]
        }
    })
}

function showMainMenu(msg) {

    bot.sendMessage(msg.chat.id, chooseAction,{
        reply_markup:{
            keyboard: [[menu.info, menu.callback]]
        }
    })

}

function showInfoMenu(msg) {

    bot.sendMessage(msg.chat.id, chooseAction,{
        reply_markup:{
            keyboard: [
                [menu.kit],
                [menu.compare, menu.questions],
                [menu.mainMenu]
            ]
}
    })

}

function giveKit(msg) {
    fs.readFile(`${__dirname}/files/TermoElectric_Kit.pdf` , (error,key) => {
    if (error) throw new Error(error)

    bot.sendMessage(msg.chat.id, 'Загружаю...')

    bot.sendDocument(msg.chat.id, key, {
        caption: 'Здесь есть  все, что вам нужно знать о нашей системе отопления'
    },
        {
            filename: 'TermoElectric Kit'
        })

    })
}

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