import { useState, useEffect, useRef } from "react";
import {
  X,
  Pin,
  BellPlus,
  UserPlus,
  Palette,
  ImagePlus,
  Archive,
  MoreVertical,
  Undo,
  Redo,
  Check,
  Plus,
  Trash2,
  Copy,
  Tag,
  CheckSquare,
  AlignLeft,
  Clock,
  Calendar,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext.jsx";

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

const NoteModal = () => {
  const {
    editingNote,
    closeNoteModal,
    updateNote,
    togglePin,
    archiveNote,
    trashNote,
    duplicateNote,
    changeNoteColor,
    labels,
    addLabelToNote,
    removeLabelFromNote,
    addChecklistItem,
    toggleChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    convertToChecklist,
    convertToNote,
    setReminder,
    viewMode,
  } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const modalRef = useRef(null);
  const newItemRef = useRef(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || "");
      setContent(editingNote.content || "");
    }
  }, [editingNote]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [title, content]);

  if (!editingNote) return null;

  const handleClose = () => {
    updateNote(editingNote.id, { title, content });
    closeNoteModal();
    setShowColorPicker(false);
    setShowMoreMenu(false);
    setShowLabelMenu(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleColorChange = (color) => {
    changeNoteColor(editingNote.id, color);
    setShowColorPicker(false);
  };

  const handleAddChecklistItem = () => {
    addChecklistItem(editingNote.id, "");
    // Use a longer timeout to ensure DOM updates
    setTimeout(() => {
      newItemRef.current?.focus();
    }, 100);
  };

  const handleSetReminder = () => {
    if (reminderDate) {
      const dateTime = reminderTime
        ? `${reminderDate}T${reminderTime}`
        : `${reminderDate}T09:00`;
      setReminder(editingNote.id, dateTime);
      setShowReminderPicker(false);
      setReminderDate("");
      setReminderTime("");
    }
  };

  const bgColor = noteColors[editingNote.color] || noteColors.default;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full sm:max-w-[600px] h-[90vh] sm:h-auto sm:min-h-[70vh] sm:max-h-[85vh] rounded-t-xl sm:rounded-lg shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: bgColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title */}
        <div className="flex items-start p-4 pb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="flex-1 bg-transparent outline-none text-[#e8eaed] text-lg font-medium placeholder-[#9aa0a6]"
          />
          <button
            onClick={() => togglePin(editingNote.id)}
            className="p-2 rounded-full hover:bg-[#3c4043] transition-colors ml-2"
          >
            <Pin
              size={20}
              className={
                editingNote.pinned ? "text-[#feefc3]" : "text-[#9aa0a6]"
              }
              fill={editingNote.pinned ? "#feefc3" : "none"}
            />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {/* Text content area - always available */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              editingNote.isChecklist ? "Add note text..." : "Take a note..."
            }
            className={`w-full bg-transparent outline-none text-[#e8eaed] text-sm placeholder-[#9aa0a6] resize-none mb-2 ${viewMode === "list" ? "min-h-[30vh]" : "min-h-[60vh]"}`}
          />

          {/* Checklist Mode */}
          {editingNote.isChecklist && (
            <div className="space-y-1 border-t border-[#5f6368]/30 pt-3">
              {editingNote.checklistItems?.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => toggleChecklistItem(editingNote.id, item.id)}
                    className="p-1"
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
                      index === editingNote.checklistItems.length - 1
                        ? newItemRef
                        : null
                    }
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      updateChecklistItem(
                        editingNote.id,
                        item.id,
                        e.target.value,
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                    className={`flex-1 bg-transparent outline-none text-sm ${
                      item.checked
                        ? "text-[#9aa0a6] line-through"
                        : "text-[#e8eaed]"
                    }`}
                    placeholder="List item"
                  />
                  <button
                    onClick={() => deleteChecklistItem(editingNote.id, item.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} className="text-[#9aa0a6]" />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddChecklistItem}
                className="flex items-center gap-2 text-[#9aa0a6] hover:text-[#e8eaed] py-2 transition-colors"
              >
                <Plus size={18} />
                <span className="text-sm">Add item</span>
              </button>
            </div>
          )}

          {/* Labels Display */}
          {editingNote.labels?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {editingNote.labels.map((labelId) => {
                const label = labels.find((l) => l.id === labelId);
                if (!label) return null;
                return (
                  <span
                    key={labelId}
                    className="px-2 py-1 rounded-full bg-[#3c4043] text-[#e8eaed] text-xs flex items-center gap-1"
                  >
                    {label.name}
                    <button
                      onClick={() =>
                        removeLabelFromNote(editingNote.id, labelId)
                      }
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Reminder Display */}
          {editingNote.reminder && (
            <div className="mt-3">
              <span className="px-3 py-1.5 rounded-full bg-[#3c4043] text-[#8ab4f8] text-xs flex items-center gap-2 w-fit">
                <BellPlus size={14} />
                {new Date(editingNote.reminder).toLocaleString()}
                <button onClick={() => setReminder(editingNote.id, null)}>
                  <X size={12} />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-2 py-2 border-t border-[#5f6368]/30">
          <div className="flex items-center gap-0.5">
            {/* Reminder */}
            <div className="relative">
              <button
                onClick={() => setShowReminderPicker(!showReminderPicker)}
                className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                title="Remind me"
              >
                <BellPlus size={18} className="text-[#9aa0a6]" />
              </button>
              {showReminderPicker && (
                <div className="absolute bottom-full left-0 mb-2 py-2 bg-[#2d2e30] rounded-lg shadow-xl border border-[#5f6368] z-50 min-w-[240px]">
                  <p className="text-[#9aa0a6] text-xs font-medium px-4 pb-2 mb-1">
                    Reminder:
                  </p>

                  {/* Quick options */}
                  <button
                    onClick={() => {
                      const today = new Date();
                      today.setHours(20, 0, 0, 0);
                      setReminder(editingNote.id, today.toISOString());
                      setShowReminderPicker(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[#e8eaed] text-sm hover:bg-[#3c4043] transition-colors"
                  >
                    <Clock size={16} className="text-[#9aa0a6]" />
                    <span>Later today</span>
                    <span className="ml-auto text-[#9aa0a6] text-xs">
                      8:00 PM
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(8, 0, 0, 0);
                      setReminder(editingNote.id, tomorrow.toISOString());
                      setShowReminderPicker(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[#e8eaed] text-sm hover:bg-[#3c4043] transition-colors"
                  >
                    <Clock size={16} className="text-[#9aa0a6]" />
                    <span>Tomorrow</span>
                    <span className="ml-auto text-[#9aa0a6] text-xs">
                      8:00 AM
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      nextWeek.setHours(8, 0, 0, 0);
                      setReminder(editingNote.id, nextWeek.toISOString());
                      setShowReminderPicker(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[#e8eaed] text-sm hover:bg-[#3c4043] transition-colors"
                  >
                    <Clock size={16} className="text-[#9aa0a6]" />
                    <span>Next week</span>
                    <span className="ml-auto text-[#9aa0a6] text-xs">
                      Mon, 8:00 AM
                    </span>
                  </button>

                  <div className="border-t border-[#5f6368]/30 my-2" />

                  {/* Custom date/time */}
                  <div className="px-4 py-2">
                    <p className="text-[#9aa0a6] text-xs mb-2">
                      Pick date & time
                    </p>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="date"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="flex-1 bg-[#3c4043] text-[#e8eaed] text-sm rounded px-2 py-1.5 outline-none"
                      />
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-24 bg-[#3c4043] text-[#e8eaed] text-sm rounded px-2 py-1.5 outline-none"
                      />
                    </div>
                    <button
                      onClick={handleSetReminder}
                      disabled={!reminderDate}
                      className="w-full bg-[#8ab4f8] text-[#202124] text-sm font-medium rounded py-1.5 hover:bg-[#aecbfa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Collaborator */}
            <button
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="Collaborator"
            >
              <UserPlus size={18} className="text-[#9aa0a6]" />
            </button>

            {/* Color Picker */}
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
                  {Object.entries(noteColors).map(([colorName, colorValue]) => (
                    <button
                      key={colorName}
                      onClick={() => handleColorChange(colorName)}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:border-white ${
                        editingNote.color === colorName
                          ? "border-white"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: colorValue }}
                      title={
                        colorName.charAt(0).toUpperCase() + colorName.slice(1)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Add Image */}
            <button
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="Add image"
            >
              <ImagePlus size={18} className="text-[#9aa0a6]" />
            </button>

            {/* Archive */}
            <button
              onClick={() => {
                archiveNote(editingNote.id);
                closeNoteModal();
              }}
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="Archive"
            >
              <Archive size={18} className="text-[#9aa0a6]" />
            </button>

            {/* More Options */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMoreMenu(!showMoreMenu);
                  setShowLabelMenu(false);
                }}
                className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                title="More"
              >
                <MoreVertical size={18} className="text-[#9aa0a6]" />
              </button>
              {showMoreMenu && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 py-2 bg-[#2d2e30] rounded-lg shadow-xl border border-[#5f6368] z-[60] min-w-[180px]">
                  <button
                    onClick={() => {
                      trashNote(editingNote.id);
                      closeNoteModal();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[#e8eaed] text-sm hover:bg-[#3c4043] transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete note
                  </button>

                  {/* Labels submenu trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLabelMenu(!showLabelMenu)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-[#e8eaed] text-sm hover:bg-[#3c4043] transition-colors"
                    >
                      <Tag size={16} />
                      Add label
                    </button>

                    {/* Labels submenu */}
                    {showLabelMenu && (
                      <div className="absolute left-full top-0 ml-1 py-2 bg-[#2d2e30] rounded-lg shadow-xl border border-[#5f6368] z-[70] min-w-[150px]">
                        <p className="px-4 py-1 text-[#9aa0a6] text-xs uppercase">
                          Labels
                        </p>
                        {labels.length > 0 ? (
                          labels.map((label) => (
                            <button
                              key={label.id}
                              onClick={() => {
                                if (editingNote.labels?.includes(label.id)) {
                                  removeLabelFromNote(editingNote.id, label.id);
                                } else {
                                  addLabelToNote(editingNote.id, label.id);
                                }
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-[#e8eaed] text-sm hover:bg-[#3c4043] transition-colors"
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  editingNote.labels?.includes(label.id)
                                    ? "bg-[#8ab4f8] border-[#8ab4f8]"
                                    : "border-[#5f6368]"
                                }`}
                              >
                                {editingNote.labels?.includes(label.id) && (
                                  <Check size={12} className="text-[#202124]" />
                                )}
                              </div>
                              {label.name}
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-2 text-[#9aa0a6] text-xs">
                            No labels yet
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      duplicateNote(editingNote.id);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[#e8eaed] text-sm hover:bg-[#3c4043] transition-colors"
                  >
                    <Copy size={16} />
                    Make a copy
                  </button>
                  {editingNote.isChecklist ? (
                    <button
                      onClick={() => {
                        convertToNote(editingNote.id);
                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-[#e8eaed] text-sm hover:bg-[#3c4043] transition-colors"
                    >
                      <AlignLeft size={16} />
                      Hide tick boxes
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        convertToChecklist(editingNote.id);
                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-[#e8eaed] text-sm hover:bg-[#3c4043] transition-colors"
                    >
                      <CheckSquare size={16} />
                      Show tick boxes
                    </button>
                  )}
                </div>
              )}
            </div>

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
    </div>
  );
};

export default NoteModal;
