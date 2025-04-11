import { type } from "express/lib/response";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{type:String, required:[true,"subscription Name is required"],trim:true,minLength:2,maxLength:50},
    price:{
        type:Number,
        required:[true,"Price is required"],
        min:[0,"Price must be greater than or equal to 0"],
    },
    currency:{
        type:String,
        enum:["USD","EUR","GBP"],
        default:"USD",
    },
    frequency:{
        type:String,
        enum:["monthly","yearly","weekly","daily"],
    },
    category:{
        type:String,
        enum:["sport","news","entertainment","education","health"],
        required:[true,"Category is required"],
    },
    paymentMethod:{
        type:String,
        enum:["active","canceled","expired"],
        default:"active",
    },
    startDate:{
        type:Date,
        required:[true,"Start date is required"],
        validate:{
            validator:(value)=>  value<=Date.now(),
            
            message:"Start date must be less than or equal to current date",
        },
        default:Date.now,
    },
    renewalDate:{
        type:Date,
        validate:{
            validator:function (value) {
                value> this.startDate
            },
            message:"Start date must be less than or equal to renewal date",
        },
        default:Date.now,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User is required"],
        index:true,
    }

},{timestamps:true});


//auto calculate renewal date
subscriptionSchema.pre('save',function(next) {
    if(!this.renewalDate){
        const renewalPeriods={
            daily :1,
            weekly:7,
            monthly:30,
            yearly:365,
        };
        this.renewalDate=new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    //Auto-update the status of the subscription if renewal date has passed

    if(this.renewalDate<Date.now()){
        this.paymentMethod="expired";
    }

    next();
})




const subscription=mongoose.model("Subscription",subscriptionSchema);