import dotenv from 'dotenv'
dotenv.config()

const globalObj = {
    PORT : process.env.PORT,
    DB_URL : process.env.DB_URL,
    APP_SECRET : process.env.APP_SECRET,
    SHOPPING_BINDING_KEY: process.env.SHOPPING_BINDING_KEY,
    PRODUCT_BINDING_KEY : process.env.PRODUCT_BINDING_KEY,
    RABBIT_MQ_URL : process.env.RABBIT_MQ_URL,
    EXCHANGE_NAME : process.env.EXCHANGE_NAME,
    SHOPPING_SERVICE : process.env.SHOPPING_SERVICE,
    PRODUCT_SERVICE : process.env.PRODUCT_SERVICE
}

export { globalObj }