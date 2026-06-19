import '../styles/PostCard.css'

export default function PostCard({ post }) {
  const { profile, desc, exp, techs } = post

  return (
    <article className="post-card">
      <div className="post-card-header">
        <h3 className="post-card-title">{profile}</h3>
        <span className="exp-badge">{exp} {exp === 1 ? 'yr' : 'yrs'} exp</span>
      </div>
      <p className="post-card-desc">{desc}</p>
      {techs && techs.length > 0 && (
        <div className="tech-tags">
          {techs.map((tech, i) => (
            <span key={i} className="tech-tag">{tech}</span>
          ))}
        </div>
      )}
    </article>
  )
}
