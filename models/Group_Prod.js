import mongoose, {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
  title: {type:String, required:true},
  description: String,
  price: {type: Number, required: true},
  images: [{type:String}],
  category: {type:mongoose.Types.ObjectId, ref:'Category'},
  Group_Prod: {type:Object},
}, {
  timestamps: true,
});

export const group_products = models.group_products || model('group_products', ProductSchema);