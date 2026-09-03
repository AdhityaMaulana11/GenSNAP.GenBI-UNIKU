# 📸 GenSNAP by GenBI UNIKU

> **Klik Momennya, Abadikan Ceritanya.**  
> *Official Web-Based Photobooth Application for Generasi Baru Indonesia (GenBI) Komisariat Universitas Kuningan — Champions Explorer Edition.*

![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 🌟 Tentan GenSNAP

**GenSNAP** adalah aplikasi photobooth web modern berbasis **Next.js (App Router)** dan **HTML5 Canvas API** yang dirancang untuk memberikan pengalaman fotografi interaktif, cepat, dan berkesan. 

Aplikasi ini disesuaikan khusus untuk mendukung kegiatan **Champions Explorer** dengan tema:
> **“Explore the World of Central Banking: Buka Wawasan, Jelajahi Tantangan, Temukan Pengetahuan”**

---

## ✨ Fitur Utama

### 1. 📸 Standard Photo Booth Mode
- **Multi-Shot Sequence**: Pengambilan foto beruntun otomatis dengan countdown timer (3s, 5s, 10s).
- **Interactive Strip Preview**: Pratinjau *real-time* posisi foto pada template frame (responsif di mobile & desktop).
- **Single Photo Retake**: Pengguna dapat mengulangi foto pada slot tertentu tanpa mengulang dari awal.
- **Kamera Controls**: Dukungan *camera flip* (depan/belakang) dan *screen flash effect*.

### 2. ✨ Apple-Style Live Photo Mode
- **Framed Motion Clips**: Mengabadikan video motion (1.8s) + snapshot foto beresolusi tinggi untuk setiap slot frame.
- **Interactive Motion Playback**: Putar video motion per-slot atau klik *"Putar Semua Live Motion"* sekaligus di halaman hasil.
- **Auto Video Mirroring**: Penyesuaian *mirroring* otomatis untuk kamera depan pada rekaman video motion.

### 3. 🎥 Video Booth Mode
- **HD Video Recording**: Perekaman video langsung hingga 15 detik dengan indikator timer animasi.
- **Instant Playback & Download**: Pratinjau langsung rekaman video dengan opsi unduh format MP4.

### 4. 🎨 Canvas Rendering & Multi-Format Export
- **Client-Side Canvas Composition**: Penggabungan foto dan artwork frame PNG secara *lossless* tanpa *server overload*.
- **Multi-Format Export**: Unduh hasil akhir dalam format **PNG**, **JPG (Background Solid)**, atau **MP4 Video Clips**.
- **Web Share Integration**: Bagikan hasil photostrip langsung ke media sosial melalui native Web Share API.

### 5. 📱 Neo-Brutalist Responsive UI Design
- Desain visual retro-modern berkarakter (*bold border*, *hard shadow*, *curated color palette*).
- Responsif di seluruh ukuran layar (Smartphone, Tablet, Desktop).

---

## 🛠️ Teknologi & Tools

- **Core Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **UI & Logic**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan Neo-Brutalist Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Graphics & Composition**: Native HTML5 Canvas 2D API
- **Media Recording**: HTML5 `MediaRecorder` API & WebRTC `getUserMedia`

---

## 🚀 Cara Menjalankan Project

### Prasyarat
- Node.js versi 18.x atau yang lebih baru
- npm / yarn / pnpm

### Langkah Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/gensnap-by-genbi-uniku.git
   cd gensnap-by-genbi-uniku
   ```

2. **Install Dependensi**
   ```bash
   npm install
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

4. **Buka Browser**  
   Akses `http://localhost:3000` pada browser Anda.

---

## 📂 Struktur Direktori Project

```text
gensnap-by-genbi-uniku/
├── app/                        # Next.js App Router Pages
│   ├── booth/                  # Standard Photo Booth & Live Photo pages
│   │   ├── live/               # Live Photo booth stage (capture, preview, result)
│   │   ├── permission/         # Camera permission request page
│   │   └── video/              # Video booth page
│   ├── frames/                 # Frame selection gallery page
│   ├── mode/                   # Mode selection page (Photo, Live, Video)
│   ├── preview/                # Photo preview & single retake page
│   ├── result/                 # Final photostrip result & export page
│   ├── layout.tsx              # Root layout & Metadata
│   └── page.tsx                # Landing Page (Champions Explorer Edition)
├── components/                 # Reusable UI Components
│   ├── camera/                 # Camera controls, viewfinder, countdown, strip preview
│   ├── frames/                 # Frame card components
│   ├── layout/                 # Sticky Header, Booth Header & Footer
│   ├── live-photo/             # Live photo result page component
│   └── ui/                     # Reusable buttons, error states, doodles
├── lib/                        # Utility & Core Logic
│   ├── camera/                 # Camera manager & photo capture helper
│   ├── canvas/                 # Canvas renderer (photostrip composer)
│   ├── export/                 # Download (PNG/JPG) & share manager
│   ├── frames/                 # Built-in frame definitions
│   ├── media/                  # MediaRecorder manager
│   └── session/                # Photobooth session context & state
├── public/                     # Static Assets & Logos (GenBI, Champions Explorer, Frames)
├── types/                      # TypeScript type definitions
└── package.json
```

---

## 🏢 GenBI Komisariat Universitas Kuningan

- **Sekretariat**: Ciporang, Universitas Kuningan
- **Email**: [genbi.komisuniku@gmail.com](mailto:genbi.komisuniku@gmail.com)
- **Instagram**: [@genbi_uniku](https://instagram.com/genbi_uniku)

---

## 🎨 Developed By

Brought to you with ❤️ by **[Undergrowth.studio](https://undergrowth.studio)**  
*© 2026 GenSNAP • GenBI UNIKU. All rights reserved.*
