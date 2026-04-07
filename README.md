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
cd ~/BOTWA-MESSENGER- && node index.js
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
📨 PENJELASAN 3 MODE PENGIRIMAN PESAN

---

1️⃣ KIRIM SEKALI

Keterangan Detail
Fungsi Mengirim 1 pesan ke 1 nomor
Contoh Anda ingin mengirim "Halo" ke Aji
Cara pakai Isi 1 nomor → tulis pesan → klik KIRIM SEKALI

Contoh:

```
Nomor: 08123456789
Pesan: Halo Aji, ada rapat jam 10
Hasil: ✅ Pesan terkirim ke 08123456789 (1x)
```

---

2️⃣ BROADCAST

Keterangan Detail
Fungsi Mengirim 1 pesan ke BANYAK nomor sekaligus
Contoh Anda ingin mengirim "Selamat pagi" ke 5 teman sekaligus
Cara pakai Isi nomor dipisah koma → tulis pesan → klik BROADCAST

Contoh:

```
Nomor: 08123456789, 08123456788, 08123456787
Pesan: Selamat pagi, jangan lupa sarapan!
Hasil: 
  ✅ Terkirim ke 08123456789
  ✅ Terkirim ke 08123456788
  ✅ Terkirim ke 08123456787
```

---

3️⃣ KIRIM BERULANG

Keterangan Detail
Fungsi Mengirim pesan BERULANG KALI ke 1 nomor
Contoh Anda ingin mengirim "Ingat janji" 5x dengan jeda 2 detik
Cara pakai Isi 1 nomor → tulis pesan → atur JUMLAH & INTERVAL → klik KIRIM BERULANG

Contoh:

```
Nomor: 08123456789
Pesan: Jangan lupa janji jam 3 sore!
Jumlah: 5
Interval: 3 detik

Hasil:
  [1/5] ✅ Terkirim (detik ke 0)
  [2/5] ✅ Terkirim (detik ke 3)
  [3/5] ✅ Terkirim (detik ke 6)
  [4/5] ✅ Terkirim (detik ke 9)
  [5/5] ✅ Terkirim (detik ke 12)
```

---


🎯 KAPAN PAKAI YANG MANA?

Situasi Mode yang Tepat
Chat personal dengan 1 orang Kirim Sekali
Info ke banyak anggota grup Broadcast
Mengingatkan seseorang berkali-kali Kirim Berulang
Promosi ke banyak nomor Broadcast
Test koneksi bot Kirim Sekali

---

📋 CONTOH KASUS

Kasus 1: Mau ngajak teman makan siang

```
Mode: Kirim Sekali
Nomor: 08123456789
Pesan: "Makan siang yuk di warteg!"
```

Kasus 2: Mau info ke semua anggota grup

```
Mode: Broadcast
Nomor: 08123456789, 08123456788, 08123456787, 08123456786
Pesan: "Rapat dimajukan jadi jam 9 pagi"
```

Kasus 3: Mau diingatkan setiap 5 menit

```
Mode: Kirim Berulang
Nomor: 08123456789
Pesan: "Jangan lupa minum obat"
Jumlah: 10
Interval: 300 (5 menit)
```

---

JELAS? SUDAH PAHAM PERBEDAAN KETIGANYA? 🚀
