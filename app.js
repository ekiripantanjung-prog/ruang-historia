{
/* RUANG HISTORIA — aplikasi belajar sejarah interaktif */
const app = document.getElementById('app');
const K = window.KOLEKSI, B = window.BAB;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const huruf = i => 'ABCDE'[i];
const cariK = id => K.find(k => k.id === id);
const isiBab = (kid, id) => (B[kid] || {})[id];
const tersedia = k => k.bab.filter(d => isiBab(k.id, d.id));

/* ---------- penyimpanan nilai (hanya di perangkat ini) ---------- */
const S = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('historia-' + k)) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('historia-' + k, JSON.stringify(v)); } catch (e) {} }
};
const simpanNilai = (kunci, skor, total) => {
  const n = S.get('nilai', {});
  const nilai = Math.round(skor / total * 100);
  const lama = n[kunci] || { terbaik: 0, kali: 0 };
  n[kunci] = { terbaik: Math.max(lama.terbaik, nilai), terakhir: nilai, kali: lama.kali + 1, tgl: new Date().toLocaleDateString('id-ID') };
  S.set('nilai', n);
  return nilai;
};

/* ---------- gambar ---------- */
const IKON = {
  genggam: '<path d="M20 46 C8 40 8 18 22 6 C34 18 34 40 20 46Z" fill="#cfc2b0" stroke="#3b2618" stroke-width="2"/><path d="M16 20 L22 28 M24 16 L20 26" stroke="#3b2618" stroke-width="1.5"/><path d="M58 44 L68 14 L82 40 Z" fill="#e8dccb" stroke="#3b2618" stroke-width="2"/>',
  kerang: '<path d="M10 44 q22 -36 44 0Z" fill="#f2e6cf" stroke="#3b2618" stroke-width="2"/><path d="M20 44 q12 -22 24 0 M30 44 q2 -14 4 0" stroke="#3b2618" stroke-width="1.4" fill="none"/><path d="M64 44 q10 -30 28 -30 q6 0 8 6 q-16 6 -22 24Z" fill="#d9c9b1" stroke="#3b2618" stroke-width="2"/>',
  kapak: '<rect x="6" y="16" width="34" height="20" rx="3" fill="#7d8a7a" stroke="#202820" stroke-width="2"/><path d="M6 20 h34" stroke="#c7d2c4" stroke-width="2"/><ellipse cx="74" cy="26" rx="24" ry="12" fill="#6d7a6a" stroke="#202820" stroke-width="2"/><ellipse cx="68" cy="22" rx="11" ry="4" fill="#a8b5a5"/>',
  batu: '<path d="M12 48 L16 6 L28 6 L32 48Z" fill="#9b9488" stroke="#2a2621" stroke-width="2"/><path d="M16 6 L20 48" stroke="#c9c3b8" stroke-width="2"/><rect x="48" y="20" width="48" height="8" rx="2" fill="#a59e92" stroke="#2a2621" stroke-width="2"/><rect x="52" y="28" width="8" height="20" fill="#8b8478" stroke="#2a2621" stroke-width="2"/><rect x="84" y="28" width="8" height="20" fill="#8b8478" stroke="#2a2621" stroke-width="2"/>',
  logam: '<path d="M28 8 h44 l-4 10 h-36Z" fill="#c9a04a" stroke="#3a2a0a" stroke-width="2"/><path d="M32 18 h36 q-6 14 4 30 h-44 q10 -16 4 -30Z" fill="#b28a36" stroke="#3a2a0a" stroke-width="2"/><circle cx="50" cy="13" r="3" fill="#f2d78a"/><path d="M38 30 h24 M36 38 h28" stroke="#f2d78a" stroke-width="1.5"/>'
};
const kepala = i => { const h = i * 2.2, w = 7 - i; return `<svg viewBox="0 0 200 100" aria-hidden="true"><path d="M60 98 q-4 -38 10 -56 q16 -22 48 -20 q34 4 38 40 q2 22 -4 36Z" fill="#c9a27c" stroke="#3b2618" stroke-width="2"/><path d="M72 ${46 - h} q30 -${16 + h} 70 -4" stroke="#3b2618" stroke-width="${w}" fill="none" stroke-linecap="round"/><circle cx="118" cy="58" r="4" fill="#3b2618"/><path d="M150 66 q8 4 4 12" stroke="#3b2618" stroke-width="2" fill="none"/></svg>`; };

