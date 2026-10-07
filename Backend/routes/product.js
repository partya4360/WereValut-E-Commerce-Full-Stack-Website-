const express = require('express');

const {protect} = require('../middlewere/auth');
const { admin} = require('../middlewere/admin');
const {getProductById, getProducts, createProduct, updateProduct, deleteProduct, deleteGalleryImage} = require('../controllers/product');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'});
const router = express.Router();
const productImages = upload.fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'galleryImages', maxCount: 10 }
]);

router.route('/').get(getProducts).post(protect, admin, productImages, createProduct);
router.route('/:id/gallery/:imageId').delete(protect, admin, deleteGalleryImage);
router.route('/:id').get(getProductById).put(protect, admin, productImages, updateProduct).delete(protect, admin, deleteProduct);
 module.exports = router;