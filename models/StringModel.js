const mongoose = require("mongoose");

const PropertiesSchema = new mongoose.Schema({
  length: { type: Number, required: true },
  is_palindrome: { type: Boolean, required: true },
  unique_characters: { type: Number, required: true },
  word_count: { type: Number, required: true },
  sha256_hash: { type: String, required: true, index: true, unique: true },
  character_frequency_map: { type: Map, of: Number, required: true },
}, { _id: false });

const stringSchema = new mongoose.Schema({
  _id: {type:String, alis: "id"},
  value: { type: String, required: true, unique: true, trim: true },
  properties: { type: PropertiesSchema, required: true },
created_at: { type: Date, default: () => new Date().toISOString() }
}, { versionKey: false });

module.exports = mongoose.model("StoredString", stringSchema);