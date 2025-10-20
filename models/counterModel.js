import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    id: String,
    reference_value: String,
    seq: Number
});

counterSchema.static("reset", function(v) { 
    return this.findOneAndUpdate({}, {$set: {seq: v || 0}});
});

const Counter = mongoose.model("counter", counterSchema, "counters");
export default Counter;