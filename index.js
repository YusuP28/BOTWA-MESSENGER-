const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const app = express();
const PORT = 3000;

const SESSIONS_DIR = './sessions';
const LOGS_DIR = './logs';

// Buat folder jika belum ada
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let currentClient = null;
let clientReady = false;
let currentSessionId = null;
let currentPhoneNumber = null;

// Warna untuk terminal
const colors = {
    reset: '\x1b[0m',
    hijau: '\x1b[32m',
    merah: '\x1b[31m',
    kuning: '\x1b[33m',
    biru: '\x1b[36m',
    putih: '\x1b[37m'
};

function logTerminal(msg, warna = 'putih') {
    console.log(`${colors[warna]}${msg}${colors.reset}`);
}

function addLog(msg, type = 'info') {
    const time = new Date().toLocaleTimeString();
    let warna = 'putih';
    let symbol = '📌';
    if (type === 'success') { warna = 'hijau'; symbol = '✅'; }
    else if (type === 'error') { warna = 'merah'; symbol = '❌'; }
    else if (type === 'warning') { warna = 'kuning'; symbol = '⚠️'; }
    else if (type === 'info') { warna = 'biru'; symbol = '📢'; }
    
    console.log(`${colors[warna]}${symbol} ${msg}${colors.reset}`);
    
    // Simpan log ke file per session
    if (currentPhoneNumber) {
        const sessionLogDir = path.join(LOGS_DIR, currentPhoneNumber);
        if (!fs.existsSync(sessionLogDir)) fs.mkdirSync(sessionLogDir, { recursive: true });
        const today = new Date().toISOString().slice(0, 10);
        const logFile = path.join(sessionLogDir, `${today}.log`);
        fs.appendFileSync(logFile, `[${time}] ${symbol} ${msg}\n`);
    }
}

function formatNumber(num) {
    let clean = num.toString().replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    else if (clean.startsWith('8')) clean = '62' + clean;
    else if (!clean.startsWith('62')) clean = '62' + clean;
    return clean + '@c.us';
}

