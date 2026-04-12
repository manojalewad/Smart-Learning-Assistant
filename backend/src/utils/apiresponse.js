class apiresponse{
    constructor(statuscode,massage="success",data){
        this.statuscode=statuscode;
        this.data=data;
        this.success=statuscode < 400;
        this.massage=massage
    }
}
export {apiresponse}