/* ---------- menu atas ---------- */
const tandaiMenu = v => document.querySelectorAll('.tabs a').forEach(a => a.classList.toggle('on', a.dataset.v === v));
let pasang = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); pasang = e; const b = document.getElementById('pasang'); if (b) b.hidden = false; });

/* ---------- BERANDA: pilih ruang (koleksi) ---------- */
function beranda() {
  tandaiMenu('beranda');
  app.innerHTML = `
<section class="hero pad"><div class="wrap">
<h1>Ruang Historia</h1>
<p>Ruang belajar sejarah interaktif untuk MA/SMA/SMK: materi ringkas, video, kuis dengan pembahasan, dan ujian akhir. Diperkaya nilai Panca Cinta Kurikulum Berbasis Cinta. Pilih ruang yang ingin kamu masuki.</p>
<div class="rooms">${K.map(k => { const ada = tersedia(k).length;
    return `<a class="room ${ada ? '' : 'kunci'}" href="#${k.id}" style="--c:${k.warna}"><span class="door"><span class="seg-bab">${k.bab.map(d => `<i class="${isiBab(k.id, d.id) ? 'on' : ''}"></i>`).join('')}</span></span><b>${esc(k.judul)}</b><span>${esc(k.ringkas)}</span><small>${ada ? `${ada} dari ${k.bab.length} bab tersedia` : `${k.bab.length} bab · segera hadir`}</small></a>`; }).join('')}</div>
<div class="row" style="margin-top:18px"><button class="btn" id="pasang" hidden type="button">Pasang di HP</button></div>
</div></section>
<footer class="pad foot"><div class="wrap"><p>Nilai kuis tersimpan di perangkat ini saja. Rujukan dicantumkan di halaman Tentang.</p></div></footer>`;
  const p = document.getElementById('pasang');
  if (pasang) p.hidden = false;
  p.addEventListener('click', async () => { if (!pasang) return; pasang.prompt(); await pasang.userChoice; pasang = null; p.hidden = true; });
}

/* ---------- RUANG: daftar bab satu koleksi ---------- */
function ruang(kid) {
  tandaiMenu('');
  const k = cariK(kid), n = S.get('nilai', {}), ada = tersedia(k), D = k.bab;
  app.innerHTML = `
<section class="hero pad" style="background:color-mix(in srgb,${k.warna} 45%,#2a1b11)"><div class="wrap">
<a class="balik" href="#beranda">Ruang Historia</a>
<h1>${esc(k.judul)}</h1><p>${esc(k.ringkas)}.</p>
<div class="river" role="list">${D.map(d => `<a role="listitem" href="#${kid}-${d.id}" class="${isiBab(kid, d.id) ? '' : 'kunci'}" style="background:${d.warna}" title="Bab ${d.id}. ${esc(d.judul)}"><b>${d.id}</b><span>${esc(d.judul)}</span></a>`).join('')}</div>
<div class="river-cap"><span>${esc(k.awal)}</span><span>${esc(k.akhir)}</span></div>
${ada.length ? `<div class="row" style="margin-top:18px"><a class="btn" href="#${kid}-${ada[0].id}">Mulai Bab ${ada[0].id}</a><a class="btn alt" style="color:#fff;border-color:#ffffff55" href="#${kid}-ujian">Ujian akhir</a></div>` : ''}
</div></section>
<section class="pad"><div class="wrap">
<h2>Daftar bab</h2>
<p>${ada.length === D.length ? `Semua ${D.length} bab sudah tersedia, lengkap dengan video, kuis, dan soal uraian.` : ada.length ? `${ada.length} dari ${D.length} bab sudah tersedia. Bab lain akan menyusul.` : 'Materi ruang ini sedang disusun. Daftar bab di bawah adalah rencananya.'}</p>
<div class="grid">${D.map(d => { const b = isiBab(kid, d.id), v = n[`${kid}-bab${d.id}`];
    return `<a class="bab ${b ? '' : 'kunci'}" href="#${kid}-${d.id}" style="--c:${d.warna}"><small>Bab ${d.id} · ${esc(d.masa)}</small><b>${esc(d.judul)}</b><span>${esc(d.ringkas)}</span><span class="st">${b ? (v ? `Nilai terbaik ${v.terbaik}` : 'Siap dipelajari') : 'Segera hadir'}</span></a>`; }).join('')}</div>
</div></section>`;
}

