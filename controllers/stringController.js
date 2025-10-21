const StoredString = require("../models/StringModel");
const { analyzeString, sha256hash } = require("../utils/analyzer");

async function createString(req, res) {
  const { value } = req.body;
  if (value === undefined) {
    return res.status(400).json({ error: 'Missing "value" field' });
  }
  if (typeof value !== "string") {
    return res.status(422).json({ error: '"value" must be a string' });
  }

  const id = sha256hash(value);
  const exists = await StoredString.findById(id);
  if (exists) {
    return res.status(409).json({ error: "String already exists" });
  }
  const analyzed = analyzeString(value);
  try {
    const newString = new StoredString({
      _id: id,
      value: analyzed.value,
      properties: analyzed.properties,
      created_at: analyzed.created_at,
    });

    await newString.save();
    const result = {
        id: newString._id,
        value: newString.value,
        properties: newString.properties,
        created_at: newString.created_at,   
    }
    return res.status(201).json(result);
  } catch (err) {
  console.error('❌ Error in createString:', err);
  return res.status(500).json({ error: 'Server error', details: err.message });
}
}


async function getString(req, res) {
  const raw = req.params.string_value;
  if (!raw) return res.status(400).json({ error: 'Missing string parameter' });
  const id = sha256hash(raw);
  const doc = await StoredString.findById(id);
  if (!doc) return res.status(404).json({ error: 'String not found' });
  return res.json({
    id: doc._id,
    value: doc.value,
    properties: doc.properties,
    created_at: doc.created_at
  });
}

async function listStrings(req, res) {
  const q = {};
  const { is_palindrome, min_length, max_length, word_count, contains_character, limit = 50, page = 1 } = req.query;

  if (is_palindrome !== undefined) {
    if (is_palindrome !== 'true' && is_palindrome !== 'false') return res.status(400).json({ error: 'is_palindrome must be true or false' });
    q['properties.is_palindrome'] = is_palindrome === 'true';
  }
  if (min_length !== undefined) {
    const n = parseInt(min_length, 10);
    if (Number.isNaN(n)) return res.status(400).json({ error: 'min_length must be an integer' });
    q['properties.length'] = { ...(q['properties.length'] || {}), $gte: n };
  }
  if (max_length !== undefined) {
    const n = parseInt(max_length, 10);
    if (Number.isNaN(n)) return res.status(400).json({ error: 'max_length must be an integer' });
    q['properties.length'] = { ...(q['properties.length'] || {}), $lte: n };
  }
  if (word_count !== undefined) {
    const n = parseInt(word_count, 10);
    if (Number.isNaN(n)) return res.status(400).json({ error: 'word_count must be an integer' });
    q['properties.word_count'] = n;
  }
  if (contains_character !== undefined) {
    if (contains_character.length !== 1) return res.status(400).json({ error: 'contains_character must be a single character' });
    q[`properties.character_frequency_map.${contains_character}`] = { $exists: true, $gt: 0 };
  }

  const skip = (Math.max(parseInt(page, 10) || 1,1) - 1) * parseInt(limit, 10);
  const docs = await StoredString.find(q).skip(skip).limit(parseInt(limit, 10));
  const count = await StoredString.countDocuments(q);
  return res.json({
    data: docs.map(doc => ({ id: doc._id, value: doc.value, properties: doc.properties, created_at: doc.created_at })),
    count,
    filters_applied: { is_palindrome, min_length, max_length, word_count, contains_character }
  });
}

async function deleteString(req, res) {
  const raw = req.params.string_value;
  const id = sha256hash(raw);
  const deleted = await StoredString.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'String not found' });
  return res.status(204).send();
}


module.exports = {
  createString,
    getString,
    listStrings,
    deleteString
};