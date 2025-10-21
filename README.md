# 🧩 String Analysis API

A simple RESTful API for storing, analyzing, and filtering strings using natural language queries.

---

## 🚀 Features
- Store and retrieve string data with computed properties  
- Automatic analysis: palindrome check, word count, unique characters, etc.  
- Natural language filtering (e.g. *"all single word palindromic strings"*)  
- SHA256 hashing used for unique string IDs  

---

## 🧠 Endpoints

### **1. Add String**
**POST** `/strings`
```json
{
  "value": "madam"
}
```

### **2. Get All Strings**
**GET** `/strings`

### **3. Get String by ID**
**GET** `/strings/:id`

### **4. Delete String**
**DELETE** `/strings/:string_value`

### **5. Filter by Natural Language**
**GET** `/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings`

---

## ⚙️ Tech Stack
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **SHA256** for ID generation
- **Custom NLP parser** for query interpretation

---

## 🧩 Example NLP Queries
- `all single word palindromic strings`
- `strings longer than 10 characters`
- `strings containing the letter z`

---

## 🧪 Run Locally
```bash
git clone <repo-url>
cd <project-folder>
npm install
npm run dev
```

Ensure MongoDB is running, then visit:  
👉 `http://localhost:3000/strings`

---

