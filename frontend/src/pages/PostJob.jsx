import { useState } from 'react'
import { createPost } from '../api/client'
import '../styles/PostJob.css'

const EMPTY_FORM = { profile: '', desc: '', exp: '', techInput: '', techs: [] }

export default function PostJob() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleTechKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTech()
    }
  }

  function addTech() {
    const tech = form.techInput.trim().replace(/,$/, '')
    if (!tech || form.techs.includes(tech)) {
      setForm((f) => ({ ...f, techInput: '' }))
      return
    }
    setForm((f) => ({ ...f, techs: [...f.techs, tech], techInput: '' }))
  }

  function removeTech(tech) {
    setForm((f) => ({ ...f, techs: f.techs.filter((t) => t !== tech) }))
  }

  function isValid() {
    return form.profile.trim() && form.desc.trim() && form.exp !== '' && Number(form.exp) >= 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid()) return

    const pendingTech = form.techInput.trim()
    const techs = pendingTech && !form.techs.includes(pendingTech)
      ? [...form.techs, pendingTech]
      : [...form.techs]

    const payload = {
      profile: form.profile.trim(),
      desc: form.desc.trim(),
      exp: Number(form.exp),
      techs,
    }

    setSubmitting(true)
    setStatus(null)
    try {
      await createPost(payload)
      setStatus('success')
      setForm(EMPTY_FORM)
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="post-page">
      <div className="post-form-card">
        <h1 className="post-form-title">Post a Job</h1>
        <p className="post-form-subtitle">Fill in the details below to list a new position.</p>

        {status === 'success' && (
          <div className="alert alert-success">
            Job posted successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="alert alert-error">
            Something went wrong. Please try again.
          </div>
        )}

        <form className="post-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="profile">Job Title / Role</label>
            <input
              id="profile"
              name="profile"
              type="text"
              className="form-input"
              placeholder="e.g. Backend Developer"
              value={form.profile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="desc">Job Description</label>
            <textarea
              id="desc"
              name="desc"
              className="form-textarea"
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={5}
              value={form.desc}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp">Years of Experience Required</label>
            <input
              id="exp"
              name="exp"
              type="number"
              className="form-input form-input-short"
              placeholder="e.g. 3"
              min="0"
              max="30"
              value={form.exp}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="techInput">
              Required Technologies
              <span className="form-hint">Press Enter or comma to add</span>
            </label>
            {form.techs.length > 0 && (
              <div className="tech-tag-list">
                {form.techs.map((tech) => (
                  <span key={tech} className="tech-tag editable">
                    {tech}
                    <button
                      type="button"
                      className="tech-tag-remove"
                      onClick={() => removeTech(tech)}
                      aria-label={`Remove ${tech}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              id="techInput"
              name="techInput"
              type="text"
              className="form-input"
              placeholder="e.g. Java, Spring Boot, MongoDB"
              value={form.techInput}
              onChange={handleChange}
              onKeyDown={handleTechKeyDown}
              onBlur={addTech}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={submitting || !isValid()}
          >
            {submitting ? 'Posting…' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  )
}
