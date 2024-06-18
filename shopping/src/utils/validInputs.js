import {z} from 'zod'

const cartInputs = z.object({
    customerId : z.string(),
    products : z.array(z.object({
        _id : z.string(),
        name : z.string(),
        description : z.string(),
        category : z.string(),
        brand : z.string(),
        quantity : z.number(),
        vendorId : z.string()
    }))
})

const orderInputs = z.object(
    {
    orderId : z.string(),
    customerId : z.string(),
    customerEmail : z.string(),
    amount : z.number(),
    status : z.string(),
    items : z.array(
        z.object({
            _id : z.string(),
        name : z.string(),
        description : z.string(),
        category : z.string(),
        brand : z.string(),
        quantity : z.number(),
        vendorId : z.string()
        })
    )
})

const wishlistInputs = z.object({
    customerId : z.string(),
    products : z.array({
        productId : z.string()
    })
})

export { cartInputs, orderInputs, wishlistInputs }