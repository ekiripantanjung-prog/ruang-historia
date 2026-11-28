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
/* ---------- ikon garis (24×24) ---------- */
const IKON_UI = {
  rumah: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
  bintang: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  jam: '<path d="M7 3h10M7 21h10"/><path d="M8 3c0 4 8 5 8 9s-8 5-8 9M16 3c0 4-8 5-8 9s8 5 8 9"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  topi: '<path d="m2.5 9 9.5-4.5L21.5 9 12 13.5z"/><path d="M6.5 11v4.5c1.5 1.6 3.4 2.4 5.5 2.4s4-.8 5.5-2.4V11"/><path d="M21.5 9v5"/>',
  layar: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/><path d="m10 8 4 2-4 2z"/>',
  buku: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5c-.8 0-1.5-.7-1.5-1.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z"/><path d="M6.5 8h2.5M6.5 11h2.5M15.5 8H18M15.5 11H18"/>',
  ceklis: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="m7.5 8.5 1.5 1.5 2.5-2.5M7.5 14.5 9 16l2.5-2.5"/><path d="M13.5 9h3M13.5 15h3"/>',
  bendera: '<path d="M5 21V4"/><path d="M5 4.5c3-1.5 5 1.5 8 0s4-1 6-.5v8c-2-.5-3-1-6 .5s-5-1.5-8 0"/>',
  orang: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.6c2.3-.2 4 1.2 4.5 4.4"/>',
  grafik: '<path d="M4 20h16"/><rect x="6" y="11" width="3" height="7" rx="1"/><rect x="11" y="7" width="3" height="11" rx="1"/><rect x="16" y="13" width="3" height="5" rx="1"/>',
  tambahorang: '<circle cx="10" cy="8" r="3.2"/><path d="M4 19.5c.6-3.2 3-5 6-5 1.4 0 2.6.3 3.6 1"/><path d="M18 13v6M15 16h6"/>',
  kunci: '<circle cx="8" cy="15" r="3.5"/><path d="m10.5 12.5 8-8M15.5 7.5l2 2M17.5 5.5l2 2"/>',
  tanya: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6v.3M12 17v.3"/>',
  keluar: '<path d="M14 4h4.5c.8 0 1.5.7 1.5 1.5v13c0 .8-.7 1.5-1.5 1.5H14"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  putar: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5.5 3.5-5.5 3.5z"/>',
  pena: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  kamus: '<path d="M6 4h12v16H6.5A1.5 1.5 0 0 1 5 18.5v-13C5 4.7 5.7 4 6.5 4z"/><path d="M5 17.5c0-.8.7-1.5 1.5-1.5H18"/><path d="M9 8h6M9 11h4"/>',
  kilat: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  panah: '<path d="M15 6l-6 6 6 6"/>',
  roket: '<path d="M12 3c3 2 4.5 5 4.5 9L14 15h-4l-2.5-3c0-4 1.5-7 4.5-9z"/><circle cx="12" cy="9" r="1.6"/><path d="M10 15l-1.5 4L12 17.5 15.5 19 14 15"/>',
  timbangan: '<path d="M12 4v16M7 20h10M5 7h14"/><path d="m5 7-2.5 6h5zM19 7l-2.5 6h5z"/>',
  otak: '<path d="M9.5 4.5A2.5 2.5 0 0 0 7 7a2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0 1 4 2.5 2.5 0 0 0 3.5 3V4.5zM14.5 4.5A2.5 2.5 0 0 1 17 7a2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1-1 4 2.5 2.5 0 0 1-3.5 3V4.5z"/>',
  daftar: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'
};
const ikon = (n, c = '') => `<svg class="ik ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IKON_UI[n] || ''}</svg>`;
const PAKET = {
  asesmenku: { nama: 'Format ASESMENKU', ket: '10 PG, 2 PG kompleks, 2 uraian · 30-40-30', ikon: 'roket', pg: { C1: 2, C2: 1, C3: 4, C4: 1, C5: 1, C6: 1 }, lain: { upgk: 2, ubs: 0, uis: 0, ujd: 0, ue: 2, uel: 'C4,C5,C6' } },
  singkat: { nama: 'Kuis singkat', ket: '10 PG dasar (C1–C3), tanpa uraian', ikon: 'kilat', pg: { C1: 4, C2: 3, C3: 3, C4: 0, C5: 0, C6: 0 }, lain: { upgk: 0, ubs: 0, uis: 0, ujd: 0, ue: 0, uel: '' } },
  seimbang: { nama: 'Ulangan lengkap', ket: '20 PG seimbang + aneka jenis + 2 uraian', ikon: 'timbangan', pg: { C1: 4, C2: 4, C3: 4, C4: 3, C5: 3, C6: 2 }, lain: { upgk: 2, ubs: 1, uis: 2, ujd: 1, ue: 2, uel: 'C4,C5,C6' } },
  hots: { nama: 'HOTS', ket: '20 PG berpikir tingkat tinggi + 2 uraian C6', ikon: 'otak', pg: { C1: 2, C2: 2, C3: 3, C4: 5, C5: 4, C6: 4 }, lain: { upgk: 2, ubs: 0, uis: 0, ujd: 0, ue: 2, uel: 'C6' } }
};

/* menu guru: kartu-kartu fitur */
const MENU_GURU = [
  ['presentasi', 'Presentasi', 'Slide siap tayang, PowerPoint & PDF', 'layar', '#3B5BA9'],
  ['modul', 'Modul Ajar', 'KBC + Pembelajaran Mendalam, Word & PDF', 'buku', '#2E7D5B'],
  ['soal', 'Soal Ulangan', 'C1–C6, siap masuk ASESMENKU', 'ceklis', '#B5532A'],
  ['kelas', 'Kelas & Babak', 'Tautan kelas, KKM, kunci bab', 'bendera', '#7A4E9E'],
  ['siswa', 'Daftar Siswa', 'Impor nama & kode siswa', 'orang', '#1F7A8C'],
  ['rekap', 'Rekap Nilai', 'Google Sheets & analisis', 'grafik', '#A8842A'],
  ['star', 'Historia Star', 'Beri bintang pemenang challenge', 'bintang', '#D99A00'],
  ['bagikan', 'Bagikan ke Guru', 'Kode aktivasi guru lain', 'tambahorang', '#C0475B'],
  ['akun', 'Akun & PIN', 'Ganti PIN, keluar mode guru', 'kunci', '#5A6275'],
  ['#panduan', 'Buku Panduan', 'Cara pakai, bisa diunduh PDF', 'tanya', '#2B3A67']
];
function sapa() { const j = new Date().getHours(); return j < 11 ? 'Selamat pagi' : j < 15 ? 'Selamat siang' : j < 18 ? 'Selamat sore' : 'Selamat malam'; }
function tataPanelGuru(sub) {
  const kotak = [...app.querySelectorAll('[data-bagian]')], c = { ...konfig() }; c.rekap = c.rekap || S.get('rekapUji', '');
  const ada = id => id.startsWith('#') || kotak.some(k => k.dataset.bagian === id);
  const menu = MENU_GURU.filter(m => ada(m[0]));
  const nama = S.get('pemilik') !== false ? 'Pak Eki' : (S.get('namaGuru', '') || 'Bapak/Ibu Guru').replace(/,.*$/, '');
  const hero = app.querySelector('.hero');
  if (!sub || !kotak.some(k => k.dataset.bagian === sub)) {
    kotak.forEach(k => k.hidden = true);
    hero.innerHTML = `<div class="wrap"><p class="sapa">${sapa()},</p><h1>${esc(nama)} 👋</h1><p>Mau menyiapkan apa hari ini?</p>
<div class="status-guru"><span class="chip ${c.rekap ? 'ok' : ''}">${ikon('grafik')} ${c.rekap ? 'Google Sheets tersambung' : 'Google Sheets belum tersambung'}</span><span class="chip ${c.nama ? 'ok' : ''}">${ikon('bendera')} ${c.nama ? `Kelas aktif: ${esc(c.nama)} · KKM ${c.kkm}` : 'Belum ada tautan kelas'}</span></div></div>`;
    const grid = document.createElement('div'); grid.className = 'menu-guru';
    grid.innerHTML = menu.map(([id, judul, ket, ik, w]) => `<a class="ubin" href="${id.startsWith('#') ? id : '#guru/' + id}" style="--w:${w}"><span class="ubin-ik">${ikon(ik)}</span><b>${judul}</b><small>${ket}</small></a>`).join('');
    app.querySelector('.guru-wrap').prepend(grid);
  } else {
    kotak.forEach(k => k.hidden = k.dataset.bagian !== sub);
    const m = MENU_GURU.find(x => x[0] === sub);
    hero.classList.add('hero-kecil'); hero.style.setProperty('--w', m[4]);
    hero.innerHTML = `<div class="wrap"><a class="balik" href="#guru">${ikon('panah')} Ruang Guru</a><div class="judul-bagian"><span class="ubin-ik">${ikon(m[3])}</span><div><h1>${m[1]}</h1><p>${m[2]}</p></div></div></div>`;
    app.querySelector('.guru-wrap').classList.add('satu');
  }
}

const tandaiMenu = v => document.querySelectorAll('.tabs a').forEach(a => a.classList.toggle('on', a.dataset.v === v));
let pasang = null;
let DAFTAR_GAMBAR = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); pasang = e; const b = document.getElementById('pasang'); if (b) b.hidden = false; });

/* ---------- BERANDA ---------- */
const KELUARGA = [
  ['HISTORIA PLAY!', 'https://historiaplay-man1.netlify.app', '#8a4b1f', 'Game sejarah', '10 mode permainan untuk evaluasi berkelompok atau mengisi jam kosong setelah materi selesai.'],
  ['ASESMENKU', 'https://evidenku-eki.netlify.app/asesmenku/', '#1f5f8a', 'Ulangan', 'Ulangan tanpa kertas dengan penilaian otomatis dan pengawasan ujian.'],
  ['EVIDENKU', 'https://evidenku-eki.netlify.app', '#0f6b52', 'Administrasi guru', 'Jurnal mengajar, bukti kinerja, tautan Google Drive, dan rekap e-Kinerja per bulan.'],
  ['SEMEDI', 'https://semedi-eki.netlify.app', '#7a3b6e', 'Sejarah dalam Meme Digital', 'Sumber belajar sejarah lokal yang ringan untuk siswa.']
];
const HAK = '© 2026 Eki Ripan J.R. Tanjung, S.Pd., M.Pd., Gr.';
const SAMPUL = { indonesia: 'Candi Borobudur', dunia: 'Piramida Giza, Mesir', ski: 'Kubah Batu (Qubbat as-Sakhrah), Yerusalem' };
const PANCA = [
  ['#E0B04A', 'Cinta Allah dan Rasul-Nya', 'Melihat sejarah sebagai jejak ketetapan Allah dan teladan para nabi.'],
  ['#D9843A', 'Cinta ilmu', 'Bertanya, membaca sumber, dan menimbang bukti sebelum menyimpulkan.'],
  ['#B23A1F', 'Cinta diri dan sesama', 'Menghargai perbedaan dan belajar dari perjuangan bersama.'],
  ['#6E7F3A', 'Cinta lingkungan', 'Merawat situs, alam, dan warisan budaya yang tersisa.'],
  ['#4A2E1C', 'Cinta tanah air', 'Mengenal akar bangsa agar sanggup menjaga masa depannya.']
];
const semuaKartu = () => K.flatMap(k => k.bab.flatMap(d => { const b = isiBab(k.id, d.id); return (b && b.kartu || []).map(c => ({ ...c, kid: k.id, id: d.id, bab: d.judul, k: k.judul })); }));
async function ambilGambar() {
  if (DAFTAR_GAMBAR) return DAFTAR_GAMBAR;
  const ambil = u => fetch(u).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  const [c, g] = await Promise.all([ambil('gambar/daftar.json'), ambil('gambar/guru.json')]);
  DAFTAR_GAMBAR = {};
  for (const k of new Set([...Object.keys(g), ...Object.keys(c)])) DAFTAR_GAMBAR[k] = [...(g[k] || []), ...(c[k] || [])];
  return DAFTAR_GAMBAR;
}

function beranda() {
  tandaiMenu('beranda');
  const t = S.get('terakhir', null), tb = t && cariK(t[0]) && cariK(t[0]).bab.find(d => d.id === t[1]);
  const jBab = K.reduce((a, k) => a + tersedia(k).length, 0);
  const n = S.get('nilai', {}), selesai = Object.keys(n).filter(x => x.includes('-bab')).length;
  app.innerHTML = `
<section class="sampul"><div class="wrap sampul-isi">
  <div class="sampul-teks">
    <p class="alis">Aplikasi belajar sejarah · MA · SMA · SMK</p>
    <h1>Ruang <em>Historia</em></h1>
    <p class="slogan">Menyusuri jejak masa lalu, merawat cinta untuk masa depan.</p>
    <p class="sampul-p">Materi ringkas, video, foto arsip asli, kuis berpembahasan, dan ujian akhir, diperkaya nilai Panca Cinta Kurikulum Berbasis Cinta.</p>
    <div class="row">
      <a class="btn emas" href="#ruang-pilih">Masuk ruang belajar</a>
      ${tb ? `<a class="btn kaca" href="#${t[0]}-${t[1]}">Lanjutkan: Bab ${tb.id} ${esc(tb.judul)}</a>` : ''}
      <button class="btn kaca" id="pasang" hidden type="button">Pasang di HP</button>
    </div>
    <dl class="angka-list">
      <div><dt>${K.length}</dt><dd>ruang</dd></div>
      <div><dt>${jBab}</dt><dd>bab</dd></div>
      <div><dt>${jBab}</dt><dd>video</dd></div>
      <div><dt id="jml-foto">80+</dt><dd>foto arsip</dd></div>
    </dl>
  </div>
  <div class="sampul-gambar" aria-hidden="true">
    <div class="cahaya"></div>
    <img class="logo-besar" src="icons/logo.svg" alt="">
    <figure class="polaroid p1"></figure><figure class="polaroid p2"></figure><figure class="polaroid p3"></figure>
  </div>
</div>
<svg class="gelombang" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">${PANCA.map((c, i) => `<path d="M0 ${30 + i * 18} C 240 ${10 + i * 18}, 480 ${50 + i * 18}, 720 ${30 + i * 18} S 1200 ${10 + i * 18}, 1440 ${34 + i * 18} V120 H0Z" fill="${c[0]}"/>`).join('')}</svg>
</section>

<section class="pad" id="ruang-pilih"><div class="wrap">
  <p class="alis gelap">Pilih ruang</p>
  <h2 class="judul-besar">Tiga ruang, satu perjalanan</h2>
  <div class="ruang-grid">${K.map(k => { const ada = tersedia(k).length, sel = k.bab.filter(d => n[`${k.id}-bab${d.id}`]).length;
    return `<a class="kamar" href="#${k.id}" style="--c:${k.warna}">
      <span class="lengkung" data-sampul="${k.id}"><span class="lengkung-tirai"></span><span class="lengkung-label">${esc(k.awal)} — ${esc(k.akhir)}</span></span>
      <span class="kamar-isi"><b>${esc(k.judul)}</b><span>${esc(k.ringkas)}</span>
      <span class="seg-bab">${k.bab.map(d => `<i class="${n[`${k.id}-bab${d.id}`] ? 'on' : ''}"></i>`).join('')}</span>
      <small>${ada} bab · ${sel ? `${sel} kuis sudah kamu kerjakan` : 'belum ada kuis dikerjakan'}</small></span></a>`; }).join('')}</div>
</div></section>

<section class="pad jejak-sec"><div class="wrap">
  <p class="alis gelap">Jejak sejarah</p>
  <h2 class="judul-besar">Dari arsip, bukan rekaan</h2>
  <p class="soft">Foto artefak, situs, dan dokumen asli dari arsip terbuka Wikimedia Commons. Ketuk untuk membuka babnya.</p>
</div><div class="pita" id="pita"><div class="pita-jalan"></div></div></section>

<section class="pad"><div class="wrap tahu-wrap">
  <div class="tahu" id="tahu"></div>
</div></section>

<section class="pad panca-sec"><div class="wrap">
  <p class="alis gelap">Makna logo</p>
  <h2 class="judul-besar">Lima lapis Panca Cinta</h2>
  <p class="soft">Lima lapis pasir di dalam jam pasir logo Ruang Historia adalah lima nilai yang ingin dirawat lewat belajar sejarah.</p>
  <ol class="panca">${PANCA.map((c, i) => `<li style="--c:${c[0]}"><span class="no">${i + 1}</span><b>${c[1]}</b><span>${c[2]}</span></li>`).join('')}</ol>
  <p style="margin-top:16px"><a class="btn" href="#logo">Baca filosofi logo lengkap</a></p>
</div></section>

<section class="pad"><div class="wrap">
  <p class="alis gelap">Cara belajar</p>
  <h2 class="judul-besar">Empat langkah tiap bab</h2>
  <ol class="langkah">
    <li><b>Baca</b><span>Materi ringkas dan jelajah interaktif.</span></li>
    <li><b>Tonton</b><span>Video pendek rangkuman bab.</span></li>
    <li><b>Uji</b><span>Kuis dengan pembahasan, target nilai 70.</span></li>
    <li><b>Renungkan</b><span>Soal uraian dan refleksi Panca Cinta.</span></li>
  </ol>
  ${selesai ? `<p style="margin-top:18px"><a class="btn" href="#nilai">Lihat nilaiku (${selesai} bab)</a></p>` : ''}
</div></section>
<section class="pad kel-sec"><div class="wrap">
  <p class="alis gelap">Keluarga aplikasi</p>
  <h2 class="judul-besar">Satu guru, satu ekosistem</h2>
  <p class="soft">Ruang Historia untuk belajar. Lanjutkan ke aplikasi saudaranya untuk bermain, ulangan, dan administrasi kelas.</p>
  <div class="kel-grid">${KELUARGA.map(x => `<a class="kel" href="${x[1]}" target="_blank" rel="noopener" style="--c:${x[2]}"><small>${x[3]}</small><b>${x[0]}</b><span>${x[4]}</span><i>Buka aplikasi ↗</i></a>`).join('')}</div>
  <p class="catatan" style="margin-top:14px">Nilai kuis Ruang Historia tersimpan di perangkat ini saja. Foto dari Wikimedia Commons dengan lisensi terbuka; rujukan di halaman <a href="#tentang">Tentang</a>.</p>
</div></section>`;

  const p = document.getElementById('pasang');
  if (pasang) p.hidden = false;
  p.addEventListener('click', async () => { if (!pasang) return; pasang.prompt(); await pasang.userChoice; pasang = null; p.hidden = true; });
  document.querySelector('a[href="#ruang-pilih"]').addEventListener('click', e => { e.preventDefault(); document.getElementById('ruang-pilih').scrollIntoView({ behavior: 'smooth' }); });

  // Tahukah kamu?
  const KS = semuaKartu(), tahu = document.getElementById('tahu');
  const acak = () => { const c = KS[Math.floor(Math.random() * KS.length)]; if (!c) return;
    tahu.innerHTML = `<p class="alis">Tahukah kamu?</p><h3>${esc(c.nama)}</h3><p class="info">${esc(c.info || '')}</p><p>${esc(c.isi)}</p><div class="row"><a class="btn emas" href="#${c.kid}-${c.id}">Buka bab: ${esc(c.bab)}</a><button class="btn kaca" type="button" id="acak">Fakta lain</button></div><small>${esc(c.k)}</small>`;
    document.getElementById('acak').onclick = acak; };
  acak();

  // Foto: sampul ruang, polaroid, pita berjalan
  ambilGambar().then(G => {
    if (!document.getElementById('pita')) return;
    const semua = Object.entries(G).flatMap(([kunci, L]) => L.map(g => ({ ...g, kunci })));
    if (!semua.length) { document.querySelector('.jejak-sec').remove(); return; }
    document.getElementById('jml-foto').textContent = semua.length;
    const cari = j => semua.find(g => g.judul === j);
    K.forEach(k => { const g = cari(SAMPUL[k.id]) || semua.find(x => x.kunci.startsWith(k.id + '-')); const el = document.querySelector(`[data-sampul="${k.id}"]`); if (g && el) el.style.backgroundImage = `url("${g.file}")`; });
    ['Nekara Bulan Pejeng, Bali', 'Naskah Proklamasi ketikan', 'Masjid Agung Demak'].forEach((j, i) => { const g = cari(j), f = document.querySelector('.p' + (i + 1)); if (g && f) f.innerHTML = `<img src="${esc(g.file)}" alt=""><figcaption>${esc(g.judul)}</figcaption>`; });
    const pil = semua.filter((g, i, a) => a.findIndex(x => x.file === g.file) === i).sort(() => Math.random() - .5).slice(0, 18);
    const isi = pil.map(g => `<a href="#${g.kunci}" title="${esc(g.judul)}"><img src="${esc(g.file)}" alt="${esc(g.judul)}" loading="lazy" onerror="this.parentElement.remove()"><span>${esc(g.judul)}</span></a>`).join('');
    document.querySelector('.pita-jalan').innerHTML = isi + isi.replace(/<a /g, '<a aria-hidden="true" tabindex="-1" ');
  });
}

