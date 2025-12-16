# Example API Requests to Test

Copy and paste these examples into your API Testing Platform to get started!

## 1. JSONPlaceholder - Get All Posts

**Method:** GET  
**URL:** `https://jsonplaceholder.typicode.com/posts`  
**Description:** Retrieves a list of all blog posts

---

## 2. JSONPlaceholder - Get Single Post

**Method:** GET  
**URL:** `https://jsonplaceholder.typicode.com/posts/1`  
**Description:** Retrieves a specific post by ID

---

## 3. JSONPlaceholder - Create Post

**Method:** POST  
**URL:** `https://jsonplaceholder.typicode.com/posts`  
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "title": "My New Post",
  "body": "This is the content of my post",
  "userId": 1
}
```

---

## 4. ReqRes - Get Users

**Method:** GET  
**URL:** `https://reqres.in/api/users?page=1`  
**Description:** Get list of users with pagination

---

## 5. ReqRes - Create User

**Method:** POST  
**URL:** `https://reqres.in/api/users`  
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "name": "John Doe",
  "job": "Software Developer"
}
```

---

## 6. REST Countries - Get All Countries

**Method:** GET  
**URL:** `https://restcountries.com/v3.1/all`  
**Description:** Get information about all countries

---

## 7. REST Countries - Search by Name

**Method:** GET  
**URL:** `https://restcountries.com/v3.1/name/india`  
**Description:** Search for a specific country

---

## 8. GitHub API - Get User

**Method:** GET  
**URL:** `https://api.github.com/users/github`  
**Headers:**
```
Accept: application/vnd.github.v3+json
```
**Description:** Get GitHub user information

---

## 9. Cat Facts API

**Method:** GET  
**URL:** `https://catfact.ninja/fact`  
**Description:** Get a random cat fact

---

## 10. Dog API - Random Dog Image

**Method:** GET  
**URL:** `https://dog.ceo/api/breeds/image/random`  
**Description:** Get a random dog image URL

---

## Testing Different Status Codes

### Success (200)
**Method:** GET  
**URL:** `https://httpstat.us/200`

### Not Found (404)
**Method:** GET  
**URL:** `https://httpstat.us/404`

### Server Error (500)
**Method:** GET  
**URL:** `https://httpstat.us/500`

---

## Tips

1. **Save your requests** by creating collections
2. **Try different HTTP methods** (GET, POST, PUT, DELETE)
3. **Experiment with headers** - add custom headers to see how APIs respond
4. **Test authentication** - some APIs require API keys or bearer tokens
5. **Check response times** - see how fast different APIs respond

Have fun testing! 🚀
