# Social Media Backend

A robust backend API for a social media platform, built with scalability and security in mind.

## Features

- **User Authentication**
    - Register, login, logout
    - JWT-based authentication
    - Password hashing

- **User Profiles**
    - View and edit profile
    - Upload profile pictures

- **Posts**
    - Create, edit, delete posts
    - Like and comment on posts
    - Media uploads (images/videos)

- **Followers System**
    - Follow/unfollow users
    - View followers and following lists

- **Notifications**
    - Real-time notifications for likes, comments, and follows

- **Feed**
    - Personalized timeline with posts from followed users

- **Search**
    - Search users and posts

- **Admin Panel**
    - Manage users and content
    - Moderate reported posts/comments

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcrypt
- **File Storage:** Cloudinary/AWS S3
- **Real-time:** Socket.io
- **Testing:** Postman

## API Endpoints

| Method | Endpoint                | Description                  |
|--------|------------------------|------------------------------|
| POST   | `/api/auth/register`   | Register new user            |
| POST   | `/api/auth/login`      | Login user                   |
| GET    | `/api/users/:id`       | Get user profile             |
| PUT    | `/api/users/:id`       | Update user profile          |
| POST   | `/api/posts`           | Create new post              |
| GET    | `/api/posts/feed`      | Get timeline feed            |
| POST   | `/api/posts/:id/like`  | Like a post                  |
| POST   | `/api/posts/:id/comment` | Comment on a post          |
| POST   | `/api/users/:id/follow` | Follow a user               |
| POST   | `/api/users/:id/unfollow` | Unfollow a user           |
| GET    | `/api/notifications`   | Get notifications            |
| GET    | `/api/search`          | Search users/posts           |

## Getting Started

1. **Clone the repository**
     ```bash
     git clone https://github.com/tinkumehta/Social_media_Backend.git
     cd Social_media_Backend
     ```

2. **Install dependencies**
     ```bash
     npm install
     ```

3. **Set up environment variables**
     - Copy `.env.example` to `.env` and fill in your configuration.

4. **Run the server**
     ```bash
     npm run dev
     ```

## Contributing

Pull requests are welcome! Please open an issue first to discuss changes.

## License

This project is licensed under the MIT License.