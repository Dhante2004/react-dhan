"use client";

import { useEffect, useState } from "react";

const projects = [
  ["RESPOND", "PWA", "A centralized reporting platform for citizens with GPS-based administration."],
  ["TALKN'TOSS AQUABIN", "Hardware", "A smart bin that identifies plastic bottles using computer vision and YOLOv8."],
  ["LAKBAI", "AI planner", "A smart itinerary app created with Alnedzfar Sanaani and Jericho Kohoyan."],
];

export default function Home() {
  const [formStatus, setFormStatus] = useState("idle");
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);

  async function loadMessages() {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) throw new Error("Unable to load inbox");
      const data = await response.json();
      setMessages(data.messages);
    } catch {
      setMessages([]);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function submitContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setFormStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (!response.ok) throw new Error("Unable to send message");
      form.reset();
      setFormStatus("sent");
      loadMessages();
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <main className={darkMode ? "dark" : "light"}>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="Hazrazee Daing home">HD</a>
        <nav aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#inbox">Inbox</a>
          <button className="theme-toggle" type="button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle color theme">
            {darkMode ? "Light" : "Dark"}
          </button>
        </nav>
      </header>

      <section className="intro" id="top">
        <p className="kicker">BSIT Database Systems Major</p>
        <h1>Hazrazee Sadhan A. Daing</h1>
        <p>4th year Bachelor of Science in Information Technology student and young student leader passionate about learning and building useful technology.</p>
      </section>

      <section className="projects" id="projects">
        <p className="kicker">Selected work</p>
        <h2>Projects</h2>
        <div className="project-list">
          {projects.map(([title, category, description], index) => (
            <article className="project" key={title}>
              <span className="project-number">0{index + 1}</span>
              <div>
                <p className="project-category">{category}</p>
                <h3>{title}</h3>
                <p className="project-description">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <p className="kicker">About</p>
        <div>
          <h2>A young student leader who enjoys learning by building.</h2>
          <p>Hazrazee is interested in civic technology, sustainability, computer vision, databases, and AI-assisted travel planning.</p>
        </div>
      </section>

      <section className="contact" id="contact">
        <div><p className="kicker">Get in touch</p><h2>Have an idea?</h2><p>Send a message about a project, collaboration, or opportunity.</p></div>
        <form onSubmit={submitContact}>
          <label>Name<input name="name" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Message<textarea name="message" rows="4" required /></label>
          <button className="send-button" type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? "Sending..." : "Send message"}</button>
          {formStatus === "sent" && <p className="form-status">Message sent. Thank you.</p>}
          {formStatus === "error" && <p className="form-status">Could not send the message. Please try again.</p>}
        </form>
      </section>

      <section className="inbox" id="inbox">
        <div className="inbox-heading">
          <div><p className="kicker">Messages</p><h2>Inbox</h2></div>
          <button className="refresh-button" type="button" onClick={loadMessages}>Refresh</button>
        </div>
        {messages.length === 0 ? <p className="empty-inbox">No messages yet.</p> : (
          <div className="message-list">
            {messages.map((message) => (
              <article className="message" key={message.id}>
                <div><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a></div>
                <p>{message.message}</p>
                <time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString()}</time>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer><span>© 2026 Hazrazee Sadhan A. Daing</span><span>BSIT Database Systems Major</span></footer>
    </main>
  );
}
