# 🌸 Glowvia – Full-Stack E-Commerce Web Application

Glowvia is a **full-stack e-commerce web application** built with React, TailwindCSS, Express, and MongoDB.  
It allows users to browse products, view product details, manage a shopping cart, and securely handle authentication and payments.  
The project is structured to meet both academic and real-world standards.

---

## ✨ Features

### User Features
- 🛍️ Browse all products (with categories & search)
- 📄 View detailed information for a single product
- ➕ Add products to shopping cart
- 🗑️ Remove items from cart
- 🔑 User Authentication (Sign Up / Login with JWT)
- 💳 Secure Payments with Stripe
- 🖼️ Image uploads via Cloudinary
- 🔔 Real-time notifications with React Hot Toast
- 📜 View order history
- 👤 Manage user profiles

### Admin Features
- 📦 Add, edit, and manage products
- 🖼️ Upload product images
- 💰 Manage orders and payments

### Technical Features
- 🎨 Responsive and modern UI with TailwindCSS
- 🌐 REST API integration with Express
- 🔒 Secure password hashing (bcryptjs) & authentication tokens (JWT)
- 🗄️ MongoDB database with Mongoose ORM
- 📡 File upload handling with Multer
- 🌍 Deployed (Frontend: **Vercel**, Backend: **Vercel**, DB: **MongoDB Atlas**)

---

## 🛠️ Tech Stack

**Frontend (client):**
- React 19
- React Router DOM 7
- TailwindCSS
- Axios
- React Hot Toast

**Backend (server):**
- Node.js + Express.js 5
- MongoDB + Mongoose
- JWT Authentication
- Stripe Payments
- Cloudinary (image hosting)
- Multer (file uploads)
- bcryptjs (password hashing)

**Other Tools:**
- dotenv for environment variables
- cors & cookie-parser for API security and sessions
- GitHub for version control

---

## 🏗️ Architecture

```
Frontend (React + Redux)  <----->  Backend (Express API)  <----->  Database (MongoDB)
             │                                 │
             │                                 └── Stripe (Payments)
             │
             └── Cloudinary (Image Hosting)
```


## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- A Stripe account (for payments)
- A Cloudinary account (for image storage)

---

### 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/glowvia.git
   cd glowvia
   ```

2. **Backend setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server/` directory with the following:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   STRIPE_SECRET_KEY=your_stripe_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   Start the backend:
   ```bash
   npm start
   ```
   Backend runs at: `http://localhost:4000`

3. **Frontend setup**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   Frontend runs at: `http://localhost:5173`

---

## 📖 Usage

1. Open the frontend in your browser.  
2. Register/Login as a user.  
3. Browse products and view details.  
4. Add items to your cart.  
5. Proceed to checkout and pay securely via Stripe.  
6. Admin users can add/manage products with images.  

---

## 📂 Project Structure

```
glowvia/
 ├── client/       # Frontend (React + Redux + Tailwind)
 ├── server/       # Backend (Express + MongoDB + Stripe + Cloudinary)
 ├── .gitignore
 └── README.md
```

---

## 🌱 Future Improvements

- Add product reviews & ratings
- Implement wishlist/favorites
- Add email notifications (order confirmation, shipping updates)
- Improve accessibility & SEO
- Implement unit and integration testing

---

## 📄 License

Developed by **Hiruni Imasha** as part of a university assignment.  
Free to use for educational and personal projects.  

---
