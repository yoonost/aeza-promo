import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'
import { getValue, addValue, updateValue, existsValue } from './database.js'
import { apiId, apiHash, stringSession } from './config.js'
import { run, aeza } from './uutils.js'
import readline from 'readline'

let client: TelegramClient | undefined = undefined

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const initialize = async () => {
    client = new TelegramClient(new StringSession(stringSession), apiId, apiHash, {
        connectionRetries: 5
    })
    await client.start({
        phoneNumber: async () => new Promise((resolve) => rl.question("Please enter your number: ", resolve)),
        password: async () => new Promise((resolve) => rl.question("Please enter your password: ", resolve)),
        phoneCode: async () => new Promise((resolve) => rl.question("Please enter the code you received: ", resolve)),
        onError: (err) => {
            console.error('Error initialize telegram client:', err.message)
            process.exit(1)
        }
    })
    console.log(client.session.save())
}

const procedure = async () => {
    if (client === undefined) process.exit(1)
    for await (const message of client.iterMessages('aezahost_ru', { limit: 5 })) {
        if (!existsValue(message.id)) addValue(message.id, 1)
        if (getValue(message.id) >= 3) {
            console.log('Message already processed:', message.id)
            continue
        }

        try {
            console.log('Message processed:', message.id)
            await run([{
                role: 'user',
                content: 'Прочитай текст и найди в нем промокод, если промо код не найден напиши слово "none". Промокод состоит из английских букв, твой ответ не должен содержать ничего кроме самого кода, а вот и сам текст - ' +  message.message
            }]).then(async (response) => {
                const promocode = response.choices[0].message.content.replace(/\*/g, '')

                if (promocode !== 'none' && /^[a-zA-Z0-9]+$/.test(promocode)) {
                    await aeza(promocode).then((response) => {
                        console.log(response.data)
                    })
                }
                
                updateValue(message.id, getValue(message.id) + 1)
            })
        } catch (err) {
            console.error('Error processing message:', err)
        }
    }
    setTimeout(procedure, 30000)
}

(async () => {
    await initialize()
    await procedure()
})()