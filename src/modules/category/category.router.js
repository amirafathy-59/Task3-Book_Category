
import express from "express"
import * as category from "./category.controller.js"
const categoryRouter = express.Router()

categoryRouter
    .route('/')
    .post(category.createOrder)
    .get(category.getAllOrders)

categoryRouter
    .route('/:id')
    .get(category.getOrderById)
    .put(category.updateOrder)
    .delete(category.deleteOrder)




export default categoryRouter


