error = new Error('scream not found')
error.statusCode = 402
throw error

catch(err=>{
        if(!err.statusCode){
                    err.statusCode=500
        }
        next(err)
    })

