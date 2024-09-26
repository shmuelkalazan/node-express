import express,{Express} from 'express'
import beeperContoller from './src/controller/beeperController'
// import userContoller from './contollers/userController'
// import postContoller from './contollers/postController'
import exp from 'express'
import 'dotenv/config'
const app :Express = express()
app.use(express.json())

app.use('/api/beepers',beeperContoller)



app.listen(process.env.PORT,():void => console.log(`the server run on port ${process.env.PORT}`))
