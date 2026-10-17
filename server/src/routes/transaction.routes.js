const {Router} =require("express");
const authMiddleware=require('../middlewares/auth.middleware')
const transactionController=require("../controllers/transaction.controller")

const transactionRoutes=Router();

transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction)

/**
 * create initail funds transaction from system user
 */

transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)

transactionRoutes.get("/", authMiddleware.authMiddleware, transactionController.fetchTransactions)

module.exports=transactionRoutes;