function getUserInput(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(colors.biru + question + colors.reset, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

function getSessions() {
    if (!fs.existsSync(SESSIONS_DIR)) return [];
    return fs.readdirSync(SESSIONS_DIR).filter(f => {
        const stat = fs.statSync(path.join(SESSIONS_DIR, f));
        return stat.isDirectory() && f.match(/^\d+$/);
    });
}

async function selectOrCreateSession() {
    const sessions = getSessions();
    
    console.log('\n');
    logTerminal('═══════════════════════════════════════════════════════════', 'biru');
    logTerminal('         BOTWA - MULTI SESSION WHATSAPP BOT', 'hijau');
    logTerminal('═══════════════════════════════════════════════════════════', 'biru');
    console.log('\n');
    
    if (sessions.length === 0) {
        logTerminal('📭 Belum ada session. Silakan input nomor baru.', 'kuning');
        return await createNewSession();
    }
    
    if (sessions.length === 1) {
        const sessionId = sessions[0];
        logTerminal(`✅ Terdeteksi 1 session: ${sessionId}`, 'hijau');
        logTerminal('🚀 Langsung menggunakan session ini...', 'info');
        return sessionId;
    }
    
    // Banyak session
    logTerminal('📋 Pilih session yang akan digunakan:', 'biru');
    for (let i = 0; i < sessions.length; i++) {
        console.log(`   ${i + 1}. ${sessions[i]}`);
    }
    console.log(`   ${sessions.length + 1}. Input nomor baru`);
    console.log(`   ${sessions.length + 2}. Hapus session`);
    console.log(`   0. Keluar`);
    
    const choice = await getUserInput(`\nPilih (1-${sessions.length + 2}): `);
    const choiceNum = parseInt(choice);
    
    if (choiceNum === 0) {
        process.exit(0);
    } else if (choiceNum === sessions.length + 1) {
        return await createNewSession();
    } else if (choiceNum === sessions.length + 2) {
        await deleteSession(sessions);
        return await selectOrCreateSession();
    } else if (choiceNum >= 1 && choiceNum <= sessions.length) {
        return sessions[choiceNum - 1];
    } else {
        logTerminal('❌ Pilihan tidak valid!', 'merah');
        return await selectOrCreateSession();
    }
}

async function createNewSession() {
    let phoneNumber = await getUserInput('📱 Masukkan nomor WhatsApp Anda (contoh: 6281234567890): ');
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (phoneNumber.startsWith('0')) phoneNumber = '62' + phoneNumber.slice(1);
    if (!phoneNumber.startsWith('62')) phoneNumber = '62' + phoneNumber;
    
    logTerminal(`\n📱 Membuat session baru untuk nomor: ${phoneNumber}`, 'info');
    return phoneNumber;
}

async function deleteSession(sessions) {
    console.log('\n');
    logTerminal('📋 Pilih session yang akan dihapus:', 'merah');
    for (let i = 0; i < sessions.length; i++) {
        console.log(`   ${i + 1}. ${sessions[i]}`);
    }
    console.log(`   0. Batal`);
    
    const choice = await getUserInput(`\nPilih (1-${sessions.length}): `);
    const choiceNum = parseInt(choice);
    
    if (choiceNum >= 1 && choiceNum <= sessions.length) {
        const sessionToDelete = sessions[choiceNum - 1];
        const sessionPath = path.join(SESSIONS_DIR, sessionToDelete);
        const logPath = path.join(LOGS_DIR, sessionToDelete);
        
        fs.rmSync(sessionPath, { recursive: true, force: true });
        if (fs.existsSync(logPath)) fs.rmSync(logPath, { recursive: true, force: true });
        
        logTerminal(`✅ Session ${sessionToDelete} berhasil dihapus!`, 'success');
    } else {
        logTerminal('❌ Dihapus!', 'info');
    }
}

async function initWhatsApp(sessionId) {
    if (currentClient) {
        try { await currentClient.destroy(); } catch(e) {}
        currentClient = null;
    }
    
    clientReady = false;
    currentSessionId = sessionId;
    currentPhoneNumber = sessionId;
    
    logTerminal(`\n🔐 Menghubungkan ke WhatsApp untuk nomor: ${sessionId}`, 'info');
    logTerminal('⏳ Proses pairing code membutuhkan waktu 30 detik - 3 menit...', 'kuning');
    logTerminal('💡 JANGAN MATIKAN BOT, TUNGGU SAMPAI KODE MUNCUL!\n', 'kuning');
    
    const client = new Client({
        authStrategy: new LocalAuth({ dataPath: path.join(SESSIONS_DIR, sessionId) }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser',
            product: 'chrome'
        },
        pairWithPhoneNumber: {
            phoneNumber: sessionId,
            showNotification: true,
            intervalMs: 180000
        }
    });
    
    client.on('code', (code) => {
        console.log('\n');
        logTerminal('═══════════════════════════════════════════════════════════', 'biru');
        logTerminal(`🔐 PAIRING CODE 8 DIGIT: ${code}`, 'hijau');
        logTerminal('═══════════════════════════════════════════════════════════', 'biru');
        logTerminal('📌 Cara menggunakan:', 'putih');
        logTerminal('   1. Buka WhatsApp di HP', 'putih');
        logTerminal('   2. Settings → Linked Devices → Link a Device', 'putih');
        logTerminal('   3. Pilih "Link with phone number"', 'putih');
        logTerminal('   4. Masukkan kode di atas', 'putih');
        console.log('\n');
        addLog(`Pairing code: ${code}`, 'success');
    });
    
    client.on('ready', () => {
        clientReady = true;
        addLog(`WhatsApp SIAP! Bot berjalan untuk nomor ${sessionId}`, 'success');
        console.log(`\n📊 Dashboard: http://localhost:${PORT}\n`);
    });
    
    client.on('authenticated', () => addLog('Session tersimpan', 'success'));
    client.on('auth_failure', (msg) => addLog(`Auth gagal: ${msg}`, 'error'));
    
    client.initialize();
    return client;
}

// Dashboard HTML
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BotWA - Dashboard</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:linear-gradient(135deg,#075e54,#128c7e);font-family:'Segoe UI',Arial,sans-serif;padding:20px;min-height:100vh}
.container{max-width:750px;margin:0 auto}
.card{background:white;border-radius:24px;padding:28px;margin-bottom:24px;box-shadow:0 20px 40px rgba(0,0,0,0.15)}
h1{color:#075e54;font-size:26px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.status{display:inline-block;padding:6px 16px;border-radius:40px;font-size:13px;font-weight:bold}
.online{background:#25d366;color:white}
.offline{background:#dc3545;color:white}
.checking{background:#ffc107;color:#333}
.form-group{margin-bottom:20px}
label{font-weight:600;display:block;margin-bottom:8px;color:#333}
input,textarea,select{width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:16px;font-size:14px}
input:focus,textarea:focus,select:focus{outline:none;border-color:#25d366}
.row{display:flex;gap:15px;flex-wrap:wrap}
.row .form-group{flex:1}
button{background:#25d366;color:white;border:none;padding:12px 24px;border-radius:40px;font-size:14px;font-weight:bold;cursor:pointer;margin-right:12px;margin-bottom:12px}
button:hover{background:#128c7e}
button.secondary{background:#6c757d}
button.warning{background:#ffc107;color:#333}
.log-area{background:#1a1a1a;color:#0f0;padding:16px;border-radius:16px;font-family:monospace;font-size:12px;height:400px;overflow-y:auto}
.log-entry{margin:8px 0;padding:8px 12px;background:#222;border-left:4px solid #25d366;border-radius:8px}
.log-error{border-left-color:#dc3545;background:#2a1a1a;color:#ff9999}
.log-success{border-left-color:#25d366;background:#1a2a1a;color:#90ff90}
.log-warning{border-left-color:#ffc107;background:#2a2a1a;color:#ffcc66}
.result{margin-top:16px;padding:12px;border-radius:12px;display:none}
.result-success{background:#d4edda;color:#155724;display:block}
.result-error{background:#f8d7da;color:#721c24;display:block}
hr{margin:20px 0;border:none;border-top:1px solid #eee}
small{color:#999}
</style>
</head>
<body>
<div class="container">
<div class="card">
<h1>🤖 BotWA <span id="status" class="status checking">Mengecek...</span></h1>
<p><small>🔐 Session: <span id="sessionId">-</span></small></p>
<div class="form-group">
<label>📞 Nomor Target (pisah dengan koma untuk broadcast)</label>
<input type="text" id="target" placeholder="08123456789, 6281234567890">
<small>Contoh: 08123456789, 085678901234</small>
</div>
<div class="form-group">
<label>💬 Pesan</label>
<textarea id="message" rows="3" placeholder="Ketik pesan di sini..."></textarea>
</div>
<hr>
<h3>⚙️ Pengaturan Kirim Berulang</h3>
<div class="row">
<div class="form-group">
<label>📊 Jumlah Pengiriman</label>
<input type="number" id="jumlah" value="1" min="1" max="100">
<small>Maksimal 100 kali</small>
</div>
<div class="form-group">
<label>⏱️ Interval (detik)</label>
<input type="number" id="interval" value="2" min="1" max="60">
<small>Jeda antar pengiriman</small>
</div>
</div>
<div class="form-group">
<label>🔄 Delay Random</label>
<select id="randomDelay">
<option value="n">Tidak (interval tetap)</option>
<option value="y">Ya (acak 1-interval detik)</option>
</select>
<small>Delay random membantu menghindari spam detection</small>
</div>
<hr>
<div>
<button id="sendBtn">📨 KIRIM SEKALI</button>
<button id="broadcastBtn" class="secondary">📢 BROADCAST</button>
<button id="bulkBtn" class="warning">⏱️ KIRIM BERULANG</button>
</div>
<div id="result" class="result"></div>
</div>
<div class="card">
<h3>📋 Log Pengiriman</h3>
<div class="log-area" id="logArea">
<div class="log-entry">🟢 Dashboard siap</div>
<div class="log-entry">⏳ Menunggu koneksi WhatsApp...</div>
</div>
</div>
</div>
<script>
let isSending = false;

async function checkStatus() {
    try {
        const res = await fetch('/status');
        const data = await res.json();
        const s = document.getElementById('status');
        if (data.status === 'connected') {
            s.className = 'status online';
            s.textContent = 'Online ✅';
        } else {
            s.className = 'status offline';
            s.textContent = 'Offline ❌';
        }
        if (data.sessionId) document.getElementById('sessionId').textContent = data.sessionId;
    } catch(e) {
        document.getElementById('status').className = 'status offline';
        document.getElementById('status').textContent = 'Error ⚠️';
    }
}

async function fetchLogs() {
    try {
        const res = await fetch('/logs');
        const logs = await res.json();
        const logArea = document.getElementById('logArea');
        if (logs.length === 0) {
            logArea.innerHTML = '<div class="log-entry">📭 Belum ada log</div>';
        } else {
            // Log baru muncul di BAWAH (seperti chat WhatsApp)
            const reversedLogs = [...logs].reverse();
            logArea.innerHTML = reversedLogs.map(log => 
                '<div class="log-entry log-' + log.type + '">[' + log.time + '] ' + log.msg + '</div>'
            ).join('');
            // Scroll otomatis ke BAWAH agar log terbaru terlihat
            logArea.scrollTop = logArea.scrollHeight;
        }
    } catch(e) {}
}

function showResult(msg, type) {
    const r = document.getElementById('result');
    r.textContent = msg;
    r.className = 'result result-' + type;
    setTimeout(() => r.className = 'result', 4000);
}

async function sendMessage(mode) {
    if (isSending) {
        showResult('⏳ Masih ada pengiriman! Tunggu selesai.', 'error');
        return;
    }
    
    let target = document.getElementById('target').value.trim();
    let message = document.getElementById('message').value.trim();
    
    if (!target || !message) {
        showResult('❌ Isi nomor target dan pesan!', 'error');
        return;
    }
    
    let jumlah = parseInt(document.getElementById('jumlah').value) || 1;
    let interval = parseInt(document.getElementById('interval').value) || 2;
    let randomDelay = document.getElementById('randomDelay').value === 'y';
    
    if (jumlah > 100) {
        showResult('❌ Maksimal 100 kali pengiriman!', 'error');
        return;
    }
    
    isSending = true;
    
    let btnId = 'sendBtn';
    if (mode === 'broadcast') btnId = 'broadcastBtn';
    if (mode === 'bulk') btnId = 'bulkBtn';
    
    const btn = document.getElementById(btnId);
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Mengirim...';
    btn.disabled = true;
    
    try {
        const res = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target, message, mode, jumlah, interval, randomDelay })
        });
        const data = await res.json();
        if (data.success) {
            showResult(data.message, 'success');
            if (mode !== 'broadcast') document.getElementById('message').value = '';
            fetchLogs();
        } else {
            showResult('❌ ' + data.error, 'error');
        }
    } catch(err) {
        showResult('❌ Error koneksi ke server', 'error');
    } finally {
        isSending = false;
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

document.getElementById('sendBtn').onclick = () => sendMessage('single');
document.getElementById('broadcastBtn').onclick = () => sendMessage('broadcast');
document.getElementById('bulkBtn').onclick = () => sendMessage('bulk');

document.getElementById('target').onblur = function() {
    let nums = this.value.split(',').map(n => {
        let num = n.trim();
        if (num.startsWith('0')) return '62' + num.slice(1);
        if (num.startsWith('8') && !num.startsWith('62')) return '62' + num;
        return num;
    }).join(', ');
    this.value = nums;
};

setInterval(checkStatus, 5000);
setInterval(fetchLogs, 3000);
checkStatus();
fetchLogs();
</script>
</body>
</html>`);
});

app.get('/status', (req, res) => {
    res.json({ status: clientReady ? 'connected' : 'disconnected', sessionId: currentSessionId });
});

app.get('/logs', (req, res) => {
    const logs = global.chatLogs || [];
    res.json(logs);
});

app.post('/send', async (req, res) => {
    const { target, message, mode, jumlah, interval, randomDelay } = req.body;
    
    if (!target || !message) {
        return res.status(400).json({ error: 'Target dan pesan wajib diisi' });
    }
    
    if (!clientReady || !currentClient) {
        return res.status(400).json({ error: 'WhatsApp belum siap. Masukkan pairing code di terminal!' });
    }
    
    try {
        let targets = target.split(',').map(t => t.trim()).filter(t => t);
        
        if (mode === 'single') {
            targets = [targets[0]];
        }
        
        let sendCount = (mode === 'bulk') ? jumlah : 1;
        let successTotal = 0;
        let failTotal = 0;
        
        if (!global.chatLogs) global.chatLogs = [];
        
        for (let i = 1; i <= sendCount; i++) {
            for (const t of targets) {
                try {
                    const formatted = formatNumber(t);
                    await currentClient.sendMessage(formatted, message);
                    successTotal++;
                    const time = new Date().toLocaleTimeString();
                    const logMsg = `📤 [${i}/${sendCount}] Ke ${t}: BERHASIL`;
                    global.chatLogs.unshift({ time, msg: logMsg, type: 'success' });
                    if (global.chatLogs.length > 100) global.chatLogs.pop();
                    addLog(logMsg, 'success');
                } catch (err) {
                    failTotal++;
                    const time = new Date().toLocaleTimeString();
                    const logMsg = `❌ [${i}/${sendCount}] Ke ${t}: GAGAL - ${err.message}`;
                    global.chatLogs.unshift({ time, msg: logMsg, type: 'error' });
                    if (global.chatLogs.length > 100) global.chatLogs.pop();
                    addLog(logMsg, 'error');
                }
            }
            if (i < sendCount) {
                let delay = randomDelay ? Math.floor(Math.random() * interval * 1000) + 1000 : interval * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        let msg = '';
        if (mode === 'single') msg = `✅ Pesan terkirim ke ${targets[0]}`;
        else if (mode === 'broadcast') msg = `✅ Broadcast selesai: ${successTotal} berhasil, ${failTotal} gagal`;
        else msg = `✅ Kirim berulang selesai: ${successTotal} berhasil, ${failTotal} gagal`;
        
        res.json({ success: true, message: msg });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function main() {
    const sessionId = await selectOrCreateSession();
    currentClient = await initWhatsApp(sessionId);
    
    app.listen(PORT, () => {
        console.log(`\n🚀 Server: http://localhost:${PORT}`);
        console.log(`📁 Session: ${SESSIONS_DIR}/${sessionId}`);
        console.log(`📁 Logs: ${LOGS_DIR}/${sessionId}\n`);
    });
    
    process.on('uncaughtException', (err) => {
        addLog(`💥 Error: ${err.message}`, 'error');
        setTimeout(() => process.exit(1), 5000);
    });
}

main();
