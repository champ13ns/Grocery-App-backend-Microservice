import dotenv from 'dotenv'

dotenv.config();

const globalObj = {
    PORT : process.env.PORT,
    DB_URL : process.env.DB_URL,
    APP_SECRET : process.env.APP_SECRET,
    RABBIT_MQ_URL : process.env.RABBIT_MQ_URL,
    EXCHANGE_NAME : process.env.EXCHANGE_NAME,
    SHOPPING_BINDING_KEY : process.env.SHOPPING_SERVICE,
    CUSTOMER_BINDING_KEY : process.env.PRDUCT_SERVICE
}

export { globalObj } ;