import Express from 'express';
import { Product } from '../models/product.js';

const dataRouter = Express.Router();

dataRouter
    .route('/')
    .get(async (request, response) => {

        let query = {};

        console.log('first get')
        if (request.query.title) {
            query = { $or: [{ title: { $regex: request.query.title.trim(), $options: 'i' } }, { title: request.query.title.trim() }] };
            console.log(query)
        }

        try {
            const productData = await Product.find(query);
            response.json({ productData });
        }
        catch (error) {
            console.error(error)
            response.send("Error G01: Unable to fetch the data....");
        }
    })


dataRouter
    .route('/getTitlesOnType')
    .get(async (request, response) => {

        let query = {};

        console.log('secons get')
        if (request.query.title) {
            query.title = { $regex: request.query.title.trim(), $options: 'i' };
            console.log(query);
        }


        try {
            const productData = await Product.find(query);
            response.json({ productData });
        }
        catch (error) {
            console.error(error)
            response.send("Error G02: Unable to fetch the data....");
        }
    })

export default dataRouter;