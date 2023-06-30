const multer = require('multer')

const diskStorage = multer.diskStorage({
    destination:(req, file,callback)=>{
        callback(null,'images');
    },
    filename:(req,file,callback)=>{
        const mimetype = file.mimetype.split('/');
        const fileType = mimetype[1]
        const filename = file.originalname 
        callback(null,filename)
    }
})

const fileFilter = (req,file,callback)=>{
    const allowedMimeTypes = ['image/png','image/jpeg','image/jpg']
    allowedMimeTypes.includes(file.mimetype) ? callback(null,true) : callback(null,false)
}

const storage = multer({storage: diskStorage, fileFilter:fileFilter}).single('avatar')

module.exports = storage