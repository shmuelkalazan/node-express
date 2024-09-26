import fs from 'fs/promises'
import Beeper from '../models/beeperModel'

export const getFileData = async ():Promise<Beeper[] |void> => {
    try {
        const strData = await fs.readFile(
            `${__dirname}/../../../data/beepers.json`,'utf-8')        
        const parasedData:Beeper[] = JSON.parse(strData)
        return parasedData
    } catch (error) {
        console.log(error)
    }
}

export const saveFileData = async (data:Beeper[]):Promise<boolean> => {
    try {
        const stringifiedData:string = JSON.stringify(data)
        await fs.writeFile(`${__dirname}/../../../data/beepers.json`,stringifiedData ,{
            encoding:'utf-8'
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}