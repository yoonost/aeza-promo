import axios from 'axios' 
import { aezaSession } from './config.js'

const run = async (promt : any) : Promise<any> => { // eslint-disable-line
    const response = await axios.post('http://gpt4free_gpt4free_1:1337/v1/chat/completions', {
        model: "gpt-4",
        messages: promt
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response.data
}

const aeza = async (promo : any) : Promise<any> => { // eslint-disable-line
    const response = await axios.post(`https://my.aeza.net/api/promo/usegift/${promo}`, null, {
        headers: {
            "Authorization": `Bearer ${aezaSession}`
        }
    })
    return response
}

export { run, aeza }