/* ---------- HALAMAN BAB ---------- */
function bab(kid, id, tab) {
  tandaiMenu('');
  const k = cariK(kid), d = k.bab.find(x => x.id === id), b = isiBab(kid, id);
  if (!d) return ruang(kid);
  const atas = `<a class="balik" href="#${kid}">${esc(k.judul)}</a>`;
  if (!b) {
    app.innerHTML = `<section class="babhead pad" style="--c:${d.warna}"><div class="wrap">${atas}<small>Bab ${id}</small><h1>${esc(d.judul)}</h1><p>${esc(d.ringkas)}</p></div></section><section class="pad"><div class="wrap"><div class="box"><h3>Segera hadir</h3><p>Materi, video, dan soal bab ini sedang disusun.</p><a class="btn" href="#${kid}">Kembali ke ${esc(k.judul)}</a></div></div></section>`;
    return;
  }
  const T = [['materi', 'Materi'], ['video', 'Video'], ['kuis', 'Kuis'], ['esai', 'Soal uraian'], ['istilah', 'Istilah']];
  tab = tab || 'materi';
  app.innerHTML = `<section class="babhead pad" style="--c:${d.warna}"><div class="wrap">${atas}
<small>Bab ${id} · ${esc(d.masa)}</small><h1>${esc(b.judul)}</h1><p>${esc(b.sub)}</p>
<div class="seg" role="tablist">${T.map(t => `<button role="tab" type="button" data-t="${t[0]}" aria-selected="${t[0] === tab}">${t[1]}</button>`).join('')}</div>
</div></section><section class="pad"><div class="wrap" id="isi"></div></section>`;
  const isi = document.getElementById('isi');
  const tampil = t => {
    app.querySelectorAll('.seg button').forEach(x => x.setAttribute('aria-selected', x.dataset.t === t));
    if (t === 'materi') isi.innerHTML = materi(b);
    if (t === 'video') {
      isi.innerHTML = b.video ? video(b) : '<p>Video bab ini segera hadir.</p>';
      const v = isi.querySelector('video');
      if (v) v.addEventListener('error', () => { v.outerHTML = '<div class="box"><b>Video sedang disiapkan.</b> Silakan pelajari materinya dulu, videonya akan segera hadir.</div>'; });
    }
    if (t === 'kuis') isi.innerHTML = kuisAwal(b, kid, id);
    if (t === 'esai') isi.innerHTML = esai(b);
    if (t === 'istilah') isi.innerHTML = `<h2>Istilah penting</h2><div class="gl">${(b.glosarium || []).map(g => `<div><b>${esc(g[0])}</b>${esc(g[1])}</div>`).join('')}</div>`;
    if (t === 'materi' && b.jelajah) pasangJelajah(b);
    if (t === 'materi') pasangGaleri(kid, id);
  };
  app.querySelector('.seg').addEventListener('click', e => { const x = e.target.closest('button'); if (x) tampil(x.dataset.t); });
  isi.addEventListener('click', e => {
    const f = e.target.closest('.flip'); if (f) f.setAttribute('aria-pressed', f.getAttribute('aria-pressed') !== 'true');
    const x = e.target.closest('[data-ke]'); if (x) { tampil(x.dataset.ke); window.scrollTo(0, 0); }
  });
  tampil(tab);
}

