import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext.jsx";
import Home from "./components/Home/home.jsx";
import MainContent from "./components/Home/main-content.jsx";
import Reminders from "./components/reminders/reminders.jsx";
import Archive from "./components/archive/archive.jsx";
import Trash from "./components/trash/trash.jsx";
import EditLabels from "./components/labels/edit-labels.jsx";
import NoteModal from "./components/notes/note-modal.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <NotesProvider>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<MainContent />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="archive" element={<Archive />} />
            <Route path="trash" element={<Trash />} />
            <Route path="edit-labels" element={<EditLabels />} />
          </Route>
        </Routes>
        <NoteModal />
      </NotesProvider>
    </BrowserRouter>
  );
};

export default App;
