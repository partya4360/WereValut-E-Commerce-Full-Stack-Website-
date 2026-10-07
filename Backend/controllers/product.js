const Product = require('../models/product');
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product nor Found' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createProduct = async (req, res) =>{
    try{
        const {name, description, price, category, stock} = req.body;
        const mainImage = req.files?.image?.[0];
        if (!mainImage) {
            return res.status(400).json({ message: 'Main product image is required.' });
        }

        const mainImageResult = await cloudinary.uploader.upload(mainImage.path);
        const galleryResults = await Promise.all(
            (req.files?.galleryImages || []).map(file => cloudinary.uploader.upload(file.path))
        );
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl: mainImageResult.secure_url,
            galleryImages: galleryResults.map(result => ({
                url: result.secure_url,
                publicId: result.public_id
            }))
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating product.', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name ?? product.name;
            product.description = description ?? product.description;
            product.price = price ?? product.price;
            product.category = category ?? product.category;
            product.stock = stock ?? product.stock;

            const mainImage = req.files?.image?.[0];
            if (mainImage) {
                const result = await cloudinary.uploader.upload(mainImage.path);
                product.imageUrl = result.secure_url;
            }

            const galleryResults = await Promise.all(
                (req.files?.galleryImages || []).map(file => cloudinary.uploader.upload(file.path))
            );
            product.galleryImages.push(...galleryResults.map(result => ({
                url: result.secure_url,
                publicId: result.public_id
            })));

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product Not Found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error',error:error.message });
    }
};

const deleteGalleryImage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }

        const image = product.galleryImages.id(req.params.imageId);
        if (!image) {
            return res.status(404).json({ message: 'Gallery image not found' });
        }

        await cloudinary.uploader.destroy(image.publicId);
        product.galleryImages.pull({ _id: image._id });
        await product.save();
        res.json({ message: 'Gallery image deleted.', galleryImages: product.galleryImages });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting gallery image.', error: error.message });
    }
};

const deleteProduct = async (req, res) =>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message: 'Product Deleted..'});
        }else {
        res.status(404).json({message: 'Product Not Found'});
       }
    }catch (error) {
        res.status(500).json({ message: 'Server Error',error: error.message });
    }
};

module.exports = {getProductById, getProducts, updateProduct, deleteProduct, deleteGalleryImage, createProduct};