function materi(b) {
  const j = b.jelajah;
  return `<div class="box"><h3>Tujuan pembelajaran</h3><ol class="tujuan">${b.tujuan.map(t => `<li>${esc(t)}</li>`).join('')}</ol></div><div id="galeri"></div>
${j ? `<h2>${esc(j.judul)}</h2><div class="dig"><div><div class="strata ${j.mode === 'waktu' ? 'waktu' : ''}" id="strata">${j.mode === 'waktu' ? '' : `<div class="sky">${esc(j.atas)}</div><div class="grass"></div>`}${j.lapisan.map((x, k) => `<button class="layer" type="button" data-k="${k}" aria-pressed="false" style="background-color:${x.c}"><span><b>${esc(x.n)}</b><small>${esc(x.t)}</small></span>${x.ikon ? `<svg viewBox="0 0 100 52" aria-hidden="true">${IKON[x.ikon] || ''}</svg>` : (j.mode === 'waktu' ? `<em class="thn">${esc(x.th || '')}</em>` : '')}</button>`).join('')}</div><div class="depth">${j.mode === 'waktu' ? '<span>lebih awal</span><span>lebih akhir</span>' : '<span>lebih muda</span><span>lebih tua, lebih dalam</span>'}</div></div><aside class="panel" id="panel" aria-live="polite"></aside></div>${j.catatan ? `<p class="catatan">${esc(j.catatan)}</p>` : ''}` : ''}
${b.bagian.map(s => `<h2 style="margin-top:28px">${esc(s.judul)}</h2>${s.isi}${s.kartu ? kartu(b) : ''}${s.cinta ? `<div class="cinta"><b>Refleksi ${esc(s.cinta[0].toLowerCase())}.</b> ${esc(s.cinta[1])}</div>` : ''}`).join('')}
<div class="box row" style="justify-content:space-between"><span>Sudah selesai membaca? Uji pemahamanmu.</span><button class="btn" type="button" data-ke="kuis">Kerjakan kuis</button></div>`;
}
/* Foto bersejarah dari Wikimedia Commons (lihat alat/cari_gambar.py) */
let DAFTAR_GAMBAR = null;
async function pasangGaleri(kid, id) {
  try { DAFTAR_GAMBAR ||= await fetch('gambar/daftar.json').then(r => r.ok ? r.json() : {}); } catch { DAFTAR_GAMBAR = {}; }
  const L = DAFTAR_GAMBAR[`${kid}-${id}`], el = document.getElementById('galeri');
  if (!el || !L || !L.length) return;
  el.innerHTML = `<h2>Jejak sejarah</h2><p class="catatan">Foto dan dokumen asli dari arsip terbuka Wikimedia Commons. Klik "sumber" untuk melihat pembuat dan lisensinya.</p><div class="galeri">${L.map(g => `<figure><img src="${esc(g.file)}" alt="${esc(g.judul)}" loading="lazy" onerror="this.closest('figure').remove()"><figcaption><b>${esc(g.judul)}</b>${g.ket ? `<span>${esc(g.ket)}</span>` : ''}<small>${g.pembuat ? esc(g.pembuat.slice(0, 80)) + ' · ' : ''}${esc(g.lisensi || '')} · <a href="${esc(g.halaman)}" target="_blank" rel="noopener">sumber</a></small></figcaption></figure>`).join('')}</div>`;
}
const kartu = b => `<p class="catatan">Klik kartu untuk membalik.</p><div class="cards">${b.kartu.map((c, i) => `<button class="flip" type="button" aria-pressed="false"><div class="inner"><div class="face"><b>${esc(c.nama)}</b><small>${esc(c.info)}</small>${b.koleksi === 'indonesia' && b.id === 1 ? kepala(i) : `<span class="mono" aria-hidden="true">${esc(c.nama.split(/\s+/).filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('') || c.nama[0])}</span>`}</div><div class="face back">${esc(c.isi)}</div></div></button>`).join('')}</div>`;
function pasangJelajah(b) {
  const L = b.jelajah.lapisan, st = document.getElementById('strata'), pn = document.getElementById('panel');
  const show = k => { const x = L[k]; pn.innerHTML = `<small>${b.jelajah.mode === 'waktu' ? 'Bagian' : 'Lapisan'} ${k + 1} dari ${L.length}</small><h3>${esc(x.n)}</h3><p>${esc(x.t)}</p><dl>${x.d.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl><p class="catatan">${esc(x.ket)}</p>`; st.querySelectorAll('.layer').forEach(e => e.setAttribute('aria-pressed', e.dataset.k == k)); };
  st.addEventListener('click', e => { const x = e.target.closest('.layer'); if (x) show(+x.dataset.k); });
  show(b.jelajah.mode === 'waktu' ? 0 : L.length - 1);
}
const video = b => `<h2>${esc(b.video.judul)}</h2><video class="vid" controls preload="metadata" playsinline poster="${esc(b.video.src.replace(/\.mp4$/, ".jpg"))}" src="${esc(b.video.src)}"></video><p class="catatan" style="margin-top:12px">${esc(b.video.durasi)}. ${esc(b.video.catatan)}</p><div class="box row" style="justify-content:space-between"><span>Selesai menonton? Coba kuisnya.</span><button class="btn" type="button" data-ke="kuis">Kerjakan kuis</button></div>`;
const kuisAwal = (b, kid, id) => { const v = S.get('nilai', {})[`${kid}-bab${id}`]; return `<h2>Kuis Bab ${id}</h2><p>${b.soal.length} soal pilihan ganda, termasuk soal analisis (HOTS). Setiap jawaban langsung diberi pembahasan, dan urutan pilihan jawaban diacak. Nilai terbaikmu disimpan.</p>${v ? `<div class="box">Nilai terbaik: <b>${v.terbaik}</b> · terakhir ${v.terakhir} · sudah ${v.kali} kali</div>` : ''}<a class="btn" href="#${kid}-${id}-kuis">Mulai kuis</a>`; };
const esai = b => `<h2>Soal uraian</h2><p>Kerjakan di buku tulis atau kirim ke guru. Rubrik penilaian ada di bawah setiap soal.</p>${b.esai.map((e, i) => `<div class="box"><p><b>${i + 1}.</b> ${esc(e.q)}</p><details class="rub"><summary>Rubrik penilaian (untuk guru)</summary><ul>${e.rubrik.map(r => `<li>${esc(r)}</li>`).join('')}</ul></details></div>`).join('')}`;

