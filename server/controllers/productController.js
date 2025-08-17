import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

//addProduct

export const addProduct = async (req, res) => {


    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        let imageURL = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                });
                return result.secure_url;
            })
        );

        await Product.create({ ...productData, image: imageURL })


        return res.json({
            success: true,
            message: "Product Added"
        })

    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }
}

//Productlist

export const productList = async (req, res) => {

    try {
        const products = await Product.find({})

        res.json({
            success: true,
            message: products
        })


    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }

}

//get Product single

export const productById = async (req, res) => {


    try {


        const { id } = req.body;

        const product = await Product.findById(id)

        res.json({
            success: true,
            message: product
        })


    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }

}

//change stock

export const changeStock = async (req, res) => {

    try {


        const { id, inStock } = req.body;

        await Product.findByIdAndUpdate(id, { inStock })

        res.json({
            success: true,
            message: "Stock updated"
        })


    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }

}