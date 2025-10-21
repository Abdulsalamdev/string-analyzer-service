const crypto = require("crypto");

function sha256hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function lengthOfString(value) {
  return [...value].length;
}

function isPalindrome(value) {
  const normalized = value.toLowerCase().replace(/\s+/g, "");
  const reversed = [...normalized].reverse().join("");
  return normalized === reversed;
}

function uniqueCharacters(value) {
  return new Set([...value]).size;
}

function wordCount(value) {
  if (!value) return 0;
  return value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
}

function characterFrequencyMap(value) {
  const map = {};
  for (const char of value) {
    map[char] = (map[char] || 0) + 1;
  }
  return map;
}

function analyzeString(value) {
  const sha = sha256hash(value);
  const prop = {
    length: lengthOfString(value),
    is_palindrome: isPalindrome(value),
    unique_characters: uniqueCharacters(value),
    word_count: wordCount(value),
    sha256_hash: sha,
    character_frequency_map: characterFrequencyMap(value)
  };

  return {
    id: sha,
    value, // ✅ include value for clarity
    properties: prop,
    created_at: new Date().toISOString()
  };
}

module.exports = {
  analyzeString,
  sha256hash,
};
