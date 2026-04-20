const express           = require('express');
const router            = express.Router();
const ProductController = require('../controllers/ProductController');
const multer            = require('multer');
const path              = require('path');
const fs                = require('fs');
 
// Garante que a pasta de uploads existe (resolve o erro ENOENT no Windows)
const uploadDir = path.join(__dirname, '..', 'public', 'images', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
 
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/i;
    if (allowed.test(path.extname(file.originalname))) return cb(null, true);
    cb(new Error('Só são permitidas imagens (jpg, png, gif, webp).'));
  }
});
 
router.get('/',            ProductController.list);
router.get('/create',      ProductController.showCreate);
router.post('/create',     upload.single('image'), ProductController.create);
router.get('/:id/edit',    ProductController.showEdit);
router.post('/:id/update', upload.single('image'), ProductController.update);
router.post('/:id/delete', ProductController.delete);
 
module.exports = router;
