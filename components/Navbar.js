"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        width: "100%",
        background: "#0f1114",
        padding: "18px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #222",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* LOGO */}
      <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
        <h2 style={{ margin: 0 }}>C R Patil & Associates</h2>
      </Link>

      {/* NAV LINKS */}
      <div style={{ display: "flex", gap: 25, alignItems: "center" }}>
        <Link href="/ongoing" className="navLink">Ongoing</Link>
        <Link href="/upcoming" className="navLink">Upcoming</Link>
        <Link href="/completed" className="navLink">Completed</Link>

        {/* DROPDOWN FOR CATEGORIES */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span className="navLink" style={{ cursor: "pointer" }}>
            Categories ▾
          </span>

          {open && (
            <div
              style={{
                position: "absolute",
                top: 28,
                left: 0,
                background: "#1a1d22",
                padding: 12,
                borderRadius: 8,
                width: 180,
                border: "1px solid #333",
              }}
            >
              <Link href="/residence" className="dropItem">Residence</Link>
              <Link href="/hotel" className="dropItem">Hotel</Link>
              <Link href="/school" className="dropItem">School</Link>
              <Link href="/temple" className="dropItem">Temple</Link>
              <Link href="/commercial" className="dropItem">Commercial</Link>
              <Link href="/farmhouse" className="dropItem">Farmhouse</Link>
              <Link href="/office" className="dropItem">Office</Link>
            </div>
          )}
        </div>

        <Link href="/contact" className="navLink">Contact</Link>

        {/* WHATSAPP BUTTON */}
        <a
          href="https://wa.me/919449143297"
          target="_blank"
          style={{
            padding: "8px 16px",
            background: "#1e4fbf",
            borderRadius: 6,
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          WhatsApp
        </a>
      </div>

      <style>{`
        .navLink {
          color: #ddd;
          text-decoration: none;
          font-size: 15px;
          transition: 0.2s;
        }
        .navLink:hover {
          color: #fff;
        }
        .dropItem {
          display: block;
          color: #ccc;
          padding: 6px 0;
          text-decoration: none;
          transition: 0.2s;
        }
        .dropItem:hover {
          color: #fff;
        }
      `}</style>
    </nav>
  );
}
