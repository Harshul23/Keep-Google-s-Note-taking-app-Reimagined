import { useState } from "react";
import { Plus, Pencil, Check, X, Trash2, Tag } from "lucide-react";
import { useNotes } from "../../context/NotesContext.jsx";

const EditLabels = () => {
  const { sidebarOpen, labels, addLabel, updateLabel, deleteLabel } =
    useNotes();
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      addLabel(newLabel.trim());
      setNewLabel("");
      setIsAddingNew(false);
    }
  };

  const handleDeleteLabel = (id) => {
    deleteLabel(id);
  };

  const handleEditLabel = (id, name) => {
    setEditingId(id);
    setEditingText(name);
  };

  const handleSaveEdit = () => {
    if (editingText.trim()) {
      updateLabel(editingId, editingText.trim());
    }
    setEditingId(null);
    setEditingText("");
  };

  return (
    <main
      className={`pt-20 pb-8 transition-all duration-300 ${
        sidebarOpen ? "ml-[280px]" : "ml-[80px]"
      }`}
    >
      <div className="flex justify-center px-4">
        <div className="w-full max-w-[300px] bg-[#202124] border border-[#5f6368] rounded-lg shadow-lg">
          <div className="p-4 border-b border-[#5f6368]">
            <h2 className="text-[#e8eaed] text-base font-medium">
              Edit labels
            </h2>
          </div>

          {/* Create new label */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#5f6368]">
            <button
              onClick={() => setNewLabel("")}
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
            >
              <X size={18} className="text-[#9aa0a6]" />
            </button>
            <input
              type="text"
              placeholder="Create new label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
              className="flex-1 bg-transparent outline-none text-[#e8eaed] text-sm placeholder-[#9aa0a6] border-b border-[#5f6368] pb-1"
            />
            <button
              onClick={handleAddLabel}
              className="p-2 rounded-full hover:bg-[#3c4043] transition-colors"
            >
              <Check size={18} className="text-[#9aa0a6]" />
            </button>
          </div>

          {/* Labels list */}
          <div className="max-h-[300px] overflow-y-auto">
            {labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#3c4043] group"
              >
                {editingId === label.id ? (
                  <>
                    <button
                      onClick={() => handleDeleteLabel(label.id)}
                      className="p-2 rounded-full hover:bg-[#5f6368] transition-colors"
                    >
                      <Trash2 size={18} className="text-[#9aa0a6]" />
                    </button>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                      className="flex-1 bg-transparent outline-none text-[#e8eaed] text-sm border-b border-[#5f6368] pb-1"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 rounded-full hover:bg-[#5f6368] transition-colors"
                    >
                      <Check size={18} className="text-[#9aa0a6]" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleDeleteLabel(label.id)}
                      className="p-2 rounded-full hover:bg-[#5f6368] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} className="text-[#9aa0a6]" />
                    </button>
                    <span className="flex-1 text-[#e8eaed] text-sm">
                      {label.name}
                    </span>
                    <button
                      onClick={() => handleEditLabel(label.id, label.name)}
                      className="p-2 rounded-full hover:bg-[#5f6368] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={18} className="text-[#9aa0a6]" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Done button */}
          <div className="p-3 border-t border-[#5f6368] flex justify-end">
            <button className="px-6 py-2 text-[#e8eaed] text-sm font-medium rounded hover:bg-[#3c4043] transition-colors">
              Done
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditLabels;
