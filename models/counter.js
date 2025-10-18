import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    id: String,
    reference_value: String,
    seq: Number
});

counterSchema.static("reset", function() { 
    return this.findOneAndUpdate({}, {$set: {seq: 8}});
});

const Counter = mongoose.model("counter", counterSchema, "counters");
export default Counter;