const http = require('http');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server || WebSocket.WebSocketServer;

const PORT = process.env.PORT || 4000;
const MAX_CLIENTS = 1000;
const MAX_QUEUE_SIZE = 200;

// ==============================================================
// 1. RENDER HTTP HEALTH CHECK & DOŞ / RAM KORUMASI: maxPayload 16 KB
// ==============================================================
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Fisilti WS Active');
});

const wss = new WebSocketServer({
  server,
  maxPayload: 16 * 1024 // 16 KB max WebSocket paket boyutu
});

server.listen(PORT, () => {
  console.log(`🚀 Fısıltı Mahkeme Salonu WebSocket Sunucusu ws://localhost:${PORT} üzerinde çalışıyor...`);
});

wss.on('error', (err) => {
  console.error('WebSocket Server Hatası:', err);
});

// ==============================================================
// 2. SUNUCU TARAFLI SABİT CEZA SÜRELERİ & SOĞUMA SÜRELERİ (COOLDOWNS)
// ==============================================================
const PENALTY_DURATIONS = {
  mute: 7,    // 7 saniye klavye kilidi
  eh: 15,     // 15 saniye Evet/Hayır kıskacı
  timer5: 5   // 5 saniye tereddüt baskısı
};

const PENALTY_COOLDOWNS = {
  mute: 25 * 1000,   // 25 saniye cooldown
  eh: 20 * 1000,     // 20 saniye cooldown
  timer5: 15 * 1000  // 15 saniye cooldown
};

const PENALTY_DEFAULT_MESSAGES = {
  mute: '🔨 [1. HAKİM TOKMAĞI VURDU! Şüpheli 7 saniye susturuldu.]',
  eh: '⚖️ [HAKİM TEK KELİME KISKACI UYGULADI! Şüpheli sadece Evet veya Hayır diyebilir.]',
  timer5: '⏱️ [5 SANİYE BASKISI UYGULANDI! Şüpheli hemen cevap vermelidir.]'
};

// ==============================================================
// 3. SUNUCU TARAFLI ANTI-DOXXING, XSS VE METİN TEMİZLİĞİ
// Boşluklu/tireli telefon numaraları ve HTML etiket temizliği
// ==============================================================
const PHONE_AND_LONG_NUMBERS_REGEX = /(?:\+?\d[\s.-]*){7,}/g;
const SOCIAL_HANDLE_REGEX = /@[a-zA-Z0-9_.]+/g;
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(com|net|org|tr|xyz|io|co|me|online|app)[^\s]*)/gi;

function sanitizeFilter(rawText, maxLen = 200) {
  if (typeof rawText !== 'string') return '';
  let sanitized = rawText.trim().slice(0, maxLen);
  if (!sanitized) return '';

  // 1. HTML etiketlerini ve tekil <, > karakterlerini doğrudan temizle (React JSX uyumlu, entity karmaşası yok)
  sanitized = sanitized.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');

  // 2. Web linklerini maskele
  sanitized = sanitized.replace(URL_REGEX, '***');

  // 3. Sosyal medya kullanıcı adlarını maskele
  sanitized = sanitized.replace(SOCIAL_HANDLE_REGEX, '***');

  // 4. Telefon ve 7+ basamaklı sayıları maskele (boşluklu, noktalı, tireli dahil)
  sanitized = sanitized.replace(PHONE_AND_LONG_NUMBERS_REGEX, '***');

  return sanitized.trim();
}

// FIFO Kuyruklar (Saf RAM)
const suspectQueue = []; // [{ ws, id, confession, category }]
const judgeQueue = [];   // [{ ws, id }]
const rooms = new Map(); // roomId -> Room Object
const roomCleanupTimers = new Map(); // roomId -> Timeout ID

function send(ws, data) {
  if (ws && ws.readyState === 1) { // 1 = OPEN
    try {
      ws.send(JSON.stringify(data));
    } catch (e) {
      // ignore send error
    }
  }
}

// ==============================================================
// 4. BELLEK TEMİZLİĞİ (GARBAGE COLLECTION - 60 SANİYE KURALI)
// ==============================================================
function scheduleRoomCleanup(roomId) {
  if (roomCleanupTimers.has(roomId)) return; // Zaten planlanmış

  const timer = setTimeout(() => {
    roomCleanupTimers.delete(roomId);
    const room = rooms.get(roomId);
    if (room) {
      if (room.timer) clearInterval(room.timer);
      rooms.delete(roomId);
      console.log(`🧹 [GC] Oda #${roomId} bellekten (RAM) tamamen temizlendi.`);
    }
  }, 60000); // 60 saniye

  roomCleanupTimers.set(roomId, timer);
}

