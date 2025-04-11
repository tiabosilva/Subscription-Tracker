const errorMiddleware = (err, req, res, next) => {
    try{
        let error ={ ...err}
        error.message = err.message;

        console.log(err);
        
        if(err.name === 'CastError'){
            const message = `Resource not found`;
            error = new Error(message, 404);
        }
        if(err.code === 11000){
            const message = `Duplicate field value entered`;
            error = new Error(message, 400);
        }
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '), 400);
        }
        res.status(error.statuscode || 500).json({success: false, error: error.message || 'Server Error'});
    }catch(e){
        next(e);
    }
}

export default errorMiddleware;
