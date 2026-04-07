# 🤖 BOTWA-MESSENGER

**Bot WhatsApp Multi-Session dengan Pairing Code 8 Digit**  
*Berjalan di Termux Android - Cukup 1 HP!*

## ✨ Fitur Lengkap

- **Login**: Pairing Code 8 digit (tanpa scan QR)
- **Multi Session**: Support banyak nomor WhatsApp dalam 1 instalasi
- **Auto Deteksi**: Jika hanya 1 session, langsung jalan otomatis
- **Manajemen Session**: Lihat daftar session, hapus session
- **Kirim Pesan**: Kirim sekali, Broadcast, Kirim berulang
- **Pengaturan**: Jumlah kirim, interval, delay random
- **Log**: Real-time di dashboard, tersimpan per session
- **Dashboard**: UI modern di browser (http://127.0.0.1:3000)

## 📦 Instalasi di Termux

```bash
git clone https://github.com/YusuP28/BOTWA-MESSENGER.git
cd BOTWA-MESSENGER
npm install express@4.18.2 whatsapp-web.js@latest qrcode-terminal --ignore-scripts
node index.js
cat > package.json << 'EOF'
{
  "name": "botwa-messenger",
  "version": "1.0.0",
  "description": "Bot WhatsApp Multi-Session dengan Pairing Code 8 digit untuk Termux",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "keywords": ["whatsapp", "bot", "termux", "pairing-code", "multi-session"],
  "author": "YusuP28",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "whatsapp-web.js": "^1.25.0",
    "qrcode-terminal": "^0.12.0"
  }
}