/* ---------- RUANG: daftar bab satu koleksi ---------- */
function ruang(kid) {
  tandaiMenu(''); ambilAtur();
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
${babakAktif() ? `<div class="box babak-info"><b>Mode babak${konfig().nama ? ` · kelas ${esc(konfig().nama)}` : ''}</b> · KKM ${konfig().kkm}<div class="prog" style="margin:10px 0 6px"><i style="width:${ada.length ? ada.filter(d => lulusBab(kid, d.id)).length / ada.length * 100 : 0}%"></i></div>${ada.filter(d => lulusBab(kid, d.id)).length} dari ${ada.length} babak lulus · ${ada.reduce((s, d) => s + jumlahBintang(nilaiBab(kid, d.id)), 0)} ★ terkumpul</div>` : ''}
<div class="grid">${D.map(d => { const b = isiBab(kid, d.id), v = n[`${kid}-bab${d.id}`], buka = !b || terbuka(kid, d.id), bt = v ? jumlahBintang(v.terbaik) : 0;
    return `<a class="bab ${b ? '' : 'kunci'} ${buka ? '' : 'gembok'}" href="#${kid}-${d.id}" style="--c:${d.warna}"><small>${babakAktif() ? 'Babak' : 'Bab'} ${d.id} · ${esc(d.masa)}</small><b>${esc(d.judul)}</b><span>${esc(d.ringkas)}</span><span class="st">${!b ? 'Segera hadir' : !buka ? `${IKON_GEMBOK} ${belumDibukaGuru(kid, d.id) ? 'Belum dibuka guru' : 'Terkunci'}` : v ? `${bt ? bintangHTML(bt) : ''} Nilai terbaik ${v.terbaik}${babakAktif() && !bt ? ' · belum KKM' : ''}` : 'Siap dipelajari'}</span></a>`; }).join('')}</div>
</div></section>`;
}

/* ---------- HALAMAN BAB ---------- */
function bab(kid, id, tab) {
  tandaiMenu('');
  const k = cariK(kid), d = k.bab.find(x => x.id === id), b = isiBab(kid, id);
  if (!d) return ruang(kid);
  if (b && !terbuka(kid, id)) return terkunci(kid, id);
  if (b) S.set('terakhir', [kid, id]);
  const atas = `<a class="balik" href="#${kid}">${esc(k.judul)}</a>`;
  if (!b) {
    app.innerHTML = `<section class="babhead pad" style="--c:${d.warna}"><div class="wrap">${atas}<small>Bab ${id}</small><h1>${esc(d.judul)}</h1><p>${esc(d.ringkas)}</p></div></section><section class="pad"><div class="wrap"><div class="box"><h3>Segera hadir</h3><p>Materi, video, dan soal bab ini sedang disusun.</p><a class="btn" href="#${kid}">Kembali ke ${esc(k.judul)}</a></div></div></section>`;
    return;
  }
  const T = [['materi', 'Materi', 'buku'], ['video', 'Video', 'putar'], ['kuis', 'Kuis', 'ceklis'], ['esai', 'Uraian', 'pena'], ['istilah', 'Istilah', 'kamus']];
  tab = tab || 'materi';
  app.innerHTML = `<section class="babhead pad" style="--c:${d.warna}"><div class="wrap">${atas}
<small>Bab ${id} · ${esc(d.masa)}</small><h1>${esc(b.judul)}</h1><p>${esc(b.sub)}</p>
<div class="seg" role="tablist">${T.map(t => `<button role="tab" type="button" data-t="${t[0]}" aria-selected="${t[0] === tab}">${ikon(t[2])}<span>${t[1]}</span></button>`).join('')}</div>
</div></section><section class="pad"><div class="wrap" id="isi"></div></section>`;
  const isi = document.getElementById('isi');
  const tampil = t => {
    app.querySelectorAll('.seg button').forEach(x => { x.setAttribute('aria-selected', x.dataset.t === t); if (x.dataset.t === t) x.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
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
    if (t === 'materi') { pasangGaleri(kid, id); isi.insertAdjacentHTML('beforeend', `<div class="box ajak"><b>Sudah selesai membaca?</b> Catat poin-poin penting di buku catatanmu, lalu uji pemahamanmu.<button class="btn" type="button" data-ke="kuis">Lanjut ke kuis</button></div>`); }
    if (t === 'kuis') pasangMasuk(isi, () => tampil('kuis'));
    if (t === 'kuis') { const kotak = isi.querySelector('.siap'); if (kotak) kotak.addEventListener('change', () => { const ok = [...kotak.querySelectorAll('input')].every(x => x.checked); const sp = S.get('siap', {}); sp[`${kid}-${id}`] = ok; S.set('siap', sp); const m = isi.querySelector('#mulai'), boleh = ok && !perluMasuk(); m.classList.toggle('mati', !boleh); m.setAttribute('aria-disabled', !boleh); }); }
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
${b.bagian.map(s => `<h2 style="margin-top:28px">${esc(s.judul)}</h2>${s.isi.replace(/<table/g, '<div class="tabel"><table').replace(/<\/table>/g, '</table></div>')}${s.kartu ? kartu(b) : ''}${s.cinta ? `<div class="cinta"><b>Refleksi ${esc(s.cinta[0].replace(/^Cinta/, 'cinta'))}.</b> ${esc(s.cinta[1])}</div>` : ''}`).join('')}
<div class="box row" style="justify-content:space-between"><span>Sudah selesai membaca? Uji pemahamanmu.</span><button class="btn" type="button" data-ke="kuis">Kerjakan kuis</button></div>`;
}
/* Foto bersejarah dari Wikimedia Commons (lihat alat/cari_gambar.py) */
const pembuat = t => { t = (t || '').replace(/(Unknown author|Unknown)+/gi, 'Pembuat tidak diketahui').replace(/(Pembuat tidak diketahui)(\s*\1)+/g, '$1').trim(); return t ? t.slice(0, 80) + ' · ' : ''; };
async function pasangGaleri(kid, id) {
  await ambilGambar();
  const L = DAFTAR_GAMBAR[`${kid}-${id}`], el = document.getElementById('galeri');
  if (!el || !L || !L.length) return;
  const sumber = g => g.guru ? `<small class="dari-guru">Ditambahkan guru</small>` : `<small>${esc(pembuat(g.pembuat))}${esc(g.lisensi || '')} · <a href="${esc(g.halaman)}" target="_blank" rel="noopener">sumber</a></small>`;
  el.innerHTML = `<h2>Jejak sejarah</h2><p class="catatan">Foto, dokumen, dan ilustrasi sejarah. Ketuk gambar untuk memperbesar.</p><div class="galeri">${L.map((g, i) => `<figure><button type="button" class="perbesar" data-i="${i}" aria-label="Perbesar: ${esc(g.judul)}"><img src="${esc(g.file)}" alt="${esc(g.judul)}" loading="lazy" onload="if(this.naturalHeight>this.naturalWidth*1.1)this.closest('figure').classList.add('tegak')" onerror="this.closest('figure').remove()"></button><figcaption><b>${esc(g.judul)}</b>${g.ket ? `<span>${esc(g.ket)}</span>` : ''}${sumber(g)}</figcaption></figure>`).join('')}</div>`;
  el.querySelectorAll('.perbesar').forEach(b => b.addEventListener('click', () => lihatBesar(L, +b.dataset.i)));
}
/* tampilan foto layar penuh */
function lihatBesar(L, i) {
  let d = document.getElementById('lb');
  if (!d) { d = document.createElement('dialog'); d.id = 'lb'; document.body.append(d);
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('.lb-tutup')) d.close(); });
    d.addEventListener('keydown', e => { if (e.key === 'ArrowRight') d.geser(1); if (e.key === 'ArrowLeft') d.geser(-1); }); }
  const isi = () => { const g = L[i]; d.innerHTML = `<figure><img src="${esc(g.file)}" alt="${esc(g.judul)}"><figcaption><b>${esc(g.judul)}</b>${g.ket ? `<em>${esc(g.ket)}</em>` : ''}<span>${i + 1} / ${L.length}</span></figcaption></figure>
    <button class="lb-tutup" type="button" aria-label="Tutup">✕</button>${L.length > 1 ? `<button class="lb-n kiri" type="button" aria-label="Sebelumnya">‹</button><button class="lb-n kanan" type="button" aria-label="Berikutnya">›</button>` : ''}`;
    d.querySelectorAll('.lb-n').forEach(b => b.onclick = e => { e.stopPropagation(); d.geser(b.classList.contains('kanan') ? 1 : -1); }); };
  d.geser = s => { i = (i + s + L.length) % L.length; isi(); };
  isi(); d.showModal();
}
const kartu = b => `<p class="catatan">Klik kartu untuk membalik.</p><div class="cards">${b.kartu.map((c, i) => `<button class="flip" type="button" aria-pressed="false"><div class="inner"><div class="face"><b>${esc(c.nama)}</b><small>${esc(c.info)}</small>${b.koleksi === 'indonesia' && b.id === 1 ? kepala(i) : `<span class="mono" aria-hidden="true">${esc(c.nama.split(/\s+/).filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('') || c.nama[0])}</span>`}</div><div class="face back">${esc(c.isi)}</div></div></button>`).join('')}</div>`;
function pasangJelajah(b) {
  const L = b.jelajah.lapisan, st = document.getElementById('strata'), pn = document.getElementById('panel');
  const show = k => { const x = L[k]; pn.innerHTML = `<small>${b.jelajah.mode === 'waktu' ? 'Bagian' : 'Lapisan'} ${k + 1} dari ${L.length}</small><h3>${esc(x.n)}</h3><p>${esc(x.t)}</p><dl>${x.d.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl><p class="catatan">${esc(x.ket)}</p>`; st.querySelectorAll('.layer').forEach(e => e.setAttribute('aria-pressed', e.dataset.k == k)); };
  st.addEventListener('click', e => { const x = e.target.closest('.layer'); if (x) { show(+x.dataset.k); if (innerWidth < 820) pn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } });
  show(b.jelajah.mode === 'waktu' ? 0 : L.length - 1);
}
const video = b => `<h2>${esc(b.video.judul)}</h2><video class="vid" controls preload="metadata" playsinline poster="${esc(b.video.src.replace(/\.mp4$/, ".jpg"))}" src="${esc(b.video.src)}"></video><p class="catatan" style="margin-top:12px">${esc(b.video.durasi)}. ${esc(b.video.catatan)}</p><div class="box row" style="justify-content:space-between"><span>Selesai menonton? Coba kuisnya.</span><button class="btn" type="button" data-ke="kuis">Kerjakan kuis</button></div>`;
const kuisAwal = (b, kid, id) => { const v = S.get('nilai', {})[`${kid}-bab${id}`], bab_ = babakAktif(), siap = siapKuis(kid, id), c = konfig();
  return `<h2>Kuis Bab ${id}</h2><p>${b.soal.length} soal pilihan ganda, termasuk soal analisis (HOTS). Setiap jawaban langsung diberi pembahasan, dan urutan pilihan jawaban diacak. Nilai terbaikmu disimpan.</p>
${bab_ ? `<div class="box babak-info"><b>Mode babak${c.nama ? ` · kelas ${esc(c.nama)}` : ''}</b><br>KKM: <b>${c.kkm}</b>. Lulus kuis ini untuk membuka ${babBerikut(kid, id) ? `Babak ${babBerikut(kid, id).id}` : 'ujian akhir'}.</div>
<div class="box siap"><h3>Sebelum mulai</h3><label class="cek"><input type="checkbox" ${siap ? 'checked' : ''}> Saya sudah membaca seluruh materi Bab ${id}.</label><label class="cek"><input type="checkbox" ${siap ? 'checked' : ''}> Saya sudah mencatat poin-poin penting di buku catatan.</label></div>` : ''}
${v ? `<div class="box">Nilai terbaik: <b>${v.terbaik}</b> ${bab_ || v.terbaik >= c.kkm ? bintangHTML(jumlahBintang(v.terbaik)) : ''} · terakhir ${v.terakhir} · sudah ${v.kali} kali</div>` : ''}
${perluMasuk() ? formMasuk() : siswaAktif() && konfig().rekap ? `<p class="catatan">Masuk sebagai <b>${esc(siswaAktif().nama)}</b> (${esc(siswaAktif().kelas)}). Nilaimu akan dikirim ke guru.</p>` : ''}
<a class="btn ${(bab_ && !siap) || perluMasuk() ? 'mati' : ''}" id="mulai" href="#${kid}-${id}-kuis" aria-disabled="${(bab_ && !siap) || perluMasuk()}">Mulai kuis</a>`; };
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
    let infoKirim = '';
    if (o.kirim && konfig().rekap && siswaAktif() && !modeGuru()) {
      o.kirim({ nilai, benar: skor, total: list.length, butir: list.map((q, k) => ({ no: k + 1, q: q.q.slice(0, 220), b: jawab[k] === q.a ? 1 : 0 })) });
      infoKirim = `<p class="catatan kirim-info">${navigator.onLine ? 'Nilai dikirim ke rekap guru.' : 'Belum ada internet. Nilai akan dikirim otomatis saat tersambung.'}</p>`;
    }
    const kkm = konfig().kkm, pesan = nilai >= 90 ? 'Luar biasa! Pemahamanmu sangat baik.' : nilai >= kkm ? 'Bagus, sudah tuntas. Pelajari lagi soal yang salah.' : 'Belum tuntas. Baca ulang materinya, lalu coba lagi.';
    document.querySelector('.sticky').remove();
    qq.innerHTML = `<div class="hasil"><big>${nilai}</big>${skor} benar dari ${list.length} soal<p style="margin:8px auto 0;color:#fff">${pesan}</p></div>
${infoKirim}${o.setelah ? o.setelah(nilai) : ''}<div class="row" style="margin-bottom:20px"><button class="btn" type="button" id="ulang">Ulangi</button><a class="btn alt" href="${o.balik}">Kembali</a></div>
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
  if (!terbuka(kid, id)) return terkunci(kid, id);
  if ((babakAktif() && !siapKuis(kid, id)) || perluMasuk()) { history.replaceState(null, '', `#${kid}-${id}`); return bab(kid, id, 'kuis'); }
  const sudahLulus = lulusBab(kid, id);
  jalankan(b.soal, { mode: 'latihan', judul: `Kuis Bab ${id}. ${b.judul}`, kunci: `${kid}-bab${id}`, balik: `#${kid}-${id}`, ulang: () => kuis(kid, id),
    kirim: r => kirimNilai({ kolom: `${NAMA_KOLOM[kid] || kid} Bab ${id}`, judul: b.judul, jenis: 'kuis', ...r }),
    setelah: v => { if (!babakAktif()) return ''; const c = konfig(), nx = babBerikut(kid, id);
      if (v >= c.kkm) return `<div class="box naik ${sudahLulus ? '' : 'baru'}"><div>${bintangHTML(jumlahBintang(nilaiBab(kid, id)))}</div><b>${sudahLulus ? `Babak ${id} sudah lulus.` : `Selamat, Babak ${id} lulus!`}</b><p>${nx ? `Babak ${nx.id}: ${esc(nx.judul)} ${sudahLulus ? 'sudah' : 'kini'} terbuka.` : 'Semua babak di ruang ini sudah kamu selesaikan. Ujian akhir terbuka!'}</p><a class="btn" href="${nx ? `#${kid}-${nx.id}` : `#${kid}-ujian`}">${nx ? `Lanjut ke Babak ${nx.id}` : 'Ke ujian akhir'}</a></div>`;
      return `<div class="box belum"><b>Belum mencapai KKM (${c.kkm}).</b><p>Baca ulang materinya dan catatanmu, perhatikan pembahasan di bawah, lalu coba lagi. Babak berikutnya terbuka setelah kamu lulus.</p></div>`; } });
}

/* ---------- UJIAN AKHIR per ruang ---------- */
function ujian(kid) {
  tandaiMenu(''); clearInterval(jam);
  const k = cariK(kid), ada = tersedia(k);
  const belum = babakAktif() ? ada.filter(d => !lulusBab(kid, d.id)) : [];
  if (belum.length) { app.innerHTML = `<section class="pad"><div class="wrap kunci-hal"><div class="gembok-besar" style="--c:${k.warna}">${IKON_GEMBOK}</div><h1>Ujian akhir ${esc(k.judul)}</h1><p>Ujian akhir terbuka setelah semua babak lulus (nilai kuis ≥ ${konfig().kkm}). Babak yang belum lulus:</p><ul class="langkah-kunci">${belum.map(d => `<li><a href="#${kid}-${d.id}">Bab ${d.id}. ${esc(d.judul)}</a> · nilai terbaik ${nilaiBab(kid, d.id)}</li>`).join('')}</ul><a class="btn" href="#${kid}">Peta babak</a></div></section>`; return; }
  if (perluMasuk()) { app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:600px"><h1>Ujian akhir ${esc(k.judul)}</h1>${formMasuk()}</div></section>`; pasangMasuk(app, () => ujian(kid)); return; }
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
    jalankan(list, { mode: 'ujian', menit: Math.round(n * 1.5), judul: `Ujian akhir · ${n} soal`, kunci: `${kid}-ujian`, balik: '#nilai', ulang: () => ujian(kid),
      kirim: r => kirimNilai({ kolom: `${NAMA_KOLOM[kid] || kid} Ujian`, judul: `Ujian akhir ${k.judul}`, jenis: 'ujian', nilai: r.nilai, benar: r.benar, total: r.total }) });
  });
}

/* ---------- NILAI ---------- */
function nilai() {
  tandaiMenu('nilai'); clearInterval(jam);
  const n = S.get('nilai', {});
  const blok = K.filter(k => tersedia(k).length).map(k => {
    const baris = [...tersedia(k).map(d => [`${k.id}-bab${d.id}`, `Bab ${d.id}. ${d.judul}`]), [`${k.id}-ujian`, 'Ujian akhir']];
    return `<h2 style="margin-top:24px">${esc(k.judul)}</h2><div style="overflow-x:auto"><table class="nilai"><thead><tr><th>Bagian</th><th>Dikerjakan</th><th>Terakhir</th><th>Terbaik</th></tr></thead><tbody>${baris.map(r => { const v = n[r[0]]; return `<tr><td>${esc(r[1])}</td><td>${v ? v.kali + '× · ' + v.tgl : 'belum'}</td><td>${v ? v.terakhir : '–'}</td><td><b style="color:${v ? (v.terbaik >= konfig().kkm ? 'var(--ok)' : 'var(--bad)') : 'inherit'}">${v ? v.terbaik : '–'}</b></td></tr>`; }).join('')}</tbody></table></div>`;
  }).join('');
  const s = siswaAktif(), c = konfig(), antre = S.get('antrean', []).length;
  const identitas = c.rekap ? (s ? `<div class="box identitas"><div><b>${esc(s.nama)}</b><br><small>Kelas ${esc(s.kelas)} · kode ${esc(s.kode)}</small></div><div><small>${antre ? `${antre} nilai menunggu dikirim (perlu internet)` : 'Semua nilai sudah terkirim ke guru'}</small><br><button class="btn alt" type="button" id="keluarsiswa">Keluar</button></div></div>` : formMasuk()) : '';
  app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:780px"><h1>Nilaiku</h1><div class="kartu-star"><div class="ks-angka">⭐ ${starSaya()}${poinTambah(starSaya()) !== null ? `<small>+${poinTambah(starSaya())} nilai tambah</small>` : ''}</div><div><b>Historia Star kamu</b><small>${starKuisSaya()} dari kuis tiap babak${S.get('starGuru', 0) ? ` + ${S.get('starGuru', 0)} dari guru` : ''}. Raih ⭐ dengan lulus KKM (1), nilai ≥ 90 (2), atau nilai 100 (3), dan menangkan challenge di kelas!</small></div></div>${identitas}<p>Nilai juga tersimpan di perangkat ini. KKM yang dipakai: ${c.kkm}${c.nama ? ` (kelas ${esc(c.nama)})` : ''}.</p>${blok}
<button class="btn alt" type="button" id="hapus" style="margin-top:12px">Hapus semua nilai</button></div></section>`;
  pasangMasuk(app, nilai);
  const ks = document.getElementById('keluarsiswa'); if (ks) ks.addEventListener('click', e => { if (!e.target.dataset.yakin) { e.target.dataset.yakin = 1; e.target.textContent = 'Yakin keluar? Tekan lagi'; return; } S.set('siswa', null); S.set('atur', null); nilai(); });
  if (antre) kirimAntrean().then(() => { if (document.querySelector('.identitas') && !S.get('antrean', []).length) nilai(); });
  document.getElementById('hapus').addEventListener('click', e => { if (!e.target.dataset.yakin) { e.target.dataset.yakin = 1; e.target.textContent = 'Yakin? Tekan sekali lagi'; return; } S.set('nilai', {}); nilai(); });
}

function tentang() {
  tandaiMenu('tentang'); clearInterval(jam);
  app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:780px"><h1>Tentang Ruang Historia</h1>
<p><a class="btn" href="#panduan">Buku panduan penggunaan (PDF)</a></p>
<p>Ruang Historia adalah aplikasi belajar sejarah interaktif untuk madrasah aliyah dan sekolah menengah. Setiap "ruang" berisi satu mata pelajaran: Sejarah Indonesia, Sejarah Dunia, dan Sejarah Kebudayaan Islam, dan ruang lain dapat ditambahkan. Materinya diperkaya nilai Panca Cinta dalam Kurikulum Berbasis Cinta Kementerian Agama: cinta kepada Allah dan Rasul-Nya, cinta ilmu, cinta diri dan sesama, cinta lingkungan, serta cinta tanah air.</p>
<h3>Cara belajar yang disarankan</h3><ol><li>Pilih ruang, lalu buka bab.</li><li>Baca materi dan jelajahi gambar interaktifnya.</li><li>Tonton video bab.</li><li>Kerjakan kuis sampai nilai minimal 70.</li><li>Kerjakan soal uraian dan diskusikan refleksi Panca Cinta di kelas.</li><li>Setelah beberapa bab, coba ujian akhir.</li></ol>
<h3>Rujukan utama</h3><ul><li>Buku teks Sejarah Indonesia dan Sejarah tingkat SMA/MA, Kementerian Pendidikan RI.</li><li>Buku Sejarah Kebudayaan Islam Madrasah Aliyah, Kementerian Agama RI.</li><li>Kementerian Agama RI (2025). <i>Panduan Kurikulum Berbasis Cinta di Madrasah</i>.</li><li>Soejono, R.P. dan Leirissa, R.Z. (ed.). <i>Sejarah Nasional Indonesia</i>. Balai Pustaka.</li><li>Ricklefs, M.C. <i>Sejarah Indonesia Modern</i>.</li><li>Azra, Azyumardi. <i>Jaringan Ulama Timur Tengah dan Kepulauan Nusantara Abad XVII dan XVIII</i>.</li><li>Bellwood, P. <i>Prehistory of the Indo-Malaysian Archipelago</i>. ANU Press.</li><li>Artikel ilmiah penanggalan situs purba: Sutikna dkk. (2016), Rizal dkk. (2020), Oktaviana dkk. (2024), jurnal <i>Nature</i>.</li></ul>
<h3>Bagian dari keluarga aplikasi</h3><ul>${KELUARGA.map(x => `<li><a href="${x[1]}" target="_blank" rel="noopener"><b>${x[0]}</b></a>: ${x[4]}</li>`).join('')}</ul>
<p>Saran pemakaian: pelajari materi di Ruang Historia, uji pemahaman dengan ulangan di ASESMENKU, lalu ajak kelas berlomba di HISTORIA PLAY! saat evaluasi atau jam kosong.</p>
<div class="hak">
<h3>Pengembang dan hak cipta</h3>
<p><b>Eki Ripan Junapratama Rahmatullah, S.Pd., M.Pd., Gr.</b> (Eki Ripan J.R. Tanjung)<br>Guru Sejarah, MAN 1 Belitung</p>
<p>© 2026 Eki Ripan Junapratama Rahmatullah. Hak cipta dilindungi undang-undang (UU No. 28 Tahun 2014 tentang Hak Cipta).</p>
<p>Materi, soal, video, desain, dan logo Ruang Historia boleh dipakai untuk pembelajaran di kelas. Menyalin, memperbanyak, atau mengedarkan ulang aplikasi ini untuk tujuan lain memerlukan izin tertulis dari pengembang. Foto arsip tetap mengikuti lisensi masing-masing sebagaimana tercantum pada keterangannya.</p>
<p>Saran dan masukan: <a href="mailto:ekiripantanjung@gmail.com">ekiripantanjung@gmail.com</a></p>
</div>
<details class="panduan"><summary>Panduan guru: menambah foto atau ilustrasi sendiri</summary>
<ol>
<li>Buka <a href="https://github.com/ekiripantanjung-prog/ruang-historia/tree/main/gambar/guru" target="_blank" rel="noopener">folder gambar/guru di GitHub</a> (masuk dengan akun GitHub Bapak/Ibu).</li>
<li>Klik <b>Add file → Upload files</b>, seret fotonya, lalu klik <b>Commit changes</b>.</li>
<li>Beri nama file dengan format <code>ruang-nomorbab judul.jpg</code>, misalnya <code>indonesia-8 Pembacaan teks Proklamasi.jpg</code> atau <code>ski-3 Peta wilayah Umayyah -- Sumber buku paket.jpg</code>. Kode ruang: <code>indonesia</code>, <code>dunia</code>, <code>ski</code>.</li>
<li>Tunggu 1–2 menit. Gambar muncul paling depan di bagian "Jejak sejarah" bab tersebut, dengan tanda "Ditambahkan guru".</li>
</ol>
<p class="catatan">Tulisan setelah <code>--</code> menjadi keterangan atau sumber. Untuk menghapus, buka filenya di GitHub lalu pilih Delete file.</p>
</details>
<p class="catatan">Guru dapat menambah atau mengubah materi dan soal pada folder <code>data/</code>.</p></div></section>`;
}

/* ---------- FILOSOFI LOGO ---------- */
function filosofi() {
  tandaiMenu('logo'); clearInterval(jam);
  const bagian = [
    ['#2B3A67', 'Lengkung mihrab', 'Bentuk gerbang melengkung diambil dari mihrab dan gapura. Ia adalah pintu masuk ke "ruang" sejarah, sekaligus pengingat bahwa belajar di madrasah berangkat dari nilai keislaman. Warnanya Biru Nila (#2B3A67), warna khas aplikasi ini: tenang, dalam, dan berwibawa.'],
    ['#FFF8EC', 'Jam pasir', 'Jam pasir adalah lambang waktu, bahan utama ilmu sejarah. Pasir di bagian atas adalah masa yang akan datang, pasir di bawah adalah masa lalu yang telah terkumpul. Belajar sejarah berarti menimbang keduanya.'],
    ['#F2C38F', 'Cahaya ilmu', 'Lingkaran bercahaya di bagian atas jam pasir adalah cahaya ilmu yang menerangi perjalanan waktu. Dari cahaya itulah butir-butir pasir mengalir turun.'],
    ['#E0B04A', 'Butir yang mengalir', 'Garis putus-putus di leher jam pasir adalah peristiwa demi peristiwa yang terus mengalir. Sejarah tidak pernah berhenti; setiap hari yang kita jalani akan menjadi sejarah.'],
    ['#E0B04A', 'Tutup atas dan bawah', 'Dua bilah emas yang mengapit jam pasir melambangkan masa lalu dan masa depan. Keduanya diikat oleh masa kini, tempat siswa belajar.'],
    ['#E0B04A', 'Ambang pintu', 'Bilah emas di dasar gerbang adalah ambang pintu: siapa pun yang melangkah masuk sedang memulai perjalanan menelusuri jejak sejarah.']
  ];
  const lapis = PANCA.map((c, i) => `<li style="--c:${c[0]}"><span class="no">${i + 1}</span><b>${c[1]}</b><span>${c[2]}</span></li>`).join('');
  app.innerHTML = `
<section class="sampul filo-sampul"><div class="wrap filo-isi">
  <div class="filo-logo"><div class="cahaya"></div><img class="logo-besar" src="icons/logo.svg" alt="Logo Ruang Historia"></div>
  <div>
    <p class="alis">Filosofi logo</p>
    <h1>Gerbang <em>Jam Pasir</em></h1>
    <p class="slogan">Pintu menuju masa lalu, dijaga oleh lima lapis cinta.</p>
    <p class="sampul-p">Logo Ruang Historia memadukan dua gagasan: <b>gerbang</b> sebagai ruang yang dimasuki siswa, dan <b>jam pasir</b> sebagai lambang waktu. Di dasar jam pasir mengendap lima lapis warna, yaitu lima nilai Panca Cinta dalam Kurikulum Berbasis Cinta.</p>
  </div>
</div>
<svg class="gelombang" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">${PANCA.map((c, i) => `<path d="M0 ${30 + i * 18} C 240 ${10 + i * 18}, 480 ${50 + i * 18}, 720 ${30 + i * 18} S 1200 ${10 + i * 18}, 1440 ${34 + i * 18} V120 H0Z" fill="${c[0]}"/>`).join('')}</svg>
</section>

<section class="pad"><div class="wrap" style="max-width:860px">
  <p class="alis gelap">Bagian demi bagian</p>
  <h2 class="judul-besar">Apa arti setiap unsur?</h2>
  <div class="unsur">${bagian.map(x => `<div class="unsur-i"><span class="swatch" style="background:${x[0]}"></span><div><b>${x[1]}</b><p>${x[2]}</p></div></div>`).join('')}</div>

  <p class="alis gelap" style="margin-top:36px">Lima lapis pasir</p>
  <h2 class="judul-besar">Panca Cinta, dari atas ke bawah</h2>
  <p class="soft">Kelima lapis itu mengendap di dasar jam pasir. Artinya, setelah waktu berlalu, yang tersisa dari belajar sejarah adalah nilai-nilai yang tertanam dalam diri.</p>
  <ol class="panca">${lapis}</ol>

  <p class="alis gelap" style="margin-top:36px">Warna khas</p>
  <h2 class="judul-besar">Biru Nila</h2>
  <div class="warna-khas"><span style="background:#2B3A67">#2B3A67<br><small>Biru Nila</small></span><span style="background:#1B2547">#1B2547<br><small>Nila malam</small></span><span style="background:#E0B04A;color:#2a1d14">#E0B04A<br><small>Emas</small></span><span style="background:#FFF8EC;color:#2a1d14">#FFF8EC<br><small>Krem</small></span></div>
  <div class="unsur" style="margin-top:16px">
    <div class="unsur-i"><span class="swatch" style="background:#2B3A67"></span><div><b>Warna warisan Nusantara</b><p>Nila (tarum) adalah pewarna alami tertua di Nusantara, dipakai turun-temurun untuk kain tenun dan batik. Nama Kerajaan Tarumanagara, salah satu kerajaan tertua di Indonesia, diyakini berasal dari kata <i>tarum</i>, tanaman penghasil warna nila.</p></div></div>
    <div class="unsur-i"><span class="swatch" style="background:#1B2547"></span><div><b>Tinta para penulis sejarah</b><p>Warna biru tua mengingatkan pada tinta naskah, prasasti, dan arsip, sumber utama yang dipakai sejarawan untuk mengenal masa lalu.</p></div></div>
    <div class="unsur-i"><span class="swatch" style="background:linear-gradient(#1B2547,#2B3A67)"></span><div><b>Langit tempat waktu berjalan</b><p>Biru nila adalah warna langit menjelang fajar: masa lalu yang gelap perlahan diterangi cahaya ilmu, seperti lingkaran cahaya di dalam jam pasir.</p></div></div>
    <div class="unsur-i"><span class="swatch" style="background:#E0B04A"></span><div><b>Emas sebagai pendamping</b><p>Emas melambangkan nilai luhur yang diwariskan sejarah. Paduan nila dan emas berarti ketenangan berpikir yang menjaga kemuliaan warisan.</p></div></div>
  </div>

  <blockquote class="ringkas">"Masuklah ke ruang sejarah, biarkan waktu mengajarkanmu, dan bawalah pulang lima lapis cinta."</blockquote>
  <p class="catatan">Logo dan filosofi dirancang untuk Ruang Historia · ${HAK}</p>
</div></section>`;
}

/* ---------- PENGATURAN KELAS, MODE GURU, DAN BABAK ---------- */
const PG = window.PENGATURAN || { modeBabak: true, kkm: 75 };
const konfig = () => { const c = { modeBabak: PG.modeBabak, kkm: PG.kkm, buka: {}, nama: '', rekap: PG.rekap || '', ...S.get('kelas', {}) }; if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(c.rekap || '')) c.rekap = ''; const at = S.get('atur', null); if (c.rekap && at && at.kkm) c.kkm = at.kkm; c.kkm = Math.min(100, Math.max(0, +c.kkm || 75)); return c; };
const modeGuru = () => !!S.get('guru', false);
const babakAktif = () => konfig().modeBabak && !modeGuru();
const nilaiBab = (kid, id) => (S.get('nilai', {})[`${kid}-bab${id}`] || {}).terbaik || 0;
const lulusBab = (kid, id) => nilaiBab(kid, id) >= konfig().kkm;
const jumlahBintang = v => v >= 100 ? 3 : v >= 90 ? 2 : v >= konfig().kkm ? 1 : 0;
const bintangHTML = n => `<span class="bintang" aria-label="${n} dari 3 Historia Star" title="Historia Star">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}">★</i>`).join('')}</span>`;
const babSebelum = (kid, id) => { const a = tersedia(cariK(kid)), i = a.findIndex(d => d.id === id); return i > 0 ? a[i - 1] : null; };
const babBerikut = (kid, id) => { const a = tersedia(cariK(kid)), i = a.findIndex(d => d.id === id); return i >= 0 && i < a.length - 1 ? a[i + 1] : null; };
const batasGuru = kid => { const at = S.get('atur', null); return konfig().rekap && siswaAktif() && at && at.batas && kid in at.batas ? at.batas[kid] : null; };
const belumDibukaGuru = (kid, id) => !modeGuru() && batasGuru(kid) !== null && id > batasGuru(kid);
const terbuka = (kid, id) => { if (belumDibukaGuru(kid, id)) return false; if (!babakAktif()) return true; const p = babSebelum(kid, id); if (!p) return true; if ((konfig().buka[kid] || 0) >= id) return true; return lulusBab(kid, p.id); };
const siapKuis = (kid, id) => !!S.get('siap', {})[`${kid}-${id}`];
const IKON_GEMBOK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2.5" fill="currentColor"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2.4" fill="none"/></svg>';

function terkunci(kid, id) {
  tandaiMenu('');
  const k = cariK(kid), d = k.bab.find(x => x.id === id), p = babSebelum(kid, id), c = konfig();
  app.innerHTML = `<section class="pad"><div class="wrap kunci-hal">
