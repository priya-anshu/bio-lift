# Bio-Lift 🏋️‍♂️

A modern, responsive fitness tracking web application built with React that helps users monitor their workouts, track nutrition, and achieve their fitness goals.

## ✨ Features

- **📊 Dashboard Analytics** - Comprehensive overview of fitness metrics and progress
- **💪 Workout Tracking** - Log and monitor your exercise routines
- **🥗 Diet Management** - Track nutrition and meal planning
- **🏆 Rankings & Leaderboards** - Compete with friends and community
- **👤 User Profiles** - Personalized fitness profiles and settings
- **🌙 Dark/Light Theme** - Beautiful UI with theme switching
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **⚡ Real-time Updates** - Live tracking of fitness metrics

## 🚀 Tech Stack

- **Frontend Framework**: React 19.1.1
- **Routing**: React Router DOM 7.8.0
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.12
- **Icons**: Lucide React 0.539.0
- **State Management**: React Context API
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bio-lift.git
   cd bio-lift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📁 Project Structure

```
bio-lift/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI components (Card, Button, etc.)
│   ├── context/           # React Context providers
│   ├── pages/             # Page components
│   │   ├── Dashboard.js   # Main dashboard
│   │   ├── Workout.js     # Workout tracking
│   │   ├── Diet.js        # Nutrition tracking
│   │   ├── Ranking.js     # Leaderboards
│   │   ├── Profile.js     # User profile
│   │   ├── Login.js       # Authentication
│   │   └── Register.js    # User registration
│   ├── styles/            # Additional styles
│   └── utils/             # Utility functions
├── package.json
└── tailwind.config.js
```

## 🎯 Key Features Explained

### Dashboard
- Real-time fitness metrics display
- Progress tracking with visual indicators
- Recent workout history
- Goal completion status

### Workout Tracking
- Log different types of exercises
- Track duration, calories burned, and intensity
- Workout history and analytics
- Custom workout creation

### Diet Management
- Nutrition tracking and meal planning
- Calorie counting and macro tracking
- Meal suggestions and recommendations
- Dietary goal setting

### Rankings & Social
- Community leaderboards
- Friend challenges and competitions
- Achievement badges and rewards
- Social fitness motivation

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface with smooth animations
- **Theme Switching**: Toggle between light and dark themes
- **Responsive Layout**: Optimized for all device sizes
- **Accessibility**: WCAG compliant design patterns
- **Performance**: Optimized rendering with React best practices

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for any environment-specific configurations:

```env
REACT_APP_API_URL=your_api_url_here
REACT_APP_ENVIRONMENT=development
```

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📦 Building for Production

Create a production build:
```bash
npm run build
```

The build files will be created in the `build/` directory, ready for deployment.

## 🚀 Deployment

The app can be deployed to various platforms:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `build` folder
- **AWS S3**: Upload the `build` folder to an S3 bucket
- **Heroku**: Use the buildpack for Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright © 2024 PRIYANSHU DHYANI**

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/) for the project scaffolding
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide React](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need support, please open an issue on GitHub or contact the maintainer.

---

**Made with ❤️ by PRIYANSHU DHYANI**
