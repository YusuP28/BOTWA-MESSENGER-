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

📘 PANDUAN INSTALASI LENGKAP BOTWA-MESSENGER

Untuk Ditambahkan di GitHub (README.md)

---

```markdown
# 📥 PANDUAN INSTALASI BOTWA-MESSENGER

## Persyaratan Awal

| No | Persyaratan | Keterangan |
|----|-------------|------------|
| 1 | **HP Android** | Minimal Android 10 ke atas |
| 2 | **RAM** | Minimal 2GB (4GB direkomendasikan) |
| 3 | **Storage** | Minimal 500MB free space |
| 4 | **Internet** | Koneksi stabil untuk pairing & kirim pesan |

---

## 🛠️ LANGKAH 1: INSTALL TERMUX

### A. Download Termux dari F-Droid

> ⚠️ **PENTING:** Jangan download Termux dari Google Play (versi usang)

1. Buka browser HP
2. Kunjungi: `https://f-droid.org/repo/com.termux_118.apk`
3. Download dan install APK tersebut
4. Buka aplikasi **Termux**

### B. Install Termux:X11 (Untuk Tampilan Dashboard)

1. Kunjungi: `https://github.com/termux/termux-x11/releases`
2. Download file: `app-arm64-v8a-debug.apk`
3. Install APK tersebut

---

## 📦 LANGKAH 2: INSTALL PAKET DI TERMUX

**Buka Termux, lalu copy paste perintah ini satu per satu:**

```bash
# Update sistem
pkg update && pkg upgrade -y

# Install Node.js (wajib)
pkg install nodejs -y

# Install Chromium (browser engine untuk bot)
pkg install chromium -y

# Install Git (untuk clone repository)
pkg install git -y
```

⏳ Proses ini memakan waktu 5-10 menit tergantung koneksi internet.

---

📁 LANGKAH 3: CLONE REPOSITORY

```bash
# Clone repository
git clone https://github.com/YusuP28/BOTWA-MESSENGER-.git

# Masuk ke folder
cd BOTWA-MESSENGER-

# Buat folder pendukung
mkdir -p sessions logs
```

---

📦 LANGKAH 4: INSTALL DEPENDENSI

```bash
npm install express@4.18.2 whatsapp-web.js@latest qrcode-terminal --ignore-scripts
```

⏳ Proses ini memakan waktu 3-5 menit.

---

🚀 LANGKAH 5: JALANKAN BOT

```bash
node index.js
```

---

⏳ LANGKAH 6: TUNGGU PAIRING CODE

⚠️ PERINGATAN PENTING!

Pairing code membutuhkan waktu 30 detik - 3 menit untuk muncul!

· JANGAN matikan bot
· JANGAN tekan tombol apapun
· TUNGGU sampai muncul kode 8 digit

Akan muncul di Termux:

```
═══════════════════════════════════════════════════════════
🔐 PAIRING CODE 8 DIGIT: 12345678
═══════════════════════════════════════════════════════════
```

---

🔐 LANGKAH 7: PAIRING DI WHATSAPP

Langkah Keterangan
1 Buka WhatsApp di HP
2 Tap Settings (titik tiga di pojok kanan atas)
3 Pilih Linked Devices
4 Tap Link a Device
5 Pilih Link with phone number
6 Masukkan kode 8 digit dari Termux
7 Tunggu hingga terhubung

---

🌐 LANGKAH 8: BUKA DASHBOARD

Opsi 1: Dari Termux:X11 (Jika terinstall)

1. Buka aplikasi Termux:X11
2. Buka Chromium (browser)
3. Ketik di address bar: http://127.0.0.1:3000

Opsi 2: Dari Chrome HP

1. Buka Chrome di HP
2. Ketik di address bar: http://127.0.0.1:3000

---

✅ LANGKAH 9: STATUS BERHASIL

Indikator Status
Di Termux ✅ WhatsApp SIAP! Bot berjalan
Di Dashboard Status berubah menjadi Online ✅

---

📨 LANGKAH 10: KIRIM PESAN

Langkah Keterangan
1 Isi nomor target (contoh: 08123456789)
2 Isi pesan
3 Atur jumlah & interval (jika perlu)
4 Klik tombol:
- KIRIM SEKALI → ke 1 nomor
- BROADCAST → ke banyak nomor
- KIRIM BERULANG → dengan jumlah & interval

---
