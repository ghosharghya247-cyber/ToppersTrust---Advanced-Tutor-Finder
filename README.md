
# ToppersTrust - Advanced Tutor Finder

An innovative platform that connects guardians, tutors, and media organizations to facilitate quality tutoring services. ToppersTrust leverages modern web technologies to provide a seamless experience for finding, managing, and delivering tutoring services.

Point to be noted : this project was done by my team in another github account. Since I don't have access to that github anymore (because it was my school account), all the contrubutions are gone. I just had the codes in my local setup. So I decided to push it into a new repository.
#Team leader : https://github.com/Xmortian
#Main repository : https://github.com/Xmortian/ToppersTrust---Advanced-Tutor-Finder
#Deployed Version : https://toppers-trust.online/

## 🎯 Project Overview

ToppersTrust is a full-stack web application built with:
- **Frontend**: React 18 with Vite for fast development
- **Backend**: Node.js Express server with Supabase for database and authentication
- **Styling**: Tailwind CSS for responsive design
- **Payment Integration**: SSLCommerz for secure transactions
- **Deployment**: Vercel-ready configuration

## ✨ Key Features

### For Guardians
- Post tutoring job requests with detailed requirements
- Browse and shortlist qualified tutors
- Manage job history and communications
- Process payments securely
- View recommended tutors based on requirements

### For Tutors
- Create and manage professional profiles
- View and accept suitable job opportunities
- Accept/reject job requests
- Track earnings and job history
- Build reputation through peer ratings

### For Media Organizations
- Browse available jobs and tutors
- Post curated job listings
- Track user engagement and interactions

### For Administrators
- Dashboard for monitoring platform activities
- Manage user accounts and permissions
- Handle complaints and disputes
- Track dues and payments
- System analytics and reporting

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/download) (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Xmortian/ToppersTrust---Advanced-Tutor-Finder.git
   cd ToppersTrust---Advanced-Tutor-Finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the project root with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev:full
   ```
   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
├── pages/
│   ├── control/        # Controllers for page logic (MVC pattern)
│   ├── model/          # Data models and business logic
│   └── view/           # View components for rendering
├── App.jsx             # Main application component
├── index.jsx           # Application entry point
├── supabase.js         # Supabase client configuration
└── global.css          # Global styles
api/
├── index.js            # Express server configuration
public/                 # Static assets
tailwind.config.js      # Tailwind CSS configuration
vite.config.mjs         # Vite bundler configuration
```

## 🏗️ Architecture

ToppersTrust follows the **MVC (Model-View-Controller)** pattern:

- **Controllers** (`pages/control/`): Handle page logic, state management, and navigation
- **Models** (`pages/model/`): Contain business logic and data transformation
- **Views** (`pages/view/`): Presentational components that render the UI
- **Components** (`components/`): Reusable UI components used across pages

## 🔐 Authentication

The application uses **Supabase Authentication** with email-based login. Users can:
- Sign up as guardians, tutors, or media organizations
- Reset forgotten passwords
- Maintain secure sessions

## 💳 Payments

SSLCommerz integration enables secure online payments for:
- Job postings
- Transaction settlements between users
- Platform fees

## 🛠️ Available Scripts

```bash
# Development
npm run dev:full      # Run both frontend and backend servers
npm run dev           # Run frontend only
npm run server        # Run backend server only

# Build
npm run build         # Build for production

# Linting
npm run lint          # Run ESLint on source code
```

## 📦 Key Dependencies

- **React** - UI library
- **React Router** - Navigation
- **Supabase** - Backend and database
- **Tailwind CSS** - Styling
- **Express** - Backend server
- **Material-UI** - Component library
- **Lucide React** - Icon library
- **React Spring** - Animation library

## 🌐 Routing

Main application routes include:
- `/` - Landing page
- `/signup` - Sign up page
- `/guardian` - Guardian dashboard
- `/tutor` - Tutor dashboard
- `/admin` - Admin portal
- `/post-job` - Post new job (guardians)
- `/profile` - User profile management
- `/shortlist` - Shortlisted tutors

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Happy tutoring! 🎓**

