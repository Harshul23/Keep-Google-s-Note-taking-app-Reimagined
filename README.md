# 📝 Keep - Google's Note-taking App Reimagined

A pixel-perfect clone of Google Keep built with React, featuring a modern dark theme, full CRUD operations, and all the core functionality you love.

![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646cff?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### Core Functionality

- 📝 **Create, Edit, Delete Notes** - Full CRUD operations with real-time updates
- 📌 **Pin Notes** - Keep important notes at the top
- 🎨 **12 Color Themes** - Personalize your notes with beautiful colors
- ✅ **Checklists** - Create to-do lists with checkable items
- 🔄 **Mixed Content** - Add both text and checklist items in the same note
- 🏷️ **Labels** - Organize notes with custom labels
- ⏰ **Reminders** - Set reminders with quick options (Today, Tomorrow, Next Week)
- 🗄️ **Archive** - Archive notes you don't need right now
- 🗑️ **Trash** - Safely delete notes with recovery option

### User Interface

- 🌙 **Dark Theme** - Beautiful Google Keep dark mode design
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🔍 **Search** - Find notes instantly with real-time search
- 📊 **Grid/List View** - Toggle between grid and list layouts
- 🎯 **Hover-to-Expand Sidebar** - Space-efficient navigation
- ⚡ **Smooth Animations** - Polished transitions throughout

### Data Persistence

- 💾 **LocalStorage** - Notes automatically saved to browser storage
- 🔄 **Real-time Sync** - Changes persist immediately

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/keep-clone.git

# Navigate to project directory
cd keep-clone

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| **React 19**     | UI Framework            |
| **Vite**         | Build Tool & Dev Server |
| **Tailwind CSS** | Styling                 |
| **React Router** | Client-side Routing     |
| **Context API**  | State Management        |
| **Lucide React** | Icons                   |
| **LocalStorage** | Data Persistence        |

## 📁 Project Structure

```
src/
├── components/
│   ├── Home/
│   │   ├── home.jsx          # Main layout wrapper
│   │   ├── navbar.jsx        # Top navigation bar
│   │   ├── sidebar.jsx       # Side navigation
│   │   ├── main-content.jsx  # Notes grid & input
│   │   └── keep-icon.jsx     # Google Keep logo
│   ├── notes/
│   │   ├── note-card.jsx     # Individual note display
│   │   └── note-modal.jsx    # Note editing modal
│   ├── labels/
│   │   └── edit-labels.jsx   # Label management
│   ├── reminders/
│   │   └── reminders.jsx     # Reminders page
│   ├── archive/
│   │   └── archive.jsx       # Archive page
│   └── trash/
│       └── trash.jsx         # Trash page
├── context/
│   └── NotesContext.jsx      # Global state management
├── App.jsx                   # Router configuration
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## 🎨 Color Palette

The app uses Google Keep's signature color palette:

| Color   | Hex       | Usage      |
| ------- | --------- | ---------- |
| Default | `#202124` | Background |
| Coral   | `#77172e` | Note color |
| Peach   | `#692b17` | Note color |
| Sand    | `#7c4a03` | Note color |
| Mint    | `#264d3b` | Note color |
| Sage    | `#0c625d` | Note color |
| Fog     | `#256377` | Note color |
| Storm   | `#284255` | Note color |
| Dusk    | `#472e5b` | Note color |
| Blossom | `#6c394f` | Note color |
| Clay    | `#4b443a` | Note color |
| Chalk   | `#232427` | Note color |

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 768px (md)
- **Desktop**: 1024px+ (lg)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Google Keep](https://keep.google.com/)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vite.dev/)

---

<p align="center">Made with ❤️ by <a href="https://github.com/yourusername">Harshul</a></p>
