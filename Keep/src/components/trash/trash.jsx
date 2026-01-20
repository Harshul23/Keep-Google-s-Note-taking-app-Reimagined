import { Trash2 } from "lucide-react";
import { useNotes } from "../../context/NotesContext.jsx";
import NoteCard from "../notes/note-card.jsx";

const Trash = () => {
  const { getTrashedNotes, viewMode, sidebarOpen, emptyTrash } = useNotes();
  const notes = getTrashedNotes();

  return (
    <main
      className={`pt-20 pb-8 transition-all duration-300 ${
        sidebarOpen ? "ml-[280px]" : "ml-[80px]"
      }`}
    >
      {/* Trash info banner */}
      {notes.length > 0 && (
        <div className="px-8 mb-4">
          <div className="flex items-center justify-between bg-[#28292c] rounded-lg px-4 py-3">
            <span className="text-[#9aa0a6] text-sm">
              Notes in Trash are deleted after 7 days.
            </span>
            <button
              onClick={emptyTrash}
              className="text-[#8ab4f8] text-sm hover:underline"
            >
              Empty Trash
            </button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center mt-32">
          <div className="w-32 h-32 mb-6 opacity-60">
            <Trash2 size={120} className="text-[#5f6368]" strokeWidth={1} />
          </div>
          <p className="text-[#9aa0a6] text-lg">No notes in Trash</p>
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
              <NoteCard key={note.id} note={note} isTrash={true} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Trash;
