const mongoose = require('mongoose')
const validator = require('validator')
const {customerModel} = require('./customerModel')
const bcrypt = require('bcryptjs')

const addressSchema = new mongoose.Schema({
    Address_1 :{
        type : String
    },
    City : {
        type : String
    },
    State : {
        type : String
    },
    Country : {
        type : String
    },
    PostalCode : {
        type : Number
    }
})


const supplierSchema = new mongoose.Schema({
    CompanyName : {
        type : String,
        required : true
    },
    FirstName : {
        type : String,
        required : true
    },
    MiddleName : {
        type : String
    },
    LastName : {
        type : String
    },
    Address_1 : addressSchema,
    Email : {
        type : String,
        required : true,
        unique : true,
        validate : {
            validator : function(v){
                return validator.isEmail(v);
            },
            message : '{VALUE} is not a valid email'
        }

    },
    Password : {
        type : String,
        required : true,
        minlength : 6
    },
    //not sure of this order id
    orderID : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Orders'
    }]
})

//hash password
supplierSchema.pre('save', function(next){
    if(!this.isModified('Password')){
        return next();
    }
    else{
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(this.Password, salt, function(err, hash){
                this.Password = hash;
            })
        })
        return next();
    }
})

//password matching
supplierSchema.methods.ComparePassword = function ComparePassword(password){
    return bcrypt.compareSync(password, this.Password)
}


var SupplierModel = mongoose.model('Suppliers', supplierSchema);

module.exports = {SupplierModel};