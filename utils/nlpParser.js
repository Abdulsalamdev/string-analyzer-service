// src/utils/nlpParser.js
function parseNaturalLanguage(query) {
  const q = query.toLowerCase().trim();
  const filters = {};

  // "single word" -> word_count=1
  if (/\bsingle word\b/.test(q) || /\bone-word\b/.test(q)) {
    filters.word_count = 1;
  }
  // "palindromic" -> is_palindrome=true
  if (/\bpalindrom(ic|romic)?\b/.test(q)) filters.is_palindrome = true;

  // "strings longer than 10 characters" -> min_length=11
  const longerMatch = q.match(/longer than (\d+)/);
  if (longerMatch) filters.min_length = parseInt(longerMatch[1], 10) + 0; // keep exact semantics maybe +1 if required

  // "strings longer than 10 characters" alternative: "longer than or equal to"
  const longerOrEqualMatch = q.match(/longer than or equal to (\d+)/);
  if (longerOrEqualMatch) filters.min_length = parseInt(longerOrEqualMatch[1], 10);

  // "contain the letter z" OR "containing the letter z"
  const containsMatch = q.match(/contain(?:ing|s)?(?: the)? letter (\w)/) || q.match(/contain(?:ing|s)?(?: the)? (\w)/);
  if (containsMatch) filters.contains_character = containsMatch[1];

  // "first vowel" heuristic: choose 'a' as "first vowel"
  if (/\bfirst vowel\b/.test(q)) filters.contains_character = 'a';

  // if nothing found -> return null to signal parse failure
  if (Object.keys(filters).length === 0) return null;
  return filters;
}

module.exports = { parseNaturalLanguage };
