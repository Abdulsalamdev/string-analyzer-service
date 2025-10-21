const StoredString = require('../models/StringModel');
const { parseNaturalLanguage } = require('../utils/nlpParser');

async function filterByNaturalLanguage(req, res) {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Missing query param' });

    const parsed = parseNaturalLanguage(query);
    if (!parsed) return res.status(400).json({ error: 'Unable to parse natural language query' });

    // Build Mongo query object dynamically
    const mongoQuery = {};

    if (parsed.is_palindrome !== undefined) {
      mongoQuery['properties.is_palindrome'] = parsed.is_palindrome;
    }
    if (parsed.word_count !== undefined) {
      mongoQuery['properties.word_count'] = parsed.word_count;
    }
    if (parsed.min_length !== undefined) {
      mongoQuery['properties.length'] = { $gte: parsed.min_length };
    }
    if (parsed.max_length !== undefined) {
      mongoQuery['properties.length'] = { ...(mongoQuery['properties.length'] || {}), $lte: parsed.max_length };
    }
    if (parsed.contains_character) {
      mongoQuery[`properties.character_frequency_map.${parsed.contains_character}`] = { $exists: true };
    }

    const results = await StoredString.find(mongoQuery);

    if (!results.length) {
      return res.status(404).json({ error: 'String not found' });
    }

    return res.status(200).json({
      data: results,
      count: results.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsed
      }
    });

  } catch (err) {
    console.error('Error in filterByNaturalLanguage:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

module.exports = { filterByNaturalLanguage };
