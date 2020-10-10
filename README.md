<!-- omit in toc -->
# Linker App Backend
--- work in progress ---

REST API for **[Linker App](https://linkerbeta.herokuapp.com)** where users can save and organize their favorite links. 

**Built with:**  
– Node.js + Express  
– MongoDB + mongoose  
– jwt

**Testing:**  
– jest  
– supertest  
– REST Client (VSCode extension) 
  
 Deployed on heroku. Frontend served from /build folder.

---
- [Endpoints:](#endpoints)
  - [/api/meta](#apimeta)
    - [POST /api/meta](#post-apimeta)
  - [/api/login](#apilogin)
    - [POST /api/login](#post-apilogin)
  - [/api/users](#apiusers)
    - [GET /api/users](#get-apiusers)
    - [GET /api/users/:id](#get-apiusersid)
    - [POST /api/users](#post-apiusers)
  - [/api/links](#apilinks)
    - [GET /api/links](#get-apilinks)
    - [GET /api/links/:id](#get-apilinksid)
    - [POST /api/links](#post-apilinks)
    - [PUT /api/links/:id](#put-apilinksid)
    - [DELETE /api/links/:id](#delete-apilinksid)
  - [/api/collections](#apicollections)
    - [GET /api/collections](#get-apicollections)
    - [GET /api/collections/:id](#get-apicollectionsid)
    - [POST /api/collections](#post-apicollections)
    - [PUT /api/collections/:id](#put-apicollectionsid)
    - [PUT /api/collections/:id/links](#put-apicollectionsidlinks)
    - [DELETE /api/collections/:id](#delete-apicollectionsid)
  - [/api/tags](#apitags)
    - [GET /api/tags](#get-apitags)
    - [GET /api/tags/:id](#get-apitagsid)
    - [POST /api/tags](#post-apitags)
- [Credits](#credits)

## Endpoints:

Auth is **required** for POST, PUT and DELETE methods.
```
Authorization: bearer (token)
```

### /api/meta

#### POST /api/meta  
Auth: required  
Request:
```js
{ url: "https://github.com" }

```
Response: 
```json
{
  "description": "GitHub is where over 50 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and feat...",
  "title": "GitHub: Where the world builds software",
  "url": "https://github.com/"
}

```
[scroll up](#linker-app-backend)

### /api/login

#### POST /api/login  
Auth: none  
Request:  
```js
{ 
 usename: "someusername",
 password: "somepassword" 
}
```
Response:
```json
{
  "id": "(id)",
  "name": "Some Name",
  "token": "(token)",
  "username": "someusername"
}
```

[scroll up](#linker-app-backend)

### /api/users

#### GET /api/users
#### GET /api/users/:id
#### POST /api/users

[scroll up](#linker-app-backend)

### /api/links

#### GET /api/links
#### GET /api/links/:id
#### POST /api/links
#### PUT /api/links/:id
#### DELETE /api/links/:id

[scroll up](#linker-app-backend)

### /api/collections

#### GET /api/collections
#### GET /api/collections/:id
#### POST /api/collections
#### PUT /api/collections/:id
#### PUT /api/collections/:id/links
#### DELETE /api/collections/:id

[scroll up](#linker-app-backend)

### /api/tags

#### GET /api/tags
#### GET /api/tags/:id
#### POST /api/tags

[scroll up](#linker-app-backend)

## Credits

Based on the assignment for the [Full Stack Open 2020](https://fullstackopen.com/en) course by the University of Helsinki. Other submissions [here](https://github.com/anchsk/fullstackopen2020).

Metadata parser:  
[mozilla/page-metadata-parser](https://github.com/mozilla/page-metadata-parser/)

[scroll up](#linker-app-backend)

