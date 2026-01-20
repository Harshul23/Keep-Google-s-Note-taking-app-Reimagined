import { createContext, useContext, useState, useEffect } from "react";

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  // Load notes from localStorage on initial render
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("keep-notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  // Load labels from localStorage
  const [labels, setLabels] = useState(() => {
    const savedLabels = localStorage.getItem("keep-labels");
    return savedLabels ? JSON.parse(savedLabels) : [];
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null); // Store just the ID

  // Compute editingNote from notes array to keep it in sync
  const editingNote = editingNoteId
    ? notes.find((n) => n.id === editingNoteId) || null
    : null;

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("keep-notes", JSON.stringify(notes));
  }, [notes]);

  // Save labels to localStorage
  useEffect(() => {
    localStorage.setItem("keep-labels", JSON.stringify(labels));
  }, [labels]);

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Add a new note
  const addNote = (note) => {
    const newNote = {
      id: generateId(),
      title: note.title || "",
      content: note.content || "",
      color: note.color || "default",
      pinned: note.pinned || false,
      archived: false,
      trashed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reminder: null,
      labels: note.labels || [],
      isChecklist: note.isChecklist || false,
      checklistItems: note.checklistItems || [],
      images: note.images || [],
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  // Update a note
  const updateNote = (id, updates) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note,
      ),
    );
  };

  // Delete a note permanently
  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  // Move note to trash
  const trashNote = (id) => {
    updateNote(id, { trashed: true, archived: false });
  };

  // Restore note from trash
  const restoreNote = (id) => {
    updateNote(id, { trashed: false });
  };

  // Archive a note
  const archiveNote = (id) => {
    updateNote(id, { archived: true, trashed: false });
  };

  // Unarchive a note
  const unarchiveNote = (id) => {
    updateNote(id, { archived: false });
  };

  // Toggle pin status
  const togglePin = (id) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      updateNote(id, { pinned: !note.pinned });
    }
  };

  // Change note color
  const changeNoteColor = (id, color) => {
    updateNote(id, { color });
  };

  // Set reminder
  const setReminder = (id, reminder) => {
    updateNote(id, { reminder });
  };

  // Clear reminder
  const clearReminder = (id) => {
    updateNote(id, { reminder: null });
  };

  // Get active notes (not archived, not trashed)
  const getActiveNotes = () => {
    return notes.filter((note) => !note.archived && !note.trashed);
  };

  // Get archived notes
  const getArchivedNotes = () => {
    return notes.filter((note) => note.archived && !note.trashed);
  };

  // Get trashed notes
  const getTrashedNotes = () => {
    return notes.filter((note) => note.trashed);
  };

  // Get notes with reminders
  const getReminderNotes = () => {
    return notes.filter((note) => note.reminder && !note.trashed);
  };

  // Search notes
  const searchNotes = (query) => {
    if (!query.trim()) return getActiveNotes();
    const lowerQuery = query.toLowerCase();
    return getActiveNotes().filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery),
    );
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  // Empty trash
  const emptyTrash = () => {
    setNotes((prev) => prev.filter((note) => !note.trashed));
  };

  // Duplicate a note
  const duplicateNote = (id) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      const newNote = {
        ...note,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    }
  };

  // Add checklist item to a note
  const addChecklistItem = (noteId, text = "") => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      const newItem = {
        id: generateId(),
        text,
        checked: false,
      };
      updateNote(noteId, {
        checklistItems: [...(note.checklistItems || []), newItem],
      });
    }
  };

  // Toggle checklist item
  const toggleChecklistItem = (noteId, itemId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note && note.checklistItems) {
      const updatedItems = note.checklistItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      );
      updateNote(noteId, { checklistItems: updatedItems });
    }
  };

  // Update checklist item text
  const updateChecklistItem = (noteId, itemId, text) => {
    const note = notes.find((n) => n.id === noteId);
    if (note && note.checklistItems) {
      const updatedItems = note.checklistItems.map((item) =>
        item.id === itemId ? { ...item, text } : item,
      );
      updateNote(noteId, { checklistItems: updatedItems });
    }
  };

  // Delete checklist item
  const deleteChecklistItem = (noteId, itemId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note && note.checklistItems) {
      const updatedItems = note.checklistItems.filter(
        (item) => item.id !== itemId,
      );
      updateNote(noteId, { checklistItems: updatedItems });
    }
  };

  // Convert note to checklist
  const convertToChecklist = (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note && !note.isChecklist) {
      const items = note.content
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => ({
          id: generateId(),
          text: line.trim(),
          checked: false,
        }));
      updateNote(noteId, {
        isChecklist: true,
        checklistItems: items,
        content: "",
      });
    }
  };

  // Convert checklist to regular note
  const convertToNote = (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note && note.isChecklist) {
      const content = note.checklistItems.map((item) => item.text).join("\n");
      updateNote(noteId, {
        isChecklist: false,
        content,
        checklistItems: [],
      });
    }
  };

  // Label management
  const addLabel = (name) => {
    const newLabel = {
      id: generateId(),
      name,
    };
    setLabels((prev) => [...prev, newLabel]);
    return newLabel;
  };

  const updateLabel = (id, name) => {
    setLabels((prev) =>
      prev.map((label) => (label.id === id ? { ...label, name } : label)),
    );
  };

  const deleteLabel = (id) => {
    setLabels((prev) => prev.filter((label) => label.id !== id));
    // Remove label from all notes
    setNotes((prev) =>
      prev.map((note) => ({
        ...note,
        labels: note.labels.filter((labelId) => labelId !== id),
      })),
    );
  };

  // Add label to note
  const addLabelToNote = (noteId, labelId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note && !note.labels.includes(labelId)) {
      updateNote(noteId, { labels: [...note.labels, labelId] });
    }
  };

  // Remove label from note
  const removeLabelFromNote = (noteId, labelId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      updateNote(noteId, {
        labels: note.labels.filter((id) => id !== labelId),
      });
    }
  };

  // Get notes by label
  const getNotesByLabel = (labelId) => {
    return notes.filter(
      (note) =>
        note.labels.includes(labelId) && !note.archived && !note.trashed,
    );
  };

  // Open note in modal for editing
  const openNoteModal = (note) => {
    setEditingNoteId(note.id);
  };

  // Close note modal
  const closeNoteModal = () => {
    setEditingNoteId(null);
  };

  const value = {
    notes,
    labels,
    sidebarOpen,
    viewMode,
    searchQuery,
    editingNote,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    trashNote,
    restoreNote,
    archiveNote,
    unarchiveNote,
    togglePin,
    changeNoteColor,
    setReminder,
    clearReminder,
    getActiveNotes,
    getArchivedNotes,
    getTrashedNotes,
    getReminderNotes,
    searchNotes,
    toggleSidebar,
    toggleViewMode,
    emptyTrash,
    duplicateNote,
    addChecklistItem,
    toggleChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    convertToChecklist,
    convertToNote,
    addLabel,
    updateLabel,
    deleteLabel,
    addLabelToNote,
    removeLabelFromNote,
    getNotesByLabel,
    openNoteModal,
    closeNoteModal,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};

export default NotesContext;