function broadcastQueueStatus() {
  const payload = {
    type: 'QUEUE_STATUS',
    suspects: Math.min(1, suspectQueue.length),
    judges: Math.min(2, judgeQueue.length),
    totalSuspects: suspectQueue.length,
    totalJudges: judgeQueue.length
  };
  suspectQueue.forEach(item => send(item.ws, payload));
  judgeQueue.forEach(item => send(item.ws, payload));
}

function removeFromQueues(ws) {
  const sIdx = suspectQueue.findIndex(i => i.ws === ws);
  if (sIdx !== -1) suspectQueue.splice(sIdx, 1);
  const jIdx = judgeQueue.findIndex(i => i.ws === ws);
  if (jIdx !== -1) judgeQueue.splice(jIdx, 1);
  broadcastQueueStatus();
}

// ==============================================================
// 5. GİZLİ FISILTI SIZINTISINI KAPATMA (DATA LEAK PREVENTION)
// ==============================================================
function broadcastRoom(room) {
  const isEnded = room.status === 'ended';

  // Hakimler: Tüm fısıltı içeriğini eksiksiz görür
  const judgeState = {
    type: 'ROOM_UPDATE',
    room: {
      roomId: room.roomId,
      confession: room.confession,
      category: room.category,
      timeLeft: room.timeLeft,
      status: room.status,
      verdict: room.verdict,
      messages: room.messages,
      whispers: room.whispers,
      whisperCount: room.whispers.length,
      isWhispering: room.isWhispering,
      activePenalty: room.activePenalty
    }
  };

  // Şüpheli: Oyun sırasında whispers: [] (boş dizi), sadece whisperCount alır!
  // Sadece oyun bittiğinde (room.status === 'ended') fısıltı içeriklerini okuyabilir.
  const suspectState = {
    type: 'ROOM_UPDATE',
    room: {
      roomId: room.roomId,
      confession: room.confession,
      category: room.category,
      timeLeft: room.timeLeft,
      status: room.status,
      verdict: room.verdict,
      messages: room.messages,
      whispers: isEnded ? room.whispers : [],
      whisperCount: room.whispers.length,
      isWhispering: room.isWhispering,
      activePenalty: room.activePenalty
    }
  };

  if (room.clients.supheli) {
    send(room.clients.supheli, suspectState);
  }

  const judgeClients = [
    room.clients.sert_hakim || room.clients.savci,
    room.clients.yumusak_hakim || room.clients.dedektif
  ].filter(Boolean);

  judgeClients.forEach(clientWs => {
    send(clientWs, judgeState);
  });
}

function broadcastToRoom(room, payload) {
  const clientList = [
    room.clients.supheli,
    room.clients.sert_hakim || room.clients.savci,
    room.clients.yumusak_hakim || room.clients.dedektif
  ].filter(Boolean);

  clientList.forEach(clientWs => {
    send(clientWs, payload);
  });
}

