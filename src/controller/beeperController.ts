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
router.get('/:id' , async (req:Request, res: Response): Promise<void> =>{
    try {        
        const resulte = await BepperService.GetBeeperById(Number(req.params.id))
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
router.post('/:id/status' , async (req:Request, res: Response): Promise<void> =>{
    try {
        let beeper :Beeper = req.body
        beeper.id = Number(req.params.id)
        const resulte = await BepperService.UpdateStatusBeeper(beeper)
        if(resulte){res.json("the beeper updated sccsfuly")}
        else{
            throw new Error('can t find beepers from the file')
        }
    } catch (error) {
        res.status(400).json({
            err:true,
            massage:error || 'not found',
            data:null
        })
    }
})
//get all bay status
router.get('/status/:status' , async (req:Request, res: Response): Promise<void> =>{
    console.log(req.params.status);
    try {
        
        const resulte:Beeper[] |null = await BepperService.GetBeepersByStatus(req.params.status)
        if(resulte){res.json(resulte)}
        else{
            throw new Error('can t get beepers from the file')
        }
    } catch (error) {
        res.status(400).json({
            err:true,
            massage:error || 'non found',
            data:null
        })
    }
})
//delete by id
router.delete('/:id' , async (req:Request, res: Response): Promise<void> =>{
    try {        
        const resulte = await BepperService.DeleteBeeperById(Number(req.params.id))
        if(resulte){
            res.status(200).json({
                err:false,
                massage:'gooood',
            })}
        }catch (error) {
        res.status(400).json({
            err:true,
            massage:error || 'no gooood',
            data:null
        })
    }
})

export default router