/* ---------- MESIN SOAL: latihan per bab & ujian akhir ---------- */
let jam = null;
function jalankan(list, o) {
  clearInterval(jam);
  // urutan pilihan jawaban diacak setiap kali supaya kunci tidak bisa dihafal
  list = list.map(q => { const idx = acak([...q.o.keys()]); return { ...q, o: idx.map(k => q.o[k]), a: idx.indexOf(q.a) }; });
  const jawab = Array(list.length).fill(null);
  let i = 0, selesai = false, sisa = o.menit ? o.menit * 60 : 0;
  app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:780px"><div class="sticky"><div class="row" style="justify-content:space-between"><b>${esc(o.judul)}</b><span class="timer" id="tm"></span></div><div class="prog"><i id="pg" style="width:0"></i></div></div><div id="qq"></div></div></section>`;
  const qq = document.getElementById('qq'), pg = document.getElementById('pg'), tm = document.getElementById('tm');
  const waktu = () => { tm.textContent = o.menit ? `${String(Math.floor(sisa / 60)).padStart(2, '0')}:${String(sisa % 60).padStart(2, '0')}` : `${jawab.filter(x => x !== null).length}/${list.length} dijawab`; };
  if (o.menit) jam = setInterval(() => { sisa--; waktu(); if (sisa <= 0) akhiri(); }, 1000);
  const gambar = () => {
    const q = list[i], j = jawab[i], latihan = o.mode === 'latihan', buka = latihan && j !== null;
    pg.style.width = ((i + (j !== null ? 1 : 0)) / list.length * 100) + '%';
    qq.innerHTML = `<div class="q"><span class="lv">${q.bab ? 'Bab ' + q.bab + ' · ' : ''}${q.l || ''}</span><p class="catatan" style="border:0;padding:0">Soal ${i + 1} dari ${list.length}</p>${q.s ? `<div class="stim">${esc(q.s)}</div>` : ''}<div class="tanya">${esc(q.q)}</div>
<div class="opts">${q.o.map((t, k) => `<button class="opt ${buka ? (k === q.a ? 'benar' : k === j ? 'salah' : '') : (k === j ? 'pilih' : '')}" type="button" data-k="${k}"><i>${huruf(k)}</i><span>${esc(t)}</span></button>`).join('')}</div>
${buka ? `<div class="why"><b>${j === q.a ? 'Benar.' : 'Belum tepat. Jawaban: ' + huruf(q.a) + '.'}</b> ${esc(q.p)}</div>` : ''}</div>
<div class="row" style="justify-content:space-between;margin-top:14px"><button class="btn alt" type="button" id="prev" ${i ? '' : 'disabled'}>Sebelumnya</button>${i < list.length - 1 ? `<button class="btn" type="button" id="next" ${latihan && j === null ? 'disabled' : ''}>Berikutnya</button>` : `<button class="btn" type="button" id="end" ${latihan && j === null ? 'disabled' : ''}>${latihan ? 'Lihat nilai' : 'Kumpulkan'}</button>`}</div>
${o.mode === 'ujian' ? `<div class="row" style="margin-top:16px;gap:6px">${list.map((_, k) => `<button class="opt" style="padding:8px 0;width:44px;justify-content:center;${k === i ? 'border-color:var(--ink)' : ''}${jawab[k] !== null ? ';background:color-mix(in srgb,var(--accent) 16%,var(--bg))' : ''}" type="button" data-n="${k}">${k + 1}</button>`).join('')}</div>` : ''}`;
    waktu();
  };
  qq.addEventListener('click', e => {
    if (selesai) return;
    const op = e.target.closest('[data-k]'), nn = e.target.closest('[data-n]');
    if (op) { if (o.mode === 'latihan' && jawab[i] !== null) return; jawab[i] = +op.dataset.k; gambar(); return; }
    if (nn) { i = +nn.dataset.n; gambar(); return; }
    if (e.target.id === 'prev' && i > 0) { i--; gambar(); }
    if (e.target.id === 'next') { i++; gambar(); window.scrollTo(0, 0); }
    if (e.target.id === 'end') { const kosong = jawab.filter(x => x === null).length; if (o.mode === 'ujian' && kosong && !e.target.dataset.yakin) { e.target.dataset.yakin = 1; e.target.textContent = `${kosong} soal belum dijawab. Tekan lagi untuk mengumpulkan`; return; } akhiri(); }
  });
  function akhiri() {
    if (selesai) return; selesai = true; clearInterval(jam);
    const skor = list.reduce((s, q, k) => s + (jawab[k] === q.a ? 1 : 0), 0);
    const nilai = simpanNilai(o.kunci, skor, list.length);
    const pesan = nilai >= 85 ? 'Luar biasa! Pemahamanmu sangat baik.' : nilai >= 70 ? 'Bagus, sudah tuntas. Pelajari lagi soal yang salah.' : 'Belum tuntas. Baca ulang materinya, lalu coba lagi.';
    document.querySelector('.sticky').remove();
    qq.innerHTML = `<div class="hasil"><big>${nilai}</big>${skor} benar dari ${list.length} soal<p style="margin:8px auto 0;color:#fff">${pesan}</p></div>
<div class="row" style="margin-bottom:20px"><button class="btn" type="button" id="ulang">Ulangi</button><a class="btn alt" href="${o.balik}">Kembali</a></div>
<h2>Pembahasan</h2>${list.map((q, k) => `<div class="q" style="margin-bottom:12px"><span class="lv">${q.bab ? 'Bab ' + q.bab : ''}</span>${q.s ? `<div class="stim">${esc(q.s)}</div>` : ''}<div class="tanya">${k + 1}. ${esc(q.q)}</div><p style="margin:0">Jawabanmu: <b style="color:${jawab[k] === q.a ? 'var(--ok)' : 'var(--bad)'}">${jawab[k] === null ? 'kosong' : huruf(jawab[k]) + '. ' + esc(q.o[jawab[k]])}</b>${jawab[k] === q.a ? '' : `<br>Kunci: <b>${huruf(q.a)}. ${esc(q.o[q.a])}</b>`}</p><div class="why">${esc(q.p)}</div></div>`).join('')}`;
    document.getElementById('ulang').addEventListener('click', () => o.ulang());
    window.scrollTo(0, 0);
  }
  gambar();
}
const acak = a => { a = a.slice(); for (let k = a.length - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [a[k], a[r]] = [a[r], a[k]]; } return a; };
function kuis(id) {
  tandaiMenu('');
  const b = B[id]; if (!b) return bab(id);
  jalankan(b.soal, { mode: 'latihan', judul: `Kuis Bab ${id}. ${b.judul}`, kunci: 'bab' + id, balik: `#bab-${id}`, ulang: () => kuis(id) });
}

