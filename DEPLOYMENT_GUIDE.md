# Bill Splitter App - Deployment Guide

This guide will walk you through deploying the Bill Splitter App to the web so your friends can access it.

## Deployment Options

You have multiple options for deploying this application:

1. **Easy (Recommended):** Deploy using Render.com with the included render.yaml configuration
2. **Advanced:** Deploy the frontend and backend separately
3. **Self-hosted:** Host on your own server or cloud VM

## Option 1: Easy Deployment with Render.com

Render.com provides a simple way to deploy both the frontend and backend with minimal configuration.

### Steps:

1. **Create a GitHub repository for your project**
   - Create a new repository on GitHub
   - Push your local project to GitHub:
     ```bash
     git remote add origin https://github.com/yourusername/bill-splitter.git
     git branch -M main
     git push -u origin main
     ```

2. **Deploy using Render.com**
   - Create an account on [Render.com](https://render.com/)
   - Click "New" and select "Blueprint"
   - Connect your GitHub account and select your repository
   - Render will automatically detect the render.yaml file and configure your services
   - Click "Apply" to deploy both the frontend and backend
   - Wait for the deployment to complete (this may take a few minutes)

3. **Update Environment Variables**
   - Once deployed, go to your backend service in Render
   - Update the FRONTEND_URL environment variable to match your frontend URL
   - Go to your frontend service in Render
   - Update the REACT_APP_API_URL environment variable to match your backend URL
   - Redeploy both services to apply the changes

## Option 2: Advanced Deployment (Separate Frontend and Backend)

### Backend Deployment (Render.com, Heroku, etc.)

1. **Create a new web service**
   - Choose Python as the environment
   - Set the build command: `pip install -r requirements.txt`
   - Set the start command: `gunicorn app:app`
   - Add environment variables:
     - FRONTEND_URL: URL of your frontend app
     - DB_FILE: Path to the database file (e.g., `/var/data/bill_splitter_db.json`)
     - DEBUG: "False" for production

2. **Deploy the backend**
   - Connect your GitHub repository
   - Deploy the application
   - Note the URL of your deployed backend (e.g., `https://bill-splitter-backend.onrender.com`)

### Frontend Deployment (Netlify, Vercel, etc.)

1. **Create a new static site**
   - Connect your GitHub repository
   - Set the build command: `cd frontend && npm install && npm run build`
   - Set the publish directory: `frontend/build`
   - Add environment variables:
     - REACT_APP_API_URL: URL of your backend (from the previous step)

2. **Deploy the frontend**
   - Deploy the application
   - Your app should now be accessible at the provided URL!

## Data Storage Considerations

The app uses a JSON file to store data. In a production environment:

1. **Persistent Storage**: Make sure your hosting provider offers persistent storage
2. **Database Path**: Update the DB_FILE environment variable to a writable location
3. **Alternative Storage**: For higher traffic, consider migrating to a proper database like PostgreSQL or MongoDB

## Sharing with Friends

Once deployed, you can share the frontend URL with your friends. Anyone with the URL can:
- Add dishes and prices
- Add people to split the bill with
- Select who had what
- Calculate how the bill should be split

## Customizing Your Deployment

You can customize various aspects of your deployment:

- **Custom Domain**: Add your own domain in your hosting provider's settings
- **SSL**: Enable HTTPS for secure connections (most providers do this automatically)
- **Custom Styling**: Modify the frontend code to change colors, themes, etc.

## Troubleshooting

**Backend Issues**:
- Check the logs in your hosting provider's dashboard
- Ensure environment variables are set correctly
- Verify that the database file path is writable

**Frontend Issues**:
- Make sure the REACT_APP_API_URL points to your backend
- Check browser console for JavaScript errors
- Verify that CORS is properly configured in the backend

## Need Help?

If you encounter issues during deployment, check:
- Your hosting provider's documentation
- Stack Overflow for specific error messages
- GitHub issues for similar projects

Good luck with your deployment!
