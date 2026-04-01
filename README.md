# Debts 

A frictionless debt tracker with WhatsApp reminders. Record who owes you and how much in under 3 seconds.

## Features

- Natural text input — just type "john 20k pizza"
- Clean debt list with person, amount and note
- One-tap WhatsApp reminder
- Works on iOS and Android

## From scratch setup (nothing installed)

### 1. Install Node.js

Download and install **nvm-windows** from:
https://github.com/coreybutler/nvm-windows/releases → `nvm-setup.exe`

Open a new terminal and run:
```bash
nvm install lts
nvm use lts
node -v
npm -v
```

### 2. Install Git

Download from:
https://git-scm.com/download/win

Leave all options as default during installation. Close and reopen your terminal after.

### 3. Install VS Code (recommended)
https://code.visualstudio.com

### 4. Clone the repo
```bash
git clone https://github.com/TU_USUARIO/debts.git
cd debts
```

### 5. Install dependencies
```bash
npm install
npx expo install react-native-screens react-native-safe-area-context
```

### 6. Install Expo Go on your phone

Android: https://play.google.com/store/apps/details?id=host.exp.exponent
iOS: https://apps.apple.com/app/expo-go/id982107779

### 7. Run the app
```bash
npx expo start --tunnel
```

Scan the QR code with Expo Go. The app will load on your phone.

> **Note:** Your phone and PC don't need to be on the same network when using `--tunnel`.

## Troubleshooting

**PowerShell blocks scripts:**
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**App not loading on phone:**
```bash
npx expo start --tunnel
```

**Expo CLI warning about Node version:** Safe to ignore.

## Stack

- React Native + Expo
- Firebase *(coming soon)*
- Claude API for smart parsing *(coming soon)*

## Roadmap

- [ ] Firebase persistence
- [ ] Auth (Google login)
- [ ] AI-powered text parsing
- [ ] Mark as paid with animation
- [ ] Debt history