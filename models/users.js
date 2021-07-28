const mongoose = require('mongoose')
const crypto = require('crypto') //hashing password
//uuid to generate uunique string 

const {v4 : uuidv4} = require('uuid')

const UserSchema= new mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim:true,
        maxlength:32
    },
    email:{
        type: String,
        required: true,
        trim:true,
        unique: true
    },
    hashed_password:{
        type: String,
        required: true,
    },
    about:{
        type:String,
        trim:true,
    },
    salt:String, //to generate hahsed password

    role:{

        type:Number,//0 to anyuser and 1 to admin
        default:0

    },

    history:{
            type :Array,
            default:[]
            //user purchase history
    }


},{timestamps:true})

//using a schema we can add virtual field can add method and any value
//to define virtual property in schema
UserSchema.virtual('password') //password is virtual property that is computed from hashed_password get and set
//should be combined. This virtual property will have the password will be passed in the request itself
//setting the password from virtual propety and assigning it to hashed_password 
//req.body will have name called password which will be assigned to virtual property password
//it is a virtural field it will not be sent in a response
.set(function(password){
    this._password = password
    this.salt = uuidv4() //generating a unique id for salt
    this.hashed_password = this.encryptPassword(password) //this will set the password
})

.get(()=>{
    console.log(this._password)
    return this._password
})

//to define method in schema
UserSchema.methods = {

    authenticate: function(plainText){

        return  (this.encryptPassword(plainText) === this.hashed_password)


    },

    encryptPassword:function (password){

        if (!password) return '';

        try {

            return  crypto.createHmac('sha256', this.salt ).update(password).digest('hex')
            

        }catch(err){

            console.log(err)
            return "";

        }
    }

}

module.exports = mongoose.model('User',UserSchema)



