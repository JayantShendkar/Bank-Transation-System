const transactionModel=require("../models/transaction.model")
const ledgerModel=require("../models/ledger.model")
const emailService=require("../services/email.service")
const accountModel=require("../models/account.model")
const mongoose=require("mongoose")

async function createTransaction(req,res){
    
    
    /**
     * Validate request!!
     * 
     */
    const{fromAccount ,toAccount,amount,idempotencyKey}=req.body
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"FromAccount,toAccount,amount and idempotencyKey are required!"
        })
    }

    const fromUserAccount=await accountModel.findOne({
        _id:fromAccount,
    })
    const toUserAccount=await accountModel.findOne({
        _id:toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"Invalid fromAccount or toAccount"
        })
    }
    /**
     * validate Idempotency!!
     */

    const isTransactionAlreadyExist=await transactionModel.findOne({
        idempotencyKey
    })

    if(isTransactionAlreadyExist){
        if(isTransactionAlreadyExist.status==="COMPLETED"){
            return res.status(200).json({
                message:"Transaction already processed",
                transaction:isTransactionAlreadyExist
            })
        }
    
        if(isTransactionAlreadyExist.status==="PENDING"){
            return res.status(200).json({
                message:"Transaction is still processing!"
            })
        }
    
  
        if(isTransactionAlreadyExist.status==="FAILED"){
            return res.status(500).json({
                message:"Transaction processing failed!"
            })
        }
    
    
        if(isTransactionAlreadyExist.status==="REVERSED"){
            return res.status(500).json({
                message:"Transaction is reversed , please retry!!"
            })
        
    }

    }


    /**
     * Check account status!!
     */

    if(fromUserAccount.status !=="ACTIVE" || toUserAccount.status!=="ACTIVE"){
        return res.status(400).json({
            message:"Both accounts must be active to process transaction!"
        })
    }

    /**
     * Derive sender balance from ledger!
     */

    const balance =await fromUserAccount.getBalance()
    if(balance<amount){
        return res.status(400).json({
            message:`Insufficient balance. Current balance is ${balance}.Requested amount is ${amount}`
        })
    }   
    /**
     * Create transaction
    */
   let transaction;
   
   try {
    const session=await mongoose.startSession()
    session.startTransaction()

    const [transaction] = await transactionModel.create([{
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING"
}], { session });


    const debitLedgerEntry=await ledgerModel.create([{
        account:fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{session})

                   

    const creditLedgerEntry=await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{session})

    await transactionModel.findOneAndUpdate(
        {_id:transaction._id},
        {status:"COMPLETED"},
        {session}
    )

    await session.commitTransaction()
    session.endSession()

} catch (error) {
        return res.status(400).json({
            message:"Transaction is processing!"
        })
    }

    /**
     * send email notification
     */

    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)
    return res.status(201).json(
        {
            message:"Transaction completed sucessfully",
            transaction:transaction
        }
    )



}


async function createInitialFundsTransaction(req,res) {
    const {toAccount,amount,idempotencyKey}=req.body;

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"toAccount,amount and idempotencyKey are required!"
        })
    }

    const toUserAccount=await accountModel.findOne({
        _id:toAccount,
    })
    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid toAccount"
        })
    }

    const fromUserAccount=await accountModel.findOne({
        systemUser:true,
        user:req.user._id
    })
    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found!!"
        })

    }

    const session=await mongoose.startSession()
    session.startTransaction()

    const [transaction]=await transactionModel.create([{
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session})


    const debitLedgerEntry=await ledgerModel.create([{
        account:fromUserAccount._id,
        amount,
        transaction:transaction._id,
        type:"DEBIT",
    }],{session})


    const creditLedgerEntry=await ledgerModel.create([{
        account:toUserAccount._id,
        amount,
        transaction:transaction._id,
        type:"CREDIT",
    }],{session})

    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"Initial funds transaction completed sucessfully",
        transaction:transaction
    })
}

async function fetchTransactions(req, res) {
    try {
        const userAccounts = await accountModel.find({ user: req.user._id });
        const accountIds = userAccounts.map(acc => acc._id);

        if (accountIds.length === 0) {
            return res.status(200).json({ transactions: [] });
        }

        const transactions = await transactionModel.find({
            $or: [
                { fromAccount: { $in: accountIds } },
                { toAccount: { $in: accountIds } }
            ]
        })
        .sort({ createdAt: -1 })
        .populate('fromAccount', 'status currency')
        .populate('toAccount', 'status currency');

        return res.status(200).json({
            message: "Transactions retrieved successfully",
            transactions
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching transactions",
            error: error.message
        });
    }
}

module.exports={
    createTransaction,
    createInitialFundsTransaction,
    fetchTransactions
}