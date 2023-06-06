import mongoose, {model, models, Schema} from "mongoose";

const TagSchema = new Schema({
  name: {type:String,required:true},
});

export const Tag = models?.Tag || model('Tag', TagSchema);