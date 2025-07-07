# City Showdown 🏙️

**CS50W Final Project**

A web-based city population guessing game built with Django.

## 🎮 Demo

**[Watch the Demo Video](https://www.youtube.com/watch?v=f-2rtc1A0Rk&t)**

## 📋 Project Overview

City Showdown is an interactive web game where players are presented with two cities and must guess whether the second city has a higher or lower population than the first. The game features three difficulty levels, user authentication, and a competitive leaderboard system.

### Key Features

- **Three Difficulty Levels**: Easy, Medium, and Hard with different population thresholds
- **User Authentication**: Register, login, and track your high scores
- **Interactive Gameplay**: Smooth animations and real-time feedback
- **Dynamic City Images**: Automatically fetched from Wikipedia
- **Leaderboard System**: Compete with other players across all difficulty levels
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Score Tracking**: Persistent score storage for registered users

## 🛠️ Technology Stack

- **Backend**: Django 5.2, Python
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: SQLite
- **Styling**: Bootstrap 4, Custom CSS with animations
- **APIs**: Wikipedia API for city images
- **Data Source**: GeonamesCache for city population data
- **CI/CD**: GitHub Actions

## 🚀 Installation & Setup

### Prerequisites

- Python 3.7+
- pip (Python package manager)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd city-showdown
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server**
   ```bash
   python manage.py runserver
   ```

7. **Open your browser**
   Navigate to `http://127.0.0.1:8000`

## 🎯 How to Play

1. **Choose Difficulty**: Select Easy, Medium, or Hard
   - **Easy**: Cities with population > 10 million
   - **Medium**: Cities with population > 5 million  
   - **Hard**: Cities with population > 100,000

2. **Make Your Guess**: 
   - You'll see two cities with the first city's population revealed
   - Guess if the second city has MORE or LESS population
   - Get immediate feedback with animations

3. **Score Points**: 
   - Correct guesses increase your score
   - Wrong guesses end the game
   - Try to beat your high score!

4. **Compete**: Check the leaderboard to see how you rank against other players

## 📁 Project Structure

```
capstone/
├── capstone/                 # Main Django project settings
│   ├── settings.py          # Django configuration
│   ├── urls.py             # URL routing
│   └── ...
├── cityshowdown/            # Main application
│   ├── models.py           # Database models (User, Game)
│   ├── views.py            # View controllers
│   ├── urls.py             # App URL patterns
│   ├── static/             # Static files (CSS, JS, images)
│   │   └── showdown/
│   │       ├── styles.css  # Main stylesheet
│   │       ├── animation.css # Animation styles
│   │       └── index.js    # Game logic
│   ├── templates/          # HTML templates
│   │   └── showdown/
│   │       ├── layout.html # Base template
│   │       ├── game_screen.html
│   │       ├── leaderboard.html
│   │       └── ...
│   └── migrations/         # Database migrations
├── requirements.txt        # Python dependencies
├── manage.py              # Django management script
└── .github/workflows/     # GitHub Actions CI
```

## 🗄️ Database Models

### User Model
- Extends Django's AbstractUser
- Stores user authentication data
- Links to game results

### Game Model
- `player`: Foreign key to User
- `score`: Final score achieved
- `difficulty`: Game difficulty level
- `date`: Timestamp of game completion

## 🎨 Design Features

- **Glassmorphism UI**: Modern translucent design elements
- **Gradient Backgrounds**: Dynamic color schemes
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Spinner animations for city image loading
- **Visual Feedback**: Check/cross animations for correct/incorrect guesses

## 🔧 Technical Implementation

### Game Logic
- Cities loaded from GeonamesCache library
- Population thresholds filter cities by difficulty
- JavaScript manages game state and user interactions
- AJAX-style form submissions for seamless gameplay

### Image Loading
- Dynamic Wikipedia API integration
- Fallback to default city image if API fails
- Preloading and fade-in animations for smooth UX

### User Authentication
- Django's built-in authentication system
- Custom user model with additional fields
- Session management for guest and registered users

## 🧪 Testing

Run the test suite with:
```bash
python manage.py test
```

## 🚀 Deployment

The project includes GitHub Actions CI/CD configuration for automated testing on:
- Python 3.7, 3.8, 3.9
- Ubuntu environment

## 📝 CS50W Requirements Fulfilled

- **Distinctiveness**: Unique city population guessing game concept
- **Complexity**: Multi-level gameplay, user authentication, dynamic content
- **Django**: Full-stack Django application with models, views, templates
- **JavaScript**: Interactive game logic and animations
- **Mobile Responsive**: Works across all device sizes
- **Multiple Models**: User and Game models with relationships

---
