import { useState, useRef, useEffect } from "react";
import {
  CheckSquare,
  Brush,
  Image,
  Pin,
  BellPlus,
  UserPlus,
  Palette,
  ImagePlus,
  Archive,
  MoreVertical,
  Undo,
  Redo,
  X,
  Plus,
  Check,
  Clock,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext.jsx";
import NoteCard from "../notes/note-card.jsx";

const noteColors = {
  default: "#202124",
  coral: "#77172e",
  peach: "#692b17",
  sand: "#7c4a03",
  mint: "#264d3b",
  sage: "#0c625d",
  fog: "#256377",
  storm: "#284255",
  dusk: "#472e5b",
  blossom: "#6c394f",
  clay: "#4b443a",
  chalk: "#232427",
};

const MainContent = () => {
  const {
    getActiveNotes,
    addNote,
    viewMode,
    sidebarOpen,
    searchQuery,
    searchNotes,
  } = useNotes();

  const [isExpanded, setIsExpanded] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [noteColor, setNoteColor] = useState("default");
  const [isChecklist, setIsChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [noteReminder, setNoteReminder] = useState(null);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const newItemRef = useRef(null);

  // Get notes based on search query
  const notes = searchQuery ? searchNotes(searchQuery) : getActiveNotes();
  const pinnedNotes = notes.filter((note) => note.pinned);
  const otherNotes = notes.filter((note) => !note.pinned);

  // Handle click outside to close expanded input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, noteTitle, noteContent, checklistItems]);

  const handleExpand = (asChecklist = false) => {
    setIsExpanded(true);
    if (asChecklist) {
      setIsChecklist(true);
      setChecklistItems([
        { id: Date.now().toString(), text: "", checked: false },
      ]);
    }
  };

  const handleClose = () => {
    const hasChecklistContent = checklistItems.some((item) => item.text.trim());
    if (noteTitle.trim() || noteContent.trim() || hasChecklistContent) {
      addNote({
        title: noteTitle,
        content: isChecklist ? "" : noteContent,
        pinned: isPinned,
        color: noteColor,
        isChecklist,
        checklistItems: isChecklist
          ? checklistItems.filter((item) => item.text.trim())
          : [],
        reminder: noteReminder,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setIsExpanded(false);
    setNoteTitle("");
    setNoteContent("");
    setIsPinned(false);
    setNoteColor("default");
    setIsChecklist(false);
    setChecklistItems([]);
    setShowColorPicker(false);
    setShowReminderPicker(false);
    setNoteReminder(null);
    setReminderDate("");
    setReminderTime("");
  };

  const handleAddChecklistItem = () => {
    const newItem = { id: Date.now().toString(), text: "", checked: false };
    setChecklistItems([...checklistItems, newItem]);
    setTimeout(() => newItemRef.current?.focus(), 50);
  };

  const handleUpdateChecklistItem = (id, text) => {
    setChecklistItems((items) =>
      items.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  const handleToggleChecklistItem = (id) => {
    setChecklistItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleDeleteChecklistItem = (id) => {
    setChecklistItems((items) => items.filter((item) => item.id !== id));
  };

  const handleChecklistKeyDown = (e, id, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddChecklistItem();
    } else if (
      e.key === "Backspace" &&
      checklistItems[index].text === "" &&
      checklistItems.length > 1
    ) {
      e.preventDefault();
      handleDeleteChecklistItem(id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  const bgColor = noteColors[noteColor] || noteColors.default;

  return (
    <main
      className={`pt-20 pb-8 transition-all duration-300 ${
        sidebarOpen ? "ml-[280px]" : "ml-[80px]"
      }`}
    >
      {/* Note Input Area */}
      <div className="flex justify-center px-4 mb-8">
        <div
          ref={containerRef}
          className={`w-full max-w-[600px] border border-[#5f6368] rounded-lg shadow-lg transition-all duration-200 ${
            isExpanded ? "shadow-xl" : ""
          }`}
          style={{ backgroundColor: bgColor }}
          onKeyDown={handleKeyDown}
        >
          {!isExpanded ? (
            /* Collapsed State */
            <div
              className="flex items-center justify-between px-4 py-3 cursor-text"
              onClick={() => handleExpand(false)}
            >
              <span className="text-[#9aa0a6] text-sm">Take a note...</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpand(true);
                  }}
                  className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                >
                  <CheckSquare size={20} className="text-[#9aa0a6]" />
                </button>
                <button className="p-2 rounded-full hover:bg-[#3c4043] transition-colors">
                  <Brush size={20} className="text-[#9aa0a6]" />
                </button>
                <button className="p-2 rounded-full hover:bg-[#3c4043] transition-colors">
                  <Image size={20} className="text-[#9aa0a6]" />
                </button>
              </div>
            </div>
          ) : (
            /* Expanded State */
            <div className="p-3">
              {/* Title Input with Pin */}
              <div className="flex items-start justify-between mb-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#e8eaed] text-base font-medium placeholder-[#9aa0a6]"
                  autoFocus={!isChecklist}
                />
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className={`p-2 rounded-full hover:bg-[#3c4043] transition-colors ${
                    isPinned ? "text-[#feefc3]" : "text-[#9aa0a6]"
                  }`}
                >
                  <Pin size={20} fill={isPinned ? "#feefc3" : "none"} />
                </button>
              </div>

              {/* Text Input - Always available */}
              <textarea
                ref={inputRef}
                placeholder={
                  isChecklist ? "Add note text..." : "Take a note..."
                }
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-transparent outline-none text-[#e8eaed] text-sm placeholder-[#9aa0a6] resize-none min-h-[20vh] mb-2"
                rows={2}
              />

              {/* Checklist Items */}
              {isChecklist && (
                <div className="space-y-1 mb-2 border-t border-[#5f6368]/30 pt-3">
                  {checklistItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 group"
                    >
                      <button
                        onClick={() => handleToggleChecklistItem(item.id)}
                        className="shrink-0"
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            item.checked
                              ? "bg-[#8ab4f8] border-[#8ab4f8]"
                              : "border-[#5f6368]"
                          }`}
                        >
                          {item.checked && (
                            <Check size={14} className="text-[#202124]" />
                          )}
                        </div>
                      </button>
                      <input
                        ref={
                          index === checklistItems.length - 1
                            ? newItemRef
                            : null
                        }
                        type="text"
                        value={item.text}
                        onChange={(e) =>
                          handleUpdateChecklistItem(item.id, e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleChecklistKeyDown(e, item.id, index)
                        }
                        className={`flex-1 bg-transparent outline-none text-sm ${
                          item.checked
                            ? "text-[#9aa0a6] line-through"
                            : "text-[#e8eaed]"
                        }`}
                        placeholder="List item"
                      />
                      <button
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} className="text-[#9aa0a6]" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddChecklistItem}
                    className="flex items-center gap-2 text-[#9aa0a6] hover:text-[#e8eaed] py-1 transition-colors"
                  >
                    <Plus size={18} />
                    <span className="text-sm">Add item</span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-3 -mx-1">
                <div className="flex items-center gap-0.5">
                  <button
                    className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                    title="Remind me"
                  >
                    <BellPlus size={18} className="text-[#9aa0a6]" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                    title="Collaborator"
                  >
                    <UserPlus size={18} className="text-[#9aa0a6]" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                      title="Background options"
                    >
                      <Palette size={18} className="text-[#9aa0a6]" />
                    </button>
                    {showColorPicker && (
                      <div
                        className="absolute bottom-full left-0 mb-2 p-2 bg-[#2d2e30] rounded-lg shadow-xl border border-[#5f6368] flex flex-wrap gap-1 z-50"
                        style={{ width: "144px" }}
                      >
                        {Object.entries(noteColors).map(
                          ([colorName, colorValue]) => (
                            <button
                              key={colorName}
                              onClick={() => {
                                setNoteColor(colorName);
                                setShowColorPicker(false);
                              }}
                              className={`w-6 h-6 rounded-full border-2 transition-all hover:border-white ${
                                noteColor === colorName
                                  ? "border-white"
                                  : "border-transparent"
                              }`}
                              style={{ backgroundColor: colorValue }}
                              title={
                                colorName.charAt(0).toUpperCase() +
                                colorName.slice(1)
                              }
                            />
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                    title="Add image"
                  >
                    <ImagePlus size={18} className="text-[#9aa0a6]" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                    title="Archive"
                  >
                    <Archive size={18} className="text-[#9aa0a6]" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                    title="More"
                  >
                    <MoreVertical size={18} className="text-[#9aa0a6]" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                    title="Undo"
                  >
                    <Undo size={18} className="text-[#9aa0a6]" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                    title="Redo"
                  >
                    <Redo size={18} className="text-[#9aa0a6]" />
                  </button>
                </div>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 text-[#e8eaed] text-sm font-medium rounded hover:bg-[#3c4043] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Display */}
      {notes.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center mt-32">
          <div className="w-32 h-32 mb-6 opacity-60">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"
                fill="#5f6368"
              />
            </svg>
          </div>
          <p className="text-[#9aa0a6] text-lg">
            Notes that you add appear here
          </p>
        </div>
      ) : (
        <div className="px-8">
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[11px] font-medium text-[#9aa0a6] uppercase tracking-wider mb-2 ml-2">
                Pinned
              </h2>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "flex flex-col gap-3 max-w-[600px] mx-auto"
                }
              >
                {pinnedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}

          {/* Other Notes Section */}
          {otherNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className="text-[11px] font-medium text-[#9aa0a6] uppercase tracking-wider mb-2 ml-2">
                  Others
                </h2>
              )}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "flex flex-col gap-3 max-w-[600px] mx-auto"
                }
              >
                {otherNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default MainContent;
