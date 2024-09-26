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
            // console.log(beeper.longitude)
            let checked :boolean = false
            const beepers:Beeper[]|null = await getFileData() as Beeper[] 
            const oneBeeper :Beeper|undefined =  beepers.find(b => b.id == beeper.id)
            if (oneBeeper){
                let updatedPeeper :Beeper = {...oneBeeper}
                // console.log(updatedPeeper);
                // console.log(beeper.status);                
                switch (beeper.status) {
                    case "assembled":
                        if (oneBeeper.status == "manufactured"){
                        updatedPeeper.status = "assembled"
                        checked = true
                        // console.log("iam in 77");
                    } 
                    break;
                case "shipped":
                    // console.log("iam in 6");
                    if (oneBeeper.status == "assembled"){
                        updatedPeeper.status = "shipped"
                        checked = true
                        // console.log("iam in 66");
                    } 
                                           
                    break;
                case "deployed":
                    if (oneBeeper.status == "shipped"){                        
                        updatedPeeper.status = "deployed"
                        updatedPeeper.latitued = beeper.latitued
                        updatedPeeper.longitude = beeper.longitude 
                        checked = true  
                   } 
                    break;
                default:
                    break;
                }
            const allBeeper :Beeper[]|undefined =  beepers.filter(b => b.id != beeper.id)
            allBeeper.push(updatedPeeper)
            await saveFileData(allBeeper)
            if (updatedPeeper.status == "deployed"){
                setTimeout(()=>{this.updateToFinish(beeper)}, 2000);                   
            }
            return checked
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
                console.log(allBeeper)
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
        console.log("in");
        
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
}