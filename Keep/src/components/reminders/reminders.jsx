import { Bell } from "lucide-react";
import { useNotes } from "../../context/NotesContext.jsx";
import NoteCard from "../notes/note-card.jsx";

const Reminders = () => {
  const { getReminderNotes, viewMode, sidebarOpen } = useNotes();
  const notes = getReminderNotes();

  return (
    <main
      className={`pt-20 pb-8 transition-all duration-300 ${
        sidebarOpen ? "ml-[280px]" : "ml-[80px]"
      }`}
    >
      {notes.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center mt-32">
          <div className="w-32 h-32 mb-6 opacity-60">
            <Bell size={120} className="text-[#5f6368]" strokeWidth={1} />
          </div>
          <p className="text-[#9aa0a6] text-lg">
            Notes with upcoming reminders appear here
          </p>
        </div>
      ) : (
        <div className="px-8">
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "flex flex-col gap-3 max-w-[600px] mx-auto"
            }
          >
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Reminders;
