import Express from 'express';
import cors from 'cors';
import cheerio from 'cheerio';
import request from 'request-promise';
import dataRouter from './routes/dataRouter.js';
import { amazonUrls } from './shared/amazonProductsUrl.js';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { Product } from './models/product.js';
import { snapdealUrls } from './shared/snapdealProductUrl.js';
import { flipkartUrls } from './shared/flipkartProductUrl.js';

const app = Express();
app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }))
const host = '0.0.0.0';
const port = process.env.PORT || 3200;

//for mongo db connection

const url = process.env.MONGODB_URI || "mongodb://localhost/ProductDB"
// || "mongodb+srv://ashler18:kOtHmMJ45rB1w2u6@recipecluster0.9b7gv.mongodb.net/test?authSource=admin&replicaSet=atlas-v33fyz-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;
con.on("open", () => console.log("Mongo DB connected"));
//

app.use('/data', dataRouter);



async function getAmazonProductsData(url) {
    try {
        const response = await request({
            uri: url,
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.5",
                "accept-encoding": "gzip, deflate, br",
            },
            gzip: true
        })

        const $ = cheerio.load(response);
        let title = $('span[id="productTitle"]').text().trim();

        let imgUrl = JSON.parse($('#landingImage').attr('data-a-dynamic-image'));
        imgUrl = "" + Object.keys(imgUrl)[0];
        let rating = $('span[class="a-icon-alt"]').text().split(" ")[0].trim();

        let price = $('span[class="priceBlockStrikePriceString a-text-strike"]').text().replace(/[^0-9.]/g, '').trim()
            || $('span[id="priceblock_ourprice"]').text().replace(/[^0-9.]/g, '').trim()
            || $('span[class="a-size-medium a-color-price priceBlockDealPriceString"]').text().replace(/[^0-9.]/g, '').trim()

        let finalPrice = $('span[id="priceblock_ourprice"]').text().replace(/[^0-9.]/g, '').trim()

        // const amazonProduct = {
        //     title: title,
        //     imgUrl: imgUrl,
        //     rating: rating,
        //     price: price,
        //     finalPrice: finalPrice,
        //     source: "amazon",
        //     category: "electronics",
        //     date: Date.now()
        // }

        // console.log({ amazonProduct })

        let amaProObjTOSave = new Product({
            "title": title.toLowerCase().trim(),
            "img": imgUrl.trim(),
            "rating": rating,
            "price": price.trim(),
            "finalPrice": finalPrice.trim(),
            "source": "amazon",
            "category": "electronics",
            "date": Date.now()
        });

        let savedObj = await amaProObjTOSave.save();

        console.log({ savedObj });


    }
    catch (error) {
        console.error(error);
    }
}

async function getSnapdealProductsData(url) {
    try {
        const response = await request({
            uri: url,
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.5",
                "accept-encoding": "gzip, deflate, br",
            },
            gzip: true
        })

        const $ = cheerio.load(response);
        let title = $('.pdp-e-i-head').text().trim();

        let imgUrl = $('img[class="cloudzoom"]').attr('src');

        let rating = $('span[class="total-rating showRatingTooltip"]').text().replace(/[^0-9]/g, '').trim();

        let price = $('div[class="pdpCutPrice "]').text().replace(/[^0-9]/g, '').trim();

        let finalPrice = $('span[class="payBlkBig"]').text().replace(/[^0-9]/g, '').trim();

        // const snapdealProduct = {
        //     title: title,
        //     img: imgUrl,
        //     rating: rating,
        //     price: price,
        //     finalPrice: finalPrice,
        //     source: "amazon",
        //     category: "electronics",
        //     date: Date.now()
        // }

        let snapProObjTOSave = new Product({
            "title": title.toLowerCase().trim(),
            "img": imgUrl.trim(),
            "rating": rating,
            "price": price.trim(),
            "finalPrice": finalPrice.trim(),
            "source": "snapdeal",
            "category": "electronics",
            "date": Date.now()
        });

        let savedObj = await snapProObjTOSave.save();

        console.log({ savedObj });
        // console.log({ snapdealProduct });

    }
    catch (error) {
        console.error(error);
    }
}

async function getFlipkartProductDate(url) {
    try {
        const response = await request({
            uri: url,
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.5",
                "accept-encoding": "gzip, deflate, br",
            },
            gzip: true
        })

        const $ = cheerio.load(response);
        let title = $('span[class="B_NuCI"]').text().trim();

        let imgUrl = $('div[class="CXW8mj _3nMexc"] > img').attr('src');

        let rating = $('div[class="_3LWZlK"]').text().trim();

        let price = $('div[class="_3I9_wc _2p6lqe"]').text().replace(/[^0-9.]/g, '').trim();

        let finalPrice = $('div[class="_30jeq3 _16Jk6d"]').text().replace(/[^0-9.]/g, '').trim();

        // const flipkartProduct = {
        //     title: title,
        //     img: imgUrl,
        //     rating: rating,
        //     price: price,
        //     finalPrice: finalPrice,
        //     source: "flipkart",
        //     category: "electronics",
        //     date: Date.now()
        // }

        // console.log({ flipkartProduct });

        let flipProObjTOSave = new Product({
            "title": title.toLowerCase().trim(),
            "img": imgUrl.trim(),
            "rating": rating,
            "price": price.trim(),
            "finalPrice": finalPrice.trim(),
            "source": "flipkart",
            "category": "electronics",
            "date": Date.now()
        });

        let savedObj = await flipProObjTOSave.save();

        console.log({ savedObj });

    }
    catch (error) {
        console.error(error);
    }
}


// (async () => {
//     //for every new data
//     try {
//         await Product.deleteMany();
//         console.log('All Data successfully deleted');
//     }
//     catch (error) {
//         console.log(error);
//     }
// })()

// amazonUrls.forEach(url => {
//     getAmazonProductsData(url);
// })

// snapdealUrls.forEach(url => {
//     getSnapdealProductsData(url);
// })

// flipkartUrls.forEach(url => {
//     getFlipkartProductDate(url);
// })


//to fetch new data every 12 hrs
cron.schedule("0 */12 * * *", async function () {
    console.log('cron-called')
    //for every new data
    try {
        await Product.deleteMany();
        console.log('All Data successfully deleted');
    }
    catch (error) {
        console.log(error);
    }

    amazonUrls.forEach(url => {
        getAmazonProductsData(url);
    })

    snapdealUrls.forEach(url => {
        getSnapdealProductsData(url);
    })

    flipkartUrls.forEach(url => {
        getFlipkartProductDate(url);
    })
});


app.listen(port, host, () => console.log(`node server is running on port :${port}`));