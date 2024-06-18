import { z  } from 'zod';

const newProductInput = z.object({
    name : z.string({message : "Name must be a string"}),
    category : z.string({message : "category must be a string"}),
    description : z.string({message : "description must be a string"}),
    brand : z.string({message : "brand must be a string"}),
    available : z.boolean({message : "Available must be a Boolean"}).optional(),
    availableUnit : z.number({message : "Avaiable units must be a number"}),
    price : z.number({message : " Price must be a valid number"})
}).strict()

const updateProductInput = z.object({
    name : z.string().optional(),
    price : z.number().optional(),
    description : z.string().optional(),
    brand : z.string().optional(),
    available : z.boolean().optional(),
    availableUnit : z.number().optional(),
    category : z.string().optional()
})



export { newProductInput, updateProductInput }

