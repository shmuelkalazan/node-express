import { getFileData, saveFileData } from "../config/fileDataLayer";
import newBeeperDto from "../dto/newBeeperDto";
import Beeper from "../models/beeperModel";
import Status from "../models/enumStatus";

export class BepperService{
    public static async CreatNewBeeper(newBeeper:newBeeperDto):Promise<boolean>{ 
        try {
            console.log(Status.manufactured.toString());
            
            const {name } = newBeeper
            const beeper :Beeper = new Beeper(
                name,Status.manufactured.toString(),0,0,"")    
            let beepers = await getFileData()            
            if (!beepers) beepers = []
            beepers.push(beeper)
            await saveFileData(beepers)
            return true
        } catch (error) {
            return false
        }
    }

    public static async GetAllBeepers():Promise<Beeper[]|null>{  
        const beepers :Beeper[] = await getFileData() as Beeper[]           
        if (beepers)
        {
            return beepers
        }
        return null
    } 

    public static async GetBeeperById(id:number):Promise<Beeper|null>{  
        const beepers:Beeper[]|null = await getFileData() as Beeper[] 
        const oneBeeper :Beeper|undefined =  beepers.find(b => b.id == id)  
        if (oneBeeper){
            return oneBeeper
        }   
        return null
    } 

    public static async UpdateStatusBeeper(id:number):Promise<boolean>{ 
        try {
            const beepers:Beeper[]|null = await getFileData() as Beeper[] 
            const oneBeeper :Beeper|undefined =  beepers.find(b => b.id == id)  
            // if (oneBeeper){
            //     return oneBeeper
            // }            
            // const beeper :Beeper = new Beeper(
            //     name,"manufactured",0,0,"")    
            // if (!beepers) beepers = []
            // beepers.push(beeper)
            // await saveFileData(beepers)
            return true
        } catch (error) {
            return false
        }
    }
}