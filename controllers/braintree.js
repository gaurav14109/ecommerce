const User = require('../models/users')
const braintree = require('braintree')
require('dotenv').config()

//we need create a gateway 

const gateway =  new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId:process.env.BRAINTREE_MERCHANT_ID,
    publicKey:process.env.BRAINTREE_PUBLIC_KEY,
    privateKey:process.env.BRAINTREE_PRIVATE_KEY
})

exports.generateToken = (req, res)=>{
        //generating the client token for braintree payment
        //this token will be send at the tym of payment
        
        gateway.clientToken.generate({},function(err, response){

            if(err){

                res.status(500).send(err)
            }else{
                res.send(response) //token will be sent to client and then this token will be sent to brain tree for payment from front end
            }

        })

}
//processing the payment
exports.processPayment = (req, res )=>{

    let nonce = req.body.paymentMethodNonce //taking nonce that have payment type
    let amountFromClient = req.body.amount  //amount

    //charge the use
    let newTransaction = gateway.transaction.sale({
        amount:amountFromClient,
        paymentMethodNonce:nonce,
        options:{
            submitForSettlement:true
        }
    },(error, data)=>{

        if (error){
            res.status(500).json(error)
        }else{
            res.json(data)
        }
    })
}