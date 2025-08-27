import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Plus, Search, Edit2, Trash2, FileText } from 'lucide-react'
import NoteModal from './NoteModal'

const API_BASE_URL = 'http://localhost:8000'

function NotesApp({ onLogout }) {
  const [notes, setNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  useEffect(() => {
    // Filter notes based on search term
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredNotes(filtered)
  }, [notes, searchTerm])

  const getAuthHeaders = () => {
    const token = Cookies.get('access_token')
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notes/`, getAuthHeaders())
      setNotes(response.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
      if (error.response?.status === 401) {
        onLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = () => {
    setEditingNote(null)
    setShowModal(true)
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setShowModal(true)
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return
    }

    try {
      await axios.delete(`${API_BASE_URL}/notes/${noteId}`, getAuthHeaders())
      setNotes(notes.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note. Please try again.')
    }
  }

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        // Update existing note
        const response = await axios.put(
          `${API_BASE_URL}/notes/${editingNote.id}`,
          noteData,
          getAuthHeaders()
        )
        setNotes(notes.map(note => 
          note.id === editingNote.id ? response.data : note
        ))
      } else {
        // Create new note
        const response = await axios.post(
          `${API_BASE_URL}/notes/`,
          noteData,
          getAuthHeaders()
        )
        setNotes([response.data, ...notes])
      }
      setShowModal(false)
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="notes-app">
      <header className="notes-header">
        <h1 className="notes-title">My Notes</h1>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="notes-container">
        <div className="notes-controls">
          <button className="add-note-button" onClick={handleCreateNote}>
            <Plus size={20} />
            New Note
          </button>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#666'
              }} 
            />
            <input
              type="text"
              placeholder="Search notes..."
              className="search-input"
              style={{ paddingLeft: '45px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileText size={48} />
            </div>
            <h2 className="empty-state-title">
              {notes.length === 0 ? 'No notes yet' : 'No notes found'}
            </h2>
            <p className="empty-state-text">
              {notes.length === 0 
                ? 'Create your first note to get started!' 
                : 'Try adjusting your search terms.'
              }
            </p>
            {notes.length === 0 && (
              <button className="add-note-button" onClick={handleCreateNote}>
                <Plus size={20} />
                Create Your First Note
              </button>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map(note => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <div className="note-actions">
                    <button
                      className="note-action-button edit-button"
                      onClick={() => handleEditNote(note)}
                      title="Edit note"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="note-action-button delete-button"
                      onClick={() => handleDeleteNote(note.id)}
                      title="Delete note"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="note-content">
                  {note.content.length > 200 
                    ? `${note.content.substring(0, 200)}...` 
                    : note.content
                  }
                </div>
                <div className="note-date">
                  {formatDate(note.updated_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NoteModal
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default NotesApp