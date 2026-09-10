import multer from 'multer'
import path from 'path'

const storage = multer.memoryStorage()

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
]

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.webpg', '.heic', '.heif']

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase()
    const mime = file.mimetype?.toLowerCase()

    if (ALLOWED_MIME_TYPES.includes(mime) || ALLOWED_EXTENSIONS.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error('Only JPG, PNG, WEBP, and HEIC images are allowed'), false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})
