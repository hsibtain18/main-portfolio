'use client'
import React from 'react'

const ResumeDownload = () => {
  return (
     <>
           <div className="container">
        <h1>Hi, I&apos;m Syed Hassan Sibtain</h1>
        <p>
          This site is currently under construction, but I’m excited to share it
          soon.
        </p>
        <p>
          In the meantime, you can download my CV to learn more about me and my
          work experience.
        </p>

        <a
          className="download-btn"
          href="/Syed_Hassan_Sibtain.pdf"
          download='Syed Hassan Sibtain.pdf'
        >
          Download My CV
        </a>
      </div>

      <style jsx>{`
        body {
          --bg-color: #ffffff;
          --text-color: #222222;
          --button-bg: #222;
          --button-text: #fff;
        }

        .container {
          min-height: 100vh;
          background-color: var(--bg-color);
          color: var(--text-color);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          text-align: center;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.125rem;
          max-width: 600px;
          margin: 0.5rem 0;
        }

        .download-btn {
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          background-color: var(--button-bg);
          color: var(--button-text);
          border: none;
          border-radius: 5px;
          text-decoration: none;
          transition: background 0.3s ease;
          border:1px solid #fff
        }

        .download-btn:hover {
          opacity: 0.85;
        }

        .toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          color: var(--text-color);
          border: 2px solid var(--text-color);
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          h1 {
            font-size: 2rem;
          }

          .download-btn {
            width: 100%;
            font-size: 1rem;
          }

          .toggle {
            top: 0.5rem;
            right: 0.5rem;
          }
        }
      `}</style>
     </>
  )
}

export default ResumeDownload