# Case Closed – Multiplayer Detective Game 🕵️‍♂️🔎

**Case Closed** is a real-time cooperative detective game where players work together to solve a single, fixed case. Built with the **MERN stack** and **WebSockets**, it supports **2–4 players** collaborating in real time—sharing clues, completing role-based minigames, and voting on the culprit.

---

## 🎯 Overview

In **Case Closed**, every player examines the same story and suspects. Each player is assigned a unique **detective role**, unlocking **exclusive clues** by completing their role-specific minigame. Players coordinate via in-game chat to piece together the mystery. Once all clues are collected, the team votes on the culprit:

- **Correct vote** → Team wins  
- **Incorrect vote** → Case fails  

This creates a **highly interactive, asymmetric, cooperative deduction experience**.

---

## 🖼 Screenshots

**Main Menu / Lobby**  
![Main Menu / Lobby](https://github.com/user-attachments/assets/df1d7402-9fbf-443a-aae5-853508c8d7b2)

**Detective Roles Interface**  
![Detective Roles](https://github.com/user-attachments/assets/31311c6b-9f92-4ba5-ba3c-d8fae0f867a9)  
![Detective Roles](https://github.com/user-attachments/assets/86f715fd-9787-49fc-b9ce-7ca31044ba65)

**Example Minigame**  
![Minigame](https://github.com/user-attachments/assets/314eb12e-9d6c-4761-8269-670aa256e35e)

**Team Chat, Clue Discussion & Voting Screen**  
![Chat & Voting](https://github.com/user-attachments/assets/b63ebbbd-146f-489d-98e7-cb9aacaee874)

---

## 🕹 Features

### Real-Time Multiplayer
- WebSocket-powered multiplayer rooms (2–4 players)  
- Synchronized story, clues, roles, and voting  
- Stable shared state across all clients  

### Asymmetric Detective Roles
Each match assigns one of four **unique roles**:  
1. **Interrogator**  
2. **Sketch Artist**  
3. **Technical Analyst**  
4. **Forensic Expert**  

Each role has a **distinct minigame** and provides **exclusive clues**.

### Cooperative Deduction
- Real-time team chat  
- Players share and combine clues  
- The team collectively decides the outcome  

### Voting System
- Players vote on the culprit after all clues are revealed  
- **Correct vote** → Team wins  
- **Incorrect vote** → Team loses  

---

## ⚙️ Tech Stack
- **Frontend:** React  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **Multiplayer:** WebSockets  
- **Architecture:** MERN stack with synchronized room & game-state management  

---

## 🧩 Gameplay Flow

1. Players **join or create a room**.  
2. All players view the **same case intro and suspect info**.  
3. Each player receives a **detective role** with a **role-specific minigame**.  
4. Completing minigames unlocks **exclusive clues**.  
5. Players discuss and combine clues via **in-game chat**.  
6. Team **votes on the culprit**.  
7. Game reveals the **solution**, triggering **win/lose state**.  


