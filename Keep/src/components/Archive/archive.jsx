import { Archive as ArchiveIcon } from "lucide-react";
import { useNotes } from "../../context/NotesContext.jsx";
import NoteCard from "../notes/note-card.jsx";

const Archive = () => {
  const { getArchivedNotes, viewMode, sidebarOpen } = useNotes();
  const notes = getArchivedNotes();

  return (
    <main
      className={`pt-20 pb-8 transition-all duration-300 ${
        sidebarOpen ? "md:ml-[280px]" : "md:ml-[80px]"
      } ml-0`}
    >
      {notes.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center mt-32 px-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mb-6 opacity-60">
            <ArchiveIcon
              size={96}
              className="text-[#5f6368] w-full h-full"
              strokeWidth={1}
            />
          </div>
          <p className="text-[#9aa0a6] text-base sm:text-lg text-center">
            Your archived notes appear here
          </p>
        </div>
      ) : (
        <div className="px-2 sm:px-4 md:px-8">
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "flex flex-col gap-3 max-w-[600px] mx-auto"
            }
          >
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} isArchive={true} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Archive;
