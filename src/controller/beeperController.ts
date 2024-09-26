import exp ,{Request, Response, Router} from 'express'
import newBeeperDto from '../dto/newBeeperDto'
import { BepperService } from '../servie/beeperService'
import Beeper from '../models/beeperModel'
const router:Router = exp.Router()

//create new
router.post('/' , async (req:Request<any,any,newBeeperDto>, res: Response): Promise<void> =>{
    try {
        console.log(req.body);
        
        const resulte = await BepperService.CreatNewBeeper(req.body)
        if(resulte){
            res.status(200).json({
                err:false,
                massage:'gooood',
                data:req.body
            })
        }
        else{
            throw new Error('can t save new beeper in the file')
        }
    } catch (error) {
        res.status(400).json({
            err:true,
            massage:error || 'no gooood',
            data:null
        })
    }
})
//get all
router.get('/' , async (req:Request, res: Response): Promise<void> =>{
    try {
        const resulte = await BepperService.GetAllBeepers()
        if(resulte){res.json(resulte)}
        else{
            throw new Error('can t get beepers from the file')
        }
    } catch (error) {
        res.status(400).json({
            err:true,
            massage:error || 'no gooood',
            data:null
        })
    }
})
//get by id
router.get('/' , async (req:Request, res: Response): Promise<void> =>{
    try {
        console.log(req.query);
        
        const resulte = await BepperService.GetBeeperById(Number(req.query.title))
        if(resulte){res.json(resulte)}
        else{
            throw new Error('can t get beeper from the file')
        }
    } catch (error) {
        res.status(400).json({
            err:true,
            massage:error || 'no gooood',
            data:null
        })
    }
})
//update status
router.get('/stasus' , async (req:Request, res: Response): Promise<void> =>{
    try {
        const resulte = await BepperService.GetBeeperById(Number(req.query.title))
        if(resulte){res.json(resulte)}
        else{
            throw new Error('can t get beepers from the file')
        }
    } catch (error) {
        res.status(400).json({
            err:true,
            massage:error || 'no gooood',
            data:null
        })
    }
})
export default router