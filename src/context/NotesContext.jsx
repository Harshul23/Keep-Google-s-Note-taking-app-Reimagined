import { createContext, useContext, useState, useEffect } from "react";

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

// Default demo notes
const demoNotes = [
  {
    id: "demo1",
    title: "Welcome to Keep! 👋",
    content:
      "This is your personal note-taking app. Create notes, checklists, and reminders to stay organized.",
    color: "fog",
    pinned: true,
    archived: false,
    trashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminder: null,
    labels: [],
    isChecklist: false,
    checklistItems: [],
    images: [],
  },
  {
    id: "demo2",
    title: "🛒 Grocery List",
    content: "",
    color: "mint",
    pinned: false,
    archived: false,
    trashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminder: null,
    labels: [],
    isChecklist: true,
    checklistItems: [
      { id: "g1", text: "Milk", checked: false },
      { id: "g2", text: "Eggs", checked: true },
      { id: "g3", text: "Bread", checked: false },
      { id: "g4", text: "Butter", checked: true },
      { id: "g5", text: "Fresh vegetables", checked: false },
    ],
    images: [],
  },
  {
    id: "demo3",
    title: "Project Ideas 💡",
    content:
      "1. Build a weather app with React\n2. Create a portfolio website\n3. Learn TypeScript\n4. Contribute to open source\n5. Build a Chrome extension",
    color: "sand",
    pinned: true,
    archived: false,
    trashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminder: null,
    labels: [],
    isChecklist: false,
    checklistItems: [],
    images: [],
  },
  {
    id: "demo4",
    title: "Meeting Notes",
    content:
      "Discussed Q1 goals and roadmap. Key points:\n\n• Focus on user experience improvements\n• Launch new features by March\n• Weekly sync every Monday at 10 AM",
    color: "storm",
    pinned: false,
    archived: false,
    trashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminder: new Date(Date.now() + 86400000).toISOString(),
    labels: [],
    isChecklist: false,
    checklistItems: [],
    images: [],
  },
  {
    id: "demo5",
    title: "📚 Books to Read",
    content: "",
    color: "dusk",
    pinned: false,
    archived: false,
    trashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminder: null,
    labels: [],
    isChecklist: true,
    checklistItems: [
      { id: "b1", text: "Atomic Habits", checked: true },
      { id: "b2", text: "The Pragmatic Programmer", checked: false },
      { id: "b3", text: "Clean Code", checked: false },
      { id: "b4", text: "Deep Work", checked: true },
    ],
    images: [],
  },
  {
    id: "demo6",
    title: "Recipe: Pasta Carbonara 🍝",
    content:
      "Ingredients:\n- 400g spaghetti\n- 200g guanciale or pancetta\n- 4 egg yolks\n- 100g Pecorino Romano\n- Black pepper\n\nCook pasta al dente. Fry guanciale until crispy. Mix egg yolks with cheese. Combine everything off heat. Season with pepper.",
    color: "peach",
    pinned: false,
    archived: false,
    trashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminder: null,
    labels: [],
    isChecklist: false,
    checklistItems: [],
    images: [],
  },
  {
    id: "demo7",
    title: "Workout Plan 💪",
    content: "",
    color: "coral",
    pinned: false,
    archived: false,
    trashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminder: null,
    labels: [],
    isChecklist: true,
    checklistItems: [
      { id: "w1", text: "Monday: Chest & Triceps", checked: false },
      { id: "w2", text: "Tuesday: Back & Biceps", checked: false },
      { id: "w3", text: "Wednesday: Rest", checked: false },
      { id: "w4", text: "Thursday: Legs", checked: false },
      { id: "w5", text: "Friday: Shoulders & Abs", checked: false },
    ],
    images: [],
  },
  {
    id: "demo8",
    title: "Travel Bucket List ✈️",
    content:
      "Places I want to visit:\n\n🗼 Tokyo, Japan - Cherry blossoms in spring\n🏔️ Swiss Alps - Skiing and hiking\n🏛️ Rome, Italy - Ancient history\n🌴 Bali, Indonesia - Beaches and temples\n🦘 Australia - Great Barrier Reef",
    color: "sage",
    pinned: false,
    archived: false,
    trashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminder: null,
    labels: [],
    isChecklist: false,
    checklistItems: [],
    images: [],
  },
];

export const NotesProvider = ({ children }) => {
  // Load notes from localStorage on initial render, merge with demo notes
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("keep-notes");
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      // Check if demo notes are already included
      const hasDemoNotes = parsed.some((n) => n.id?.startsWith("demo"));
      if (!hasDemoNotes) {
        return [...parsed, ...demoNotes];
      }
      return parsed;
    }
    return demoNotes;
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
