const errorhandler=(err,req,res,next)=>{
    let statusCode=err.statuscode || 500;
    let message=err.message || "Internal server error";
    //mongoose bad object id error
    if(err.name==="CastError"){
        statusCode=400;
        message="Resource not found";
    }

    //mongoose duplicate key error means aready exit like email or username
    if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
    }

    //if field is required and not provided
    if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
    .map(val => val.message)
    .join(', ');
    statusCode = 400;
    }

    //if file limit exceeds the maximum limit of 10mb
    if(err.code === 'LIMIT_FILE_SIZE'){
    message = 'File size exceeds the maximum limit of 10MB';
    statusCode = 400;
    }

    //jwt token error
    if(err.name==='JsonWebTokenError'){
        message = 'Invalid token';
        statusCode = 401;
    }

    //jwt token expired error
    if(err.name==='TokenExpiredError'){
        message = 'Token expired';
        statusCode = 401;
    }

    console.error('Error:',{
        message: err.message,
        stack:process.env.NODE_ENV === 'development' ? err.stack:undefined
    })
    //send the response
    res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });

}
export default errorhandler