function kuis(kid, id) {
  tandaiMenu('');
  const b = isiBab(kid, id); if (!b) return bab(kid, id);
  jalankan(b.soal, { mode: 'latihan', judul: `Kuis Bab ${id}. ${b.judul}`, kunci: `${kid}-bab${id}`, balik: `#${kid}-${id}`, ulang: () => kuis(kid, id) });
}

/* ---------- UJIAN AKHIR per ruang ---------- */
function ujian(kid) {
  tandaiMenu(''); clearInterval(jam);
  const k = cariK(kid), ada = tersedia(k);
  const semua = ada.flatMap(d => isiBab(kid, d.id).soal.map(q => ({ ...q, bab: d.id })));
  if (!semua.length) { app.innerHTML = `<section class="pad"><div class="wrap"><h1>Ujian akhir ${esc(k.judul)}</h1><p>Belum ada soal di ruang ini.</p><a class="btn" href="#${kid}">Kembali</a></div></section>`; return; }
  const pilihan = [10, 20, 40].filter(n => n <= semua.length);
  app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:780px"><a class="balik gelap" href="#${kid}">${esc(k.judul)}</a><h1>Ujian akhir ${esc(k.judul)}</h1>
<p>Soal diambil acak dari semua bab yang sudah tersedia (${ada.map(d => 'Bab ' + d.id).join(', ')}). Ujian memakai batas waktu, dan pembahasan baru muncul setelah dikumpulkan.</p>
<div class="box"><h3>Pilih jumlah soal</h3><div class="row">${(pilihan.length ? pilihan : [semua.length]).map(n => `<button class="btn alt" type="button" data-n="${n}">${n} soal · ${Math.round(n * 1.5)} menit</button>`).join('')}</div></div>
<p class="catatan">Bank soal saat ini: ${semua.length} soal. Jumlahnya bertambah setiap ada bab baru.</p></div></section>`;
  app.querySelector('.box').addEventListener('click', e => {
    const x = e.target.closest('[data-n]'); if (!x) return;
    const n = +x.dataset.n, list = acak(semua).slice(0, n);
    jalankan(list, { mode: 'ujian', menit: Math.round(n * 1.5), judul: `Ujian akhir · ${n} soal`, kunci: `${kid}-ujian`, balik: '#nilai', ulang: () => ujian(kid) });
  });
}

/* ---------- NILAI ---------- */
function nilai() {
  tandaiMenu('nilai'); clearInterval(jam);
  const n = S.get('nilai', {});
  const blok = K.filter(k => tersedia(k).length).map(k => {
    const baris = [...tersedia(k).map(d => [`${k.id}-bab${d.id}`, `Bab ${d.id}. ${d.judul}`]), [`${k.id}-ujian`, 'Ujian akhir']];
    return `<h2 style="margin-top:24px">${esc(k.judul)}</h2><div style="overflow-x:auto"><table class="nilai"><thead><tr><th>Bagian</th><th>Dikerjakan</th><th>Terakhir</th><th>Terbaik</th></tr></thead><tbody>${baris.map(r => { const v = n[r[0]]; return `<tr><td>${esc(r[1])}</td><td>${v ? v.kali + '× · ' + v.tgl : 'belum'}</td><td>${v ? v.terakhir : '–'}</td><td><b style="color:${v ? (v.terbaik >= 70 ? 'var(--ok)' : 'var(--bad)') : 'inherit'}">${v ? v.terbaik : '–'}</b></td></tr>`; }).join('')}</tbody></table></div>`;
  }).join('');
  app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:780px"><h1>Nilaiku</h1><p>Nilai tersimpan di perangkat ini. Kriteria ketuntasan yang dipakai di sini: 70.</p>${blok}
<button class="btn alt" type="button" id="hapus" style="margin-top:12px">Hapus semua nilai</button></div></section>`;
  document.getElementById('hapus').addEventListener('click', e => { if (!e.target.dataset.yakin) { e.target.dataset.yakin = 1; e.target.textContent = 'Yakin? Tekan sekali lagi'; return; } S.set('nilai', {}); nilai(); });
}

