# 🏚️ Haunted House (React + Three.js)

This project is a **React + TypeScript** app powered by **Three.js**.  
It renders an interactive 3D haunted house scene with:  
- Detailed PBR materials (color, normal, roughness, metalness, AO, displacement, alpha)  
- Animated “ghost” lights orbiting around the house  
- Procedural sky and fog for atmosphere  
- Shadows and real-time lighting  

---

## 🚀 Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)  
- [Three.js](https://threejs.org/)  
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)  
- [lil-gui](https://github.com/georgealways/lil-gui) for debug UI  
- [Sky shader](https://threejs.org/examples/?q=sky#objects/Sky)  

---

## 📂 Project Structure

```
src/
  components/
    Floor.ts        # Creates the floor (PBR textures + displacement + alpha fade)
    House.ts        # Group containing walls, roof, and door
    Bushes.ts       # Bushes with textures
    Graves.ts       # Group of randomly placed graves
  App.tsx           # Main scene, renderer, lights, and animations
  App.css
```

---

## ⚙️ Getting Started

### 1. Install dependencies
```bash
npm install
# or
yarn install
```

### 2. Run development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 3. Build for production
```bash
npm run build
npm run preview
```

---

## 🎮 Scene Controls

- **Left mouse drag** → orbit camera  
- **Scroll** → zoom in/out  
- **Right mouse drag** → pan  

---

## 🌍 Visual Features

- **PBR Textures**: applied to floor, walls, door, roof, bushes, and graves.  
- **AlphaMap** on the floor for smooth fading edges.  
- **DisplacementMap** on the floor and door to add real geometry detail.  
- **Sky shader** simulating realistic atmosphere.  
- **Fog** for atmospheric depth.  
- **Soft shadows** with `PCFSoftShadowMap`.  

---

## 💡 Lights

- `AmbientLight` → soft global illumination.  
- `DirectionalLight` → simulates moon/sunlight.  
- `PointLight` → warm light at the door.  
- Three orbiting **“ghosts”** (`PointLights` with colors) animate around the house.  

---

## 📸 Screenshots

*(Add scene screenshots here)*

---

## 📜 License

Free to use for learning and experimentation with **Three.js**.  
Textures should comply with the licenses of their original sources (e.g., [Polyhaven](https://polyhaven.com/)).

---

## ✨ Credits

Based on **Three.js Journey** lessons and expanded into a React + TypeScript project.