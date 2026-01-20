import { useState } from "react";
import {
  Pin,
  BellPlus,
  UserPlus,
  Palette,
  ImagePlus,
  Archive,
  MoreVertical,
  Trash2,
  ArchiveRestore,
  Check,
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

const NoteCard = ({ note, isArchive = false, isTrash = false }) => {
  const {
    togglePin,
    archiveNote,
    unarchiveNote,
    trashNote,
    restoreNote,
    deleteNote,
    changeNoteColor,
    openNoteModal,
    toggleChecklistItem,
    labels,
  } = useNotes();
  const [isHovered, setIsHovered] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color) => {
    changeNoteColor(note.id, color);
    setShowColorPicker(false);
  };

  const handleCardClick = () => {
    if (!isTrash) {
      openNoteModal(note);
    }
  };

  const bgColor = noteColors[note.color] || noteColors.default;

  // Get note labels
  const noteLabels =
    note.labels
      ?.map((labelId) => labels.find((l) => l.id === labelId))
      .filter(Boolean) || [];

  return (
    <div
      className="group relative rounded-lg border border-[#5f6368] hover:border-[#5f6368] transition-all duration-200 cursor-pointer hover:shadow-xl"
      style={{ backgroundColor: bgColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowColorPicker(false);
      }}
      onClick={handleCardClick}
    >
      {/* Pin Button (top-right corner) */}
      {!isTrash && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePin(note.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full hover:bg-[#3c4043] transition-all ${
            isHovered || note.pinned ? "opacity-100" : "opacity-0"
          }`}
        >
          <Pin
            size={18}
            className={note.pinned ? "text-[#feefc3]" : "text-[#9aa0a6]"}
            fill={note.pinned ? "#feefc3" : "none"}
          />
        </button>
      )}

      {/* Note Content */}
      <div className="p-3 pr-10">
        {note.title && (
          <h3 className="text-[#e8eaed] font-medium text-base mb-2 break-words">
            {note.title}
          </h3>
        )}

        {/* Text Content - shown first */}
        {note.content && (
          <p
            className={`text-[#e8eaed] text-sm break-words whitespace-pre-wrap ${note.isChecklist && note.checklistItems?.filter((item) => item.text.trim()).length > 0 ? "mb-2" : ""}`}
          >
            {note.content}
          </p>
        )}

        {/* Checklist Display */}
        {note.isChecklist &&
          note.checklistItems?.filter((item) => item.text.trim()).length >
            0 && (
            <div className="space-y-1">
              {note.checklistItems
                .filter((item) => item.text.trim())
                .slice(0, 8)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => toggleChecklistItem(note.id, item.id)}
                      className="shrink-0"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          item.checked
                            ? "bg-[#8ab4f8] border-[#8ab4f8]"
                            : "border-[#5f6368]"
                        }`}
                      >
                        {item.checked && (
                          <Check size={10} className="text-[#202124]" />
                        )}
                      </div>
                    </button>
                    <span
                      className={`text-sm ${
                        item.checked
                          ? "text-[#9aa0a6] line-through"
                          : "text-[#e8eaed]"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              {note.checklistItems.filter((item) => item.text.trim()).length >
                8 && (
                <p className="text-[#9aa0a6] text-xs mt-1">
                  +{" "}
                  {note.checklistItems.filter((item) => item.text.trim())
                    .length - 8}{" "}
                  more items
                </p>
              )}
            </div>
          )}

        {/* Labels Display */}
        {noteLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {noteLabels.map((label) => (
              <span
                key={label.id}
                className="px-2 py-0.5 rounded bg-[#3c4043]/50 text-[#e8eaed] text-xs"
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Reminder Display */}
        {note.reminder && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#3c4043]/50 text-[#8ab4f8] text-xs">
              <BellPlus size={12} />
              {new Date(note.reminder).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons (bottom) */}
      <div
        className={`flex items-center gap-0.5 px-1 py-1 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {isTrash ? (
          /* Trash Actions */
          <>
            <button
              onClick={() => deleteNote(note.id)}
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="Delete forever"
            >
              <Trash2 size={16} className="text-[#9aa0a6]" />
            </button>
            <button
              onClick={() => restoreNote(note.id)}
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="Restore"
            >
              <ArchiveRestore size={16} className="text-[#9aa0a6]" />
            </button>
          </>
        ) : (
          /* Normal Actions */
          <>
            <button
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="Remind me"
            >
              <BellPlus size={16} className="text-[#9aa0a6]" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="Collaborator"
            >
              <UserPlus size={16} className="text-[#9aa0a6]" />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }}
                className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                title="Background options"
              >
                <Palette size={16} className="text-[#9aa0a6]" />
              </button>

              {/* Color Picker Dropdown */}
              {showColorPicker && (
                <div
                  className="absolute bottom-full left-0 mb-2 p-2 bg-[#2d2e30] rounded-lg shadow-xl border border-[#5f6368] flex flex-wrap gap-1 z-50"
                  style={{ width: "144px" }}
                >
                  {Object.entries(noteColors).map(([colorName, colorValue]) => (
                    <button
                      key={colorName}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColorChange(colorName);
                      }}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:border-white ${
                        note.color === colorName
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
            <button
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="Add image"
            >
              <ImagePlus size={16} className="text-[#9aa0a6]" />
            </button>
            {isArchive ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  unarchiveNote(note.id);
                }}
                className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                title="Unarchive"
              >
                <ArchiveRestore size={16} className="text-[#9aa0a6]" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  archiveNote(note.id);
                }}
                className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
                title="Archive"
              >
                <Archive size={16} className="text-[#9aa0a6]" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                trashNote(note.id);
              }}
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="Delete"
            >
              <Trash2 size={16} className="text-[#9aa0a6]" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
              title="More"
            >
              <MoreVertical size={16} className="text-[#9aa0a6]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