function tryMatchmaking() {
  while (suspectQueue.length >= 1 && judgeQueue.length >= 2) {
    const suspect = suspectQueue.shift();
    const sertHakim = judgeQueue.shift();
    const yumusakHakim = judgeQueue.shift();

    const roomId = Math.floor(100 + Math.random() * 900).toString();
    const room = {
      roomId,
      confession: suspect.confession || 'İş yerinde terfi almak için arkadaşımın projesini kendim yaptım dedim.',
      category: suspect.category || 'İş & Para',
      timeLeft: 180,
      status: 'active',
      verdict: null,
      messages: [
        {
          id: 'sys_start_' + Date.now(),
          sender: 'system',
          text: `🚨 ANONİM SORGU SALONU #${roomId} AÇILDI. Süre 180 saniye. 1 Şüpheli ve 2 Hakim salona girdi.`,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'conf_' + Date.now(),
          sender: 'supheli',
          text: `📂 GİZLİ İTİRAF DOSYASI: "${suspect.confession || 'İş yerinde terfi almak için arkadaşımın projesini kendim yaptım dedim.'}"`,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }
      ],
      whispers: [],
      isWhispering: false,
      activePenalty: null,
      penaltyCooldowns: { mute: 0, eh: 0, timer5: 0 },
      clients: {
        supheli: suspect.ws,
        sert_hakim: sertHakim.ws,
        yumusak_hakim: yumusakHakim.ws,
        savci: sertHakim.ws,
        dedektif: yumusakHakim.ws
      },
      timer: null
    };

    suspect.ws.roomId = roomId; suspect.ws.role = 'supheli';
    sertHakim.ws.roomId = roomId; sertHakim.ws.role = 'sert_hakim';
    yumusakHakim.ws.roomId = roomId; yumusakHakim.ws.role = 'yumusak_hakim';

    // Odaya girildi, boşta bekleme zaman aşımını iptal et
    if (suspect.ws.idleTimeout) clearTimeout(suspect.ws.idleTimeout);
    if (sertHakim.ws.idleTimeout) clearTimeout(sertHakim.ws.idleTimeout);
    if (yumusakHakim.ws.idleTimeout) clearTimeout(yumusakHakim.ws.idleTimeout);

    rooms.set(roomId, room);

    // Eşleşme başladığında da şüpheliye fısıltı içeriği ASLA sızdırılmaz
    const suspectRoomInfo = {
      roomId: room.roomId,
      confession: room.confession,
      category: room.category,
      timeLeft: room.timeLeft,
      status: room.status,
      verdict: room.verdict,
      messages: room.messages,
      whispers: [],
      whisperCount: 0,
      isWhispering: room.isWhispering,
      activePenalty: room.activePenalty
    };

    const judgeRoomInfo = {
      ...suspectRoomInfo,
      whispers: room.whispers,
      whisperCount: 0
    };

    // 3 CİHAZA AYNI ANDA ODAYA GİRİŞ EMRİ GÖNDER!
    send(suspect.ws, { type: 'MATCH_FOUND', role: 'supheli', room: suspectRoomInfo });
    send(sertHakim.ws, { type: 'MATCH_FOUND', role: 'sert_hakim', room: judgeRoomInfo });
    send(yumusakHakim.ws, { type: 'MATCH_FOUND', role: 'yumusak_hakim', room: judgeRoomInfo });

    // Sunucu bazlı ortak geri sayım sayacı (180 saniye)
    room.timer = setInterval(() => {
      if (room.status !== 'active') {
        clearInterval(room.timer);
        return;
      }
      room.timeLeft -= 1;
      if (room.activePenalty && room.activePenalty.expiresAt <= Date.now()) {
        room.activePenalty = null;
      }
      if (room.timeLeft <= 0) {
        room.timeLeft = 0;
        room.status = 'ended';
        room.verdict = room.verdict || {
          stamp: 'SÜRE DOLDU - KARARSIZ',
          reason: 'Hakimler 180 saniyelik süre içinde nihai ortak hükme varamadı.',
          by: 'system'
        };
        clearInterval(room.timer);
        broadcastRoom(room);
        scheduleRoomCleanup(room.roomId);
      } else {
        broadcastRoom(room);
      }
    }, 1000);
  }
  broadcastQueueStatus();
}

