class Beeper {
    public id:number
    public created_at: Date 
    constructor(    
        public name:string,
        public status:string,
        public latitued:number,
        public longitude :number,
        public detonated:string
    ) {
        this.id = Number(Math.random().toString().split('.')[1])
        this.created_at = new Date()
    }
}


export default Beeper