import { getFileData, saveFileData } from "../config/fileDataLayer";
import newBeeperDto from "../dto/newBeeperDto";
import Beeper from "../models/beeperModel";
import Status from "../models/enumStatus";

export class BepperService{
    //יצירת ביפר חדש
    public static async CreatNewBeeper(newBeeper:newBeeperDto):Promise<boolean>{ 
        try {            
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
    //להביא את כל הביפרים
    public static async GetAllBeepers():Promise<Beeper[]|null>{  
        const beepers :Beeper[] = await getFileData() as Beeper[]           
        if (beepers)
        {
            return beepers
        }
        return null
    } 
    //להביא ביפר לפי מזהה
    public static async GetBeeperById(id:number):Promise<Beeper|null>{  
        const beepers:Beeper[]|null = await getFileData() as Beeper[] 
        const oneBeeper :Beeper|undefined =  beepers.find(b => b.id == id)  
        if (oneBeeper){
            return oneBeeper
        }   
        return null
    } 
    //עדכון סטטוס ביפר
    public static async UpdateStatusBeeper(beeper:Beeper):Promise<boolean |undefined>{ 
        try {
            //למצוא את הביפר הספציפי
            const beepers:Beeper[]|null = await getFileData() as Beeper[] 
            const oneBeeper :Beeper|undefined =  beepers.find(b => b.id == beeper.id)
            //בדיקת הסטטוס
            if (oneBeeper){
                //הביפר החדש שיתעדכן
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
                        //לבדוק האם הביפר בלבנון
                        const range:boolean = await this.checkrange(beeper.latitued,beeper.longitude)                        
                        if(!range){return false}  
                        //עדכון הביפר החדש
                        updatedBeeper.status = "deployed"
                        updatedBeeper.latitued = beeper.latitued
                        updatedBeeper.longitude = beeper.longitude 
                   } 
                    break;
                default:
                    break;
                }
                //שמירה ועדכון הביפר החדש
            const allBeeper :Beeper[]|undefined =  beepers.filter(b => b.id != beeper.id)
            allBeeper.push(updatedBeeper)
            await saveFileData(allBeeper)
            //הפעלת טיימר לפיצוץ עוד 10 שניות
            if (updatedBeeper.status == "deployed"){
                setTimeout(()=>{this.updateToFinish(beeper)}, 10000);                   
            }
            return true
        }            
        } catch (error) {
            return false
        }
    }
    //מחיקת ביפר לפי מזהה
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
    //להביא ביפרים לפי סטטוס
    public static async GetBeepersByStatus(status:string):Promise<Beeper[]|null>{  
        const beepers:Beeper[]|null = await getFileData() as Beeper[] 
        const filterBeepers :Beeper[]|undefined =  beepers.filter(b => b.status == status) 
        if (filterBeepers){
            return filterBeepers
        }   
        return null
    }
    //פיצוץ ביפר
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
    //לבדוק אם הטווח בלבנון
    public static async checkrange(lat: number, lon: number): Promise<boolean>{
        const latitued: boolean = lat > 33.01048 && lat < 34.6793
        const longitude: boolean = lon > 35.04438 && lon < 36.59793
        return latitued && longitude
    }

}