<div class="gembok-besar" style="--c:${d.warna}">${IKON_GEMBOK}</div>
<small>${esc(k.judul)} · Babak ${id}</small><h1>${esc(d.judul)}</h1>
${belumDibukaGuru(kid, id) ? `<p>Bab ini <b>belum dibuka oleh gurumu</b>. Bab akan terbuka ketika materinya mulai dibahas di kelas.</p><p class="catatan">Sementara itu, pastikan bab-bab sebelumnya sudah lulus.</p><div class="row" style="justify-content:center"><a class="btn" href="#${kid}">Peta babak</a></div>` : `<p>Babak ini masih terkunci. Selesaikan dulu <b>Bab ${p.id}. ${esc(p.judul)}</b>:</p>
<ol class="langkah-kunci"><li>Baca seluruh materinya.</li><li>Catat poin-poin penting di buku catatanmu.</li><li>Kerjakan kuisnya sampai nilaimu minimal <b>${c.kkm}</b> (KKM).</li></ol>
<p>Nilai terbaikmu di Bab ${p.id} sekarang: <b>${nilaiBab(kid, p.id)}</b></p>
<div class="row" style="justify-content:center"><a class="btn" href="#${kid}-${p.id}">Buka Bab ${p.id}</a><a class="btn alt" href="#${kid}">Peta babak</a></div>`}</div></section>`;
}

/* ---------- REKAP NILAI KE GOOGLE SHEETS ---------- */
const siswaAktif = () => S.get('siswa', null);
const perluMasuk = () => !!konfig().rekap && !siswaAktif() && !modeGuru();
const NAMA_KOLOM = { indonesia: 'Indonesia', dunia: 'Dunia', ski: 'SKI' };
const formMasuk = () => `<form class="box masuk" data-masuk><h3>Masuk dengan kode siswa</h3><p>Gurumu memakai rekap nilai. Masukkan kode siswa (6 huruf/angka) dari guru supaya nilaimu tercatat.</p><input class="isian" name="kode" maxlength="8" autocomplete="off" autocapitalize="characters" placeholder="contoh: 2FDX8S" required><p class="catatan pesan-masuk"></p><button class="btn" type="submit">Masuk</button></form>`;
/* nilai dari Google Sheets dikembalikan ke perangkat (misalnya siswa ganti HP) */
function pulihkanNilai(riwayat) {
  if (!riwayat || typeof riwayat !== 'object') return 0;
  const balik = Object.fromEntries(Object.entries(NAMA_KOLOM).map(([k, v]) => [v, k])), n = S.get('nilai', {}); let jml = 0;
  Object.entries(riwayat).forEach(([kol, v]) => {
    const m = String(kol).match(/^(.+?) (?:Bab (\d+)|(Ujian))$/); const kid = m && balik[m[1]]; if (!kid) return;
    const kunci = m[3] ? `${kid}-ujian` : `${kid}-bab${m[2]}`, nilai = Math.max(0, Math.min(100, Math.round(+v || 0)));
    const lama = n[kunci] || { terbaik: 0, kali: 0 };
    if (nilai > lama.terbaik) { n[kunci] = { ...lama, terbaik: nilai, terakhir: lama.terakhir ?? nilai, kali: Math.max(1, lama.kali || 0), tgl: lama.tgl || 'dipulihkan' }; jml++; }
  });
  S.set('nilai', n); return jml;
}
function pasangMasuk(akar, setelah) {
  akar.querySelectorAll('[data-masuk]').forEach(f => f.addEventListener('submit', async e => {
    e.preventDefault();
    const kode = f.kode.value.trim().toUpperCase(), pesan = f.querySelector('.pesan-masuk'), tb = f.querySelector('button');
    tb.disabled = true; pesan.textContent = 'Memeriksa kode…';
    try {
      const r = await fetch(`${konfig().rekap}?aksi=masuk&kode=${encodeURIComponent(kode)}`).then(x => x.json());
      if (r.ok) { S.set('siswa', { kode, nama: r.nama, kelas: r.kelas, no: r.no }); pulihkanNilai(r.riwayat); if (typeof r.star === 'number') S.set('starGuru', r.star); if (r.konversi) S.set('konversiStar', r.konversi); await ambilAtur(); setelah(); }
      else pesan.textContent = r.pesan || 'Kode tidak dikenal.';
    } catch { pesan.textContent = 'Tidak dapat terhubung. Periksa internet, lalu coba lagi.'; }
    tb.disabled = false;
  }));
}
async function kirimAntrean() {
  const url = konfig().rekap, q = S.get('antrean', []);
  if (!url || !q.length || !navigator.onLine) return;
  const sisa = [];
  for (const d of q) {
    try { await fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) }); }
    catch { sisa.push(d); }
  }
  S.set('antrean', sisa.concat(S.get('antrean', []).filter(d => !q.some(x => x.id === d.id))));
}
function kirimNilai(o) {
  const s = siswaAktif(); if (!konfig().rekap || !s || modeGuru()) return null;
  const d = { aksi: 'nilai', kode: s.kode, kkm: konfig().kkm, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), ...o };
  S.set('antrean', S.get('antrean', []).concat(d));
  return kirimAntrean();
}
let aturTerakhir = 0;
async function ambilAtur() {
  const s = siswaAktif(), url = konfig().rekap; if (!s || !url || !navigator.onLine || Date.now() - aturTerakhir < 20000) return; aturTerakhir = Date.now();
  try { const r = await fetch(`${url}?aksi=atur&kode=${encodeURIComponent(s.kode)}`).then(x => x.json()); if (r.ok) { if (typeof r.star === 'number') S.set('starGuru', r.star); if (r.konversi) S.set('konversiStar', r.konversi); const baru = { batas: r.batas || {}, kkm: r.kkm || null }, lama = S.get('atur', null); S.set('atur', baru); if (JSON.stringify(lama) !== JSON.stringify(baru) && !/kuis|ujian|guru|slide/.test(location.hash)) rute(); } } catch {}
}
addEventListener('online', () => { kirimAntrean(); ambilAtur(); });
setTimeout(ambilAtur, 1500);
setTimeout(kirimAntrean, 3000);

/* ---------- PANEL GURU ---------- */
const normKode = k => String(k).toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^RH/, '');
async function kodeAktivasi(nama) { const h = await sha256('ruang-historia-aktivasi:' + nama.toLowerCase().replace(/\s+/g, ' ').trim() + ':' + (PG.pin || '')); let s = ''; for (let i = 0; i < 8; i++) s += HURUF_KODE[parseInt(h.substr(i * 2, 2), 16) % HURUF_KODE.length]; return `RH-${s.slice(0, 4)}-${s.slice(4)}`; }
const HURUF_KODE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const sha256 = async t => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))].map(x => x.toString(16).padStart(2, '0')).join('');
const muatSkrip = src => new Promise((ok, gagal) => { if (document.querySelector(`script[data-lib="${src}"]`)) return ok(); const s = document.createElement('script'); s.src = src; s.dataset.lib = src; s.onload = ok; s.onerror = gagal; document.head.append(s); });
const alamatDasar = () => location.origin + location.pathname;
const kodeKelas = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const bacaKelas = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
async function qrSVG(teks, ukuran = 220) { await muatSkrip('lib/qrcode.js'); const q = qrcode(0, 'M'); q.addData(teks); q.make(); const n = q.getModuleCount(), c = ukuran / (n + 8); let p = ''; for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) p += `M${((k + 4) * c).toFixed(2)} ${((r + 4) * c).toFixed(2)}h${c.toFixed(2)}v${c.toFixed(2)}h-${c.toFixed(2)}z`; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ukuran} ${ukuran}" width="${ukuran}" height="${ukuran}" role="img" aria-label="Kode QR"><rect width="100%" height="100%" fill="#fff"/><path d="${p}" fill="#111"/></svg>`; }
async function qrPNG(teks, ukuran = 600) { const svg = await qrSVG(teks, ukuran); const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode(); const cv = document.createElement('canvas'); cv.width = cv.height = ukuran; cv.getContext('2d').drawImage(img, 0, 0); return cv.toDataURL('image/png'); }

function panelGuru(sub = '') {
  tandaiMenu('guru');
  if (!modeGuru()) {
    app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:520px"><h1>Panel Guru</h1>
<p>Panel ini berisi pembuat presentasi, modul ajar, soal ulangan, dan pengaturan kelas. Masukkan PIN guru untuk membuka.</p>
<form class="box" id="fpin"><label for="pin"><b>PIN guru</b></label><input id="pin" class="isian" type="password" inputmode="numeric" autocomplete="off" required>
<p class="catatan" id="pesanpin" style="margin-top:10px">Siswa tidak memerlukan panel ini.</p><button class="btn" type="submit">Masuk</button></form>
<details class="box" id="aktivasi" ${S.get('pinSaya', null) ? '' : 'open'}><summary><b>Guru baru, atau lupa PIN?</b> Aktifkan dengan kode aktivasi</summary>
<p class="catatan">Kode aktivasi diberikan oleh pengembang Ruang Historia untuk setiap guru. Setelah aktif, Bapak/Ibu membuat PIN sendiri untuk perangkat ini.</p>
<form id="fakt"><label><b>Nama guru</b> (tulis persis seperti saat menerima kode)<input id="anama" class="isian" required autocomplete="name"></label>
<label><b>Kode aktivasi</b><input id="akode" class="isian" required autocomplete="off" placeholder="RH-XXXX-XXXX" style="text-transform:uppercase"></label>
<label><b>Buat PIN baru</b> (minimal 4 angka)<input id="apin1" class="isian" type="password" inputmode="numeric" minlength="4" required></label>
<label><b>Ulangi PIN baru</b><input id="apin2" class="isian" type="password" inputmode="numeric" minlength="4" required></label>
<p class="catatan" id="pesanakt"></p><button class="btn" type="submit">Aktifkan</button></form></details>
<p><a href="#panduan">Buka buku panduan penggunaan</a></p></div></section>`;
    document.getElementById('fakt').addEventListener('submit', async e => {
      e.preventDefault(); const ps = document.getElementById('pesanakt');
      const nama = document.getElementById('anama').value.trim(), kode = document.getElementById('akode').value, p1 = document.getElementById('apin1').value.trim(), p2 = document.getElementById('apin2').value.trim();
      if (normKode(kode) !== normKode(await kodeAktivasi(nama))) { ps.textContent = 'Nama atau kode aktivasi tidak cocok. Periksa penulisan nama dan kodenya.'; return; }
      if (p1.length < 4 || p1 !== p2) { ps.textContent = 'PIN minimal 4 angka dan kedua isian harus sama.'; return; }
      S.set('pinSaya', await sha256('ruang-historia-saya:' + p1)); S.set('namaGuru', nama); S.set('pemilik', false); S.set('guru', true); panelGuru(sub);
    });
    document.getElementById('fpin').addEventListener('submit', async e => {
      e.preventDefault();
      const v = document.getElementById('pin').value.trim(), pemilik = PG.pin && await sha256('ruang-historia:' + v) === PG.pin, saya = S.get('pinSaya', null) && await sha256('ruang-historia-saya:' + v) === S.get('pinSaya');
      if (pemilik || saya) { if (pemilik) S.set('pemilik', true); S.set('guru', true); panelGuru(sub); } else document.getElementById('pesanpin').textContent = 'PIN salah. Coba lagi.';
    });
    return;
  }
  const c = konfig();
  const opsiBab = kid => tersedia(cariK(kid)).map(d => `<option value="${d.id}">Bab ${d.id}. ${esc(d.judul)}</option>`).join('');
  app.innerHTML = `<section class="hero pad"><div class="wrap"><h1>Panel Guru</h1><p>${S.get('namaGuru', '') && !S.get('pemilik') ? `Selamat datang, ${esc(S.get('namaGuru').replace(/\.$/, ''))}. ` : ''}Mode guru aktif di perangkat ini: semua babak terbuka untuk Bapak/Ibu. <a href="#panduan" style="color:inherit"><b>Buku panduan</b></a></p></div></section>
<section class="pad"><div class="wrap guru-wrap">
<div class="box guru-kartu" data-bagian="presentasi"><h2>Presentasi kelas</h2><p>Slide dibuat otomatis dari materi bab: tujuan, materi, garis waktu, tokoh, foto arsip, istilah, refleksi Panca Cinta, dan pertanyaan diskusi.</p>
<label><b>Ruang</b><select id="pr" class="isian">${K.filter(k => tersedia(k).length).map(k => `<option value="${k.id}">${esc(k.judul)}</option>`).join('')}</select></label>
<label><b>Bab</b><select id="pb" class="isian"></select></label>
<div class="row"><button class="btn" type="button" id="tampil">Tampilkan presentasi</button><button class="btn alt" type="button" id="unduh">Unduh PowerPoint (.pptx)</button><button class="btn alt" type="button" id="unduhpdf">Unduh PDF</button></div>
<p class="catatan" id="pesanppt">File PowerPoint dapat diedit di Microsoft PowerPoint, Google Slides, atau WPS. Untuk PDF, pilih <b>Simpan sebagai PDF</b> pada jendela cetak.</p></div>

<div class="box guru-kartu" data-bagian="modul"><h2>Modul ajar</h2><p>Modul ajar Pembelajaran Mendalam berbasis Kurikulum Berbasis Cinta, disusun dari materi bab: identifikasi, desain pembelajaran, langkah kegiatan sesuai sintaks model, asesmen, LKPD, rubrik, dan glosarium.</p>
<label><b>Ruang</b><select id="mr" class="isian">${K.filter(k => tersedia(k).length).map(k => `<option value="${k.id}">${esc(k.judul)}</option>`).join('')}</select></label>
<label><b>Bab</b><select id="mb" class="isian"></select></label>
<label><b>Model pembelajaran</b><select id="mm" class="isian"></select></label>
<p class="catatan" id="malasan"></p>
<div class="dua"><label><b>Kelas</b><select id="mk" class="isian"><option>X</option><option>XI</option><option>XII</option></select></label>
<label><b>Semester</b><select id="ms" class="isian"><option>Ganjil</option><option>Genap</option></select></label></div>
<div class="dua"><label><b>Jumlah pertemuan</b><select id="mp" class="isian"><option>1</option><option selected>2</option><option>3</option></select></label>
<label><b>JP per pertemuan</b><input id="mj" class="isian" type="number" min="1" max="6" value="2"></label></div>
<details><summary><b>Identitas madrasah dan guru</b></summary>
${[['madrasah', 'Nama madrasah'], ['guru', 'Nama guru'], ['nip', 'NIP guru'], ['kepala', 'Nama kepala madrasah'], ['nipKepala', 'NIP kepala madrasah'], ['tempat', 'Tempat penandatanganan'], ['tahun', 'Tahun pelajaran'], ['menitJp', 'Menit per JP']].map(([k, l]) => `<label><b>${l}</b><input class="isian" data-id="${k}" value="${esc(idGuru()[k])}"></label>`).join('')}</details>
<div class="row"><button class="btn" type="button" id="mbuat">Buat modul ajar</button></div></div>

<div class="box guru-kartu" data-bagian="soal"><h2>Soal ulangan harian</h2>
<div class="langkah-no"><span>1</span><b>Pilih materi</b></div>
<label><b>Ruang</b><select id="ur" class="isian">${K.filter(k => tersedia(k).length).map(k => `<option value="${k.id}">${esc(k.judul)}</option>`).join('')}</select></label>
<div><b>Bab</b> <span class="catatan">(boleh lebih dari satu)</span><div id="ub" class="pilih-bab"></div></div>
<div class="langkah-no"><span>2</span><b>Pilih paket soal</b></div>
<div class="paket" id="upaket">${Object.entries(PAKET).map(([k, v], i) => `<button type="button" class="paket-btn" data-paket="${k}" aria-pressed="${i === 0}"><span class="paket-ik">${ikon(v.ikon)}</span><b>${v.nama}</b><small>${v.ket}</small></button>`).join('')}</div>
<div class="dua"><label><b>Kelas</b><select id="uk" class="isian"><option>X</option><option selected>XI</option><option>XII</option></select></label><label><b>Semester</b><select id="us" class="isian"><option>Ganjil</option><option>Genap</option></select></label></div>
<p class="catatan" id="uinfo"></p>
<div class="langkah-no"><span>3</span><b>Buat</b></div>
<div class="row"><button class="btn besar" type="button" id="ubuat">${ikon('kilat')} Buat soal sekarang</button></div>
<details class="lanjutan"><summary>Atur sendiri (jumlah per level, jenis soal, waktu)</summary>
<div><b>Jumlah soal pilihan ganda per level</b>
<div class="level-grid" id="ul"></div></div>
<div class="dua"><label><b>PG kompleks</b><input id="upgk" class="isian" type="number" min="0" max="5" value="2"></label><label><b>Benar-salah</b><input id="ubs" class="isian" type="number" min="0" max="5" value="0"></label></div>
<div class="dua"><label><b>Isian singkat</b><input id="uis" class="isian" type="number" min="0" max="10" value="0"></label><label><b>Menjodohkan</b><input id="ujd" class="isian" type="number" min="0" max="3" value="0"></label></div>
<div class="dua"><label><b>Soal uraian</b><input id="ue" class="isian" type="number" min="0" max="10" value="2"></label>
<label><b>Level uraian</b><select id="uel" class="isian"><option value="">Semua level</option><option value="C4,C5,C6" selected>HOTS (C4–C6)</option><option value="C6">C6 saja</option><option value="C1,C2,C3">C1–C3</option></select></label></div>
<label><b>Judul naskah</b><input id="uj" class="isian" value="ULANGAN HARIAN"></label>
<div class="dua"><label><b>Waktu (menit)</b><input id="uw" class="isian" type="number" min="10" value="90"></label>
<label><b>Bobot pilihan ganda (%)</b><input id="ubb" class="isian" type="number" min="0" max="100" value="70"></label></div>
<label class="cek"><input type="checkbox" id="ua"> Acak urutan soal (bila tidak dicentang: urut dari C1 ke C6)</label></details></div>

<div class="box guru-kartu" data-bagian="kelas"><h2>Pengaturan babak untuk kelas</h2>
<p>Mode babak: siswa harus membaca, mencatat, lalu lulus kuis (nilai ≥ KKM) untuk membuka bab berikutnya. Pengaturan dibagikan lewat <b>tautan kelas</b> atau kode QR; setiap kelas boleh berbeda.</p>
<label><b>Nama kelas</b><input id="gk" class="isian" placeholder="contoh: X-1" value="${esc(c.nama || '')}"></label>
<label class="cek"><input type="checkbox" id="gm" ${c.modeBabak ? 'checked' : ''}> Aktifkan mode babak (bab terkunci berurutan)</label>
<label><b>KKM kuis</b><input id="gn" class="isian" type="number" min="0" max="100" value="${c.kkm}"></label>
<details><summary><b>Buka paksa bab tertentu</b> (opsional)</summary><p class="catatan">Bab sampai nomor ini langsung terbuka untuk seluruh kelas, misalnya bila sudah dibahas di kelas. Isi 0 bila tidak perlu.</p>
${K.filter(k => tersedia(k).length).map(k => `<label><b>${esc(k.judul)}</b>: buka sampai Bab <input class="isian kecil" type="number" min="0" max="${k.bab.length}" data-buka="${k.id}" value="${(c.buka || {})[k.id] || 0}"></label>`).join('')}</details>
<div class="row"><button class="btn" type="button" id="buat">Buat tautan kelas</button></div>
<div id="hasilkelas"></div></div>

<div class="box guru-kartu" data-bagian="rekap"><h2>Rekap nilai dan analisis (Google Sheets)</h2>
<p>Nilai kuis dan ujian siswa terkirim otomatis ke Google Sheets milik Bapak/Ibu, lengkap dengan lembar <b>Rekap</b> dan <b>Analisis</b> (ketuntasan, siswa yang perlu remedial, dan soal yang paling sulit).</p>
${(c.rekap || S.get('rekapUji', '')) ? `<p class="status-ok">${ikon('grafik')} Google Sheets sudah tersambung. Buka file Google Sheets Bapak/Ibu untuk melihat lembar <b>Rekap</b> dan <b>Analisis</b>.</p>` : ''}
<details class="lanjutan" ${(c.rekap || S.get('rekapUji', '')) ? '' : 'open'}><summary>Cara memasang (sekali saja)</summary>
<ol class="langkah-rekap">
<li>Buka <a href="https://sheets.new" target="_blank" rel="noopener">sheets.new</a> di Chrome, beri nama <i>Rekap Ruang Historia</i>.</li>
<li>Di HP: menu ⋮ Chrome → centang <b>Situs desktop</b>. Lalu pilih menu <b>Ekstensi → Apps Script</b>.</li>
<li>Hapus isi editor, tempel kode dari tombol <b>Salin kode</b> di bawah, lalu tekan ikon Simpan.</li>
<li>Pilih fungsi <b>siapkan</b>, tekan <b>Jalankan</b>, lalu berikan izin (Lanjutan → Buka proyek).</li>
<li><b>Terapkan → Deployment baru</b> → jenis <b>Aplikasi web</b>; Jalankan sebagai: <b>Saya</b>; Akses: <b>Siapa saja</b> → Terapkan. Salin alamat aplikasi web.</li>
<li>Tempel alamat itu di kotak di bawah, tekan <b>Uji sambungan</b>, lalu buat tautan kelas di menu <b>Kelas &amp; Babak</b>.</li>
<li>Masukkan daftar siswa dengan <b>Impor daftar siswa</b> di bawah (dari file Excel, Word, atau PDF). Kode siswa dibuat otomatis.</li>
<li>Setiap kali mulai mengajar bab baru, buka lembar <b>Pengaturan</b> dan ubah angka <b>Buka sampai bab</b> untuk kelas itu (misalnya 1 menjadi 2). KKM per kelas juga diatur di sana.</li>
</ol></details>
<div class="row"><button class="btn alt" type="button" id="salinkode">Salin kode Apps Script</button></div>
<label><b>Alamat aplikasi web</b> (berakhiran /exec)<input id="gr" class="isian" placeholder="https://script.google.com/macros/s/…/exec" value="${esc(c.rekap || S.get('rekapUji', ''))}"></label>
<div class="row"><button class="btn alt" type="button" id="ujirekap">Uji sambungan</button></div><p class="catatan" id="pesanrekap"></p>
</div><div class="box guru-kartu" data-bagian="siswa"><h2>Impor daftar siswa</h2><p class="catatan" id="isbelum"></p>
<p>Pilih file daftar siswa per kelas. Bisa Excel, Word, atau PDF. Nama siswa akan masuk otomatis ke Google Sheets, lengkap dengan kodenya.</p>
<label><b>1. Nama kelas</b> (tulis persis, misalnya XI D)<input id="isk" class="isian" placeholder="XI D"></label>
<label><b>2. Pilih file daftar siswa</b><input id="isf" class="isian" type="file" accept=".xlsx,.xls,.csv,.ods,.docx,.pdf,.txt"></label>
<p style="margin:4px 0"><b>atau</b></p><div class="row"><button class="btn alt" type="button" id="isketik">Tempel / ketik daftar nama</button></div>
<p class="catatan">Salin kolom nama dari Excel, Word, atau WA (blok lalu Ctrl+C), klik tombol di atas, lalu tempel (Ctrl+V) di kotak yang muncul. Nomor, NIS, dan L/P dibuang otomatis.</p>
<p class="catatan" id="isp"></p>
<textarea id="ist" class="isian" rows="12" hidden></textarea>
<div id="islanjut" hidden><div class="row"><button class="btn" type="button" id="iskirim">3. Kirim ke Google Sheets</button><button class="btn alt" type="button" id="istsv">Salin untuk ditempel manual</button></div></div>
<div id="ish"></div>
<details class="box" id="isperbarui"><summary><b>Perbarui kode Apps Script</b> (sekali saja, bila diminta)</summary><ol>
<li>Tekan <b>Salin kode Apps Script</b> di atas.</li>
<li>Di Apps Script: hapus semua isi editor (Ctrl+A, Delete), tempel (Ctrl+V), lalu Simpan.</li>
<li>Tekan <b>Terapkan → Kelola deployment</b>, klik ikon pensil, pada <b>Versi</b> pilih <b>Versi baru</b>, lalu <b>Terapkan</b>. Alamat /exec tetap sama.</li>
<li>Kembali ke sini dan tekan <b>Kirim ke Google Sheets</b> lagi.</li></ol>
<label><b>Kunci guru</b> <span class="catatan">(terisi otomatis; isi sama di laptop dan HP bila memakai dua perangkat)</span><input id="istoken" class="isian"></label></details></div>

<div class="box guru-kartu" data-bagian="star"><h2>Historia Star</h2>
<p>Beri <b>Historia Star</b> ⭐ kepada siswa yang menang challenge, game, atau metode ajar di kelas. Bintang tercatat di Google Sheets (lembar <b>Historia Star</b>) dan ikut terhitung di Nilaiku siswa, bersama bintang dari kuis.</p>
<label><b>Kelas</b><select id="stk" class="isian"></select></label>
<div class="langkah-no"><span>1</span><b>Ketuk nama siswa yang menang</b></div>
<div id="stl" class="st-grid"></div>
<div class="langkah-no"><span>2</span><b>Berapa bintang, dan untuk apa?</b></div>
<div class="row kecil-row">${[1, 2, 3].map(n => `<button type="button" class="btn alt kecil-btn" data-jml="${n}" aria-pressed="${n === 1}">⭐ ${n}</button>`).join('')}</div>
<div class="row kecil-row">${ALASAN_STAR.map(x => `<button type="button" class="btn alt kecil-btn" data-alasan="${esc(x)}">${esc(x)}</button>`).join('')}</div>
<label><b>Alasan</b><input id="sta" class="isian" placeholder="contoh: Menang challenge Jigsaw Bab 4"></label>
<div class="langkah-no"><span>3</span><b>Kirim</b></div>
<div class="row"><button class="btn besar" type="button" id="stberi">${ikon('bintang')} Beri Historia Star</button><button class="btn alt" type="button" id="stpapan">${ikon('grafik')} Tayangkan papan peringkat</button></div>
<p class="catatan" id="stp"></p>
<details class="lanjutan" id="stkonv"><summary>Konversi ke nilai tambah</summary>
<p>Historia Star diubah menjadi <b>nilai tambah</b> dan tercatat di lembar <b>Nilai Tambah</b> pada Google Sheets, untuk diolah bersama nilai lainnya (misalnya ditambahkan ke nilai harian atau sikap).</p>
<div class="dua"><label><b>1 ⭐ bernilai (poin)</b><input id="stpoin" class="isian" type="number" min="0" max="10" step="0.5" value="1"></label><label><b>Maksimal nilai tambah</b> <span class="catatan">(0 = tanpa batas)</span><input id="stmaks" class="isian" type="number" min="0" max="100" value="10"></label></div>
<div class="row"><button class="btn alt" type="button" id="stsimpan">Simpan aturan</button></div><p class="catatan" id="stkp"></p></details></div>
${S.get('pemilik') ? `<div class="box guru-kartu" data-bagian="bagikan"><h2>Bagikan ke guru lain</h2><p>Buat kode aktivasi untuk setiap guru. Dengan kode itu, guru membuat PIN sendiri, sehingga PIN Bapak tidak perlu dibagikan. Kode hanya berlaku untuk nama yang ditulis.</p>
<label><b>Nama guru</b><input id="bnama" class="isian" placeholder="contoh: Rina Marlina, S.Pd."></label>
<div class="row"><button class="btn" type="button" id="bbuat">Buat kode aktivasi</button></div><div id="bhasil"></div></div>` : ''}
<div class="box guru-kartu" data-bagian="akun"><h2>Ganti PIN</h2><p>Ganti PIN guru untuk perangkat ini.</p>
<label><b>PIN baru</b> (minimal 4 angka)<input id="gp1" class="isian" type="password" inputmode="numeric"></label><label><b>Ulangi PIN baru</b><input id="gp2" class="isian" type="password" inputmode="numeric"></label>
<div class="row"><button class="btn alt" type="button" id="gpsimpan">Simpan PIN</button></div><p class="catatan" id="gppesan">${S.get('pemilik') ? 'PIN utama pengembang (di file pengaturan) tetap berlaku di semua perangkat.' : ''}</p></div>

<div class="box guru-kartu" data-bagian="akun"><h2>Lainnya</h2><ul>
<li><a href="#panduan">Buku panduan penggunaan</a> (dapat diunduh sebagai PDF).</li>
<li>Tambah foto atau ilustrasi sendiri: lihat panduan di halaman <a href="#tentang">Tentang</a>.</li>
<li>Rekap nilai: siswa dapat menunjukkan halaman <a href="#nilai">Nilaiku</a> di perangkatnya.</li></ul>
<button class="btn alt" type="button" id="keluar">Keluar dari mode guru</button></div>
</div></section>`;
  const pr = document.getElementById('pr'), pb = document.getElementById('pb');
  const isiBabPilihan = () => { pb.innerHTML = opsiBab(pr.value); };
  pr.addEventListener('change', isiBabPilihan); isiBabPilihan();
  document.getElementById('tampil').addEventListener('click', () => { location.hash = `#${pr.value}-${pb.value}-slide`; });
  document.getElementById('unduh').addEventListener('click', async e => {
    const t = e.target, pesan = document.getElementById('pesanppt'); t.disabled = true; pesan.textContent = 'Menyusun slide… (pertama kali mungkin agak lama)';
    try { await unduhPPT(pr.value, +pb.value); pesan.textContent = 'Selesai. Cek folder unduhan.'; } catch (err) { console.error(err); pesan.textContent = 'Gagal membuat PowerPoint. Periksa koneksi internet lalu coba lagi.'; }
    t.disabled = false;
  });
  document.getElementById('unduhpdf').addEventListener('click', async e => { const t = e.target, pesan = document.getElementById('pesanppt'); t.disabled = true; pesan.textContent = 'Menyiapkan PDF…'; try { await cetakSlide(pr.value, +pb.value); pesan.textContent = 'Pilih "Simpan sebagai PDF" pada jendela cetak.'; } catch (err) { console.error(err); pesan.textContent = 'Gagal menyiapkan PDF. Coba lagi.'; } t.disabled = false; });
  pasangModulForm(); pasangSoalForm(); pasangImporSiswa(); tataPanelGuru(sub); if (sub === 'star') pasangStar();
  if (!document.getElementById('gr').value.trim()) document.getElementById('isbelum').innerHTML = `${ikon('info')} Sambungkan Google Sheets dulu di menu <a href="#guru/rekap">Rekap Nilai</a> agar nama bisa dikirim. Tanpa itu, gunakan tombol <b>Salin untuk ditempel manual</b>.`;
  document.getElementById('buat').addEventListener('click', async () => {
    const buka = {}; app.querySelectorAll('[data-buka]').forEach(x => { if (+x.value > 0) buka[x.dataset.buka] = +x.value; });
    const o = { nama: document.getElementById('gk').value.trim(), modeBabak: document.getElementById('gm').checked, kkm: +document.getElementById('gn').value || 75, buka, rekap: document.getElementById('gr').value.trim() };
    const url = `${alamatDasar()}#kelas=${kodeKelas(o)}`;
    document.getElementById('hasilkelas').innerHTML = `<div class="tautan-kelas"><div>${await qrSVG(url, 200)}</div><div><p><b>Tautan kelas ${esc(o.nama || '')}</b>: mode babak ${o.modeBabak ? 'aktif' : 'mati'}, KKM ${o.kkm}, rekap nilai ${o.rekap ? 'aktif' : 'tidak dipakai'}.</p><input class="isian" readonly value="${esc(url)}"><div class="row"><button class="btn" type="button" id="salin">Salin tautan</button></div><p class="catatan">Bagikan tautan ini di grup kelas, atau tampilkan kode QR-nya di proyektor. Siswa cukup membukanya sekali dari HP masing-masing.</p></div></div>`;
    document.getElementById('salin').addEventListener('click', async ev => { try { await navigator.clipboard.writeText(url); ev.target.textContent = 'Tersalin'; } catch { app.querySelector('.tautan-kelas input').select(); } });
  });
  document.getElementById('salinkode').addEventListener('click', async ev => { try { const t = (await fetch('alat/rekap-google-sheets.gs', { cache: 'no-cache' }).then(r => r.text())).replace('__TOKEN_GURU__', (document.getElementById('istoken') || {}).value || tokenRekap()); await navigator.clipboard.writeText(t); ev.target.textContent = 'Kode tersalin. Tempel di Apps Script'; } catch { ev.target.textContent = 'Gagal menyalin. Coba lagi'; } });
  document.getElementById('gr').addEventListener('change', e => { const u = e.target.value.trim(); if (/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(u)) S.set('rekapUji', u); });
  document.getElementById('ujirekap').addEventListener('click', async () => { const u = document.getElementById('gr').value.trim(), ps = document.getElementById('pesanrekap'); if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(u)) { ps.textContent = 'Alamat belum benar. Alamatnya diawali https://script.google.com/macros/s/ dan diakhiri /exec'; return; } ps.textContent = 'Menghubungi Google Sheets…'; try { const r = await fetch(u + '?aksi=cek').then(x => x.json()); if (r.ok) S.set('rekapUji', u); ps.textContent = r.ok ? `Tersambung ke "${r.nama}". Langkah berikutnya: menu Daftar Siswa, lalu Kelas & Babak.` : 'Tersambung, tetapi ada masalah: ' + (r.pesan || ''); } catch { ps.textContent = 'Belum tersambung. Pastikan Akses diatur ke "Siapa saja", lalu coba lagi.'; } });
  document.getElementById('keluar').addEventListener('click', () => { S.set('guru', false); location.hash = '#beranda'; });
  document.getElementById('gpsimpan').onclick = async () => { const a1 = document.getElementById('gp1').value.trim(), a2 = document.getElementById('gp2').value.trim(), ps = document.getElementById('gppesan'); if (a1.length < 4 || a1 !== a2) { ps.textContent = 'PIN minimal 4 angka dan kedua isian harus sama.'; return; } S.set('pinSaya', await sha256('ruang-historia-saya:' + a1)); ps.textContent = 'PIN baru tersimpan untuk perangkat ini.'; document.getElementById('gp1').value = document.getElementById('gp2').value = ''; };
  const bb = document.getElementById('bbuat');
  if (bb) bb.onclick = async () => { const nama = document.getElementById('bnama').value.trim(); if (!nama) return; const kode = await kodeAktivasi(nama), url = alamatDasar();
    const pesan = `Assalamu'alaikum, ${nama.replace(/\.$/, '')}.\n\nBerikut akses guru aplikasi Ruang Historia:\n1. Buka ${url}#guru\n2. Pilih "Guru baru, atau lupa PIN?"\n3. Nama guru: ${nama}\n4. Kode aktivasi: ${kode}\n5. Buat PIN sendiri.\n\nBuku panduan: ${url}#panduan\nMohon kode ini tidak dibagikan kepada siswa.\n\nSalam,\nEki Ripan J.R. Tanjung, S.Pd., M.Pd., Gr.`;
    document.getElementById('bhasil').innerHTML = `<p>Kode aktivasi untuk <b>${esc(nama)}</b>:</p><p class="kode-akt">${kode}</p><textarea class="isian" rows="9" readonly>${esc(pesan)}</textarea><div class="row"><button class="btn" type="button" id="bsalin">Salin pesan untuk dikirim</button></div>`;
    document.getElementById('bsalin').onclick = async ev => { try { await navigator.clipboard.writeText(pesan); ev.target.textContent = 'Tersalin. Kirim lewat WhatsApp'; } catch { document.querySelector('#bhasil textarea').select(); } }; };
}

