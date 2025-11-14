# 🚀 Social Media API
A fully functional backend for a Social Media application built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**. The API supports user authentication, following/unfollowing, posts, reels, comments, likes, saves, and more.

---

## 📌 **Base URL (Render Deployment)**
```
https://socialmediaapi-5dyl.onrender.com/api/v1
```

---

## 🔐 **Authentication**
Authentication is handled using **JWT Tokens**.  
All protected routes require:
```
Authorization: Bearer <token>
```

---

## 📚 **API Endpoints Overview**

Below is the complete routing structure based on your backend implementation.

---

### 👤 **Auth Routes**
```
POST   /register
POST   /login
POST   /forgot-password
POST   /reset-password
PUT    /change-password     (Protected)
GET    /verified            (Protected)
```
---

### 👤 **User Routes**
```
GET    /users                       (Protected)
GET    /users/:id                   (Protected)
POST   /users/follow/:id            (Protected)
POST   /users/unfollow/:id          (Protected)
GET    /users/followers/:id         (Protected)
GET    /users/following/:id         (Protected)
POST   /users/followcount           (Protected)
GET    /users/suggested             (Protected)
PUT    /upload-profile              (Protected) [file upload]
```
---

### 📝 **Post Routes**
```
POST   /posts                       (Protected) [file upload]
GET    /posts                       (Protected)
GET    /posts/:id                   (Protected)
DELETE /posts/:id                   (Protected)
PUT    /posts/:id/like              (Protected)
POST   /posts/:id/comment           (Protected)
POST   /posts/toggle-save/:id       (Protected)
GET    /posts/saved                 (Protected)
```
---

### 🎥 **Reel Routes**
```
POST   /reels                       (Protected) [file upload]
GET    /reels                       (Protected)
GET    /reels/:id                   (Protected)
DELETE /reels/:id                   (Protected)
PUT    /reels/:id/like              (Protected)
POST   /reels/:id/comment           (Protected)
POST   /reels/toggle-save/:id       (Protected)
GET    /reels/saved                 (Protected)
```
---

### 📚 **Story Routes**
```
POST   /stories                     (Protected) [file upload]
GET    /stories                     (Protected)
PUT    /stories/:id/view            (Protected)
DELETE /stories/:id                 (Protected)
PUT    /stories/:id/like            (Protected)
POST   /stories/:id/comment         (Protected)
```
---

### ### 👤 User Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login & get JWT token |
| GET | `/users/me` | Get logged-in user details |
| POST | `/users/follow/:id` | Follow a user |
| POST | `/users/unfollow/:id` | Unfollow a user |
| GET | `/users/followers/:id` | Get followers list |
| GET | `/users/following/:id` | Get following list |
| GET | `/users/suggested` | Get 10 suggested users |

---

### 📝 Post Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts` | Create post |
| GET | `/posts/:id` | Get a single post |
| POST | `/posts/toggle-save/:id` | Toggle save/unsave post |
| POST | `/posts/toggle-like/:id` | Like/Unlike post |

---

### 🎥 Reel Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reels` | Upload a reel |
| GET | `/reels/:id` | Get reel |
| POST | `/reels/toggle-save/:id` | Save/Unsave reel |
| POST | `/reels/toggle-like/:id` | Like/Unlike reel |

---

## 🛠 **Tech Stack**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Render Deployment
- Bcrypt Password Hashing

---

## 📁 Project Structure
```
📦 social-media-api
├──src-
├── 📁 configs
├── 📁 controllers
├── 📁 middlware
├── 📁 models
├── 📁 routes
├── 📁 utils
├── index.js
└── package.json
```

---

## 🔧 Installation & Setup

### 1️⃣ Clone Repo
```
https://github.com/deepu8570tiwari/socialMediaApi
```

### 2️⃣ Install Dependencies
```
npm install
```

### 3️⃣ Add Environment Variables
Create a `.env` file:
```
PORT=5000
MONGO_URI=your-mongodb-url
JWT_SECRET=your-secret
NODE_CLOUDINARY_CLOUD_NAME=xxxxxx
NODE_CLOUDINARY_API_KEY=xxxxxxx
NODE_CLOUDINARY_API_SECRET=xxxxxxx
```

### 4️⃣ Run Server
```
npm start
```

---

## 🚀 Deployment
This project is deployed on **Render**.  
Make sure your Render env variables include:
```
MONGO_URI
JWT_SECRET
PORT
```

---

## 🤝 Contribution
Feel free to fork, contribute, and submit pull requests.

---

## 📄 License
MIT License

---

If you want to add screenshots, diagrams, or detailed API documentation, I can include them too!