wss.on('connection', (ws, req) => {
  // ==============================================================
  // 6. CSWSH / ORIGIN KONTROLÜ
  // ==============================================================
  const origin = req.headers.origin;
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  if (origin) {
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    const isAllowed = allowedOrigin && (origin === allowedOrigin || origin.endsWith(allowedOrigin));

    if (allowedOrigin && !isAllowed && !isLocalhost) {
      ws.close(1008, 'Yetkisiz Origin');
      return;
    }
  }

  // ==============================================================
  // 7. MAKSİMUM BAĞLANTI (MAX_CLIENTS) KONTROLÜ
  // ==============================================================
  if (wss.clients.size > MAX_CLIENTS) {
    ws.close(1008, 'Sunucu kapasitesi dolu');
    return;
  }

  ws.id = Math.random().toString(36).slice(2, 10);

  // ==============================================================
  // 8. İSTEMCİ HIZ SINIRI & ANTI-SPAM SAYACLARI
  // ==============================================================
  ws.lastMessageAt = 0;
  ws.joinCount = 0;
  ws.joinWindowStart = Date.now();

  // ==============================================================
  // 9. HAYALET BAĞLANTI & BOŞTA BEKLEME ZAMAN AŞIMI (3 DAKİKA)
  // ==============================================================
  ws.idleTimeout = setTimeout(() => {
    if (!ws.roomId && ws.readyState === 1) {
      send(ws, { type: 'ERROR', message: 'Boşta bekleme zaman aşımı (3 dk).' });
      ws.close(1000, 'Boşta bekleme zaman aşımı');
    }
  }, 3 * 60 * 1000);

  ws.on('error', () => {
    // client error handled gracefully
  });

  // Bağlantı kurulduğunda anlık havuz durumunu yeni bağlanan istemciye ilet
  send(ws, {
    type: 'QUEUE_STATUS',
    suspects: Math.min(1, suspectQueue.length),
    judges: Math.min(2, judgeQueue.length),
    totalSuspects: suspectQueue.length,
    totalJudges: judgeQueue.length
  });

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch (e) {
      return;
    }

    if (!msg || typeof msg !== 'object') return;

    // Kuyruk Rate Limiting: Aynı bağlantıdan saniyede en fazla 5 kez gir/çık yapılabilir
    if (msg.type === 'JOIN_QUEUE' || msg.type === 'LEAVE_QUEUE') {
      const now = Date.now();
      if (now - ws.joinWindowStart > 1000) {
        ws.joinWindowStart = now;
        ws.joinCount = 0;
      }
      ws.joinCount++;
      if (ws.joinCount > 5) {
        send(ws, { type: 'ERROR', message: 'Kuyruk istek sınırı aşıldı. Lütfen bekleyin.' });
        return;
      }
    }

    if (msg.type === 'JOIN_QUEUE') {
      removeFromQueues(ws);

      // Kuyruk kapasite kontrolü
      if (suspectQueue.length + judgeQueue.length >= MAX_QUEUE_SIZE) {
        send(ws, { type: 'ERROR', message: 'Kuyruk kapasitesi dolu. Lütfen biraz sonra tekrar deneyin.' });
        return;
      }

      const cleanConfession = sanitizeFilter(msg.confession, 200);
      const cleanCategory = sanitizeFilter(msg.category || 'İş & Para', 50);

      if (msg.role === 'supheli' || msg.role === 'suspect') {
        suspectQueue.push({ ws, id: ws.id, confession: cleanConfession, category: cleanCategory });
      } else if (msg.role === 'yargic' || msg.role === 'hakim' || msg.role === 'sert_hakim' || msg.role === 'yumusak_hakim') {
        judgeQueue.push({ ws, id: ws.id });
      }
      broadcastQueueStatus();
      tryMatchmaking();
      return;
    }

    if (msg.type === 'LEAVE_QUEUE') {
      removeFromQueues(ws);
      return;
    }

    const room = ws.roomId ? rooms.get(ws.roomId) : null;
    if (!room) return;

    const isJudge = ws.role === 'sert_hakim' || ws.role === 'yumusak_hakim' || ws.role === 'savci' || ws.role === 'dedektif';

    // Canlı Yazma Bildirimi (Katip daktilo ve ağız oynama animasyonu için)
    if (msg.type === 'TYPING_STATUS') {
      broadcastToRoom(room, {
        type: 'USER_TYPING',
        role: ws.role,
        isTyping: Boolean(msg.isTyping)
      });
      return;
    }

    // ==============================================================
    // 10. MESAJ VE CEZA HIZ SINIRI (RATE LIMITING - 500MS)
    // ==============================================================
    if (msg.type === 'CHAT_MESSAGE' || msg.type === 'WHISPER_MESSAGE' || msg.type === 'APPLY_PENALTY') {
      const now = Date.now();
      if (now - ws.lastMessageAt < 500) {
        send(ws, { type: 'ERROR', message: 'Çok hızlı işlem yapıyorsunuz. Lütfen 500ms bekleyin.' });
        return;
      }
      ws.lastMessageAt = now;
    }

    // A. GENEL SOHBET MESAJI (TUTANAK)
    if (msg.type === 'CHAT_MESSAGE') {
      // Şüpheli susturulmuşsa mesaj atamaz
      if (ws.role === 'supheli' && room.activePenalty?.type === 'mute' && room.activePenalty.expiresAt > Date.now()) {
        send(ws, { type: 'ERROR', message: 'Susturuldunuz, klavyeniz kilitli.' });
        return;
      }

      const cleanText = sanitizeFilter(msg.text, 200);
      if (!cleanText) return;

      // Tek kelime kıskacı (Evet / Hayır) denetimi
      if (ws.role === 'supheli' && room.activePenalty?.type === 'eh') {
        const lower = cleanText.toLowerCase();
        if (lower !== 'evet' && lower !== 'hayır' && lower !== 'hayir') {
          send(ws, { type: 'ERROR', message: 'Sadece "Evet" veya "Hayır" yazabilirsiniz.' });
          return;
        }
        room.activePenalty = null;
      }

      room.messages.push({
        id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        sender: ws.role,
        text: cleanText,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });

      broadcastRoom(room);
      return;
    }

    // B. KÜRSÜ FISILDAMASI (SADECE HAKİMLER)
    if (msg.type === 'WHISPER_MESSAGE') {
      if (!isJudge) {
        send(ws, { type: 'ERROR', message: 'Yetkisiz işlem: Şüpheli kürsü fısıltısı gönderemez.' });
        return;
      }

      const cleanText = sanitizeFilter(msg.text, 200);
      if (!cleanText) return;

      room.whispers.push({
        id: 'w_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        sender: ws.role,
        text: cleanText,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });
      room.isWhispering = true;
      broadcastRoom(room);
      return;
    }

    if (msg.type === 'WHISPER_TYPING' && isJudge) {
      room.isWhispering = Boolean(msg.isTyping);
      broadcastRoom(room);
      return;
    }

    // C. OTORİTE CEZALARI (SADECE HAKİMLER, SUNUCU KONTROLLÜ SÜRELER & COOLDOWN)
    if (msg.type === 'APPLY_PENALTY') {
      if (!isJudge) {
        send(ws, { type: 'ERROR', message: 'Yetkisiz işlem: Sadece hakimler ceza uygulayabilir.' });
        return;
      }

      const penaltyType = msg.penaltyType;
      const fixedDuration = PENALTY_DURATIONS[penaltyType];
      if (!fixedDuration) return;

      // Odada zaten aktif bir ceza varsa reddet
      if (room.activePenalty && room.activePenalty.expiresAt > Date.now()) {
        send(ws, { type: 'ERROR', message: 'Şu anda odada zaten aktif bir ceza uygulanıyor.' });
        return;
      }

      // Cooldown kontrolü
      if (!room.penaltyCooldowns) {
        room.penaltyCooldowns = { mute: 0, eh: 0, timer5: 0 };
      }
      const lastAppliedAt = room.penaltyCooldowns[penaltyType] || 0;
      const cooldownMs = PENALTY_COOLDOWNS[penaltyType] || 15000;
      const timeSinceLast = Date.now() - lastAppliedAt;

      if (timeSinceLast < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - timeSinceLast) / 1000);
        send(ws, { type: 'ERROR', message: `Bu ceza için ${remainingSec} saniye beklemelisiniz.` });
        return;
      }

      room.penaltyCooldowns[penaltyType] = Date.now();
      room.activePenalty = {
        type: penaltyType,
        by: ws.role,
        expiresAt: Date.now() + fixedDuration * 1000 // Sunucu taraflı sabit süre
      };

      const customNotice = sanitizeFilter(msg.systemText, 200);
      const systemNotice = customNotice || PENALTY_DEFAULT_MESSAGES[penaltyType];

      room.messages.push({
        id: 'sys_' + Date.now(),
        sender: 'system',
        text: systemNotice,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });

      broadcastRoom(room);
      return;
    }

    // D. NİHAİ HÜKÜM (SADECE HAKİMLER)
    if (msg.type === 'SUBMIT_VERDICT') {
      if (!isJudge) {
        send(ws, { type: 'ERROR', message: 'Yetkisiz işlem: Sadece hakimler hüküm verebilir.' });
        return;
      }
      if (room.status === 'ended') return;

      room.status = 'ended';
      room.verdict = {
        stamp: sanitizeFilter(msg.stamp || 'HÜKÜM VERİLDİ', 50),
        reason: sanitizeFilter(msg.reason || 'Mahkeme heyeti oy birliğiyle karar verdi.', 200),
        by: ws.role
      };

      if (room.timer) clearInterval(room.timer);
      broadcastRoom(room);

      // Oyun bitti, 60 saniye sonra odayı bellekten tamamen sil
      scheduleRoomCleanup(room.roomId);
    }
  });

  ws.on('close', () => {
    if (ws.idleTimeout) clearTimeout(ws.idleTimeout);
    removeFromQueues(ws);
    if (ws.roomId && rooms.has(ws.roomId)) {
      const room = rooms.get(ws.roomId);
      const roleLabel = ws.role === 'supheli'
        ? 'Şüpheli'
        : ws.role === 'sert_hakim'
        ? '1. Hakim'
        : ws.role === 'yumusak_hakim'
        ? '2. Hakim'
        : 'Hakim';

      room.messages.push({
        id: 'sys_leave_' + Date.now(),
        sender: 'system',
        text: `⚠️ [${roleLabel} duruşma salonundan ayrıldı.]`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });

      broadcastRoom(room);

      // Odada kalan aktif oyuncu var mı kontrol et
      const remainingConnected = Object.values(room.clients || {}).filter(
        clientWs => clientWs && clientWs.readyState === 1 && clientWs !== ws
      );

      // Tüm oyuncular ayrıldıysa 60 saniye sonra temizle
      if (remainingConnected.length === 0) {
        scheduleRoomCleanup(ws.roomId);
      }
    }
  });
});