function tentang() {
  tandaiMenu('tentang'); clearInterval(jam);
  app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:780px"><h1>Tentang Ruang Historia</h1>
<p>Ruang Historia adalah aplikasi belajar sejarah interaktif untuk madrasah aliyah dan sekolah menengah. Setiap "ruang" berisi satu mata pelajaran: Sejarah Indonesia, Sejarah Dunia, dan Sejarah Kebudayaan Islam, dan ruang lain dapat ditambahkan. Materinya diperkaya nilai Panca Cinta dalam Kurikulum Berbasis Cinta Kementerian Agama: cinta kepada Allah dan Rasul-Nya, cinta ilmu, cinta diri dan sesama, cinta lingkungan, serta cinta tanah air.</p>
<h3>Cara belajar yang disarankan</h3><ol><li>Pilih ruang, lalu buka bab.</li><li>Baca materi dan jelajahi gambar interaktifnya.</li><li>Tonton video bab.</li><li>Kerjakan kuis sampai nilai minimal 70.</li><li>Kerjakan soal uraian dan diskusikan refleksi Panca Cinta di kelas.</li><li>Setelah beberapa bab, coba ujian akhir.</li></ol>
<h3>Rujukan utama</h3><ul><li>Buku teks Sejarah Indonesia dan Sejarah tingkat SMA/MA, Kementerian Pendidikan RI.</li><li>Buku Sejarah Kebudayaan Islam Madrasah Aliyah, Kementerian Agama RI.</li><li>Kementerian Agama RI (2025). <i>Panduan Kurikulum Berbasis Cinta di Madrasah</i>.</li><li>Soejono, R.P. dan Leirissa, R.Z. (ed.). <i>Sejarah Nasional Indonesia</i>. Balai Pustaka.</li><li>Ricklefs, M.C. <i>Sejarah Indonesia Modern</i>.</li><li>Azra, Azyumardi. <i>Jaringan Ulama Timur Tengah dan Kepulauan Nusantara Abad XVII dan XVIII</i>.</li><li>Bellwood, P. <i>Prehistory of the Indo-Malaysian Archipelago</i>. ANU Press.</li><li>Artikel ilmiah penanggalan situs purba: Sutikna dkk. (2016), Rizal dkk. (2020), Oktaviana dkk. (2024), jurnal <i>Nature</i>.</li></ul>
<p class="catatan">Guru dapat menambah atau mengubah materi dan soal pada folder <code>data/</code>.</p></div></section>`;
}

/* ---------- router ---------- */
function rute() {
  clearInterval(jam);
  const h = (location.hash || '#beranda').slice(1);
  let m;
  if ((m = h.match(/^([a-z]+)-(\d+)-kuis$/)) && cariK(m[1])) kuis(m[1], +m[2]);
  else if ((m = h.match(/^([a-z]+)-(\d+)$/)) && cariK(m[1])) bab(m[1], +m[2]);
  else if ((m = h.match(/^([a-z]+)-ujian$/)) && cariK(m[1])) ujian(m[1]);
  else if (cariK(h)) ruang(h);
  else if (h === 'nilai') nilai();
  else if (h === 'tentang') tentang();
  else beranda();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', rute);
rute();

/* ---------- mode luring (offline) ---------- */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
}
