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

    public static async UpdateStatusBeeper(beeper:Beeper):Promise<boolean |undefined>{ 
        try {
            const beepers:Beeper[]|null = await getFileData() as Beeper[] 
            const oneBeeper :Beeper|undefined =  beepers.find(b => b.id == beeper.id)
            if (oneBeeper){
                let updatedBeeper :Beeper = {...oneBeeper}                
                switch (beeper.status) {
                    case "assembled":
                        if (oneBeeper.status == "manufactured"){
                            updatedBeeper.status = "assembled"
                    } 
                    break;
                case "shipped":
                    if (oneBeeper.status == "assembled"){
                        updatedBeeper.status = "shipped"
                    }                                 
                    break;
                case "deployed":
                    if (oneBeeper.status == "shipped"){ 
                        const range:boolean = await this.checkrange(beeper.latitued,beeper.longitude)                        
                        if(!range){return false}  
                        updatedBeeper.status = "deployed"
                        updatedBeeper.latitued = beeper.latitued
                        updatedBeeper.longitude = beeper.longitude 
                   } 
                    break;
                default:
                    break;
                }
            const allBeeper :Beeper[]|undefined =  beepers.filter(b => b.id != beeper.id)
            allBeeper.push(updatedBeeper)
            await saveFileData(allBeeper)
            if (updatedBeeper.status == "deployed"){
                setTimeout(()=>{this.updateToFinish(beeper)}, 10000);                   
            }
            return true
        }            
        } catch (error) {
            return false
        }
    }

    public static async DeleteBeeperById(id:number):Promise<boolean>{
        try {   
            const beepers:Beeper[]|null = await getFileData() as Beeper[] 
            if (beepers){
                const allBeeper :Beeper[]|undefined =  beepers.filter(b => b.id != id)
                await saveFileData(allBeeper)         
            }
            return true
        } catch (error) {
            return false
        }  
    }
    
    public static async GetBeepersByStatus(status:string):Promise<Beeper[]|null>{  
        const beepers:Beeper[]|null = await getFileData() as Beeper[] 
        const filterBeepers :Beeper[]|undefined =  beepers.filter(b => b.status == status) 
        if (filterBeepers){
            return filterBeepers
        }   
        return null
    }

    public static async updateToFinish(beeper :Beeper){        
        try {   
            const beepers:Beeper[]|null = await getFileData() as Beeper[] 
            if (beepers){
                const allBeeper :Beeper[]|undefined =  beepers.filter(b => b.id != beeper.id)
                if(allBeeper){
                    let updatedPeeper :Beeper = {...beeper}
                    updatedPeeper.status = "detonated" 
                    updatedPeeper.detonated = new Date().toString()
                    allBeeper.push(updatedPeeper)
                    await saveFileData(allBeeper)  
                }
            }
            return true
        } catch (error) {
            return false
        }  
    }
    public static async checkrange(lat: number, lon: number): Promise<boolean>{
        const latitued: boolean = lat > 33.01048 && lat < 34.6793
        const longitude: boolean = lon > 35.04438 && lon < 36.59793
        return latitued && longitude
    }

}