function terapkanKelas(kode) {
  try {
    const o = bacaKelas(kode);
    S.set('kelas', { nama: String(o.nama || '').slice(0, 40), modeBabak: !!o.modeBabak, kkm: Math.min(100, Math.max(0, +o.kkm || 75)), buka: o.buka || {}, rekap: /^https:\/\/script\.google\.com\//.test(o.rekap || '') ? o.rekap : '' });
    app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:600px"><div class="box"><h1>Selamat datang${o.nama ? ` di kelas ${esc(o.nama)}` : ''}!</h1>
<p>Pengaturan dari gurumu sudah diterapkan: ${o.modeBabak ? `<b>mode babak aktif</b> dengan KKM <b>${o.kkm}</b>. Setiap bab adalah satu babak: baca materinya, catat di buku catatan, lalu lulus kuis untuk membuka babak berikutnya.` : 'semua bab terbuka.'}</p>
${o.rekap ? `<p>Gurumu juga memakai <b>rekap nilai</b>. Masukkan kode siswa dari gurumu:</p>${formMasuk()}` : ''}
<a class="btn" href="#beranda">Mulai belajar</a></div></div></section>`;
    pasangMasuk(app, () => { const f = app.querySelector('[data-masuk]'); f.outerHTML = `<div class="box">Berhasil masuk sebagai <b>${esc(siswaAktif().nama)}</b> (${esc(siswaAktif().kelas)}).</div>`; });
    history.replaceState(null, '', location.pathname + '#kelas-ok');
  } catch { location.hash = '#beranda'; }
}

/* ---------- PEMBUAT SLIDE ---------- */
const runsDari = node => { const out = []; const jalan = (n, b, i) => { n.childNodes.forEach(x => { if (x.nodeType === 3) { if (x.textContent) out.push({ text: x.textContent.replace(/\s+/g, ' '), b, i }); } else if (x.nodeType === 1) jalan(x, b || /^(B|STRONG)$/.test(x.tagName), i || /^(I|EM)$/.test(x.tagName)); }); }; jalan(node, false, false); if (out.length) { out[0].text = out[0].text.replace(/^\s+/, ''); out[out.length - 1].text = out[out.length - 1].text.replace(/\s+$/, ''); } return out.filter(r => r.text); };
const teksDari = runs => runs.map(r => r.text).join('');
const kata = s => s.split(/\s+/).filter(Boolean).length;
async function susunSlide(kid, id) {
  const k = cariK(kid), d = k.bab.find(x => x.id === id), b = isiBab(kid, id), c = konfig();
  const sl = [{ t: 'judul', ruang: k.judul, bab: id, judul: b.judul, sub: b.sub, masa: d.masa }];
  sl.push({ t: 'poin', judul: 'Tujuan pembelajaran', item: b.tujuan.map(x => ({ runs: [{ text: x }], li: true })) });
  const cinta = [];
  for (const s of b.bagian) {
    const doc = new DOMParser().parseFromString(`<div>${s.isi}</div>`, 'text/html').body.firstChild;
    let cur = null, sub = '';
    const tutup = () => { if (cur && cur.item.length) sl.push(cur); cur = null; };
    const baru = () => { cur = { t: 'poin', judul: s.judul, sub, item: [] }; };
    const tambahItem = it => { if (!cur) baru(); const w = cur.item.reduce((a, x) => a + kata(teksDari(x.runs)), 0); if (cur.item.length >= 6 || (cur.item.length && w + kata(teksDari(it.runs)) > 90)) { tutup(); baru(); } cur.item.push(it); };
    let rute = null;
    for (const el of doc.children) {
      const tag = el.tagName;
      if (!el.classList.contains('rute') && rute) { sl.push(rute); rute = null; }
      if (tag === 'P') {
        const runs = runsDari(el); if (!runs.length) continue;
        if (kata(teksDari(runs)) > 80) { teksDari(runs).match(/[^.!?]+[.!?]+["”)]?\s*|[^.!?]+$/g).forEach(k2 => tambahItem({ runs: [{ text: k2.trim() }], catatan: el.classList.contains('catatan') })); }
        else tambahItem({ runs, catatan: el.classList.contains('catatan') });
      } else if (tag === 'UL' || tag === 'OL') {
        [...el.children].forEach((li, n) => tambahItem({ runs: runsDari(li), li: true, no: tag === 'OL' ? n + 1 : 0 }));
      } else if (tag === 'H3') { tutup(); sub = el.textContent.trim(); }
      else if (tag === 'TABLE') {
        tutup();
        const head = [...el.querySelectorAll('thead th')].map(x => x.textContent.trim()), rows = [...el.querySelectorAll('tbody tr')].map(tr => [...tr.children].map(x => x.textContent.trim()));
        const per = rows.reduce((a, r) => a + r.join(' ').length, 0) / Math.max(1, rows.length) > 140 ? 3 : 6;
        for (let i = 0; i < rows.length; i += per) sl.push({ t: 'tabel', judul: s.judul, sub, head, rows: rows.slice(i, i + per), lanjut: i > 0 });
      } else if (el.classList.contains('rute')) {
        tutup(); if (!rute || rute.item.length >= 4) { if (rute) sl.push(rute); rute = { t: 'rute', judul: s.judul, item: [] }; }
        rute.item.push({ nama: el.querySelector('b').textContent, warna: (el.getAttribute('style') || '').match(/#[0-9a-f]{6}/i)?.[0] || '#2B3A67', langkah: [...el.querySelectorAll('li')].map(x => x.textContent.trim()) });
      }
    }
    if (rute) sl.push(rute);
    tutup();
    if (s.kartu && b.kartu) for (let i = 0; i < b.kartu.length; i += 3) sl.push({ t: 'tokoh', judul: 'Tokoh penting', item: b.kartu.slice(i, i + 3) });
    if (s.cinta) cinta.push(s.cinta);
  }
  // gabungkan slide teks yang terlalu pendek dengan slide di dekatnya
  const kataSl = s => s.item.reduce((x, it) => x + kata(teksDari(it.runs)), 0);
  for (let i = 0; i < sl.length; i++) {
    const s = sl[i]; if (s.t !== 'poin' || i < 2 || kataSl(s) >= 30) continue;
    const nx = sl[i + 1], pv = sl[i - 1];
    if (nx && (nx.t === 'tabel' || nx.t === 'rute') && nx.judul === s.judul && !nx.pengantar) { nx.pengantar = s.item.map(it => teksDari(it.runs)).join(' '); sl.splice(i--, 1); }
    else if (pv && pv.t === 'poin' && pv.judul === s.judul && pv.item.length + s.item.length <= 7 && kataSl(pv) + kataSl(s) <= 110) { pv.item.push(...s.item); sl.splice(i--, 1); }
  }
  if (b.jelajah && b.jelajah.lapisan) {
    const L = b.jelajah.mode === 'waktu' ? b.jelajah.lapisan : b.jelajah.lapisan.slice().reverse();
    for (let i = 0; i < L.length; i += 5) sl.push({ t: 'waktu', judul: b.jelajah.mode === 'waktu' ? 'Garis waktu' : 'Lapisan zaman', item: L.slice(i, i + 5).map(x => ({ th: x.th || '', n: x.n, t: x.t, ket: x.ket, c: x.c })) });
  }
  if (b.kartu && !b.bagian.some(s => s.kartu)) for (let i = 0; i < b.kartu.length; i += 3) sl.push({ t: 'tokoh', judul: 'Tokoh penting', item: b.kartu.slice(i, i + 3) });
  const G = (await ambilGambar())[`${kid}-${id}`] || [];
  G.slice(0, 8).forEach(g => sl.push({ t: 'foto', judul: g.judul, ket: g.ket, file: g.file, kredit: g.guru ? 'Koleksi guru' : `${pembuat(g.pembuat)}${g.lisensi || ''} · Wikimedia Commons` }));
  if (b.glosarium) for (let i = 0; i < b.glosarium.length; i += 8) sl.push({ t: 'istilah', judul: 'Istilah penting', item: b.glosarium.slice(i, i + 8) });
  if (cinta.length) sl.push({ t: 'cinta', judul: 'Refleksi Panca Cinta', item: cinta.slice(0, 3) });
  const hots = acak(b.soal.filter(q => /C[456]/.test(q.l || ''))).slice(0, 3);
  if (hots.length) sl.push({ t: 'diskusi', judul: 'Mari berdiskusi', item: hots.map(q => ({ s: q.s, q: q.q })) });
  if (b.esai && b.esai.length) sl.push({ t: 'poin', judul: 'Pertanyaan uraian', item: b.esai.map(e => ({ runs: [{ text: e.q }], li: true })) });
  sl.push({ t: 'penutup', judul: 'Tugas mandiri', kid, id, kkm: c.kkm, url: `${alamatDasar()}#${kid}-${id}`, babJudul: b.judul });
  return { sl, warna: d.warna, b, k };
}

/* ---------- PRESENTASI LAYAR PENUH ---------- */
const runsHTML = runs => runs.map(r => { let t = esc(r.text); if (r.b) t = `<b>${t}</b>`; if (r.i) t = `<i>${t}</i>`; return t; }).join('');
function slideHTML(s, w, total, n, qr) {
  const kaki = `<div class="sl-kaki"><span>Ruang Historia</span><span>${n} / ${total}</span></div>`;
  const head = `<div class="sl-pita"></div><h2 class="sl-judul">${esc(s.judul)}</h2>${s.sub ? `<p class="sl-sub">${esc(s.sub)}</p>` : ''}`;
  if (s.t === 'judul') return `<div class="sl sl-cover"><div class="sl-cover-isi"><small>${esc(s.ruang)} · Bab ${s.bab} · ${esc(s.masa)}</small><h1>${esc(s.judul)}</h1><p>${esc(s.sub)}</p></div><img src="icons/logo.svg" alt="" class="sl-logo">${kaki}</div>`;
  if (s.t === 'poin') { const w2 = s.item.reduce((a, x) => a + kata(teksDari(x.runs)), 0); return `<div class="sl">${head}<ul class="sl-poin ${w2 > 70 ? 'kecil' : ''}">${s.item.map(x => `<li class="${x.li ? 'li' : 'p'} ${x.catatan ? 'cat' : ''}">${x.no ? `<i>${x.no}.</i> ` : ''}${runsHTML(x.runs)}</li>`).join('')}</ul>${kaki}</div>`; }
  const peng = s.pengantar ? `<p class="sl-pengantar">${esc(s.pengantar)}</p>` : '';
  if (s.t === 'tabel') return `<div class="sl">${head}${peng}<div class="sl-tabel"><table>${s.head.length ? `<thead><tr>${s.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>` : ''}<tbody>${s.rows.map(r => `<tr>${r.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${kaki}</div>`;
  if (s.t === 'rute') return `<div class="sl">${head}${peng}<div class="sl-rute">${s.item.map(r => `<div style="--c:${r.warna}"><b>${esc(r.nama)}</b><p>${r.langkah.map(esc).join(' <span>→</span> ')}</p></div>`).join('')}</div>${kaki}</div>`;
  if (s.t === 'waktu') return `<div class="sl">${head}<div class="sl-waktu">${s.item.map(x => `<div style="--c:${x.c || w}"><span class="th">${esc(x.th)}</span><b>${esc(x.n)}</b><small>${esc(x.t || '')}</small><p>${esc(x.ket || '')}</p></div>`).join('')}</div>${kaki}</div>`;
  if (s.t === 'tokoh') return `<div class="sl">${head}<div class="sl-tokoh">${s.item.map(x => `<div><b>${esc(x.nama)}</b><small>${esc(x.info)}</small><p>${esc(x.isi)}</p></div>`).join('')}</div>${kaki}</div>`;
  if (s.t === 'foto') return `<div class="sl sl-foto"><img src="${esc(s.file)}" alt="${esc(s.judul)}"><div class="sl-foto-ket"><b>${esc(s.judul)}</b>${s.ket ? `<p>${esc(s.ket)}</p>` : ''}<small>${esc(s.kredit)}</small></div>${kaki}</div>`;
  if (s.t === 'istilah') return `<div class="sl">${head}<dl class="sl-istilah">${s.item.map(g => `<div><dt>${esc(g[0])}</dt><dd>${esc(g[1])}</dd></div>`).join('')}</dl>${kaki}</div>`;
  if (s.t === 'cinta') return `<div class="sl">${head}<div class="sl-cinta">${s.item.map(x => `<div><b>${esc(x[0])}</b><p>${esc(x[1])}</p></div>`).join('')}</div>${kaki}</div>`;
  if (s.t === 'diskusi') return `<div class="sl">${head}<ol class="sl-diskusi">${s.item.map(x => `<li>${x.s ? `<p class="stim">${esc(x.s)}</p>` : ''}<p>${esc(x.q)}</p></li>`).join('')}</ol>${kaki}</div>`;
  if (s.t === 'penutup') return `<div class="sl sl-penutup">${head}<div class="sl-tugas"><ol><li>Buka <b>Ruang Historia</b>, Bab ${s.id}: ${esc(s.babJudul)}.</li><li>Baca seluruh materi dan tonton videonya.</li><li>Catat poin-poin penting di buku catatan.</li><li>Kerjakan kuis sampai nilai minimal <b>${s.kkm}</b> untuk membuka babak berikutnya.</li></ol><div class="sl-qr">${qr || ''}<small>Pindai untuk membuka bab ini</small></div></div>${kaki}</div>`;
  return '';
}
async function presentasi(kid, id) {
  if (!modeGuru()) { location.hash = '#guru'; return; }
  const b = isiBab(kid, id); if (!b) return ruang(kid);
  app.innerHTML = '<section class="pad"><div class="wrap"><p>Menyusun slide…</p></div></section>';
  const { sl, warna } = await susunSlide(kid, id);
  const qr = await qrSVG(sl[sl.length - 1].url, 260);
  let i = 0;
  app.innerHTML = `<div class="presenter" style="--c:${warna}" tabindex="0"><div class="pr-panggung"><div class="pr-slide" id="prs"></div></div>
<div class="pr-kendali"><a class="btn alt" href="#guru">Tutup</a><button class="btn alt" type="button" id="pk">‹</button><span id="pn"></span><button class="btn alt" type="button" id="pl">›</button><button class="btn alt" type="button" id="pf">Layar penuh</button><button class="btn" type="button" id="pu">Unduh .pptx</button></div></div>`;
  const pr = app.querySelector('.presenter'), prs = document.getElementById('prs');
  const ukur = () => { const p = app.querySelector('.pr-panggung'); if (!p) return; const sk = Math.min(p.clientWidth / 1280, p.clientHeight / 720); prs.style.transform = `scale(${sk})`; };
  const tampil = () => { prs.innerHTML = slideHTML(sl[i], warna, sl.length, i + 1, qr); document.getElementById('pn').textContent = `${i + 1} / ${sl.length}`; ukur(); };
  const geser = n => { i = Math.max(0, Math.min(sl.length - 1, i + n)); tampil(); };
  document.getElementById('pk').onclick = () => geser(-1); document.getElementById('pl').onclick = () => geser(1);
  document.getElementById('pf').onclick = () => { document.fullscreenElement ? document.exitFullscreen() : pr.requestFullscreen?.(); };
  document.getElementById('pu').onclick = async e => { e.target.disabled = true; e.target.textContent = 'Menyusun…'; try { await unduhPPT(kid, id); e.target.textContent = 'Terunduh'; } catch { e.target.textContent = 'Gagal, coba lagi'; } e.target.disabled = false; };
  prs.onclick = e => { if (!e.target.closest('a,button')) geser(e.clientX > innerWidth / 3 ? 1 : -1); };
  const tombol = e => { if (!document.getElementById('prs')) return document.removeEventListener('keydown', tombol); if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); geser(1); } if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); geser(-1); } if (e.key === 'Home') { i = 0; tampil(); } if (e.key === 'End') { i = sl.length - 1; tampil(); } };
  document.addEventListener('keydown', tombol);
  let x0 = null; prs.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true }); prs.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) geser(dx < 0 ? 1 : -1); x0 = null; });
  addEventListener('resize', ukur); document.addEventListener('fullscreenchange', ukur);
  tampil(); pr.focus();
}

/* ---------- UNDUH POWERPOINT ---------- */
const hex = c => (c || '#2B3A67').replace('#', '').toUpperCase();
const keData = async url => { const r = await fetch(url); const bl = await r.blob(); const du = await new Promise(ok => { const f = new FileReader(); f.onload = () => ok(f.result); f.readAsDataURL(bl); }); const img = new Image(); img.src = du; await img.decode(); return { data: du.replace(/^data:/, ''), w: img.naturalWidth, h: img.naturalHeight }; };
const pas = (iw, ih, bx, by, bw, bh) => { const r = Math.min(bw / iw, bh / ih), w = iw * r, h = ih * r; return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h }; };
async function unduhPPT(kid, id) {
  await muatSkrip('lib/pptxgen.bundle.js');
  const { sl, warna, b, k } = await susunSlide(kid, id);
  const p = new PptxGenJS(); p.layout = 'LAYOUT_WIDE'; p.author = 'Ruang Historia'; p.company = 'Ruang Historia'; p.title = `Bab ${id}. ${b.judul}`;
  const W = 13.333, H = 7.5, C = hex(warna), NILA = '2B3A67', EMAS = 'E0B04A', TINTA = '2A1D14', LEMBUT = '6B5848', F = 'Calibri', FJ = 'Arial Black';
  const logo = await keData('icons/icon-192.png').catch(() => null);
  const dasar = (s, n) => { s.background = { color: 'FFFFFF' }; s.addShape(p.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.18, fill: { color: C }, line: { color: C } }); s.addText(`Ruang Historia · ${k.judul} · Bab ${id}`, { x: 0.5, y: H - 0.45, w: 9, h: 0.3, fontFace: F, fontSize: 10, color: '8A7B6E' }); s.addText(`${n} / ${sl.length}`, { x: W - 1.7, y: H - 0.45, w: 1.2, h: 0.3, fontFace: F, fontSize: 10, color: '8A7B6E', align: 'right' }); };
  const judul = (s, x) => { s.addText(x.judul, { x: 0.5, y: 0.4, w: W - 1, h: 0.75, fontFace: FJ, fontSize: 26, color: TINTA, fit: 'shrink' }); if (x.sub) s.addText(x.sub, { x: 0.5, y: 1.1, w: W - 1, h: 0.4, fontFace: F, fontSize: 15, color: C, bold: true }); return x.sub ? 1.6 : 1.35; };
  for (let n = 0; n < sl.length; n++) {
    const x = sl[n], s = p.addSlide();
    if (x.t === 'judul') {
      s.background = { color: NILA };
      s.addShape(p.ShapeType.rect, { x: 0, y: H - 0.9, w: W, h: 0.9, fill: { color: C }, line: { color: C } });
      s.addText(`${x.ruang} · Bab ${x.bab} · ${x.masa}`, { x: 0.7, y: 1.6, w: 9, h: 0.5, fontFace: F, fontSize: 16, color: EMAS, bold: true });
      s.addText(x.judul, { x: 0.7, y: 2.1, w: 9.2, h: 2.2, fontFace: FJ, fontSize: 44, color: 'FFFFFF', valign: 'top', fit: 'shrink' });
      s.addText(x.sub, { x: 0.7, y: 4.4, w: 9, h: 0.8, fontFace: F, fontSize: 20, color: 'D3DAF0' });
      if (logo) s.addImage({ data: logo.data, x: 10.4, y: 1.8, w: 2.2, h: 2.2 });
      s.addText(HAK, { x: 0.7, y: H - 0.75, w: 10, h: 0.5, fontFace: F, fontSize: 11, color: 'FFFFFF' });
      continue;
    }
    dasar(s, n + 1);
    if (x.t === 'foto') {
      try { const im = await keData(x.file), f = pas(im.w, im.h, 0.5, 0.45, 8.2, 6.4); s.addImage({ data: im.data, ...f }); } catch {}
      s.addText(x.judul, { x: 9, y: 0.6, w: 3.9, h: 1.6, fontFace: FJ, fontSize: 22, color: TINTA, valign: 'top', fit: 'shrink' });
      if (x.ket) s.addText(x.ket, { x: 9, y: 2.3, w: 3.9, h: 3, fontFace: F, fontSize: 15, color: TINTA, valign: 'top', fit: 'shrink' });
      s.addText(x.kredit, { x: 9, y: 5.6, w: 3.9, h: 1.1, fontFace: F, fontSize: 10, color: LEMBUT, valign: 'bottom' });
      continue;
    }
    let y0 = judul(s, x);
    if (x.pengantar) { s.addText(x.pengantar, { x: 0.5, y: y0, w: W - 1, h: 0.7, fontFace: F, fontSize: 15, color: LEMBUT, valign: 'top', fit: 'shrink' }); y0 += 0.75; }
    const hT = H - 0.6 - y0;
    if (x.t === 'poin') {
      const w2 = x.item.reduce((a, it) => a + kata(teksDari(it.runs)), 0), fs = w2 > 75 ? 16 : w2 > 50 ? 18 : 20;
      const teks = x.item.flatMap((it, n) => { const tanda = it.li ? (it.no ? `${it.no}.  ` : '•  ') : ''; const rr = it.runs.map((r, j) => ({ text: r.text, options: { bold: r.b, italic: r.i || it.catatan, color: it.catatan ? LEMBUT : TINTA, breakLine: j === it.runs.length - 1 && n < x.item.length - 1, paraSpaceAfter: 10 } })); if (tanda) rr.unshift({ text: tanda, options: { bold: true, color: C } }); return rr; });
      s.addText(teks, { x: 0.6, y: y0, w: W - 1.2, h: hT, fontFace: F, fontSize: fs, valign: 'top', fit: 'shrink' });
    } else if (x.t === 'tabel') {
      const panjang = x.rows.reduce((a, r) => a + r.join(' ').length, 0), fs = panjang > 900 ? 11 : panjang > 500 ? 13 : 15;
      const rows = [];
      if (x.head.length) rows.push(x.head.map(h => ({ text: h, options: { bold: true, color: 'FFFFFF', fill: { color: C } } })));
      x.rows.forEach((r, i) => rows.push(r.map(c2 => ({ text: c2, options: { fill: { color: i % 2 ? 'F6F1EA' : 'FFFFFF' } } }))));
      s.addTable(rows, { x: 0.5, y: y0, w: W - 1, fontFace: F, fontSize: fs, color: TINTA, border: { type: 'solid', pt: 0.75, color: 'D8CFC4' }, valign: 'top', margin: 0.06 });
    } else if (x.t === 'rute') {
      const tinggi = Math.min(1.35, hT / x.item.length);
      x.item.forEach((r, i) => { const y = y0 + i * tinggi; s.addShape(p.ShapeType.rect, { x: 0.5, y, w: 0.12, h: tinggi - 0.15, fill: { color: hex(r.warna) }, line: { color: hex(r.warna) } }); s.addText(r.nama, { x: 0.75, y, w: 3, h: 0.4, fontFace: F, fontSize: 18, bold: true, color: hex(r.warna) }); s.addText(r.langkah.join('  →  '), { x: 0.75, y: y + 0.4, w: W - 1.4, h: tinggi - 0.55, fontFace: F, fontSize: 15, color: TINTA, valign: 'top', fit: 'shrink' }); });
    } else if (x.t === 'waktu') {
      const lebar = (W - 1) / x.item.length;
      s.addShape(p.ShapeType.line, { x: 0.5, y: y0 + 0.55, w: W - 1, h: 0, line: { color: 'C9BFB3', width: 2 } });
      x.item.forEach((it, i) => { const xx = 0.5 + i * lebar; s.addShape(p.ShapeType.ellipse, { x: xx + 0.05, y: y0 + 0.43, w: 0.24, h: 0.24, fill: { color: hex(it.c) }, line: { color: 'FFFFFF', width: 1.5 } }); s.addText(it.th, { x: xx, y: y0 - 0.05, w: lebar - 0.15, h: 0.4, fontFace: F, fontSize: 14, bold: true, color: hex(it.c) }); s.addText([{ text: it.n, options: { bold: true, fontSize: 16, color: TINTA, breakLine: true } }, { text: it.t || '', options: { fontSize: 12, color: LEMBUT, breakLine: true } }, { text: it.ket || '', options: { fontSize: 12, color: TINTA } }], { x: xx, y: y0 + 0.8, w: lebar - 0.15, h: hT - 0.9, fontFace: F, valign: 'top', fit: 'shrink' }); });
    } else if (x.t === 'tokoh') {
      const lebar = (W - 1.3) / 3;
      x.item.forEach((t, i) => { const xx = 0.5 + i * (lebar + 0.15); s.addShape(p.ShapeType.roundRect, { x: xx, y: y0, w: lebar, h: hT - 0.1, fill: { color: 'F6F1EA' }, line: { color: 'E6DDD4' }, rectRadius: 0.12 }); s.addText([{ text: t.nama, options: { bold: true, fontSize: 18, color: TINTA, breakLine: true } }, { text: t.info, options: { fontSize: 13, color: C, bold: true, breakLine: true } }, { text: ' ', options: { fontSize: 6, breakLine: true } }, { text: t.isi, options: { fontSize: 14, color: TINTA } }], { x: xx + 0.15, y: y0 + 0.15, w: lebar - 0.3, h: hT - 0.4, fontFace: F, valign: 'top', fit: 'shrink' }); });
    } else if (x.t === 'istilah') {
      const kol = [x.item.slice(0, 4), x.item.slice(4, 8)];
      kol.forEach((col, ci) => s.addText(col.flatMap(g => [{ text: g[0], options: { bold: true, color: C, fontSize: 16, breakLine: true } }, { text: g[1], options: { color: TINTA, fontSize: 14, breakLine: true, paraSpaceAfter: 10 } }]), { x: 0.6 + ci * 6.2, y: y0, w: 5.9, h: hT, fontFace: F, valign: 'top', fit: 'shrink' }));
    } else if (x.t === 'cinta') {
      s.addText(x.item.flatMap(c2 => [{ text: c2[0], options: { bold: true, color: C, fontSize: 18, breakLine: true } }, { text: c2[1], options: { color: TINTA, fontSize: 16, breakLine: true, paraSpaceAfter: 14 } }]), { x: 0.6, y: y0, w: W - 1.2, h: hT, fontFace: F, valign: 'top', fit: 'shrink' });
    } else if (x.t === 'diskusi') {
      s.addText(x.item.flatMap((q, i) => [...(q.s ? [{ text: q.s, options: { italic: true, color: LEMBUT, fontSize: 14, breakLine: true } }] : []), { text: `${i + 1}. ${q.q}`, options: { bold: true, color: TINTA, fontSize: 17, breakLine: true, paraSpaceAfter: 14 } }]), { x: 0.6, y: y0, w: W - 1.2, h: hT, fontFace: F, valign: 'top', fit: 'shrink' });
    } else if (x.t === 'penutup') {
      s.addText([`Buka Ruang Historia, Bab ${x.id}: ${x.babJudul}.`, 'Baca seluruh materi dan tonton videonya.', 'Catat poin-poin penting di buku catatan.', `Kerjakan kuis sampai nilai minimal ${x.kkm} untuk membuka babak berikutnya.`].map((t, i, a) => ({ text: `${i + 1}.  ${t}`, options: { breakLine: i < a.length - 1, paraSpaceAfter: 12 } })), { x: 0.6, y: y0, w: 7.8, h: hT, fontFace: F, fontSize: 20, color: TINTA, valign: 'top' });
      try { const q = await qrPNG(x.url, 600); s.addImage({ data: q.replace(/^data:/, ''), x: 9.2, y: y0, w: 3.4, h: 3.4 }); s.addText('Pindai untuk membuka bab ini', { x: 9.0, y: y0 + 3.45, w: 3.8, h: 0.4, fontFace: F, fontSize: 12, color: LEMBUT, align: 'center' }); } catch {}
    }
  }
  const aman = `${k.judul} Bab ${id} ${b.judul}`.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim();
  await p.writeFile({ fileName: `Ruang Historia - ${aman}.pptx` });
}

/* ---------- GENERATOR MODUL AJAR (Pembelajaran Mendalam + KBC) ---------- */
const MODEL = {
  discovery: { nama: 'Discovery Learning', metode: ['tanya jawab', 'pengamatan sumber sejarah (foto arsip dan video)', 'diskusi kelompok', 'presentasi'],
    alasan: 'materi ini kaya akan sumber sejarah (artefak, foto, garis waktu) sehingga murid dapat menemukan sendiri konsepnya melalui pengamatan dan pengolahan data.',
    sintaks: { memahami: ['Pemberian rangsangan (stimulation)', 'Identifikasi masalah (problem statement)'], mengaplikasi: ['Pengumpulan data (data collection)', 'Pengolahan data (data processing)'], merefleksi: ['Pembuktian (verification)', 'Menarik kesimpulan (generalization)'] } },
  inquiry: { nama: 'Inquiry Learning (analisis sumber sejarah)', metode: ['tanya jawab', 'analisis sumber primer dan sekunder', 'diskusi kelompok', 'presentasi'],
    alasan: 'materi ini menuntut murid membandingkan berbagai sumber dan sudut pandang, sehingga cocok dipelajari dengan merumuskan pertanyaan lalu menelusuri jawabannya dari sumber sejarah.',
    sintaks: { memahami: ['Orientasi', 'Merumuskan pertanyaan penelitian'], mengaplikasi: ['Mengumpulkan informasi dari sumber', 'Menganalisis dan menguji jawaban sementara'], merefleksi: ['Merumuskan kesimpulan', 'Refleksi proses inkuiri'] } },
  pbl: { nama: 'Problem Based Learning', metode: ['diskusi kelompok', 'studi kasus', 'tanya jawab', 'presentasi'],
    alasan: 'materi ini memuat persoalan nyata (ketidakadilan, kebijakan, dan dampaknya) yang dapat dikaitkan dengan masalah masa kini sehingga murid berlatih memecahkan masalah.',
    sintaks: { memahami: ['Orientasi murid pada masalah', 'Mengorganisasi murid untuk belajar'], mengaplikasi: ['Membimbing penyelidikan individu dan kelompok', 'Mengembangkan dan menyajikan hasil karya'], merefleksi: ['Menganalisis dan mengevaluasi proses pemecahan masalah'] } },
  pjbl: { nama: 'Project Based Learning', metode: ['diskusi kelompok', 'kerja proyek', 'presentasi', 'tanya jawab'],
    alasan: 'materi ini dekat dengan kehidupan murid dan dapat diwujudkan menjadi produk nyata, sehingga murid belajar dengan berkarya secara kolaboratif.',
    sintaks: { memahami: ['Penentuan pertanyaan mendasar', 'Mendesain perencanaan proyek'], mengaplikasi: ['Menyusun jadwal', 'Memonitor murid dan kemajuan proyek'], merefleksi: ['Menguji hasil (presentasi produk)', 'Mengevaluasi pengalaman'] } },
  jigsaw: { nama: 'Cooperative Learning tipe Jigsaw', metode: ['diskusi kelompok asal dan kelompok ahli', 'tutor sebaya', 'tanya jawab', 'kuis'],
    alasan: 'materi ini terdiri atas beberapa subtopik yang setara (kerajaan, tokoh, atau peristiwa), sehingga setiap murid dapat menjadi ahli satu subtopik lalu mengajarkannya kepada teman.',
    sintaks: { memahami: ['Pembentukan kelompok asal dan pembagian subtopik'], mengaplikasi: ['Diskusi kelompok ahli', 'Kembali ke kelompok asal dan saling mengajarkan'], merefleksi: ['Kuis individu dan penghargaan kelompok', 'Refleksi'] } }
};
const MODEL_BAB = { 'indonesia-1': 'discovery', 'indonesia-2': 'jigsaw', 'indonesia-3': 'jigsaw', 'indonesia-4': 'pbl', 'indonesia-5': 'jigsaw', 'indonesia-6': 'inquiry', 'indonesia-7': 'inquiry', 'indonesia-8': 'pjbl', 'indonesia-9': 'pbl', 'indonesia-10': 'inquiry', 'indonesia-11': 'pjbl',
  'dunia-1': 'jigsaw', 'dunia-2': 'discovery', 'dunia-3': 'inquiry', 'dunia-4': 'discovery', 'dunia-5': 'pbl', 'dunia-6': 'jigsaw', 'dunia-7': 'inquiry', 'dunia-8': 'pbl', 'dunia-9': 'pjbl',
  'ski-1': 'discovery', 'ski-2': 'jigsaw', 'ski-3': 'inquiry', 'ski-4': 'pjbl', 'ski-5': 'pbl', 'ski-6': 'jigsaw', 'ski-7': 'inquiry', 'ski-8': 'pjbl' };
const PRODUK = { discovery: 'peta konsep atau garis waktu bergambar', inquiry: 'laporan analisis sumber singkat', pbl: 'rekomendasi solusi dalam bentuk poster atau infografis', pjbl: 'produk kreatif (poster digital, video pendek, atau podcast sejarah)', jigsaw: 'rangkuman kelompok dalam bentuk peta konsep' };

const bersihJudul = s => s.replace(/^[A-Z]\.\s*/, '');
const teksPolos = h => new DOMParser().parseFromString(`<div>${String(h).replace(/<(table|figure|svg|ol|ul)[\s\S]*?<\/\1>/gi, ' ').replace(/<\/(p|li|td|th|div|h\d)>|<br\s*\/?>/gi, ' $&')}</div>`, 'text/html').body.textContent.replace(/\s+/g, ' ').trim();
const kalimat = (t, n) => (t.match(/[^.!?]+[.!?]+/g) || [t]).slice(0, n).join(' ').trim();
const fmtTgl = d => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

function susunModul(o) {
  const k = cariK(o.kid), d = k.bab.find(x => x.id === o.id), b = isiBab(o.kid, o.id), M = MODEL[o.model] || MODEL.discovery;
  const fase = o.kelas === 'X' ? 'E' : 'F', mapel = o.kid === 'ski' ? 'Sejarah Kebudayaan Islam' : 'Sejarah';
  const sub = b.bagian.map(s => bersihJudul(s.judul));
  const cinta = []; b.bagian.forEach(s => { if (s.cinta && !cinta.some(c => c[0] === s.cinta[0])) cinta.push(s.cinta); });
  const hots = b.soal.filter(q => /C[456]/.test(q.l || '')), mudah = b.soal.filter(q => /C[12]/.test(q.l || ''));
  const pemantik = (b.soal.find(q => /C[45]/.test(q.l || '')) || b.soal[0]).q.replace(/…$/, '?').replace(/adalah\s*\?$/, 'adalah?');
  const menit = o.jp * o.menitJp, P = o.pertemuan;
  const kkm = konfig().kkm, url = `${alamatDasar()}#${o.kid}-${o.id}`;
  const dpl = ['Penalaran Kritis', 'Komunikasi', 'Kolaborasi', o.kid === 'ski' ? 'Keimanan dan Ketakwaan terhadap Tuhan YME' : 'Kewargaan'];
  const B = [];
  const h1 = x => B.push({ t: 'h1', x }), h2 = x => B.push({ t: 'h2', x }), h3 = x => B.push({ t: 'h3', x }), p = (x, al) => B.push({ t: 'p', x, al }), li = (x, n) => B.push({ t: 'li', x, n }), tabel = (rows, head, lebar) => B.push({ t: 'tabel', rows, head, lebar });
  const kv = rows => B.push({ t: 'tabel', rows, kv: true, lebar: [32, 68] });

  B.push({ t: 'judul', x: 'MODUL AJAR', sub: `Pembelajaran Mendalam Berbasis Cinta (KBC)\n${mapel} · ${b.judul}` });
  h2('A. Identitas Modul');
  kv([['Nama Madrasah', o.madrasah || '…'], ['Nama Penyusun', o.guru || '…'], ['Mata Pelajaran', mapel], ['Fase / Kelas / Semester', `${fase} / ${o.kelas} / ${o.semester}`], ['Materi Pokok', `${k.judul}, Bab ${o.id}: ${b.judul}`], ['Alokasi Waktu', `${P} pertemuan × ${o.jp} JP × ${o.menitJp} menit`], ['Tahun Pelajaran', o.tahun]]);

  h2('B. Identifikasi');
  h3('1. Kesiapan murid');
  p(`Murid telah mempelajari materi sebelumnya${babSebelum(o.kid, o.id) ? ` (Bab ${babSebelum(o.kid, o.id).id}: ${babSebelum(o.kid, o.id).judul})` : ''} dan terbiasa menggunakan gawai untuk belajar. Sebelum pertemuan, murid diminta membaca materi Bab ${o.id} di aplikasi Ruang Historia dan mencatat poin-poin penting di buku catatan. Kesiapan murid diukur melalui asesmen awal (lihat bagian E).`);
  h3('2. Karakteristik materi');
  p(`Materi ${b.judul.toLowerCase()} bersifat ${/1|2|3/.test(String(o.id)) && o.kid !== 'ski' ? 'konseptual dan faktual' : 'faktual, kronologis, dan analitis'}: murid perlu memahami fakta dan urutan peristiwa, lalu menganalisis sebab-akibat serta maknanya bagi kehidupan sekarang. Cakupan materi: ${sub.join('; ')}.`);
  h3('3. Dimensi Profil Lulusan');
  dpl.forEach(x => li(x));
  h3('4. Topik Panca Cinta dan materi insersi KBC');
  if (cinta.length) cinta.forEach(c => li(`**${c[0]}**: ${c[1]}`)); else li('**Cinta tanah air**: menghargai perjuangan dan warisan sejarah bangsa.');

  h2('C. Desain Pembelajaran');
  h3('1. Capaian Pembelajaran');
  p(o.cp || `Pada akhir Fase ${fase}, murid mampu memahami dan menganalisis ${b.judul.toLowerCase()} dengan menggunakan konsep dasar sejarah (kronologi, sebab-akibat, perubahan dan keberlanjutan), serta mengaitkannya dengan kehidupan masa kini. (Sesuaikan dengan dokumen CP ${mapel} yang berlaku.)`);
  h3('2. Lintas disiplin ilmu');
  p(o.kid === 'ski' ? 'Al-Qur\'an Hadis, Akidah Akhlak, Geografi, dan Bahasa Indonesia (literasi).' : 'Geografi (ruang dan peta), Ekonomi, Sosiologi, PPKn, dan Bahasa Indonesia (literasi).');
  h3('3. Tujuan Pembelajaran');
  b.tujuan.forEach((t, i) => li(t, i + 1));
  h3('4. Praktik pedagogis');
  kv([['Pendekatan', 'Pembelajaran Mendalam (berkesadaran, bermakna, menggembirakan) terintegrasi Kurikulum Berbasis Cinta'], ['Model', M.nama], ['Metode', M.metode.join(', ')], ['Alasan pemilihan model', `Model ini dipilih karena ${M.alasan}`]]);
  h3('5. Kemitraan pembelajaran');
  p('Orang tua mendampingi murid membaca materi di rumah; pustakawan madrasah menyediakan buku pendukung; bila memungkinkan, museum atau situs sejarah setempat dijadikan sumber belajar.');
  h3('6. Lingkungan pembelajaran');
  kv([['Ruang fisik', 'Kelas ditata berkelompok (4–5 murid), dinding untuk menempel hasil karya (galeri)'], ['Ruang virtual', `Aplikasi Ruang Historia (${url})`], ['Budaya belajar', 'Saling menghargai pendapat, jujur, tabayun (memeriksa sumber), dan gotong royong']]);
  h3('7. Pemanfaatan digital');
  li(`Materi, video, foto arsip, dan kuis interaktif di aplikasi Ruang Historia (Bab ${o.id}).`);
  li('Presentasi kelas yang dibuat dari Panel Guru Ruang Historia.');
  li('Rekap nilai kuis otomatis melalui Google Sheets (bila diaktifkan).');

  h2('D. Pengalaman Belajar');
  const fase3 = { memahami: 'Memahami (berkesadaran, bermakna)', mengaplikasi: 'Mengaplikasi (bermakna, menggembirakan)', merefleksi: 'Merefleksi (berkesadaran)' };
  const kegiatan = {
    memahami: () => {
      const s = M.sintaks.memahami, L = [];
      if (o.model === 'jigsaw') { L.push([s[0], [`Guru membentuk kelompok asal beranggotakan ${Math.min(sub.length, 5)} murid.`, `Setiap anggota mendapat satu subtopik: ${sub.slice(0, 5).map((x, i) => `(${i + 1}) ${x}`).join('; ')}.`, 'Murid membaca subtopiknya di Ruang Historia dan mencatat poin penting.']]); return L; }
      L.push([s[0], [o.model === 'pjbl' ? `Guru mengajukan pertanyaan mendasar: "Bagaimana kita dapat menyampaikan pelajaran dari ${b.judul.toLowerCase()} kepada masyarakat sekarang?"` : o.model === 'pbl' ? `Guru menyajikan masalah dari stimulus berikut: "${(hots.find(q => q.s) || {}).s || b.sub}"` : `Guru menayangkan video "${b.video ? b.video.judul : b.judul}" dan beberapa foto arsip dari Ruang Historia.`, `Guru mengajukan pertanyaan pemantik: "${pemantik}"`]]);
      L.push([s[1], [o.model === 'pjbl' ? `Murid berkelompok merancang ${PRODUK.pjbl} beserta pembagian tugas.` : 'Murid berkelompok merumuskan 2–3 pertanyaan yang ingin dijawab tentang materi.', 'Guru membantu murid memilih pertanyaan yang paling penting dan dapat diteliti.']]);
      return L;
    },
    mengaplikasi: () => {
      const s = M.sintaks.mengaplikasi;
      if (o.model === 'jigsaw') return [[s[0], ['Murid dengan subtopik yang sama berkumpul dalam kelompok ahli.', 'Kelompok ahli membahas subtopik menggunakan materi, garis waktu, dan kartu tokoh di Ruang Historia, lalu menyiapkan cara menjelaskannya.']], [s[1], ['Murid kembali ke kelompok asal dan bergiliran mengajarkan subtopiknya.', `Kelompok asal menyusun ${PRODUK.jigsaw} untuk seluruh subtopik pada LKPD.`]]];
      return [[s[0], [o.model === 'pjbl' ? 'Kelompok menyusun jadwal pengerjaan proyek dan mulai mengumpulkan bahan dari Ruang Historia.' : `Murid mengumpulkan informasi dari materi Ruang Historia (${sub.slice(0, 4).join('; ')}), foto arsip, dan buku teks.`, 'Guru berkeliling memberi bimbingan dan pertanyaan penuntun.']],
        [s[1], [o.model === 'pjbl' ? `Guru memantau kemajuan; kelompok menyelesaikan ${PRODUK.pjbl}.` : `Kelompok mengolah informasi menjadi ${PRODUK[o.model] || 'rangkuman'} pada LKPD.`, 'Kelompok menyajikan hasilnya dengan teknik galeri (gallery walk); kelompok lain memberi tanggapan.']]];
    },
    merefleksi: () => {
      const s = M.sintaks.merefleksi, L = [];
      L.push([s[0], [o.model === 'jigsaw' ? `Murid mengerjakan kuis individu Bab ${o.id} di Ruang Historia (KKM ${kkm}); kelompok dengan peningkatan terbaik mendapat penghargaan.` : 'Guru dan murid mengecek kembali hasil kerja dengan sumber sejarah; meluruskan miskonsepsi.', 'Murid menuliskan satu hal baru yang dipelajari dan satu pertanyaan yang masih tersisa.']]);
      if (s[1]) L.push([s[1], [`Refleksi Panca Cinta: ${cinta[0] ? cinta[0][1] : 'apa makna peristiwa ini bagi sikap kita sebagai warga bangsa?'}`, 'Murid menuliskan komitmen sikap yang akan dipraktikkan dalam kehidupan sehari-hari.']]);
      return L;
    }
  };
  const awal = (n) => [`Guru membuka dengan salam dan doa bersama (cinta Allah dan Rasul-Nya), lalu mengecek kehadiran dan kesiapan murid.`, n === 1 ? `Apersepsi: mengaitkan materi dengan ${babSebelum(o.kid, o.id) ? `Bab ${babSebelum(o.kid, o.id).id} (${babSebelum(o.kid, o.id).judul})` : 'pengalaman murid'} dan dengan catatan murid dari Ruang Historia.` : 'Guru mengulas singkat kegiatan pertemuan sebelumnya.', n === 1 ? 'Guru menyampaikan tujuan pembelajaran dan manfaatnya bagi kehidupan.' : 'Guru menyampaikan target kegiatan hari ini.'];
  const tutup = (n, akhir) => ['Murid bersama guru menyimpulkan pembelajaran.', akhir ? `Tindak lanjut: murid menyelesaikan kuis Bab ${o.id} di Ruang Historia (KKM ${kkm}) dan membaca bab berikutnya.` : 'Guru menyampaikan rencana kegiatan pertemuan berikutnya.', 'Pembelajaran ditutup dengan doa dan salam.'];
  const urutan = P === 1 ? [['memahami', 'mengaplikasi', 'merefleksi']] : P === 2 ? [['memahami', 'mengaplikasi'], ['merefleksi']] : [['memahami'], ['mengaplikasi'], ['merefleksi']];
  urutan.forEach((fs, i) => {
    const n = i + 1, inti = menit - 25;
    h3(P > 1 ? `Pertemuan ${n} (${o.jp} JP)` : `Kegiatan pembelajaran (${o.jp} JP)`);
    const rows = [];
    rows.push(['Pendahuluan (berkesadaran)', awal(n).map(x => '• ' + x).join('\n'), '15 menit']);
    fs.forEach(f => kegiatan[f]().forEach(([nm, langkah]) => rows.push([`${fase3[f]}\nSintaks: ${nm}`, langkah.map(x => '• ' + x).join('\n'), `${Math.round(inti / fs.length / kegiatan[f]().length)} menit`])));
    rows.push(['Penutup (bermakna)', tutup(n, n === urutan.length).map(x => '• ' + x).join('\n'), '10 menit']);
    tabel(rows, ['Tahap', 'Kegiatan', 'Waktu'], [24, 62, 14]);
  });
  p(`Diferensiasi: murid yang sudah cepat paham diberi tugas pengayaan (menganalisis satu sumber tambahan atau menjadi tutor sebaya); murid yang memerlukan bantuan mendapat pendampingan, ringkasan visual, dan video di Ruang Historia.`);

  h2('E. Asesmen Pembelajaran');
  kv([['Asesmen awal (diagnostik)', `Pertanyaan pemantik lisan dan 3 soal singkat (lampiran 3), atau kuis Bab ${o.id} di Ruang Historia sebelum pembelajaran.`],
    ['Asesmen proses (formatif)', 'Observasi keaktifan dan kolaborasi dalam diskusi (rubrik lampiran 3), penilaian LKPD, dan kuis interaktif Ruang Historia.'],
    ['Asesmen akhir (sumatif)', `Soal uraian (lampiran 3) dan/atau kuis Bab ${o.id} di Ruang Historia dengan KKM ${kkm}. Murid yang belum tuntas mengikuti remedial; yang tuntas mendapat pengayaan.`]]);

  B.push({ t: 'ttd', tempat: o.tempat || '…', tgl: fmtTgl(new Date()), kepala: o.kepala || '…', nipKepala: o.nipKepala || '…', guru: o.guru || '…', nipGuru: o.nip || '…' });

  B.push({ t: 'pb' });
  h1('LAMPIRAN');
  h2('Lampiran 1. Ringkasan materi');
  b.bagian.forEach(s => { h3(s.judul); p(kalimat(teksPolos(s.isi), 3)); });
  if (b.jelajah && b.jelajah.lapisan) { h3(b.jelajah.mode === 'waktu' ? 'Garis waktu' : 'Lapisan zaman'); tabel(b.jelajah.lapisan.map(l => [l.th || '', l.n, l.ket || '']), [b.jelajah.mode === 'waktu' ? 'Waktu' : 'Masa', 'Peristiwa', 'Keterangan'], [16, 30, 54]); }

  h2('Lampiran 2. Lembar Kerja Peserta Didik (LKPD)');
  kv([['Nama kelompok', ''], ['Anggota', '\n\n'], ['Kelas', '']]);
  p(`**Petunjuk**: Baca materi Bab ${o.id} di Ruang Historia (pindai atau buka ${url}), diskusikan bersama kelompok, lalu kerjakan tugas berikut.`);
  if (o.model === 'jigsaw') sub.slice(0, 5).forEach((x, i) => li(`Subtopik ${i + 1}: ${x}. Tuliskan tiga poin penting dan satu tokoh atau peristiwa kuncinya.`, i + 1));
  else b.esai.forEach((e, i) => li(e.q, i + 1));
  li(`Buatlah ${PRODUK[o.model] || 'rangkuman'} dari hasil diskusi kelompok.`, (o.model === 'jigsaw' ? Math.min(sub.length, 5) : b.esai.length) + 1);
  li(`Refleksi: ${cinta[0] ? cinta[0][1] : 'Apa nilai yang dapat kalian teladani dari materi ini?'} Tuliskan pendapat kelompokmu.`, (o.model === 'jigsaw' ? Math.min(sub.length, 5) : b.esai.length) + 2);

  h2('Lampiran 3. Instrumen asesmen');
  h3('a. Asesmen awal (diagnostik)');
  mudah.slice(0, 3).forEach((q, i) => li(q.q, i + 1));
  h3('b. Rubrik observasi diskusi (formatif)');
  tabel([['Keaktifan', 'Selalu aktif bertanya dan menjawab', 'Sering aktif', 'Kadang-kadang aktif', 'Pasif'], ['Kerja sama', 'Membantu seluruh anggota', 'Bekerja sama dengan baik', 'Kurang bekerja sama', 'Bekerja sendiri'], ['Penggunaan sumber', 'Memakai beberapa sumber dan menyebutkannya', 'Memakai dua sumber', 'Memakai satu sumber', 'Tanpa sumber'], ['Sikap menghargai', 'Selalu menghargai pendapat teman', 'Sering menghargai', 'Kadang-kadang', 'Tidak menghargai']], ['Aspek', '4 (Sangat baik)', '3 (Baik)', '2 (Cukup)', '1 (Perlu bimbingan)'], [18, 22, 20, 20, 20]);
  p('Nilai = (jumlah skor ÷ 16) × 100.');
  h3('c. Asesmen akhir: soal uraian dan rubrik');
  b.esai.forEach((e, i) => { li(e.q, i + 1); tabel(e.rubrik.map(r => { const m = r.match(/^(\d)\s*:\s*(.*)$/); return m ? [m[1], m[2]] : ['', r]; }), ['Skor', 'Kriteria'], [12, 88]); });
  h3(`d. Soal pilihan ganda (contoh dari bank soal, ${b.soal.length} soal tersedia di Ruang Historia)`);
  const pg = hots.slice(0, 3).concat(mudah.slice(3, 10)).slice(0, 10);
  pg.forEach((q, i) => { if (q.s) p(`*${q.s}*`); li(q.q, i + 1); q.o.forEach((x, j) => B.push({ t: 'opsi', x: `${huruf(j)}. ${x}` })); });
  p('**Kunci jawaban**: ' + pg.map((q, i) => `${i + 1}. ${huruf(q.a)}`).join('; '));

  h2('Lampiran 4. Glosarium');
  tabel((b.glosarium || []).map(g => [g[0], g[1]]), ['Istilah', 'Arti'], [28, 72]);
  h2('Lampiran 5. Daftar pustaka');
  li(`Ruang Historia: aplikasi belajar sejarah interaktif. ${HAK}. ${url}`);
  li(`Buku teks ${mapel} kelas ${o.kelas} yang digunakan di madrasah.`);
  li('Wikimedia Commons: sumber foto arsip berlisensi terbuka (keterangan pembuat dan lisensi tercantum di aplikasi).');
  li('Keputusan Direktur Jenderal Pendidikan Islam Nomor 6077 Tahun 2025 tentang Panduan Kurikulum Berbasis Cinta.');
  return { blok: B, nama: `Modul Ajar ${mapel} Kelas ${o.kelas} Bab ${o.id} ${b.judul}` };
}

/* ---- tampilan HTML (pratinjau dan PDF) ---- */
const runsMd = t => { const out = []; String(t).split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).forEach(s => { if (!s) return; if (/^\*\*.*\*\*$/.test(s)) out.push({ text: s.slice(2, -2), b: true }); else if (/^\*.*\*$/.test(s)) out.push({ text: s.slice(1, -1), i: true }); else out.push({ text: s }); }); return out; };
const mdHTML = t => runsMd(t).map(r => r.b ? `<b>${esc(r.text)}</b>` : r.i ? `<i>${esc(r.text)}</i>` : esc(r.text)).join('').replace(/\n/g, '<br>');
function modulHTML(M) {
  let html = '', ol = null;
  const tutupList = () => { if (ol) { html += `</${ol}>`; ol = null; } };
  for (const x of M.blok) {
    if (x.t !== 'li' && x.t !== 'opsi') tutupList();
    if (x.t === 'judul') html += `<div class="md-judul"><h1>${esc(x.x)}</h1><p>${esc(x.sub).replace(/\n/g, '<br>')}</p></div>`;
    else if (x.t === 'h1') html += `<h1 class="md-h1">${esc(x.x)}</h1>`;
    else if (x.t === 'h2') html += `<h2 class="md-h2">${esc(x.x)}</h2>`;
    else if (x.t === 'h3') html += `<h3 class="md-h3">${esc(x.x)}</h3>`;
    else if (x.t === 'p') html += `<p style="${x.al ? 'text-align:' + x.al : ''}">${mdHTML(x.x)}</p>`;
    else if (x.t === 'li') { const jenis = x.n ? 'ol' : 'ul'; if (ol !== jenis) { tutupList(); html += `<${jenis}>`; ol = jenis; } html += `<li ${x.n ? `value="${x.n}"` : ''}>${mdHTML(x.x)}</li>`; }
    else if (x.t === 'opsi') html += `<div class="md-opsi">${esc(x.x)}</div>`;
    else if (x.t === 'tabel') html += `<table class="md-tabel ${x.kv ? 'kv' : ''}">${x.lebar ? `<colgroup>${x.lebar.map(w => `<col style="width:${w}%">`).join('')}</colgroup>` : ''}${x.head ? `<thead><tr>${x.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>` : ''}<tbody>${x.rows.map(r => `<tr>${r.map((c, j) => `<td>${x.kv && j === 0 ? `<b>${esc(c)}</b>` : mdHTML(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    else if (x.t === 'ttd') html += `<table class="md-ttd"><tr><td>Mengetahui,<br>Kepala Madrasah<br><br><br><br><b>${esc(x.kepala)}</b><br>NIP. ${esc(x.nipKepala)}</td><td>${esc(x.tempat)}, ${esc(x.tgl)}<br>Guru Mata Pelajaran<br><br><br><br><b>${esc(x.guru)}</b><br>NIP. ${esc(x.nipGuru)}</td></tr></table>`;
    else if (x.t === 'pb') html += '<div class="md-pb"></div>';
  }
  tutupList();
  return html;
}

/* ---- penulis .docx sederhana (tanpa pustaka tambahan) ---- */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = t[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }; })();
function zipSimpan(berkas) {
  const enc = new TextEncoder(), bagian = [], pusat = []; let off = 0;
  const u16 = n => [n & 255, (n >> 8) & 255], u32 = n => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255];
  for (const [nama, isi] of berkas) {
    const nb = enc.encode(nama), data = typeof isi === 'string' ? enc.encode(isi) : isi, crc = CRC(data);
    const kepala = new Uint8Array([...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nb.length), ...u16(0)]);
    bagian.push(kepala, nb, data);
    pusat.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nb.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(off)]), nb);
    off += kepala.length + nb.length + data.length;
  }
  const besarPusat = pusat.reduce((a, x) => a + x.length, 0);
  const akhir = new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(berkas.length), ...u16(berkas.length), ...u32(besarPusat), ...u32(off), ...u16(0)]);
  return new Blob([...bagian, ...pusat, akhir], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}
const xe = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function docxDari(M) {
  const run = (r, extra = '') => { const parts = r.text.split('\n'); return parts.map((t, i) => `<w:r><w:rPr>${r.b ? '<w:b/>' : ''}${r.i ? '<w:i/>' : ''}${extra}</w:rPr>${i ? '<w:br/>' : ''}<w:t xml:space="preserve">${xe(t)}</w:t></w:r>`).join(''); };
  const par = (teks, { gaya = '', al = '', ind = 0, gantung = 0, rpr = '', sesudah = null } = {}) => `<w:p><w:pPr>${gaya ? `<w:pStyle w:val="${gaya}"/>` : ''}${sesudah !== null ? `<w:spacing w:after="${sesudah}"/>` : ''}${ind ? `<w:ind w:left="${ind}" w:hanging="${gantung}"/>` : ''}${al ? `<w:jc w:val="${al}"/>` : ''}</w:pPr>${runsMd(teks).map(r => run(r, rpr)).join('')}</w:p>`;
  const sel = (isi, w, { kepala = false, tebal = false } = {}) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${kepala ? '<w:shd w:val="clear" w:color="auto" w:fill="2B3A67"/>' : ''}</w:tcPr>${String(isi).split('\n').map(baris => par(tebal ? `**${baris.replace(/\*\*/g, '')}**` : baris, { rpr: kepala ? '<w:color w:val="FFFFFF"/><w:b/>' : '', sesudah: 40 })).join('') || '<w:p/>'}</w:tc>`;
  let body = ''; const lebarTotal = 9354;
  for (const x of M.blok) {
    if (x.t === 'judul') body += par(x.x, { gaya: 'Title', al: 'center' }) + x.sub.split('\n').map(s => par(s, { al: 'center', rpr: '<w:sz w:val="26"/><w:color w:val="2B3A67"/>' })).join('');
    else if (x.t === 'h1') body += par(x.x, { gaya: 'Heading1' });
    else if (x.t === 'h2') body += par(x.x, { gaya: 'Heading2' });
    else if (x.t === 'h3') body += par(x.x, { gaya: 'Heading3' });
    else if (x.t === 'p') body += par(x.x, { al: x.al === 'center' ? 'center' : 'both' });
    else if (x.t === 'mentah') body += `<w:p><w:pPr><w:spacing w:after="0"/></w:pPr>${x.x ? `<w:r><w:t xml:space="preserve">${xe(x.x)}</w:t></w:r>` : ''}</w:p>`;
    else if (x.t === 'li') body += par(`${x.n ? x.n + '.' : '•'}\t${x.x}`, { ind: 425, gantung: 425 });
    else if (x.t === 'opsi') body += par(x.x, { ind: 851, gantung: 0, sesudah: 20 });
    else if (x.t === 'pb') body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    else if (x.t === 'tabel' || x.t === 'ttd') {
      const rows = x.t === 'ttd' ? [[`Mengetahui,\nKepala Madrasah\n\n\n\n**${x.kepala}**\nNIP. ${x.nipKepala}`, `${x.tempat}, ${x.tgl}\nGuru Mata Pelajaran\n\n\n\n**${x.guru}**\nNIP. ${x.nipGuru}`]] : x.rows;
      const kol = (x.head || rows[0]).length, lebar = (x.lebar || Array(kol).fill(100 / kol)).map(w => Math.round(w / 100 * lebarTotal));
      const garis = x.t === 'ttd' ? '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>' : '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="BFB6AA"/><w:left w:val="single" w:sz="4" w:color="BFB6AA"/><w:bottom w:val="single" w:sz="4" w:color="BFB6AA"/><w:right w:val="single" w:sz="4" w:color="BFB6AA"/><w:insideH w:val="single" w:sz="4" w:color="BFB6AA"/><w:insideV w:val="single" w:sz="4" w:color="BFB6AA"/></w:tblBorders>';
      body += `<w:tbl><w:tblPr><w:tblW w:w="${lebarTotal}" w:type="dxa"/>${garis}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${lebar.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`;
      if (x.head) body += `<w:tr><w:trPr><w:tblHeader/></w:trPr>${x.head.map((h, j) => sel(h, lebar[j], { kepala: true })).join('')}</w:tr>`;
      rows.forEach(r => { body += `<w:tr><w:trPr><w:cantSplit/></w:trPr>${r.map((c, j) => sel(c, lebar[j], { tebal: x.kv && j === 0 })).join('')}</w:tr>`; });
      body += '</w:tbl>' + par('', { sesudah: 60 });
    }
  }
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1418" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const gaya = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri" w:eastAsia="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="id-ID"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="60"/><w:jc w:val="center"/></w:pPr><w:rPr><w:b/><w:color w:val="2B3A67"/><w:sz w:val="40"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:jc w:val="center"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="2B3A67"/><w:sz w:val="30"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="100"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="E0B04A"/></w:pBdr><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="2B3A67"/><w:sz w:val="26"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="60"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:sz w:val="23"/></w:rPr></w:style></w:styles>`;
  return zipSimpan([
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ['word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
    ['word/document.xml', doc], ['word/styles.xml', gaya]
  ]);
}
const unduhBlob = (blob, nama) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nama; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); };
const namaBerkas = s => s.replace(/[^\w\s.-]/g, '').replace(/\s+/g, ' ').trim();

function halamanModul() {
  if (!modeGuru()) { location.hash = '#guru'; return; }
  const o = S.get('modulTerakhir', null); if (!o || !isiBab(o.kid, o.id)) { location.hash = '#guru'; return; }
  const M = susunModul(o);
  app.innerHTML = `<section class="pad no-cetak"><div class="wrap" style="max-width:900px"><a class="balik gelap" href="#guru/modul">Modul Ajar</a><h1>Modul ajar siap</h1>
<p>Periksa pratinjau di bawah, lalu unduh. Dokumen Word dapat diedit di Microsoft Word, WPS, atau Google Dokumen.</p>
<div class="row"><button class="btn" type="button" id="mword">Unduh Word (.docx)</button><button class="btn alt" type="button" id="mpdf">Unduh PDF</button></div>
<p class="catatan">Untuk PDF: pada jendela cetak, pilih <b>Simpan sebagai PDF</b>.</p></div></section>
<section class="pad"><div class="wrap"><article class="modul-dok">${modulHTML(M)}</article></div></section>`;
  document.getElementById('mword').addEventListener('click', () => unduhBlob(docxDari(M), namaBerkas(M.nama) + '.docx'));
  document.getElementById('mpdf').addEventListener('click', () => { const t = document.title; document.title = namaBerkas(M.nama); document.body.classList.add('cetak-modul'); setTimeout(() => { print(); document.body.classList.remove('cetak-modul'); document.title = t; }, 50); });
}

async function cetakSlide(kid, id) {
  const { sl, warna } = await susunSlide(kid, id);
  const qr = await qrSVG(sl[sl.length - 1].url, 260);
  let wadah = document.getElementById('cetak-slide'); if (wadah) wadah.remove();
  wadah = document.createElement('div'); wadah.id = 'cetak-slide'; wadah.style.setProperty('--c', warna);
  wadah.innerHTML = sl.map((s, i) => `<div class="cs-hal">${slideHTML(s, warna, sl.length, i + 1, qr)}</div>`).join('');
  document.body.append(wadah);
  await Promise.all([...wadah.querySelectorAll('img')].map(im => im.complete ? 1 : new Promise(r => { im.onload = im.onerror = r; })));
  const t = document.title; document.title = namaBerkas(`Ruang Historia - ${cariK(kid).judul} Bab ${id} ${isiBab(kid, id).judul}`);
  document.body.classList.add('cetak-slide');
  setTimeout(() => { print(); document.body.classList.remove('cetak-slide'); document.title = t; wadah.remove(); }, 100);
}

/* ---------- GENERATOR SOAL ULANGAN HARIAN ---------- */
const LEVEL = { C1: 'Mengingat', C2: 'Memahami', C3: 'Menerapkan', C4: 'Menganalisis', C5: 'Mengevaluasi', C6: 'Mencipta' };
const RANAH = l => /C[123]/.test(l) ? (l === 'C3' ? 'MOTS' : 'LOTS') : 'HOTS';
const levelEsai = e => e.l || (/^Rancang|^Buat(lah)?|^Susun(lah)? (sebuah|rencana|usulan)/i.test(e.q) ? 'C6' : /^(Nilai|Bagaimana pendapat|Setujukah|Menurutmu|Apakah .* tepat)/i.test(e.q) ? 'C5' : /^(Jelaskan|Sebutkan|Uraikan) /i.test(e.q) && !/mengapa|kaitkan|bandingkan|hubungan/i.test(e.q) ? 'C2' : 'C4');
const bankSoal = (kid, ids) => ids.flatMap(id => { const b = isiBab(kid, id); return b ? b.soal.map((q, i) => ({ ...q, l: q.l || 'C1', kid, id, i, bab: b.judul })) : []; });
const bankEsai = (kid, ids) => ids.flatMap(id => { const b = isiBab(kid, id); return b ? (b.esai || []).map((e, i) => ({ ...e, l: levelEsai(e), kid, id, i, bab: b.judul })) : []; });
const PRESET = { asesmenku: { C1: 2, C2: 1, C3: 4, C4: 1, C5: 1, C6: 1 }, seimbang: { C1: 4, C2: 4, C3: 4, C4: 3, C5: 3, C6: 2 }, hots: { C1: 2, C2: 2, C3: 3, C4: 5, C5: 4, C6: 4 }, dasar: { C1: 8, C2: 6, C3: 4, C4: 2, C5: 0, C6: 0 } };

function buatUlangan(o) {
  const pg = bankSoal(o.kid, o.bab), es = bankEsai(o.kid, o.bab);
  const pilih = [];
  Object.keys(LEVEL).forEach(l => { const ada = acak(pg.filter(q => q.l === l)); pilih.push(...ada.slice(0, o.jumlah[l] || 0)); });
  // urutkan dari mudah ke sukar, atau acak
  const urut = o.acak ? acak(pilih) : pilih;
  const esaiPilih = o.levelEsai.length ? acak(es.filter(e => o.levelEsai.includes(e.l))).slice(0, o.nEsai) : acak(es).slice(0, o.nEsai);
  const dipakai = new Set(pilih.map(q => `${q.kid}-${q.id}-${q.i}`));
  return { ...o, tambah: buatTambahan(o, dipakai), pg: urut.map(q => [q.kid, q.id, q.i]), es: esaiPilih.map(e => [e.kid, e.id, e.i]), dibuat: Date.now() };
}
const ambilPG = r => { const b = isiBab(r[0], r[1]), q = b && b.soal[r[2]]; return q ? { ...q, l: q.l || 'C1', bab: b.judul, id: r[1] } : null; };
const ambilEs = r => { const b = isiBab(r[0], r[1]), e = b && (b.esai || [])[r[2]]; return e ? { ...e, l: levelEsai(e), bab: b.judul, id: r[1] } : null; };

function naskahUlangan(U) {
  const k = cariK(U.kid), mapel = U.kid === 'ski' ? 'Sejarah Kebudayaan Islam' : 'Sejarah';
  const pg = U.pg.map(ambilPG).filter(Boolean), es = U.es.map(ambilEs).filter(Boolean);
  const judulBab = U.bab.map(id => `Bab ${id}. ${isiBab(U.kid, id).judul}`).join('; ');
  const lain = butirLain(U), nLain = lain.pgk.length + lain.bs.length + lain.isian.length + lain.jodoh.length;
  const nObj = pg.length + nLain, skorPG = nObj ? Math.round((U.bobotPG / nObj) * 100) / 100 : 0, skorEs = es.length ? Math.round(((100 - U.bobotPG) / es.length) * 100) / 100 : 0;
  const B = []; const p = x => B.push({ t: 'p', x }), li = (x, n) => B.push({ t: 'li', x, n }), h2 = x => B.push({ t: 'h2', x }), h3 = x => B.push({ t: 'h3', x });
  B.push({ t: 'judul', x: U.judul || 'ULANGAN HARIAN', sub: `${mapel} · ${k.judul}\n${judulBab}` });
  B.push({ t: 'tabel', kv: true, lebar: [30, 70], rows: [['Madrasah', U.madrasah || '…'], ['Kelas / Semester', `${U.kelas} / ${U.semester}`], ['Waktu', `${U.waktu} menit`], ['Nama', ''], ['No. absen', '']] });
  h3('Petunjuk');
  [`Berdoalah sebelum mengerjakan soal.`, pg.length ? `Pilihlah satu jawaban yang paling tepat untuk soal nomor 1–${pg.length}.` : null, es.length ? `Jawablah soal uraian dengan jelas dan runtut.` : null, 'Kerjakan dengan jujur. Kejujuran adalah bagian dari cinta ilmu.'].filter(Boolean).forEach((x, i) => li(x, i + 1));
  if (pg.length) { h2('A. Pilihan ganda'); pg.forEach((q, i) => { if (q.s) p(`*${q.s}*`); li(q.q, i + 1); q.o.forEach((x, j) => B.push({ t: 'opsi', x: `${huruf(j)}. ${x}` })); }); }
  let no = pg.length, bag = pg.length ? 1 : 0; const H = t => h2(`${'ABCDEF'[bag++]}. ${t}`);
  if (lain.pgk.length) { H('Pilihan ganda kompleks (jawaban benar lebih dari satu)'); lain.pgk.forEach(x => { li(x.teks, ++no); x.opsi.forEach((o, j) => B.push({ t: 'opsi', x: `☐ ${huruf(j)}. ${o}` })); }); }
  if (lain.bs.length) { H('Benar atau salah'); lain.bs.forEach(x => { li(x.teks, ++no); tabel(B, x.butir.map(([t]) => [t, '']), ['Pernyataan', 'B / S'], [86, 14]); }); }
  if (lain.isian.length) { H('Isian singkat'); lain.isian.forEach(x => li(x.teks, ++no)); }
  if (lain.jodoh.length) { H('Menjodohkan'); lain.jodoh.forEach(x => { li(x.teks, ++no); const kanan = acak(x.pasang.map(p => p[1])); x.urutKanan = kanan; tabel(B, x.pasang.map((p, i) => [`${i + 1}. ${p[0]}`, `${huruf(i)}. ${kanan[i]}`]), ['Istilah', 'Pengertian'], [35, 65]); }); }
  if (es.length) { H('Uraian'); es.forEach(e => li(e.q, ++no)); }
  B.push({ t: 'pb' });
  B.push({ t: 'h1', x: 'KUNCI JAWABAN DAN PEMBAHASAN' });
  p(`Pedoman penskoran: soal objektif ${nObj} soal × ${skorPG} = ${U.bobotPG}${es.length ? `; uraian ${es.length} soal × ${skorEs} (skor rubrik 1–4 dikonversi: skor ÷ 4 × ${skorEs})` : ''}. Nilai maksimal 100.`);
  if (pg.length) tabel(B, pg.map((q, i) => [String(i + 1), huruf(q.a), q.l, q.p || '']), ['No', 'Kunci', 'Level', 'Pembahasan'], [7, 9, 9, 75]);
  { let m = pg.length; lain.pgk.forEach(x => p(`**${++m}** (PG kompleks, ${x.l}): ${x.kunci.join(', ')}`)); lain.bs.forEach(x => p(`**${++m}** (benar-salah, ${x.l}): ${x.butir.map((b, i) => `${i + 1}-${b[1]}`).join(', ')}`)); lain.isian.forEach(x => p(`**${++m}** (isian, ${x.l}): ${x.kunci}`)); lain.jodoh.forEach(x => p(`**${++m}** (menjodohkan, ${x.l}): ${x.pasang.map((pp, i) => `${i + 1}-${huruf(x.urutKanan.indexOf(pp[1]))}`).join(', ')}`)); }
  es.forEach((e, i) => { h3(`Soal ${pg.length + nLain + i + 1} (uraian, ${e.l})`); tabel(B, e.rubrik.map(r => { const m = r.match(/^(\d)\s*:\s*(.*)$/); return m ? [m[1], m[2]] : ['', r]; }), ['Skor', 'Kriteria'], [12, 88]); });
  B.push({ t: 'pb' });
  B.push({ t: 'h1', x: 'KISI-KISI SOAL' });
  const turunan = [...lain.pgk.map(x => ['PG kompleks', x, 'memilih pernyataan yang benar tentang materi']), ...lain.bs.map(x => ['Benar-salah', x, 'menentukan kebenaran pernyataan tentang materi']), ...lain.isian.map(x => ['Isian', x, 'melengkapi pernyataan: ' + x.teks.slice(0, 80)]), ...lain.jodoh.map(x => ['Menjodohkan', x, 'memasangkan istilah dengan pengertiannya'])];
  const semua = pg.map((q, i) => [String(i + 1), 'PG', `Bab ${q.id}`, indikator(q), q.l + ' ' + LEVEL[q.l], RANAH(q.l)]).concat(turunan.map(([j, x, ind], i) => [String(pg.length + i + 1), j, `Bab ${x.id}`, 'Murid mampu ' + ind, x.l + ' ' + LEVEL[x.l], RANAH(x.l)])).concat(es.map((e, i) => [String(pg.length + nLain + i + 1), 'Uraian', `Bab ${e.id}`, indikator(e), e.l + ' ' + LEVEL[e.l], RANAH(e.l)]));
  tabel(B, semua, ['No', 'Bentuk', 'Materi', 'Indikator soal', 'Level kognitif', 'Ranah'], [6, 9, 9, 46, 18, 12]);
  const hit = {}; [...pg, ...turunan.map(t => t[1]), ...es].forEach(x => hit[x.l] = (hit[x.l] || 0) + 1);
  p('**Sebaran level**: ' + Object.keys(LEVEL).filter(l => hit[l]).map(l => `${l} = ${hit[l]}`).join(', ') + `. LOTS ${[...pg, ...es].filter(x => RANAH(x.l) === 'LOTS').length}, MOTS ${[...pg, ...es].filter(x => RANAH(x.l) === 'MOTS').length}, HOTS ${[...pg, ...es].filter(x => RANAH(x.l) === 'HOTS').length}.`);
  return { blok: B, nama: `Ulangan Harian ${mapel} Kelas ${U.kelas} ${U.bab.map(x => 'Bab ' + x).join(' ')}`, pg, es, lain, skorEs };
}
function tabel(B, rows, head, lebar) { B.push({ t: 'tabel', rows, head, lebar }); }
const KATA_KERJA = { C1: 'menyebutkan', C2: 'menjelaskan', C3: 'menerapkan konsep tentang', C4: 'menganalisis', C5: 'menilai', C6: 'merancang' };
function indikator(q) {
  const t = (q.q || '').replace(/…|\.\.\./g, '').replace(/\s+/g, ' ').trim();
  const pendek = t.length > 110 ? t.slice(0, 107).replace(/\s\S*$/, '') + '…' : t;
  return `Disajikan ${q.s ? 'stimulus, ' : ''}murid mampu ${KATA_KERJA[q.l] || 'menjelaskan'}: ${pendek.charAt(0).toLowerCase() + pendek.slice(1)}`;
}

/* format teks untuk disalin ke aplikasi asesmen */
function teksUlangan(N, gaya) {
  const out = [];
  N.pg.forEach((q, i) => {
    if (gaya === 'aiken') { out.push(`${q.s ? q.s + ' ' : ''}${q.q}`); q.o.forEach((x, j) => out.push(`${huruf(j)}. ${x}`)); out.push(`ANSWER: ${huruf(q.a)}`, ''); return; }
    out.push(`${i + 1}. ${q.s ? q.s + ' ' : ''}${q.q}`); q.o.forEach((x, j) => out.push(`${huruf(j)}. ${x}`));
    out.push(`Kunci: ${huruf(q.a)}`); if (gaya === 'lengkap') out.push(`Level: ${q.l} (${LEVEL[q.l]})`, `Pembahasan: ${q.p || '-'}`); out.push('');
  });
  if (gaya !== 'aiken' && N.es.length) { out.push('URAIAN', ''); N.es.forEach((e, i) => { out.push(`${N.pg.length + i + 1}. ${e.q}`); if (gaya === 'lengkap') out.push(`Level: ${e.l} (${LEVEL[e.l]})`, 'Rubrik: ' + e.rubrik.join(' | ')); out.push(''); }); }
  return out.join('\n').trim();
}
const csvSel = x => `"${String(x ?? '').replace(/"/g, '""')}"`;
function csvUlangan(N) {
  const h = ['No', 'Jenis', 'Stimulus', 'Pertanyaan', 'A', 'B', 'C', 'D', 'E', 'Kunci', 'Level', 'Ranah', 'Bab', 'Pembahasan'];
  const r = N.pg.map((q, i) => [i + 1, 'PG', q.s || '', q.q, ...q.o, huruf(q.a), q.l, RANAH(q.l), `Bab ${q.id}`, q.p || '']).concat(N.es.map((e, i) => [N.pg.length + i + 1, 'Uraian', '', e.q, '', '', '', '', '', '', e.l, RANAH(e.l), `Bab ${e.id}`, e.rubrik.join(' | ')]));
  return '﻿' + [h, ...r].map(x => x.map(csvSel).join(',')).join('\r\n');
}

/* PDF berisi baris-baris teks yang tidak boleh terlipat (agar terbaca utuh oleh ASESMENKU) */
function cetakBaris(baris, nama) {
  let w = document.getElementById('cetak-as'); if (w) w.remove();
  w = document.createElement('div'); w.id = 'cetak-as';
  w.innerHTML = baris.map(x => `<div class="as-baris">${esc(x) || '&nbsp;'}</div>`).join('');
  document.body.append(w);
  const lebar = w.clientWidth;
  w.querySelectorAll('.as-baris').forEach(d => { const sw = d.scrollWidth; if (sw > lebar) d.style.fontSize = Math.max(4, 9 * lebar / sw * 0.98) + 'pt'; });
  const t = document.title; document.title = nama; document.body.classList.add('cetak-as');
  setTimeout(() => { print(); document.body.classList.remove('cetak-as'); document.title = t; w.remove(); }, 80);
}
function halamanSoal() {
  if (!modeGuru()) { location.hash = '#guru'; return; }
  const U = S.get('ulanganTerakhir', null); if (!U || !cariK(U.kid)) { location.hash = '#guru'; return; }
  const N = naskahUlangan(U);
  app.innerHTML = `<section class="pad no-cetak"><div class="wrap" style="max-width:900px"><a class="balik gelap" href="#guru/soal">Soal Ulangan</a><h1>Soal ulangan siap</h1>
<p><b>${N.pg.length}</b> pilihan ganda${N.lain.pgk.length ? `, <b>${N.lain.pgk.length}</b> PG kompleks` : ''}${N.lain.bs.length ? `, <b>${N.lain.bs.length}</b> benar-salah` : ''}${N.lain.isian.length ? `, <b>${N.lain.isian.length}</b> isian` : ''}${N.lain.jodoh.length ? `, <b>${N.lain.jodoh.length}</b> menjodohkan` : ''}, dan <b>${N.es.length}</b> uraian. Periksa naskahnya di bawah sebelum dipakai.</p>
<div class="box"><h2 style="margin-top:0">Masukkan ke ASESMENKU</h2>
<label><b>Format teks</b><select id="sg" class="isian"><option value="asesmenku">Format ASESMENKU</option><option value="ringkas">Bernomor + kunci (umum)</option><option value="lengkap">Bernomor + kunci + level + pembahasan</option><option value="aiken">Aiken (ANSWER: B), untuk impor kuis</option></select></label>
<textarea id="st" class="isian teks-soal" rows="10" readonly></textarea>
<div class="row"><button class="btn" type="button" id="ssalin">Salin semua soal</button><button class="btn alt" type="button" id="scsv">Unduh Excel (.csv)</button></div>
<p class="catatan">File .csv dapat dibuka di Excel atau Google Sheets. Kolomnya: No, Jenis, Stimulus, Pertanyaan, A–E, Kunci, Level, Ranah, Bab, Pembahasan.</p></div>
<div class="box"><h2 style="margin-top:0">Berkas untuk impor ASESMENKU</h2><p>Di ASESMENKU, buka paket soal → <b>Impor Word/PDF</b>, lalu pilih berkas ini. Isinya sudah dalam format ASESMENKU, lengkap dengan kunci.</p>
<div class="row"><button class="btn" type="button" id="aword">Word untuk ASESMENKU</button><button class="btn alt" type="button" id="apdf">PDF untuk ASESMENKU</button></div>
<p class="catatan">Disarankan memakai Word, karena hasil bacanya paling rapi. Jangan ubah susunan barisnya, misalnya baris "Kunci:".</p></div>
<div class="box"><h2 style="margin-top:0">Naskah cetak</h2><p>Berisi naskah soal, kunci jawaban dan pembahasan, pedoman penskoran, serta kisi-kisi.</p>
<div class="row"><button class="btn" type="button" id="sword">Unduh Word (.docx)</button><button class="btn alt" type="button" id="spdf">Unduh PDF</button><button class="btn alt" type="button" id="sulang">Acak ulang soal</button></div>
<p class="catatan">Untuk PDF: pada jendela cetak, pilih <b>Simpan sebagai PDF</b>.</p></div></div></section>
<section class="pad"><div class="wrap"><article class="modul-dok">${modulHTML(N)}</article></div></section>`;
  const sg = document.getElementById('sg'), st = document.getElementById('st');
  sg.value = S.get('gayaSoal', 'asesmenku'); const isi = () => { st.value = sg.value === 'asesmenku' ? teksAsesmenku(N) : teksUlangan(N, sg.value); S.set('gayaSoal', sg.value); }; sg.onchange = isi; isi();
  document.getElementById('ssalin').onclick = async e => { try { await navigator.clipboard.writeText(st.value); e.target.textContent = 'Tersalin. Tempel di ASESMENKU'; } catch { st.select(); document.execCommand('copy'); e.target.textContent = 'Tersalin'; } };
  document.getElementById('scsv').onclick = () => unduhBlob(new Blob([csvUlangan(N)], { type: 'text/csv;charset=utf-8' }), namaBerkas(N.nama) + '.csv');
  document.getElementById('sword').onclick = () => unduhBlob(docxDari(N), namaBerkas(N.nama) + '.docx');
  document.getElementById('spdf').onclick = () => { const t = document.title; document.title = namaBerkas(N.nama); document.body.classList.add('cetak-modul'); setTimeout(() => { print(); document.body.classList.remove('cetak-modul'); document.title = t; }, 50); };
  const kepalaAs = () => [`Ruang Historia - soal untuk impor ASESMENKU`, `${cariK(U.kid).judul}: ${U.bab.map(id => `Bab ${id} ${isiBab(U.kid, id).judul}`).join('; ')}`, `Kelas ${U.kelas} / ${U.semester}`, ''];
  const namaAs = namaBerkas(N.nama) + ' - ASESMENKU';
  document.getElementById('aword').onclick = () => unduhBlob(docxDari({ blok: [...kepalaAs(), ...teksAsesmenku(N).split('\n')].map(x => ({ t: 'mentah', x })) }), namaAs + '.docx');
  document.getElementById('apdf').onclick = () => cetakBaris([...kepalaAs(), ...teksAsesmenku(N).split('\n')], namaAs);
  document.getElementById('sulang').onclick = () => { S.set('ulanganTerakhir', buatUlangan(U)); halamanSoal(); };
}

const tahunAjar = () => { const d = new Date(), y = d.getFullYear(); return d.getMonth() >= 6 ? `${y}/${y + 1}` : `${y - 1}/${y}`; };
const idGuru = () => ({ madrasah: S.get('pemilik') !== false ? 'MAN 1 Belitung' : '', guru: S.get('pemilik') !== false ? 'Eki Ripan J.R. Tanjung, S.Pd., M.Pd., Gr.' : S.get('namaGuru', ''), nip: '', kepala: '', nipKepala: '', tempat: 'Tanjungpandan', tahun: tahunAjar(), menitJp: '45', ...S.get('idGuru', {}) });
function pasangModulForm() {
  const mr = document.getElementById('mr'), mb = document.getElementById('mb'), mm = document.getElementById('mm'), al = document.getElementById('malasan');
  const isiModel = () => { const saran = MODEL_BAB[`${mr.value}-${mb.value}`] || 'discovery'; mm.innerHTML = Object.entries(MODEL).map(([k, m]) => `<option value="${k}" ${k === saran ? 'selected' : ''}>${esc(m.nama)}${k === saran ? ' (disarankan)' : ''}</option>`).join(''); alasan(); };
  const alasan = () => { al.textContent = `Model ini cocok karena ${MODEL[mm.value].alasan}`; };
  const isiBabM = () => { mb.innerHTML = tersedia(cariK(mr.value)).map(d => `<option value="${d.id}">Bab ${d.id}. ${esc(d.judul)}</option>`).join(''); isiModel(); };
  mr.onchange = isiBabM; mb.onchange = isiModel; mm.onchange = alasan; isiBabM();
  document.getElementById('mbuat').onclick = () => {
    const idg = {}; app.querySelectorAll('[data-id]').forEach(x => idg[x.dataset.id] = x.value.trim()); S.set('idGuru', idg);
    S.set('modulTerakhir', { kid: mr.value, id: +mb.value, model: mm.value, kelas: document.getElementById('mk').value, semester: document.getElementById('ms').value, pertemuan: +document.getElementById('mp').value, jp: +document.getElementById('mj').value || 2, ...idg, menitJp: +idg.menitJp || 45 });
    location.hash = '#guru-modul';
  };
}
function pasangSoalForm() {
  const ur = document.getElementById('ur'), ub = document.getElementById('ub'), ul = document.getElementById('ul'), info = document.getElementById('uinfo');
  const babDipilih = () => [...ub.querySelectorAll('input:checked')].map(x => +x.value);
  const hitung = () => {
    const bank = bankSoal(ur.value, babDipilih()), ada = {}; bank.forEach(q => ada[q.l] = (ada[q.l] || 0) + 1);
    ul.querySelectorAll('input').forEach(x => { const n = ada[x.dataset.l] || 0; x.max = n; x.closest('label').querySelector('small').textContent = `tersedia ${n}`; x.classList.toggle('kurang', +x.value > n); });
    const tot = [...ul.querySelectorAll('input')].reduce((s, x) => s + Math.min(+x.value || 0, +x.max), 0), es = bankEsai(ur.value, babDipilih()).length;
    const lain = ['upgk', 'ubs', 'uis', 'ujd', 'ue'].reduce((s, id) => s + (+(document.getElementById(id) || {}).value || 0), 0); info.innerHTML = babDipilih().length ? `Akan dibuat sekitar <b>${tot + lain}</b> soal (${tot} pilihan ganda + ${lain} soal lain).${[...ul.querySelectorAll('input.kurang')].length ? ' Beberapa level kekurangan soal; tambahkan bab agar jumlahnya penuh.' : ''}` : 'Centang minimal satu bab.';
  };
  const isiBabU = () => { ub.innerHTML = tersedia(cariK(ur.value)).map((d, i) => `<label class="cek"><input type="checkbox" value="${d.id}" ${i === 0 ? 'checked' : ''}> Bab ${d.id}. ${esc(d.judul)}</label>`).join(''); ub.onchange = hitung; hitung(); };
  ul.innerHTML = Object.entries(LEVEL).map(([l, n]) => `<label><b>${l}</b> <span>${n}</span><input class="isian" type="number" min="0" data-l="${l}" value="${PRESET.asesmenku[l]}"><small></small></label>`).join('');
  ul.oninput = hitung; app.querySelector('.lanjutan').oninput = hitung;
  const pakaiPaket = k => { const P = PAKET[k]; app.querySelectorAll('.paket-btn').forEach(b => b.setAttribute('aria-pressed', b.dataset.paket === k)); ul.querySelectorAll('input').forEach(x => x.value = P.pg[x.dataset.l]); Object.entries(P.lain).forEach(([id, v]) => { const el = document.getElementById(id); if (el) el.value = v; }); hitung(); };
  app.querySelectorAll('.paket-btn').forEach(b => b.onclick = () => pakaiPaket(b.dataset.paket));
  ur.onchange = isiBabU; isiBabU(); pakaiPaket(Object.keys(PAKET)[0]);
  document.getElementById('ubuat').onclick = () => {
    const bab = babDipilih(); if (!bab.length) { info.textContent = 'Pilih minimal satu bab.'; return; }
    const jumlah = {}; ul.querySelectorAll('input').forEach(x => jumlah[x.dataset.l] = Math.min(+x.value || 0, +x.max));
    const idg = idGuru(), uel = document.getElementById('uel').value;
    const U = buatUlangan({ kid: ur.value, bab, jumlah, nEsai: +document.getElementById('ue').value || 0, nPGK: +document.getElementById('upgk').value || 0, nBS: +document.getElementById('ubs').value || 0, nIsian: +document.getElementById('uis').value || 0, nJodoh: +document.getElementById('ujd').value || 0, levelEsai: uel ? uel.split(',') : [], acak: document.getElementById('ua').checked, waktu: +document.getElementById('uw').value || 90, bobotPG: Math.min(100, Math.max(0, +document.getElementById('ubb').value || 70)), madrasah: idg.madrasah, kelas: document.getElementById('uk').value, semester: document.getElementById('us').value, judul: document.getElementById('uj').value.trim() || 'ULANGAN HARIAN' });
    const T = U.tambah, nObj = U.pg.length + T.pgk.length + T.bs.length + T.isian.length + T.jodoh.length; if (!U.es.length) U.bobotPG = 100; if (!nObj) U.bobotPG = 0;
    S.set('ulanganTerakhir', U); location.hash = '#guru-soal';
  };
}

/* ---- butir turunan untuk format ASESMENKU: PGK, benar-salah, isian, menjodohkan ---- */
const NEGASI = /kecuali|bukan|tidak termasuk|salah|tidak tepat|keliru/i;
const layakPernyataan = q => /^C[123]$/.test(q.l || 'C1') && /…$/.test(q.q) && !q.s && !NEGASI.test(q.q) && q.q.length < 140 && !q.o.some(x => /semua|tidak ada/i.test(x));
const kalimatDari = (q, j) => { const t = q.q.replace(/\s*…$/, '').trim(); return `${t} ${q.o[j]}`.replace(/\s+/g, ' ').replace(/[.\s]*$/, '.'); };
const salahAcak = q => { const s = [0, 1, 2, 3, 4].filter(j => j !== q.a); return s[Math.floor(Math.random() * s.length)]; };
function buatTambahan(o, dipakai) {
  const pg = bankSoal(o.kid, o.bab).filter(q => !dipakai.has(`${q.kid}-${q.id}-${q.i}`) && layakPernyataan(q));
  const kolam = acak(pg); let k = 0; const ambil = () => kolam[k++];
  const ref = (q, benar) => [q.kid, q.id, q.i, benar ? 1 : 0, benar ? q.a : salahAcak(q)];
  const pgk = [], bs = [], isian = [], jodoh = [];
  for (let n = 0; n < (o.nPGK || 0); n++) { const qs = [ambil(), ambil(), ambil(), ambil(), ambil()].filter(Boolean); if (qs.length < 5) break; const nb = 2 + Math.floor(Math.random() * 2); const pola = acak(qs.map((_, i) => i < nb)); pgk.push(qs.map((q, i) => ref(q, pola[i]))); }
  for (let n = 0; n < (o.nBS || 0); n++) { const qs = [ambil(), ambil(), ambil(), ambil()].filter(Boolean); if (qs.length < 4) break; const pola = acak([true, true, false, false]); bs.push(qs.map((q, i) => ref(q, pola[i]))); }
  for (let n = 0; n < (o.nIsian || 0); n++) { const q = kolam.slice(k).find(x => /^C[12]$/.test(x.l) && x.o[x.a].split(' ').length <= 5); if (!q) break; kolam.splice(kolam.indexOf(q), 1); isian.push([q.kid, q.id, q.i]); }
  const gl = acak(o.bab.flatMap(id => (isiBab(o.kid, id).glosarium || []).map((g, i) => [o.kid, id, i])).filter(r => isiBab(r[0], r[1]).glosarium[r[2]][1].length < 90));
  for (let n = 0; n < (o.nJodoh || 0); n++) { const s = gl.splice(0, 4); if (s.length < 4) break; jodoh.push(s); }
  return { pgk, bs, isian, jodoh };
}
const ambilRef = r => { const b = isiBab(r[0], r[1]); const q = b && b.soal[r[2]]; return q ? { q, l: q.l || 'C1', id: r[1], benar: !!r[3], teks: kalimatDari(q, r[4]) } : null; };
function butirLain(U) {
  const T = U.tambah || { pgk: [], bs: [], isian: [], jodoh: [] };
  const lv = xs => { const o = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6']; return o[Math.max(...xs.map(x => o.indexOf(x)))]; };
  return {
    pgk: T.pgk.map(g => { const it = g.map(ambilRef).filter(Boolean); return { teks: 'Perhatikan pernyataan-pernyataan berikut. Manakah pernyataan yang benar?', opsi: it.map(x => x.teks), kunci: it.map((x, i) => x.benar ? huruf(i) : null).filter(Boolean), l: lv(it.map(x => x.l)), id: it[0].id }; }),
    bs: T.bs.map(g => { const it = g.map(ambilRef).filter(Boolean); return { teks: 'Tentukan benar atau salah.', butir: it.map(x => [x.teks, x.benar ? 'B' : 'S']), l: lv(it.map(x => x.l)), id: it[0].id }; }),
    isian: T.isian.map(r => { const q = isiBab(r[0], r[1]).soal[r[2]]; return { teks: q.q.replace(/\s*…$/, ' ....'), kunci: q.o[q.a], l: q.l || 'C1', id: r[1] }; }),
    jodoh: T.jodoh.map(g => ({ teks: 'Pasangkan istilah berikut dengan pengertiannya yang tepat.', pasang: g.map(r => isiBab(r[0], r[1]).glosarium[r[2]]), l: 'C2', id: g[0][1] }))
  };
}
function teksAsesmenku(N) {
  const out = []; let n = 0; const L = N.lain;
  if (N.pg.length) { out.push('[PG]'); N.pg.forEach(q => { out.push(`${++n}. ${q.s ? q.s + ' ' : ''}${q.q}`); q.o.forEach((x, j) => out.push(`${huruf(j)}. ${x}`)); out.push(`Kunci: ${huruf(q.a)}`, `Pembahasan: ${kalimat(q.p || '-', 1)}`, ''); }); }
  if (L.pgk.length) { out.push('[PGK]'); L.pgk.forEach(x => { out.push(`${++n}. ${x.teks} (pilih lebih dari satu jawaban)`); x.opsi.forEach((o, j) => out.push(`${huruf(j)}. ${o}`)); out.push(`Kunci: ${x.kunci.join(', ')}`, ''); }); }
  if (L.bs.length) { out.push('[BS]'); L.bs.forEach(x => { out.push(`${++n}. ${x.teks}`); x.butir.forEach(([t, k]) => out.push(`- ${t} | ${k}`)); out.push(''); }); }
  if (L.isian.length) { out.push('[ISIAN]'); L.isian.forEach(x => { out.push(`${++n}. ${x.teks}`, `Kunci: ${x.kunci}`, ''); }); }
  if (L.jodoh.length) { out.push('[JODOH]'); L.jodoh.forEach(x => { out.push(`${++n}. ${x.teks}`); x.pasang.forEach(([a, b]) => out.push(`- ${a} = ${b}`)); out.push(''); }); }
  if (N.es.length) { out.push('[URAIAN]'); N.es.forEach(e => { const top = (e.rubrik.find(r => /^4\s*:/.test(r)) || e.rubrik[0] || '').replace(/^\d\s*:\s*/, ''); out.push(`${++n}. ${e.q}`, `Kunci: ${top.charAt(0).toUpperCase() + top.slice(1)}`, `Skor: ${N.skorEs ? Math.round(N.skorEs) : 10}`, ''); }); }
  return out.join('\n').trim();
}

/* ---------- BUKU PANDUAN PENGGUNAAN ---------- */
function susunPanduan() {
  const url = alamatDasar(), B = [];
  const h1 = x => B.push({ t: 'h1', x }), h2 = x => B.push({ t: 'h2', x }), h3 = x => B.push({ t: 'h3', x }), p = x => B.push({ t: 'p', x }), li = (x, n) => B.push({ t: 'li', x, n });
  const langkah = xs => xs.forEach((x, i) => li(x, i + 1)), poin = xs => xs.forEach(x => li(x));
  const kv = rows => B.push({ t: 'tabel', kv: true, rows, lebar: [30, 70] });
  B.push({ t: 'judul', x: 'BUKU PANDUAN PENGGUNAAN', sub: 'RUANG HISTORIA\nAplikasi Belajar Sejarah Interaktif Berbasis Cinta' });
  kv([['Nama aplikasi', 'Ruang Historia'], ['Alamat', url], ['Isi', 'Sejarah Indonesia (11 bab), Sejarah Dunia (9 bab), Sejarah Kebudayaan Islam (8 bab)'], ['Pembuat dan pemegang hak cipta', 'Eki Ripan Junapratama Rahmatullah, S.Pd., M.Pd., Gr. (Eki Ripan J.R. Tanjung)'], ['Jabatan', 'Guru Sejarah, MAN 1 Belitung, Kementerian Agama'], ['Kontak', 'ekiripantanjung@gmail.com'], ['Tahun', '2026']]);
  p('Ruang Historia adalah aplikasi belajar sejarah untuk madrasah aliyah dan sekolah menengah. Materinya dilengkapi foto arsip, video, garis waktu, kuis, dan refleksi Panca Cinta Kurikulum Berbasis Cinta. Aplikasi ini dapat dipasang di HP dan laptop, dan tetap bisa dipakai tanpa internet setelah dibuka pertama kali.');

  h2('Bagian A. Panduan untuk siswa');
  h3('1. Membuka dan memasang aplikasi');
  langkah([`Buka **${url}** di Chrome (HP Android atau laptop) atau Safari (iPhone).`, 'Di HP Android: ketuk menu titik tiga di kanan atas, lalu **Tambahkan ke layar utama** atau **Instal aplikasi**. Di iPhone: ketuk tombol Bagikan lalu **Tambahkan ke Layar Utama**. Di laptop: klik ikon instal di ujung kanan kolom alamat.', 'Ikon **Ruang Historia** muncul di layar. Buka aplikasi dari ikon itu.']);
  h3('2. Bergabung dengan kelas');
  langkah(['Buka **tautan kelas** atau pindai **kode QR** yang dibagikan guru. Cukup sekali.', 'Bila guru memakai rekap nilai, masukkan **kode siswa** 6 huruf dari guru. Nama dan kelasmu akan muncul.', 'Jangan berikan kode siswamu kepada teman, karena nilai yang masuk tercatat atas namamu.']);
  h3('3. Belajar setiap bab (babak)');
  langkah(['Di Beranda, pilih ruang (Sejarah Indonesia, Sejarah Dunia, atau SKI), lalu pilih bab yang terbuka.', 'Baca **Materi**, lihat **Jejak sejarah** (foto arsip), dan tonton **Video**.', 'Catat poin penting di buku catatan. Centang daftar kesiapan, lalu kerjakan **Kuis**.', 'Bila nilaimu mencapai **KKM**, kamu mendapat bintang dan babak berikutnya terbuka. Bila belum, pelajari lagi materinya lalu ulangi kuis.', 'Bab yang belum dibuka guru bertanda **Belum dibuka guru**. Tunggu sampai guru membukanya di kelas.']);
  h3('4. Nilai dan ujian');
  poin(['Menu **Nilaiku** menampilkan semua nilai dan koleksi **Historia Star** ⭐ milikmu. Historia Star didapat dari kuis tiap babak (lulus KKM = 1, nilai ≥ 90 = 2, nilai 100 = 3) dan dari guru bila kamu menang challenge atau game di kelas. Historia Star diubah menjadi **nilai tambah** sesuai aturan guru.', 'Ujian akhir tiap ruang terbuka setelah babak-babaknya selesai.', 'Bila mengerjakan kuis tanpa internet, nilai disimpan di HP dan terkirim otomatis ke guru saat HP tersambung internet lagi.', '**Ganti HP?** Buka tautan kelas di HP baru lalu masukkan kode siswamu. Nilai dan babak yang sudah terbuka kembali otomatis dari rekap guru.']);

  h2('Bagian B. Panduan untuk guru');
  h3('1. Masuk Panel Guru');
  langkah(['Ketuk menu **Guru** (ikon topi toga; di HP ada di menu bawah). Setelah masuk, tampil **Ruang Guru** berisi kotak-kotak menu: Presentasi, Modul Ajar, Soal Ulangan, Kelas & Babak, Daftar Siswa, Rekap Nilai, Akun & PIN, dan Buku Panduan. Ketuk kotak yang diperlukan; tombol **← Ruang Guru** membawa kembali.', '**Guru baru:** pilih **Guru baru, atau lupa PIN?**, isi nama dan **kode aktivasi** dari pengembang, lalu buat PIN sendiri. Langkah ini juga dipakai bila lupa PIN.', 'Berikutnya, cukup masukkan PIN Bapak/Ibu. PIN dapat diganti di bagian **Ganti PIN**.', 'Jangan bagikan PIN atau kode aktivasi kepada siswa, karena mode guru membuka semua bab.']);
  h3('2. Presentasi kelas (PowerPoint dan PDF)');
  langkah(['Di Ruang Guru, buka menu **Presentasi**, pilih ruang dan bab.', 'Tekan **Tampilkan presentasi** untuk mengajar langsung dari aplikasi (geser atau tombol panah untuk pindah slide).', 'Tekan **Unduh PowerPoint** untuk file yang dapat diedit, atau **Unduh PDF** lalu pilih **Simpan sebagai PDF** pada jendela cetak.']);
  h3('3. Modul ajar (Word dan PDF)');
  langkah(['Di Ruang Guru, buka menu **Modul Ajar**, pilih ruang dan bab. Model pembelajaran yang cocok dipilihkan otomatis beserta alasannya; boleh diganti.', 'Atur kelas, semester, jumlah pertemuan, dan JP. Lengkapi identitas madrasah, nama guru, NIP, dan kepala madrasah.', 'Tekan **Buat modul ajar**, periksa pratinjau, lalu **Unduh Word** (dapat diedit) atau **Unduh PDF**.', 'Modul memuat identitas, identifikasi (DPL dan Panca Cinta), desain pembelajaran, langkah kegiatan sesuai sintaks model, asesmen, LKPD, rubrik, contoh soal, dan glosarium. Sesuaikan Capaian Pembelajaran dengan dokumen CP yang berlaku.']);
  h3('4. Soal ulangan harian dan ASESMENKU');
  langkah(['Di Ruang Guru, buka menu **Soal Ulangan**, lalu pilih ruang dan satu atau beberapa bab.', 'Pilih paket soal: **Format ASESMENKU**, **Kuis singkat**, **Ulangan lengkap**, atau **HOTS**, lalu tekan **Buat soal sekarang**.', 'Ingin mengatur sendiri jumlah soal per level C1–C6 dan jenis soalnya? Buka **Atur sendiri**. Angka merah berarti stok soal level itu kurang; tambahkan bab.', 'Masukkan ke ASESMENKU dengan salah satu cara: (a) pilih **Format ASESMENKU**, tekan **Salin semua soal**, lalu di ASESMENKU pilih **Tempel banyak soal**; atau (b) tekan **Word untuk ASESMENKU** atau **PDF untuk ASESMENKU**, lalu di ASESMENKU buka paket soal → **Impor Word/PDF** dan pilih berkas tadi. Cara Word paling disarankan. Jangan ubah susunan baris berkas itu (misalnya baris "Kunci:").', 'Semua jenis soal terbawa lengkap dengan kuncinya: pilihan ganda, PG kompleks, benar-salah, isian, menjodohkan, dan uraian. Periksa pratinjau di ASESMENKU sebelum menekan Tambahkan.', 'Naskah lengkap dengan kunci, pembahasan, pedoman penskoran, dan kisi-kisi dapat diunduh sebagai Word atau PDF. Tersedia juga file Excel (.csv). Tekan **Acak ulang soal** untuk paket soal yang berbeda.']);
  h3('5. Mode babak dan tautan kelas');
  langkah(['Di Ruang Guru, buka menu **Kelas & Babak**, isi nama kelas dan KKM, lalu aktifkan mode babak.', 'Tekan **Buat tautan kelas**, lalu bagikan tautan atau kode QR ke grup kelas.', 'Setiap kelas boleh memiliki pengaturan sendiri. Buat tautan terpisah untuk tiap kelas.']);
  h3('6. Rekap nilai di Google Sheets (dipasang sekali)');
  langkah(['Di laptop, buka **sheets.new** dan beri nama file **Rekap Ruang Historia**.', 'Di Ruang Guru, buka menu **Rekap Nilai**, tekan **Salin kode Apps Script**.', 'Di Google Sheets: menu **Ekstensi → Apps Script**. Hapus isi editor, tempel kode, lalu Simpan.', 'Pilih fungsi **siapkan**, tekan **Jalankan**, lalu berikan izin (Lanjutan → Buka proyek → Izinkan).', 'Tekan **Terapkan → Deployment baru → Aplikasi web**. Jalankan sebagai: **Saya**; akses: **Siapa saja**. Salin alamat yang berakhiran **/exec**.', 'Tempel alamat itu di menu **Rekap Nilai**, lalu tekan **Uji sambungan**.', 'Buka menu **Daftar Siswa**: ketik nama kelas, pilih file daftar siswa (Excel, Word, atau PDF), periksa daftar nama, lalu tekan **Kirim ke Google Sheets**. Kode siswa dibuat otomatis. Tekan **Cetak kartu kode** untuk membagikan kode kepada siswa, atau **Salin daftar kode untuk WA**. Bila diminta memperbarui kode Apps Script, ikuti 4 langkah yang tampil di layar.', 'Buat tautan kelas di menu **Kelas & Babak**. Sejak itu nilai kuis dan ujian masuk otomatis.']);
  h3('7. Membuka bab baru dan membaca analisis');
  poin(['Setiap mulai mengajar bab baru, buka lembar **Pengaturan** di Google Sheets dan ubah angka **Buka sampai bab** untuk kelas itu. KKM per kelas juga diatur di sana.', 'Lembar **Rekap** berisi nilai tertinggi setiap siswa per bab (merah bila di bawah KKM).', 'Lembar **Analisis** berisi rata-rata, persentase ketuntasan, siswa yang perlu remedial, siswa yang belum mengerjakan, dan soal yang paling sulit.']);
  h3('8. Historia Star dan nilai tambah');
  poin(['Siswa mengoleksi **Historia Star** ⭐ dari kuis tiap babak (lulus KKM = 1, nilai ≥ 90 = 2, nilai 100 = 3).', 'Guru memberi Historia Star tambahan kepada pemenang challenge, game, atau metode ajar di kelas: buka menu **Historia Star**, pilih kelas, ketuk nama siswa, pilih jumlah bintang dan alasannya, lalu tekan **Beri Historia Star**. Salah pilih? Tekan **Batalkan**.', 'Tekan **Tayangkan papan peringkat** untuk menampilkan 10 besar kelas di proyektor.', 'Di **Konversi ke nilai tambah**, atur nilai 1 ⭐ (misalnya 1 poin) dan batas maksimalnya (misalnya 10 poin). Hasilnya tercatat di lembar **Nilai Tambah** pada Google Sheets untuk diolah bersama nilai lainnya.', 'Siswa melihat total Historia Star dan nilai tambahnya di menu **Nilaiku**.']);
  h3('9. Tahun ajaran baru');
  poin(['Menu **Ruang Historia → Hapus data satu kelas**: menghapus data satu kelas saja.', 'Menu **Ruang Historia → Tahun ajaran baru**: file lama disimpan sebagai arsip di Google Drive, lalu nilai dikosongkan. Daftar siswa boleh dihapus atau disimpan. Alamat aplikasi web tidak berubah.']);

  h2('Bagian C. Pertanyaan yang sering muncul');
  B.push({ t: 'tabel', head: ['Masalah', 'Penyelesaian'], lebar: [35, 65], rows: [
    ['Bab terkunci padahal sudah belajar', 'Kerjakan kuis bab sebelumnya sampai mencapai KKM. Bila bertanda "Belum dibuka guru", tunggu guru membukanya.'],
    ['Nilai belum masuk ke Google Sheets', 'Pastikan HP tersambung internet lalu buka aplikasi lagi; nilai yang tertunda terkirim otomatis. Pastikan siswa sudah memasukkan kode siswa.'],
    ['Uji sambungan gagal', 'Ulangi langkah Deployment dan pastikan akses diatur ke "Siapa saja". Alamat harus diakhiri /exec.'],
    ['Guru lupa PIN', 'Pilih "Guru baru, atau lupa PIN?" dan pakai kode aktivasi yang sama untuk membuat PIN baru.'],
    ['Soal dari berkas tidak terbaca rapi di ASESMENKU', 'Pakai berkas "Word untuk ASESMENKU" (bukan naskah cetak), dan jangan menyunting susunan barisnya. Naskah cetak hanya untuk dibagikan kepada siswa.'],
    ['Tampilan masih versi lama', 'Tutup aplikasi lalu buka lagi saat tersambung internet. Pembaruan terpasang otomatis.'],
    ['Siswa lupa kode siswa', 'Lihat kolom Kode di lembar Siswa pada Google Sheets.']] });

  h2('Bagian D. Hak cipta dan ketentuan penggunaan');
  p('**Ruang Historia** dibuat dan dikembangkan oleh **Eki Ripan Junapratama Rahmatullah, S.Pd., M.Pd., Gr.** (Eki Ripan J.R. Tanjung), Guru Sejarah MAN 1 Belitung. Seluruh rancangan aplikasi, materi, soal, video, desain, dan logo merupakan ciptaan pembuat dan dilindungi Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta.');
  poin(['Guru dan siswa boleh memakai aplikasi ini secara gratis untuk kegiatan pembelajaran.', 'Modul ajar, presentasi, dan soal yang dihasilkan aplikasi boleh disunting dan dipakai untuk keperluan mengajar.', 'Dilarang memperjualbelikan, mengakui sebagai karya sendiri, atau mengedarkan ulang aplikasi tanpa izin tertulis dari pembuat.', 'Saat membagikan atau memakai hasilnya di luar kelas, cantumkan sumber: "Ruang Historia, karya Eki Ripan J.R. Tanjung, S.Pd., M.Pd., Gr."', 'Foto arsip mengikuti lisensi masing-masing sebagaimana tercantum pada keterangannya.']);
  p(`Ruang Historia merupakan bagian dari keluarga aplikasi karya pembuat: ${KELUARGA.map(x => x[0]).join(', ')}.`);
  p(`Saran dan masukan: ekiripantanjung@gmail.com.`);
  p(`*${HAK}. Hak cipta dilindungi undang-undang.*`);
  return { blok: B, nama: 'Buku Panduan Ruang Historia' };
}
function panduan() {
  tandaiMenu('tentang');
  const M = susunPanduan();
  app.innerHTML = `<section class="pad no-cetak"><div class="wrap" style="max-width:900px"><h1>Buku panduan penggunaan</h1>
<p>Panduan singkat untuk siswa dan guru. Dapat dibaca di sini atau diunduh untuk dibagikan.</p>
<div class="row"><button class="btn" type="button" id="ppdf">Unduh PDF</button><button class="btn alt" type="button" id="pword">Unduh Word (.docx)</button></div>
<p class="catatan">Untuk PDF: pada jendela cetak, pilih <b>Simpan sebagai PDF</b>.</p></div></section>
<section class="pad"><div class="wrap"><article class="modul-dok">${modulHTML(M)}</article></div></section>`;
  document.getElementById('pword').onclick = () => unduhBlob(docxDari(M), M.nama + '.docx');
  document.getElementById('ppdf').onclick = () => { const t = document.title; document.title = M.nama; document.body.classList.add('cetak-modul'); setTimeout(() => { print(); document.body.classList.remove('cetak-modul'); document.title = t; }, 50); };
}

/* ---------- IMPOR DAFTAR SISWA (Excel / Word / PDF) ---------- */
const tokenRekap = () => { let t = S.get('tokenRekap', ''); if (!t) { const a = new Uint8Array(18); crypto.getRandomValues(a); t = [...a].map(x => HURUF_KODE[x % HURUF_KODE.length]).join(''); S.set('tokenRekap', t); } return t; };
const KATA_KEPALA = /^(no\.?|nomor|nama( siswa| peserta didik| lengkap)?|nis|nisn|kelas|rombel|jenis kelamin|l\/p|jk|keterangan|ttd|tanda tangan|daftar.*|tahun.*|semester.*|wali kelas.*|mengetahui.*|kepala.*|nip.*|jumlah.*|madrasah.*|sekolah.*|kementerian.*|alamat.*|agama|tempat.*|tanggal.*)$/i;
function bersihNama(s) {
  let t = String(s ?? '').replace(/\s+/g, ' ').trim();
  t = t.replace(/^\d+\s*[.)]?\s*/, '');                         // nomor urut
  t = t.split(' ').filter(w => !/\d/.test(w)).join(' ');          // NIS/NISN/angka
  t = t.replace(/\s+(L|P|LK|PR|Laki-laki|Laki laki|Perempuan)$/i, '').replace(/[|;]+/g, ' ').trim();
  if (t.length < 3 || t.length > 70 || !/[A-Za-z]{2}/.test(t) || KATA_KEPALA.test(t)) return '';
  return t;
}
const judulNama = t => t === t.toUpperCase() ? t.toLowerCase().replace(/(^|[\s.-])\S/g, m => m.toUpperCase()) : t;
// baris tabel -> {kelas: [nama]}
function dariBaris(rows, kelasDefault) {
  rows = rows.map(r => (r || []).map(x => String(x ?? '').trim()));
  let h = -1, cN = -1, cK = -1;
  for (let i = 0; i < Math.min(rows.length, 20) && h < 0; i++) rows[i].forEach((x, j) => { if (/^nama/i.test(x) && cN < 0) { cN = j; h = i; } });
  if (h >= 0) rows[h].forEach((x, j) => { if (/^(kelas|rombel)/i.test(x)) cK = j; });
  if (cN < 0) { const skor = []; rows.forEach(r => r.forEach((x, j) => { if (bersihNama(x) && /\s/.test(x)) skor[j] = (skor[j] || 0) + 1; })); cN = skor.reduce((b, v, j) => v > (skor[b] || 0) ? j : b, 0); }
  const out = {};
  rows.slice(h + 1).forEach(r => { const n = bersihNama(r[cN]); if (!n) return; const k = (cK >= 0 && r[cK]) || kelasDefault; (out[k] = out[k] || []).push(judulNama(n)); });
  return out;
}
function dariTeks(teks, kelasDefault) {
  const nama = teks.split(/\n/).map(bersihNama).filter(Boolean).map(judulNama);
  return nama.length ? { [kelasDefault]: nama } : {};
}
async function bacaDaftarSiswa(file, kelasDefault) {
  const ext = (file.name.split('.').pop() || '').toLowerCase(), buf = await file.arrayBuffer();
  if (['xlsx', 'xls', 'csv', 'ods'].includes(ext)) {
    await muatSkrip('lib/xlsx.core.min.js');
    const wb = XLSX.read(buf, { type: 'array' }), out = {};
    const lembar = wb.SheetNames.map(n => [n, dariBaris(XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: '' }), kelasDefault)]).filter(([, o]) => Object.keys(o).length);
    lembar.forEach(([n, o]) => Object.entries(o).forEach(([k, v]) => { const kk = lembar.length > 1 && k === kelasDefault ? n.trim() : k; out[kk] = (out[kk] || []).concat(v); }));
    return out;
  }
  if (ext === 'docx') {
    await muatSkrip('lib/mammoth.browser.min.js');
    const html = (await mammoth.convertToHtml({ arrayBuffer: buf })).value, dom = new DOMParser().parseFromString(html, 'text/html');
    const tb = [...dom.querySelectorAll('table')];
    if (tb.length) { const out = {}; tb.forEach(t => Object.entries(dariBaris([...t.rows].map(r => [...r.cells].map(c => c.textContent)), kelasDefault)).forEach(([k, v]) => out[k] = (out[k] || []).concat(v))); if (Object.keys(out).length) return out; }
    return dariTeks(dom.body.innerText || dom.body.textContent, kelasDefault);
  }
  if (ext === 'pdf') {
    await muatSkrip('lib/pdf.min.js'); pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
    const doc = await pdfjsLib.getDocument({ data: buf }).promise, baris = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const items = (await (await doc.getPage(i)).getTextContent()).items.filter(it => it.str.trim());
      const grup = []; items.forEach(it => { const y = it.transform[5], x = it.transform[4]; let g = grup.find(g => Math.abs(g.y - y) < 3); if (!g) grup.push(g = { y, sel: [] }); g.sel.push([x, it.str]); });
      grup.sort((a, b) => b.y - a.y).forEach(g => baris.push(g.sel.sort((a, b) => a[0] - b[0]).map(s => s[1].trim()).filter(Boolean)));
    }
    const o = dariBaris(baris, kelasDefault);
    if (Object.keys(o).length) return o;
    return dariTeks(baris.map(r => r.join(' ')).join('\n'), kelasDefault);
  }
  if (ext === 'txt') return dariTeks(new TextDecoder().decode(buf), kelasDefault);
  throw new Error('format');
}
const kelompokKeTeks = o => Object.entries(o).map(([k, v]) => `# ${k}\n` + v.join('\n')).join('\n\n');
const namaDariBaris = l => { const sel = l.split(/\t|\s{3,}| \| /).map(bersihNama).filter(Boolean); return sel.length ? judulNama(sel.sort((a, b) => b.replace(/[^A-Za-z]/g, '').length - a.replace(/[^A-Za-z]/g, '').length)[0]) : ''; };
const teksKeKelompok = (t, kDef) => { const o = {}; let k = kDef; t.split('\n').forEach(l => { l = l.trim(); if (!l) return; const m = l.match(/^#\s*(.+)$/); if (m) { k = m[1].trim(); return; } const n = namaDariBaris(l); if (n) (o[k] = o[k] || []).push(n); }); return o; };

function pasangImporSiswa() {
  const f = document.getElementById('isf'), kel = document.getElementById('isk'), ta = document.getElementById('ist'), ps = document.getElementById('isp'), hasilEl = document.getElementById('ish');
  const tampil = o => { const n = Object.values(o).reduce((s, v) => s + v.length, 0); ta.value = kelompokKeTeks(o); ta.hidden = false; document.getElementById('islanjut').hidden = !n; ps.innerHTML = n ? `Terbaca <b>${n}</b> nama dalam <b>${Object.keys(o).length}</b> kelas. Periksa daftar di bawah: hapus baris yang bukan nama, perbaiki yang salah. Baris berawalan <b>#</b> adalah nama kelas.` : 'Tidak ada nama yang terbaca. Pastikan berkas berisi kolom <b>Nama</b>, atau ketik/tempel nama di kotak di bawah (satu nama per baris).'; if (!n) { ta.hidden = false; ta.value = `# ${kel.value.trim() || 'XI D'}\n`; document.getElementById('islanjut').hidden = false; } };
  f.onchange = async () => {
    const file = f.files[0]; if (!file) return;
    const kD = kel.value.trim() || 'Kelas'; ps.textContent = 'Membaca berkas…';
    try { tampil(await bacaDaftarSiswa(file, kD)); } catch (e) { console.error(e); ps.innerHTML = 'Berkas tidak bisa dibaca. Gunakan Excel (.xlsx/.xls/.csv), Word (.docx), atau PDF yang berisi teks (bukan hasil foto/pindai).'; }
  };
  document.getElementById('isketik').onclick = () => { ta.hidden = false; document.getElementById('islanjut').hidden = false; if (!ta.value) ta.value = `# ${kel.value.trim() || 'XI D'}\n`; ps.innerHTML = 'Tempel (Ctrl+V) atau ketik nama di kotak ini, satu nama per baris. Baris pertama yang berawalan <b>#</b> adalah nama kelas.'; ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); };
  ta.addEventListener('paste', () => setTimeout(() => { const o = teksKeKelompok(ta.value, kel.value.trim() || 'Kelas'), n = Object.values(o).reduce((s, v) => s + v.length, 0); ta.value = kelompokKeTeks(o); ps.innerHTML = `Terbaca <b>${n}</b> nama. Periksa sebentar, lalu tekan <b>Kirim ke Google Sheets</b>.`; }, 0));
  kel.addEventListener('change', () => { if (ta.value.startsWith('# ')) ta.value = ta.value.replace(/^# .*/, `# ${kel.value.trim()}`); });
  document.getElementById('istsv').onclick = async ev => {
    const o = teksKeKelompok(ta.value, kel.value.trim() || 'Kelas');
    const tsv = Object.entries(o).flatMap(([k, v]) => v.map((n, i) => `${k}\t${i + 1}\t${n}`)).join('\n');
    try { await navigator.clipboard.writeText(tsv); ev.target.textContent = 'Tersalin. Klik sel A2 di lembar Siswa, lalu Ctrl+V'; } catch { ev.target.textContent = 'Gagal menyalin'; }
  };
  document.getElementById('iskirim').onclick = async () => {
    const url = document.getElementById('gr').value.trim();
    if (!/\/exec$/.test(url)) { ps.textContent = 'Isi dulu alamat aplikasi web di atas, lalu tekan Uji sambungan.'; return; }
    const o = teksKeKelompok(ta.value, kel.value.trim() || 'Kelas'), semua = [];
    ps.textContent = 'Mengirim ke Google Sheets…';
    try {
      for (const [k, v] of Object.entries(o)) for (let i = 0; i < v.length; i += 40) {
        const r = await fetch(`${url}?aksi=siswa&token=${encodeURIComponent(tokenRekap())}&data=${encodeURIComponent(JSON.stringify({ kelas: k, nama: v.slice(i, i + 40) }))}`).then(x => x.json());
        if (!r.ok) throw new Error(r.pesan || 'gagal');
        r.siswa.forEach(s => semua.push([k, ...s]));
      }
    } catch (e) {
      ps.innerHTML = /token|tidak dikenal/i.test(e.message) ? `<b>Kode Apps Script perlu diperbarui sekali.</b> Ikuti 4 langkah di kotak <b>Perbarui kode Apps Script</b> di bawah, lalu tekan Kirim lagi.` : 'Gagal mengirim. Periksa internet dan alamat aplikasi web, lalu coba lagi.';
      document.getElementById('isperbarui').open = true; return;
    }
    S.set('kodeSiswaTerakhir', semua);
    ps.innerHTML = `Berhasil. <b>${semua.length}</b> siswa sudah masuk ke lembar Siswa, lengkap dengan kodenya.`;
    hasilEl.innerHTML = `<table class="md-tabel"><thead><tr><th>Kelas</th><th>No</th><th>Nama</th><th>Kode</th></tr></thead><tbody>${semua.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td><b>${esc(r[3])}</b></td></tr>`).join('')}</tbody></table>
<div class="row"><button class="btn" type="button" id="iskartu">Cetak kartu kode (PDF)</button><button class="btn alt" type="button" id="iswa">Salin daftar kode untuk WA</button></div>`;
    document.getElementById('iskartu').onclick = () => cetakKartu(semua);
    document.getElementById('iswa').onclick = async ev => { const k = konfig(); const t = Object.entries(semua.reduce((o, r) => ((o[r[0]] = o[r[0]] || []).push(r), o), {})).map(([kk, rs]) => `*Kode Ruang Historia kelas ${kk}*\n` + rs.map(r => `${r[1]}. ${r[2]}: ${r[3]}`).join('\n')).join('\n\n') + `\n\nBuka tautan kelas dari guru, lalu masukkan kodemu. Jangan berikan kode kepada teman.`; try { await navigator.clipboard.writeText(t); ev.target.textContent = 'Tersalin. Tempel di WA'; } catch {} };
  };
  document.getElementById('istoken').value = tokenRekap();
  document.getElementById('istoken').onchange = e => { const v = e.target.value.trim(); if (v) S.set('tokenRekap', v); };
}
function cetakKartu(rows) {
  let w = document.getElementById('cetak-kartu'); if (w) w.remove();
  w = document.createElement('div'); w.id = 'cetak-kartu';
  w.innerHTML = rows.map(r => `<div class="kartu"><div class="k-atas">RUANG HISTORIA · Kelas ${esc(r[0])}</div><div class="k-nama">${esc(r[2])}</div><div class="k-kode">${esc(r[3])}</div><div class="k-cara">Buka tautan kelas dari guru, lalu masukkan kode ini. Jangan berikan kepada teman.</div></div>`).join('');
  document.body.append(w);
  const t = document.title; document.title = 'Kartu kode siswa Ruang Historia'; document.body.classList.add('cetak-kartu');
  setTimeout(() => { print(); document.body.classList.remove('cetak-kartu'); document.title = t; w.remove(); }, 80);
}

/* ---------- HISTORIA STAR ---------- */
const starKuisSaya = () => Object.entries(S.get('nilai', {})).filter(([k]) => /-bab\d+$/.test(k)).reduce((s, [, v]) => s + jumlahBintang(v.terbaik || 0), 0);
const starSaya = () => starKuisSaya() + (S.get('starGuru', 0) || 0);
const poinTambah = n => { const a = S.get('konversiStar', null); if (!a) return null; const v = n * a.poin; return Math.round((a.maks > 0 ? Math.min(v, a.maks) : v) * 10) / 10; };
const ALASAN_STAR = ['Menang challenge kelas', 'Menang game HISTORIA PLAY!', 'Presentasi terbaik', 'Aktif berdiskusi', 'Membantu teman'];
function pasangStar() {
  const kotak = app.querySelector('[data-bagian="star"]'); if (!kotak) return;
  const url = () => document.getElementById('gr').value.trim(), sel = document.getElementById('stk'), daftar = document.getElementById('stl'), ps = document.getElementById('stp');
  let data = null, pilih = new Set(), jumlah = 1, terakhir = null;
  const panggil = async (aksi, ekstra = '') => { const r = await fetch(`${url()}?aksi=${aksi}&token=${encodeURIComponent(tokenRekap())}${ekstra}`).then(x => x.json()); if (!r.ok) throw new Error(r.pesan || 'gagal'); return r; };
  const gagal = e => { ps.innerHTML = /token|tidak dikenal/i.test(e.message) ? `Kode Apps Script perlu diperbarui sekali. Buka menu <a href="#guru/siswa">Daftar Siswa</a> → <b>Perbarui kode Apps Script</b>, ikuti 4 langkahnya, lalu kembali ke sini.` : 'Tidak dapat terhubung ke Google Sheets. Periksa internet, lalu coba lagi.'; };
  const gambar = () => {
    if (!data || !data.siswa) { daftar.innerHTML = ''; return; }
    const urut = [...data.siswa].sort((a, b) => a.no - b.no);
    daftar.innerHTML = urut.map(s => `<button type="button" class="st-siswa" data-nama="${esc(s.nama)}" aria-pressed="${pilih.has(s.nama)}"><span class="st-no">${esc(s.no)}</span><span class="st-nama">${esc(s.nama)}</span><span class="st-jml">⭐ ${s.total}${s.poin !== undefined ? `<small>+${s.poin}</small>` : ''}</span></button>`).join('');
    document.getElementById('stberi').innerHTML = `${ikon('bintang')} Beri ${jumlah} Historia Star${pilih.size ? ` ke ${pilih.size} siswa` : ''}`;
  };
  const muatKelas = async k => { ps.textContent = 'Memuat daftar siswa…'; try { data = await panggil('star', `&kelas=${encodeURIComponent(k)}`); if (data.konversi) { document.getElementById('stpoin').value = data.konversi.poin; document.getElementById('stmaks').value = data.konversi.maks; } pilih.clear(); ps.textContent = data.siswa.length ? 'Ketuk nama siswa yang menang (boleh lebih dari satu), lalu tekan tombol Beri.' : 'Belum ada siswa di kelas ini. Isi dulu lewat menu Daftar Siswa.'; S.set('kelasStar', k); gambar(); } catch (e) { gagal(e); } };
  const mulai = async () => {
    if (!/\/exec$/.test(url())) { ps.innerHTML = `Sambungkan Google Sheets dulu di menu <a href="#guru/rekap">Rekap Nilai</a>.`; return; }
    try { const r = await panggil('star'); sel.innerHTML = r.daftarKelas.map(k => `<option>${esc(k)}</option>`).join(''); if (!r.daftarKelas.length) { ps.innerHTML = 'Belum ada kelas. Isi daftar siswa dulu di menu <a href="#guru/siswa">Daftar Siswa</a>.'; return; } const ingat = S.get('kelasStar', ''); if (r.daftarKelas.includes(ingat)) sel.value = ingat; muatKelas(sel.value); } catch (e) { gagal(e); }
  };
  sel.onchange = () => muatKelas(sel.value);
  daftar.onclick = e => { const b = e.target.closest('.st-siswa'); if (!b) return; const n = b.dataset.nama; pilih.has(n) ? pilih.delete(n) : pilih.add(n); gambar(); };
  kotak.querySelectorAll('[data-jml]').forEach(b => b.onclick = () => { jumlah = +b.dataset.jml; kotak.querySelectorAll('[data-jml]').forEach(x => x.setAttribute('aria-pressed', x === b)); gambar(); });
  kotak.querySelectorAll('[data-alasan]').forEach(b => b.onclick = () => { document.getElementById('sta').value = b.dataset.alasan; });
  document.getElementById('stberi').onclick = async () => {
    if (!pilih.size) { ps.textContent = 'Ketuk dulu nama siswa yang akan diberi bintang.'; return; }
    const id = 'S' + Date.now(), nama = [...pilih], alasan = document.getElementById('sta').value.trim() || 'Historia Star dari guru';
    ps.textContent = 'Mengirim…';
    try { data = await panggil('beriStar', `&data=${encodeURIComponent(JSON.stringify({ kelas: sel.value, nama, jumlah, alasan, id }))}`); terakhir = { id, kelas: sel.value, n: nama.length }; pilih.clear(); gambar();
      ps.innerHTML = `🎉 ${nama.length} siswa mendapat ${jumlah} Historia Star (${esc(alasan)}). <button class="tautan" type="button" id="stbatal">Batalkan</button>`;
      document.getElementById('stbatal').onclick = async () => { try { data = await panggil('batalStar', `&id=${terakhir.id}&kelas=${encodeURIComponent(terakhir.kelas)}`); gambar(); ps.textContent = 'Pemberian bintang terakhir dibatalkan.'; } catch (e) { gagal(e); } };
    } catch (e) { gagal(e); }
  };
  document.getElementById('stsimpan').onclick = async () => { const kp = document.getElementById('stkp'); kp.textContent = 'Menyimpan…'; try { const r = await panggil('aturStar', `&poin=${encodeURIComponent(document.getElementById('stpoin').value)}&maks=${encodeURIComponent(document.getElementById('stmaks').value)}`); kp.textContent = `Tersimpan: 1 ⭐ = ${r.poin} poin${r.maks > 0 ? `, maksimal ${r.maks} poin` : ', tanpa batas'}. Lembar Nilai Tambah di Google Sheets sudah diperbarui.`; if (sel.value) muatKelas(sel.value); } catch (e) { gagal(e); kp.textContent = ''; } };
  document.getElementById('stpapan').onclick = () => { if (data && data.siswa) tayangPapan(data); };
  mulai();
}
function tayangPapan(d) {
  const urut = [...d.siswa].sort((a, b) => b.total - a.total || a.no - b.no), top = urut.slice(0, 10);
  const el = document.createElement('div'); el.className = 'papan-star'; el.tabIndex = -1;
  el.innerHTML = `<div class="ps-isi"><button class="ps-tutup" type="button" aria-label="Tutup">✕</button><p class="ps-label">RUANG HISTORIA · KELAS ${esc(d.kelas)}</p><h1>⭐ Papan Historia Star</h1>
<div class="ps-podium">${[1, 0, 2].map(i => top[i] ? `<div class="ps-p ps-${i + 1}"><div class="ps-medali">${['🥇', '🥈', '🥉'][i]}</div><b>${esc(top[i].nama)}</b><span>⭐ ${top[i].total}</span><div class="ps-tiang">${i + 1}</div></div>` : '').join('')}</div>
<ol class="ps-daftar" start="4">${top.slice(3).map(s => `<li><span>${esc(s.nama)}</span><b>⭐ ${s.total}</b></li>`).join('')}</ol>
<p class="ps-ket">Historia Star = bintang dari kuis tiap babak + bintang dari guru untuk pemenang challenge di kelas.</p></div>`;
  document.body.append(el); el.focus();
  const tutup = () => el.remove(); el.querySelector('.ps-tutup').onclick = tutup; el.addEventListener('keydown', e => { if (e.key === 'Escape') tutup(); });
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
}

/* ---------- router ---------- */
function rute() {
  clearInterval(jam);
  const h = (location.hash || '#beranda').slice(1);
  let m;
  if (h.startsWith('kelas=')) return terapkanKelas(h.slice(6));
  if ((m = h.match(/^([a-z]+)-(\d+)-slide$/)) && cariK(m[1])) presentasi(m[1], +m[2]);
  else if ((m = h.match(/^([a-z]+)-(\d+)-kuis$/)) && cariK(m[1])) kuis(m[1], +m[2]);
  else if ((m = h.match(/^([a-z]+)-(\d+)$/)) && cariK(m[1])) bab(m[1], +m[2]);
  else if ((m = h.match(/^([a-z]+)-ujian$/)) && cariK(m[1])) ujian(m[1]);
  else if (cariK(h)) ruang(h);
  else if (h === 'nilai') nilai();
  else if (h === 'tentang') tentang();
  else if (h === 'logo') filosofi();
  else if (h === 'guru' || h.startsWith('guru/')) panelGuru(h.split('/')[1] || '');
  else if (h === 'guru-modul') halamanModul();
  else if (h === 'guru-soal') halamanSoal();
  else if (h === 'panduan') panduan();
  else beranda();
  window.scrollTo(0, 0);
}
document.querySelectorAll('.tabs a').forEach(a => { const n = { beranda: 'rumah', nilai: 'bintang', logo: 'jam', tentang: 'info', guru: 'topi' }[a.dataset.v]; if (n && !a.querySelector('svg')) a.innerHTML = ikon(n) + `<span>${a.textContent}</span>`; });
window.addEventListener('hashchange', rute);
rute();

/* ---------- mode luring (offline) ---------- */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => {});
  // muat ulang sekali saat versi baru aplikasi aktif
  if (navigator.serviceWorker.controller) {
    let sekali = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!sekali) { sekali = true; location.reload(); } });
  }
}
}
