import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";
import ProjectCard from "../components/ProjectCard";

// -------------------------------
// 14 ONGOING PROJECTS (sample entries)
// Replace images when website admin is ready
// -------------------------------

const ongoing = [
  {
    id: 1,
    name: "Temple Project – Phase 1",
    location: "Belagavi",
    images: ["/images/CR PATIL DR TEKKALAKI FIRST FLOOR RENDER BATCH 1 V4.jpg"],
    scope: "Institutional",
  },
  {
    id: 2,
    name: "Premium Residence – Plot 417",
    location: "Belagavi",
    images: ["/images/IMG_4157.jpg"],
    scope: "Turnkey Construction",
  },
  {
    id: 3,
    name: "Modern Duplex Villa",
    location: "Hubli",
    images: ["/images/1001.jpg"],
    scope: "Structural + Architectural",
  },
  {
    id: 4,
    name: "Commercial Complex – Block A",
    location: "Chandargi",
    images: ["/images/1000.jpg"],
    scope: "Commercial Structure",
  },
  {
    id: 5,
    name: "Residence Elevation Upgrade",
    location: "Belagavi",
    images: ["/images/PHOTO-2025-08-05-12-55-50 (2).jpg"],
    scope: "Elevation + Interiors",
  },
  {
    id: 6,
    name: "Interior Works – Apartment 202",
    location: "Hubballi",
    images: ["/images/PHOTO-2025-08-05-12-55-50 (1).jpg"],
    scope: "Interior Execution",
  },
  {
    id: 7,
    name: "Institutional Building – Block B",
    location: "Kustagi",
    images: ["/images/CBSC SCHOOL [6875]_2024-04-10.jpg"],
    scope: "Institutional",
  },
  {
    id: 8
