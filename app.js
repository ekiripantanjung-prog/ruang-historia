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
  const T = [['materi', 'Materi'], ['video', 'Video'], ['kuis', 'Kuis'], ['esai', 'Uraian'], ['istilah', 'Istilah']];
  tab = tab || 'materi';
  app.innerHTML = `<section class="babhead pad" style="--c:${d.warna}"><div class="wrap">${atas}
<small>Bab ${id} · ${esc(d.masa)}</small><h1>${esc(b.judul)}</h1><p>${esc(b.sub)}</p>
<div class="seg" role="tablist">${T.map(t => `<button role="tab" type="button" data-t="${t[0]}" aria-selected="${t[0] === tab}">${t[1]}</button>`).join('')}</div>
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
  app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:780px"><h1>Nilaiku</h1>${identitas}<p>Nilai juga tersimpan di perangkat ini. KKM yang dipakai: ${c.kkm}${c.nama ? ` (kelas ${esc(c.nama)})` : ''}.</p>${blok}
<button class="btn alt" type="button" id="hapus" style="margin-top:12px">Hapus semua nilai</button></div></section>`;
  pasangMasuk(app, nilai);
  const ks = document.getElementById('keluarsiswa'); if (ks) ks.addEventListener('click', e => { if (!e.target.dataset.yakin) { e.target.dataset.yakin = 1; e.target.textContent = 'Yakin keluar? Tekan lagi'; return; } S.set('siswa', null); S.set('atur', null); nilai(); });
  if (antre) kirimAntrean().then(() => { if (document.querySelector('.identitas') && !S.get('antrean', []).length) nilai(); });
  document.getElementById('hapus').addEventListener('click', e => { if (!e.target.dataset.yakin) { e.target.dataset.yakin = 1; e.target.textContent = 'Yakin? Tekan sekali lagi'; return; } S.set('nilai', {}); nilai(); });
}

function tentang() {
  tandaiMenu('tentang'); clearInterval(jam);
  app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:780px"><h1>Tentang Ruang Historia</h1>
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
const bintangHTML = n => `<span class="bintang" aria-label="${n} dari 3 bintang">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}">★</i>`).join('')}</span>`;
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
function pasangMasuk(akar, setelah) {
  akar.querySelectorAll('[data-masuk]').forEach(f => f.addEventListener('submit', async e => {
    e.preventDefault();
    const kode = f.kode.value.trim().toUpperCase(), pesan = f.querySelector('.pesan-masuk'), tb = f.querySelector('button');
    tb.disabled = true; pesan.textContent = 'Memeriksa kode…';
    try {
      const r = await fetch(`${konfig().rekap}?aksi=masuk&kode=${encodeURIComponent(kode)}`).then(x => x.json());
      if (r.ok) { S.set('siswa', { kode, nama: r.nama, kelas: r.kelas, no: r.no }); await ambilAtur(); setelah(); }
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
  try { const r = await fetch(`${url}?aksi=atur&kode=${encodeURIComponent(s.kode)}`).then(x => x.json()); if (r.ok) { const baru = { batas: r.batas || {}, kkm: r.kkm || null }, lama = S.get('atur', null); S.set('atur', baru); if (JSON.stringify(lama) !== JSON.stringify(baru) && !/kuis|ujian|guru|slide/.test(location.hash)) rute(); } } catch {}
}
addEventListener('online', () => { kirimAntrean(); ambilAtur(); });
setTimeout(ambilAtur, 1500);
setTimeout(kirimAntrean, 3000);

/* ---------- PANEL GURU ---------- */
const sha256 = async t => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))].map(x => x.toString(16).padStart(2, '0')).join('');
const muatSkrip = src => new Promise((ok, gagal) => { if (document.querySelector(`script[data-lib="${src}"]`)) return ok(); const s = document.createElement('script'); s.src = src; s.dataset.lib = src; s.onload = ok; s.onerror = gagal; document.head.append(s); });
const alamatDasar = () => location.origin + location.pathname;
const kodeKelas = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const bacaKelas = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
async function qrSVG(teks, ukuran = 220) { await muatSkrip('lib/qrcode.js'); const q = qrcode(0, 'M'); q.addData(teks); q.make(); const n = q.getModuleCount(), c = ukuran / (n + 8); let p = ''; for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) p += `M${((k + 4) * c).toFixed(2)} ${((r + 4) * c).toFixed(2)}h${c.toFixed(2)}v${c.toFixed(2)}h-${c.toFixed(2)}z`; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ukuran} ${ukuran}" width="${ukuran}" height="${ukuran}" role="img" aria-label="Kode QR"><rect width="100%" height="100%" fill="#fff"/><path d="${p}" fill="#111"/></svg>`; }
async function qrPNG(teks, ukuran = 600) { const svg = await qrSVG(teks, ukuran); const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode(); const cv = document.createElement('canvas'); cv.width = cv.height = ukuran; cv.getContext('2d').drawImage(img, 0, 0); return cv.toDataURL('image/png'); }

