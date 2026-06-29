# ByteMind — Startup Guide

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod` or MongoDB Atlas URI)

## 1. Start Backend

```bash
cd /Users/ritikkumar/Desktop/WorkSpace/bytemind/backend
npm run dev
```

Backend runs on: http://localhost:5000

## 2. Start Frontend

```bash
cd /Users/ritikkumar/Desktop/WorkSpace/bytemind/frontend
npm run dev
```

Frontend runs on: http://localhost:3000

## Admin Panel
- URL: http://localhost:3000/admin/login
- Email: admin@bytemind.io
- Password: Admin@ByteMind2024

## Environment Files

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/bytemind
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXXX  ← Replace with your AdSense ID
```

## Google AdSense Setup
1. Apply at https://adsense.google.com
2. After approval, get your Publisher ID (ca-pub-XXXXX)
3. Update `NEXT_PUBLIC_ADSENSE_CLIENT` in frontend/.env.local
4. Update the ad slot IDs in the AdBanner components

## Auto Blog Generation
- Blogs auto-post daily at **midnight IST** across all 8 categories
- To trigger manually: Go to Admin Dashboard → Click "Generate All Blogs"
- Per-category: Admin → Categories → click the ⚡ icon

## Categories (8 default)
| Icon | Category | Slug |
|------|----------|------|
| 🤖 | Artificial Intelligence | artificial-intelligence |
| 🧠 | Machine Learning | machine-learning |
| 💻 | Programming | programming |
| 🔒 | Cybersecurity | cybersecurity |
| 📱 | Gadgets & Reviews | gadgets |
| ☁️ | Cloud & DevOps | cloud-devops |
| 📰 | Tech News | tech-news |
| ⚡ | AI Tools | ai-tools |

## Production Deployment
- Frontend: Deploy to Vercel (`vercel --prod`)
- Backend: Deploy to Railway/Render/DigitalOcean
- Database: MongoDB Atlas (free tier)
- Update all env variables to production URLs
