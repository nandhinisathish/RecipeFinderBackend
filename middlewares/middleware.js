
export const globalErr =  (err, _req, res, _next) => {
    
   res.status(err.status || 500).json({ msg: err.message || "Server Error" });

}

export const log = (req, res, next) =>{

    console.log(`${req.method} - ${req.path}`);
    next();

} 