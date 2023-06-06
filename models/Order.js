import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  line_items:Object,
  name:String,
  email:String,
  city:String,
  postalCode:Number,
  Address:String,
  country:String,
  paid:Boolean,
  phone:Number,
  total:Number,
}, {
  timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);