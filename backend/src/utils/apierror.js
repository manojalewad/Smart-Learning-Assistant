class apierror extends Error{
    constructor(
        stautscode,
        message="somethings is wrong",
        error=[],
        statck=""
    ){
        super(message)
        this.stautscode=stautscode
        this.message=message
        this.data=null
        this.success=false
        this.error=error
        if(statck){
            this.stack=statck
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {apierror}