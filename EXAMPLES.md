# Example API Requests

Test these free public APIs with the platform!

## Get Requests

| Description | Method | URL |
|-------------|--------|-----|
| All posts (JSONPlaceholder) | GET | `https://jsonplaceholder.typicode.com/posts` |
| Single post | GET | `https://jsonplaceholder.typicode.com/posts/1` |
| Users (ReqRes) | GET | `https://reqres.in/api/users?page=1` |
| All countries | GET | `https://restcountries.com/v3.1/all` |
| Country search | GET | `https://restcountries.com/v3.1/name/india` |
| GitHub user | GET | `https://api.github.com/users/github` |
| Random cat fact | GET | `https://catfact.ninja/fact` |
| Random dog image | GET | `https://dog.ceo/api/breeds/image/random` |

## Post Requests

**Create Post (JSONPlaceholder)**
```
Method: POST
URL: https://jsonplaceholder.typicode.com/posts
Headers: Content-Type: application/json
Body:
{
  "title": "My Post",
  "body": "Content here",
  "userId": 1
}
```

**Create User (ReqRes)**
```
Method: POST
URL: https://reqres.in/api/users
Headers: Content-Type: application/json
Body:
{
  "name": "John Doe",
  "job": "Developer"
}
```

## Status Code Testing

Test error responses with [httpstat.us](https://httpstat.us):

```
GET https://httpstat.us/200   (Success)
GET https://httpstat.us/404   (Not Found)
GET https://httpstat.us/500   (Server Error)
```

## Tips

- Save requests in collections for later use
- Try different HTTP methods (GET, POST, PUT, DELETE)
- Add custom headers to experiment with APIs
- Check response times in the status bar
