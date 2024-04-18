import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type JSONData = { [key: string]: number }[]

const existsValue = (key: string | number): boolean => {
    return loadData().some(item => key.toString() in item)
}

const addValue = (key: string | number, value: number): boolean => {
    const data = loadData()
    if (!existsValue(key)) {
        data.push({ [key.toString()]: value })
        saveData(data)
        return true
    }
    return false
}

const getValue = (key: string | number): number => {
    const item = loadData().find(item => key.toString() in item)
    return item ? item[key.toString()] : 1
}

const updateValue = (key: string | number, value: number): boolean => {
    const data = loadData()
    const index = data.findIndex(item => key.toString() in item)
    if (index !== -1) {
        data[index][key.toString()] = value
        saveData(data)
        return true
    }
    return false
}

const loadData = (): JSONData => {
    const filePath = path.join(__dirname, 'database.json')
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8')
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as JSONData
    } catch (error) {
        console.error('Error loading data:', error)
        return []
    }
}

const saveData = (data: JSONData): boolean => {
    try {
        fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify(data), 'utf-8')
        return true
    } catch (error) {
        console.error('Error saving data:', error)
        return false
    }
}

export { getValue, addValue, updateValue, existsValue }