import dotenv from 'dotenv'

dotenv.config()

const globalObj = {
    PORT : process.env.PORT,
    DB_URL : process.env.DB_URL,
    APP_SECRET : process.env.APP_SECRET,
    EXCHANGE_NAME : process.env.EXCHANGE_NAME,
    RABBIT_MQ_URL : process.env.RABBIT_MQ_URL,
    SHOPPING_BINDING_KEY: process.env.SHOPPING_BINDING_KEY,
    PRODUCT_BINDING_KEY : process.env.PRODUCT_BINDING_KEY
}



export { globalObj };