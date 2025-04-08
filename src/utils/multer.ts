import path from "node:path";
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    fileFilter(req, file, callback) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extName = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimeType = filetypes.test(file.mimetype);

        if (mimeType && extName) {
            return callback(null, true);
        }
        callback(new Error("Only images are allowed!"));
    },
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});
