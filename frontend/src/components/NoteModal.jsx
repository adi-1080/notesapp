import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

function NoteModal({ note, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content
      })
    }
  }, [note])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Please enter a title for your note')
      return
    }

    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Enter note title..."
              value={formData.title}
              onChange={handleInputChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              className="form-input modal-textarea"
              placeholder="Write your note here..."
              value={formData.content}
              onChange={handleInputChange}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-button cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteModal