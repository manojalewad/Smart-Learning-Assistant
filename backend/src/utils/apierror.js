class apierror extends Error{
    constructor(
        statusOrMessage,
        message="somethings is wrong",
        error=[],
        statck=""
    ){
        // Support both constructor signatures:
        // new apierror(401, "Message") and new apierror("Message", 401)
        let statuscode = 500;
        let finalMessage = message;

        if (typeof statusOrMessage === "number") {
            statuscode = statusOrMessage;
        } else if (typeof statusOrMessage === "string") {
            finalMessage = statusOrMessage;
            if (typeof message === "number") {
                statuscode = message;
            }
        }

        super(finalMessage)
        // Keep both keys for backward compatibility with existing code typos.
        this.statuscode=statuscode
        this.stautscode=statuscode
        this.message=finalMessage
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