function panelGuru() {
  tandaiMenu('guru');
  if (!modeGuru()) {
    app.innerHTML = `<section class="pad"><div class="wrap" style="max-width:520px"><h1>Panel Guru</h1>
<p>Panel ini berisi pembuat presentasi dan pengaturan babak untuk kelas. Masukkan PIN guru untuk membuka.</p>
<form class="box" id="fpin"><label for="pin"><b>PIN guru</b></label><input id="pin" class="isian" type="password" inputmode="numeric" autocomplete="off" required>
<p class="catatan" id="pesanpin" style="margin-top:10px">Siswa tidak memerlukan panel ini.</p><button class="btn" type="submit">Masuk</button></form></div></section>`;
    document.getElementById('fpin').addEventListener('submit', async e => {
      e.preventDefault();
      const ok = PG.pin && await sha256('ruang-historia:' + document.getElementById('pin').value.trim()) === PG.pin;
      if (ok) { S.set('guru', true); panelGuru(); } else document.getElementById('pesanpin').textContent = 'PIN salah. Coba lagi.';
    });
    return;
  }
  const c = konfig();
  const opsiBab = kid => tersedia(cariK(kid)).map(d => `<option value="${d.id}">Bab ${d.id}. ${esc(d.judul)}</option>`).join('');
  app.innerHTML = `<section class="hero pad"><div class="wrap"><h1>Panel Guru</h1><p>Mode guru aktif di perangkat ini: semua babak terbuka untuk Bapak/Ibu.</p></div></section>
<section class="pad"><div class="wrap guru-wrap">
<div class="box guru-kartu"><h2>1. Presentasi kelas</h2><p>Slide dibuat otomatis dari materi bab: tujuan, materi, garis waktu, tokoh, foto arsip, istilah, refleksi Panca Cinta, dan pertanyaan diskusi.</p>
<label><b>Ruang</b><select id="pr" class="isian">${K.filter(k => tersedia(k).length).map(k => `<option value="${k.id}">${esc(k.judul)}</option>`).join('')}</select></label>
<label><b>Bab</b><select id="pb" class="isian"></select></label>
<div class="row"><button class="btn" type="button" id="tampil">Tampilkan presentasi</button><button class="btn alt" type="button" id="unduh">Unduh PowerPoint (.pptx)</button></div>
<p class="catatan" id="pesanppt">File PowerPoint dapat diedit di Microsoft PowerPoint, Google Slides, atau WPS.</p></div>

<div class="box guru-kartu"><h2>2. Pengaturan babak untuk kelas</h2>
<p>Mode babak: siswa harus membaca, mencatat, lalu lulus kuis (nilai ≥ KKM) untuk membuka bab berikutnya. Pengaturan dibagikan lewat <b>tautan kelas</b> atau kode QR; setiap kelas boleh berbeda.</p>
<label><b>Nama kelas</b><input id="gk" class="isian" placeholder="contoh: X-1" value="${esc(c.nama || '')}"></label>
<label class="cek"><input type="checkbox" id="gm" ${c.modeBabak ? 'checked' : ''}> Aktifkan mode babak (bab terkunci berurutan)</label>
<label><b>KKM kuis</b><input id="gn" class="isian" type="number" min="0" max="100" value="${c.kkm}"></label>
<details><summary><b>Buka paksa bab tertentu</b> (opsional)</summary><p class="catatan">Bab sampai nomor ini langsung terbuka untuk seluruh kelas, misalnya bila sudah dibahas di kelas. Isi 0 bila tidak perlu.</p>
${K.filter(k => tersedia(k).length).map(k => `<label><b>${esc(k.judul)}</b>: buka sampai Bab <input class="isian kecil" type="number" min="0" max="${k.bab.length}" data-buka="${k.id}" value="${(c.buka || {})[k.id] || 0}"></label>`).join('')}</details>
<div class="row"><button class="btn" type="button" id="buat">Buat tautan kelas</button></div>
<div id="hasilkelas"></div></div>

<div class="box guru-kartu"><h2>3. Rekap nilai dan analisis (Google Sheets)</h2>
<p>Nilai kuis dan ujian siswa terkirim otomatis ke Google Sheets milik Bapak/Ibu, lengkap dengan lembar <b>Rekap</b> dan <b>Analisis</b> (ketuntasan, siswa yang perlu remedial, dan soal yang paling sulit).</p>
<ol class="langkah-rekap">
<li>Buka <a href="https://sheets.new" target="_blank" rel="noopener">sheets.new</a> di Chrome, beri nama <i>Rekap Ruang Historia</i>.</li>
<li>Di HP: menu ⋮ Chrome → centang <b>Situs desktop</b>. Lalu pilih menu <b>Ekstensi → Apps Script</b>.</li>
<li>Hapus isi editor, tempel kode dari tombol <b>Salin kode</b> di bawah, lalu tekan ikon Simpan.</li>
<li>Pilih fungsi <b>siapkan</b>, tekan <b>Jalankan</b>, lalu berikan izin (Lanjutan → Buka proyek).</li>
<li><b>Terapkan → Deployment baru</b> → jenis <b>Aplikasi web</b>; Jalankan sebagai: <b>Saya</b>; Akses: <b>Siapa saja</b> → Terapkan. Salin alamat aplikasi web.</li>
<li>Tempel alamat itu di kotak di bawah, tekan <b>Uji sambungan</b>, lalu buat tautan kelas (bagian 2).</li>
<li>Di Google Sheets, isi lembar <b>Siswa</b> (Kelas, No, Nama; bisa disalin dari Excel), lalu menu <b>Ruang Historia → Buat kode siswa</b>. Bagikan kodenya kepada siswa.</li>
<li>Setiap kali mulai mengajar bab baru, buka lembar <b>Pengaturan</b> dan ubah angka <b>Buka sampai bab</b> untuk kelas itu (misalnya 1 menjadi 2). KKM per kelas juga diatur di sana.</li>
</ol>
<div class="row"><button class="btn alt" type="button" id="salinkode">Salin kode Apps Script</button></div>
<label><b>Alamat aplikasi web (dari langkah 5)</b><input id="gr" class="isian" placeholder="https://script.google.com/macros/s/…/exec" value="${esc(c.rekap || '')}"></label>
<div class="row"><button class="btn alt" type="button" id="ujirekap">Uji sambungan</button></div><p class="catatan" id="pesanrekap"></p></div>

<div class="box guru-kartu"><h2>4. Lainnya</h2><ul>
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
  document.getElementById('buat').addEventListener('click', async () => {
    const buka = {}; app.querySelectorAll('[data-buka]').forEach(x => { if (+x.value > 0) buka[x.dataset.buka] = +x.value; });
    const o = { nama: document.getElementById('gk').value.trim(), modeBabak: document.getElementById('gm').checked, kkm: +document.getElementById('gn').value || 75, buka, rekap: document.getElementById('gr').value.trim() };
    const url = `${alamatDasar()}#kelas=${kodeKelas(o)}`;
    document.getElementById('hasilkelas').innerHTML = `<div class="tautan-kelas"><div>${await qrSVG(url, 200)}</div><div><p><b>Tautan kelas ${esc(o.nama || '')}</b>: mode babak ${o.modeBabak ? 'aktif' : 'mati'}, KKM ${o.kkm}, rekap nilai ${o.rekap ? 'aktif' : 'tidak dipakai'}.</p><input class="isian" readonly value="${esc(url)}"><div class="row"><button class="btn" type="button" id="salin">Salin tautan</button></div><p class="catatan">Bagikan tautan ini di grup kelas, atau tampilkan kode QR-nya di proyektor. Siswa cukup membukanya sekali dari HP masing-masing.</p></div></div>`;
    document.getElementById('salin').addEventListener('click', async ev => { try { await navigator.clipboard.writeText(url); ev.target.textContent = 'Tersalin'; } catch { app.querySelector('.tautan-kelas input').select(); } });
  });
  document.getElementById('salinkode').addEventListener('click', async ev => { try { const t = await fetch('alat/rekap-google-sheets.gs').then(r => r.text()); await navigator.clipboard.writeText(t); ev.target.textContent = 'Kode tersalin. Tempel di Apps Script'; } catch { ev.target.textContent = 'Gagal menyalin. Coba lagi'; } });
  document.getElementById('ujirekap').addEventListener('click', async () => { const u = document.getElementById('gr').value.trim(), ps = document.getElementById('pesanrekap'); if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(u)) { ps.textContent = 'Alamat belum benar. Alamatnya diawali https://script.google.com/macros/s/ dan diakhiri /exec'; return; } ps.textContent = 'Menghubungi Google Sheets…'; try { const r = await fetch(u + '?aksi=cek').then(x => x.json()); ps.textContent = r.ok ? `Tersambung ke "${r.nama}". Sekarang buat tautan kelas di bagian 2.` : 'Tersambung, tetapi ada masalah: ' + (r.pesan || ''); } catch { ps.textContent = 'Belum tersambung. Pastikan Akses diatur ke "Siapa saja", lalu coba lagi.'; } });
  document.getElementById('keluar').addEventListener('click', () => { S.set('guru', false); location.hash = '#beranda'; });
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
  else if (h === 'guru') panelGuru();
  else beranda();
  window.scrollTo(0, 0);
}
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
