/**
 * REKAP NILAI RUANG HISTORIA — kode untuk Google Sheets (Apps Script)
 * Pengembang: Eki Ripan J.R. Tanjung, S.Pd., M.Pd., Gr.
 *
 * Cara pakai singkat:
 * 1. Tempel seluruh kode ini di Ekstensi > Apps Script, lalu Simpan.
 * 2. Jalankan fungsi "siapkan" sekali dan berikan izin.
 * 3. Terapkan > Deployment baru > Aplikasi web (Jalankan sebagai: Saya; Akses: Siapa saja).
 * 4. Salin alamat aplikasi web ke Panel Guru Ruang Historia.
 * 5. Isi lembar "Siswa" (Kelas, No, Nama), lalu menu Ruang Historia > Buat kode siswa.
 * 6. Lihat lembar "Analisis" (diperbarui otomatis setiap file dibuka, atau lewat menu).
 * 7. Lembar "Pengaturan": atur sampai bab berapa materi dibuka untuk tiap kelas, dan KKM-nya.
 * 8. Tahun ajaran baru: menu Ruang Historia > Tahun ajaran baru. File lama disimpan sebagai arsip, lalu data dikosongkan.
 */

const LEMBAR_SISWA = 'Siswa';
const LEMBAR_NILAI = 'Nilai';
const LEMBAR_REKAP = 'Rekap';
const LEMBAR_BUTIR = 'Butir Soal';
const LEMBAR_ANALISIS = 'Analisis';
const LEMBAR_ATUR = 'Pengaturan';
const RUANG = [['Sejarah Indonesia', 'indonesia'], ['Sejarah Dunia', 'dunia'], ['SKI', 'ski']];
const HURUF_KODE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
// Kunci rahasia guru: diisi otomatis saat kode disalin dari Panel Guru. Jangan dibagikan.
const TOKEN_GURU = '__TOKEN_GURU__';
const VERSI = 6;
const LEMBAR_STAR = 'Historia Star';
const LEMBAR_TAMBAH = 'Nilai Tambah';

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Ruang Historia')
    .addItem('1. Siapkan lembar', 'siapkan')
    .addItem('2. Buat kode siswa', 'buatKode')
    .addItem('3. Perbarui analisis', 'perbaruiAnalisis')
    .addSeparator()
    .addItem('Hapus data satu kelas', 'hapusKelas')
    .addItem('Tahun ajaran baru (arsipkan lalu kosongkan)', 'tahunAjaranBaru')
    .addToUi();
  try { perbaruiAnalisis(true); } catch (e) {}
}

/** Membuat lembar Siswa, Nilai, dan Rekap beserta judul kolomnya. */
function siapkan() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const buat = (nama, judul, lebar) => {
    let sh = ss.getSheetByName(nama);
    if (!sh) sh = ss.insertSheet(nama);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, judul.length).setValues([judul]).setFontWeight('bold').setBackground('#2B3A67').setFontColor('#FFFFFF');
      sh.setFrozenRows(1);
      (lebar || []).forEach((w, i) => sh.setColumnWidth(i + 1, w));
    }
    return sh;
  };
  buat(LEMBAR_SISWA, ['Kelas', 'No', 'Nama', 'Kode'], [80, 50, 260, 100]);
  buat(LEMBAR_NILAI, ['Waktu', 'Kelas', 'No', 'Nama', 'Bagian', 'Judul', 'Nilai', 'Benar', 'Jumlah soal', 'Jenis', 'ID'], [150, 70, 45, 220, 130, 260, 60, 60, 80, 70, 120]);
  buat(LEMBAR_REKAP, ['Kelas', 'No', 'Nama'], [80, 50, 240]);
  buat(LEMBAR_BUTIR, ['Bagian', 'Kelas', 'No soal', 'Soal', 'Dijawab', 'Benar', '% benar'], [130, 70, 60, 520, 70, 60, 70]);
  buat(LEMBAR_ANALISIS, ['Analisis hasil belajar'], [900]);
  buat(LEMBAR_ATUR, ['Kelas'].concat(RUANG.map(r => 'Buka sampai bab: ' + r[0])).concat(['KKM']), [80, 190, 170, 120, 60]);
  const awal = ss.getSheetByName('Sheet1') || ss.getSheetByName('Lembar1');
  if (awal && awal.getLastRow() === 0 && ss.getSheets().length > 3) ss.deleteSheet(awal);
  try { SpreadsheetApp.getUi().alert('Lembar Siswa, Nilai, dan Rekap sudah siap. Isi daftar siswa di lembar Siswa (Kelas, No, Nama), lalu pilih menu Ruang Historia > Buat kode siswa.'); } catch (e) {}
}

/** Memberi kode unik 6 huruf/angka bagi setiap siswa yang belum punya kode. */
function buatKode() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_SISWA);
  if (!sh) { siapkan(); return; }
  const n = sh.getLastRow() - 1;
  if (n < 1) { SpreadsheetApp.getUi().alert('Lembar Siswa masih kosong.'); return; }
  const data = sh.getRange(2, 1, n, 4).getValues();
  const ada = new Set(data.map(r => String(r[3]).trim().toUpperCase()).filter(Boolean));
  let baru = 0;
  data.forEach(r => {
    if (String(r[2]).trim() && !String(r[3]).trim()) {
      let k;
      do { k = Array.from({ length: 6 }, () => HURUF_KODE[Math.floor(Math.random() * HURUF_KODE.length)]).join(''); } while (ada.has(k));
      ada.add(k); r[3] = k; baru++;
    }
  });
  sh.getRange(2, 1, n, 4).setValues(data);
  isiKelasPengaturan(data.map(r => String(r[0]).trim()).filter(Boolean));
  try { SpreadsheetApp.getUi().alert(baru + ' kode baru dibuat. Bagikan kode di kolom D kepada setiap siswa.'); } catch (e) {}
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const kunci = LockService.getScriptLock();
  try {
    kunci.waitLock(20000);
    if (p.aksi === 'cek') return keluar({ ok: true, nama: SpreadsheetApp.getActiveSpreadsheet().getName(), versi: VERSI, impor: TOKEN_GURU.indexOf('__') !== 0 && p.token === TOKEN_GURU });
    if (p.aksi === 'siswa') return keluar(imporSiswa(p));
    if (p.aksi === 'star') return keluar(papanStar(p));
    if (p.aksi === 'beriStar') return keluar(beriStar(p));
    if (p.aksi === 'batalStar') return keluar(batalStar(p));
    if (p.aksi === 'aturStar') return keluar(aturStar(p));
    if (p.aksi === 'tahunBaru') return keluar(tahunBaruDariAplikasi(p));
    if (p.aksi === 'olah') return keluar(dataOlahNilai(p));
    if (p.aksi === 'masuk') return keluar(masuk(p.kode));
    if (p.aksi === 'atur') return keluar(bacaPengaturan(p.kode));
    if (p.aksi === 'nilai') return keluar(simpanNilai(p));
    return keluar({ ok: false, pesan: 'Aksi tidak dikenal' });
  } catch (err) {
    return keluar({ ok: false, pesan: String(err) });
  } finally {
    try { kunci.releaseLock(); } catch (e2) {}
  }
}

/** Menerima nilai dari aplikasi (dikirim dengan POST). */
function doPost(e) {
  const kunci = LockService.getScriptLock();
  try {
    kunci.waitLock(30000);
    const p = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (p.aksi === 'nilai') return keluar(simpanNilai(p));
    return keluar({ ok: false });
  } catch (err) {
    return keluar({ ok: false, pesan: String(err) });
  } finally {
    try { kunci.releaseLock(); } catch (e2) {}
  }
}

function keluar(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function cariSiswa(kode) {
  kode = String(kode || '').trim().toUpperCase();
  if (!kode) return null;
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_SISWA);
  if (!sh || sh.getLastRow() < 2) return null;
  const data = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues();
  for (const r of data) if (String(r[3]).trim().toUpperCase() === kode) return { kelas: String(r[0]), no: r[1], nama: String(r[2]) };
  return null;
}

/** Menambahkan baris kelas baru di lembar Pengaturan (bawaan: Bab 1 terbuka, KKM 75). */
function isiKelasPengaturan(kelasList) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(LEMBAR_ATUR);
  if (!sh) { siapkan(); sh = ss.getSheetByName(LEMBAR_ATUR); }
  const ada = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(r => String(r[0]).trim()) : [];
  Array.from(new Set(kelasList)).forEach(k => { if (ada.indexOf(k) < 0) sh.appendRow([k, 1, 1, 1, 75]); });
}

/** Mengirim pengaturan kelas siswa (bab yang sudah dibuka guru dan KKM). */
function bacaPengaturan(kode) {
  const s = cariSiswa(kode);
  if (!s) return { ok: false };
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_ATUR);
  if (!sh || sh.getLastRow() < 2) return { ok: true, batas: {} };
  const data = sh.getRange(2, 1, sh.getLastRow() - 1, RUANG.length + 2).getValues();
  const r = data.filter(x => String(x[0]).trim() === s.kelas)[0];
  if (!r) return { ok: true, batas: {} };
  const batas = {};
  RUANG.forEach((ru, i) => { const v = r[i + 1]; if (v !== '' && v !== null) batas[ru[1]] = Number(v) || 0; });
  return { ok: true, kelas: s.kelas, batas: batas, kkm: Number(r[RUANG.length + 1]) || null, star: bonusStar(s.kelas)[s.nama] || 0, konversi: aturanStar() };
}

function masuk(kode) {
  const s = cariSiswa(kode);
  return s ? { ok: true, nama: s.nama, kelas: s.kelas, no: s.no, riwayat: riwayatSiswa(s), star: bonusStar(s.kelas)[s.nama] || 0, konversi: aturanStar() } : { ok: false, pesan: 'Kode tidak dikenal. Periksa lagi kodemu atau tanyakan kepada guru.' };
}

function simpanNilai(p) {
  const s = cariSiswa(p.kode);
  if (!s) return { ok: false, pesan: 'Kode tidak dikenal' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const log = ss.getSheetByName(LEMBAR_NILAI), rek = ss.getSheetByName(LEMBAR_REKAP);
  const nilai = Math.max(0, Math.min(100, Math.round(Number(p.nilai) || 0)));
  const id = String(p.id || '');
  // cegah data ganda bila aplikasi mengirim ulang
  if (id && log.getLastRow() > 1) {
    const mulai = Math.max(2, log.getLastRow() - 1500);
    const ids = log.getRange(mulai, 11, log.getLastRow() - mulai + 1, 1).getValues().map(r => String(r[0]));
    if (ids.indexOf(id) >= 0) return { ok: true, ganda: true };
  }
  log.appendRow([new Date(), s.kelas, s.no, s.nama, String(p.kolom || ''), String(p.judul || ''), nilai, Number(p.benar) || '', Number(p.total) || '', String(p.jenis || ''), id]);

  // rekap: satu baris per siswa, satu kolom per bab, berisi nilai terbaik
  const kolom = String(p.kolom || 'Lainnya');
  const lebar = Math.max(3, rek.getLastColumn());
  const judul = rek.getRange(1, 1, 1, lebar).getValues()[0].map(String);
  let c = judul.indexOf(kolom) + 1;
  if (!c) {
    c = lebar + 1;
    rek.getRange(1, c).setValue(kolom).setFontWeight('bold').setBackground('#2B3A67').setFontColor('#FFFFFF');
    rek.setColumnWidth(c, 95);
  }
  let baris = 0;
  if (rek.getLastRow() > 1) {
    const isi = rek.getRange(2, 1, rek.getLastRow() - 1, 3).getValues();
    for (let i = 0; i < isi.length; i++) if (String(isi[i][0]) === s.kelas && String(isi[i][2]) === s.nama) { baris = i + 2; break; }
  }
  if (!baris) { baris = rek.getLastRow() + 1; rek.getRange(baris, 1, 1, 3).setValues([[s.kelas, s.no, s.nama]]); }
  const sel = rek.getRange(baris, c), lama = Number(sel.getValue()) || 0;
  if (nilai > lama || sel.getValue() === '') sel.setValue(nilai);
  const kkm = Number(p.kkm) || 0;
  if (kkm) {
    sel.setBackground(Math.max(nilai, lama) >= kkm ? '#D9F2E3' : '#FBE3E1');
    PropertiesService.getDocumentProperties().setProperty('kkm_' + s.kelas, String(kkm));
  }
  if (Array.isArray(p.butir) && p.butir.length) catatButir(kolom, s.kelas, p.butir);
  return { ok: true };
}

/** Menghitung berapa kali setiap soal dijawab dan dijawab benar. */
function catatButir(kolom, kelas, butir) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_BUTIR);
  const n = sh.getLastRow() - 1;
  const data = n > 0 ? sh.getRange(2, 1, n, 6).getValues() : [];
  const posisi = {};
  data.forEach((r, i) => { posisi[r[0] + '#' + r[1] + '#' + r[2]] = i; });
  butir.forEach(b => {
    const key = kolom + '#' + kelas + '#' + b.no, benar = b.b ? 1 : 0;
    if (key in posisi) { const r = data[posisi[key]]; r[4] = (Number(r[4]) || 0) + 1; r[5] = (Number(r[5]) || 0) + benar; if (b.q && !r[3]) r[3] = String(b.q).slice(0, 300); }
    else { posisi[key] = data.length; data.push([kolom, kelas, b.no, String(b.q || '').slice(0, 300), 1, benar]); }
  });
  if (data.length) {
    sh.getRange(2, 1, data.length, 6).setValues(data);
    sh.getRange(2, 7, data.length, 1).setValues(data.map(r => [r[4] ? Math.round(r[5] / r[4] * 100) : '']));
  }
}

/** Menyusun lembar Analisis: per kelas dan per bab. */
function perbaruiAnalisis(diam) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rek = ss.getSheetByName(LEMBAR_REKAP), sis = ss.getSheetByName(LEMBAR_SISWA), but = ss.getSheetByName(LEMBAR_BUTIR);
  let an = ss.getSheetByName(LEMBAR_ANALISIS);
  if (!rek || !sis) return;
  if (!an) an = ss.insertSheet(LEMBAR_ANALISIS);
  const props = PropertiesService.getDocumentProperties();
  const judul = rek.getRange(1, 1, 1, Math.max(3, rek.getLastColumn())).getValues()[0].map(String);
  const isi = rek.getLastRow() > 1 ? rek.getRange(2, 1, rek.getLastRow() - 1, judul.length).getValues() : [];
  const siswa = sis.getLastRow() > 1 ? sis.getRange(2, 1, sis.getLastRow() - 1, 3).getValues().filter(r => String(r[2]).trim()) : [];
  const kelasList = Array.from(new Set(siswa.map(r => String(r[0])).concat(isi.map(r => String(r[0]))))).filter(Boolean).sort();
  const butir = but && but.getLastRow() > 1 ? but.getRange(2, 1, but.getLastRow() - 1, 7).getValues() : [];
  const out = [];
  const tulis = (teks, gaya) => out.push({ teks, gaya: gaya || '' });
  tulis('ANALISIS HASIL BELAJAR RUANG HISTORIA', 'judul');
  tulis('Diperbarui: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm') + ' · Nilai yang dipakai adalah nilai terbaik setiap siswa.', 'kecil');
  tulis('');
  kelasList.forEach(kelas => {
    const at = ss.getSheetByName(LEMBAR_ATUR), barisAt = at && at.getLastRow() > 1 ? at.getRange(2, 1, at.getLastRow() - 1, RUANG.length + 2).getValues().filter(x => String(x[0]).trim() === kelas)[0] : null;
  const kkm = (barisAt && Number(barisAt[RUANG.length + 1])) || Number(props.getProperty('kkm_' + kelas)) || 75;
    const anggota = siswa.filter(r => String(r[0]) === kelas).map(r => String(r[2]));
    const baris = isi.filter(r => String(r[0]) === kelas);
    tulis('KELAS ' + kelas + ' · ' + (anggota.length || baris.length) + ' siswa · KKM ' + kkm, 'kelas');
    let adaData = false;
    for (let c = 3; c < judul.length; c++) {
      const nilai = baris.map(r => ({ nama: String(r[2]), v: r[c] })).filter(x => x.v !== '' && x.v !== null);
      if (!nilai.length) continue;
      adaData = true;
      const angka = nilai.map(x => Number(x.v));
      const rata = Math.round(angka.reduce((a, b) => a + b, 0) / angka.length);
      const tuntas = nilai.filter(x => Number(x.v) >= kkm), remedial = nilai.filter(x => Number(x.v) < kkm);
      const sudah = new Set(nilai.map(x => x.nama));
      const belum = anggota.filter(n => !sudah.has(n));
      const persen = Math.round(tuntas.length / nilai.length * 100);
      tulis(judul[c], 'bab');
      tulis('• Mengerjakan: ' + nilai.length + (anggota.length ? ' dari ' + anggota.length + ' siswa' : ' siswa') + ' · Rata-rata: ' + rata + ' · Tertinggi: ' + Math.max.apply(null, angka) + ' · Terendah: ' + Math.min.apply(null, angka));
      tulis('• Tuntas KKM: ' + tuntas.length + ' siswa (' + persen + '%) · Belum tuntas: ' + remedial.length + ' siswa', persen >= 75 ? 'baik' : persen >= 50 ? 'sedang' : 'kurang');
      if (remedial.length) tulis('• Perlu remedial: ' + remedial.map(x => x.nama + ' (' + x.v + ')').join(', '));
      if (belum.length) tulis('• Belum mengerjakan: ' + belum.join(', '));
      const sulit = butir.filter(r => String(r[0]) === judul[c] && String(r[1]) === kelas && Number(r[4]) >= 3).sort((a, b) => Number(a[6]) - Number(b[6])).slice(0, 3).filter(r => Number(r[6]) < 70);
      if (sulit.length) tulis('• Soal paling sulit: ' + sulit.map(r => 'no. ' + r[2] + ' (' + r[6] + '% benar) "' + String(r[3]).slice(0, 90) + (String(r[3]).length > 90 ? '…' : '') + '"').join('; '));
      let saran = persen >= 85 ? 'Sebagian besar siswa sudah menguasai materi ini. Dapat dilanjutkan ke bab berikutnya; berikan pengayaan bagi yang bernilai tinggi.'
        : persen >= 60 ? 'Sebagian siswa sudah tuntas. Lakukan remedial bagi siswa yang belum tuntas, misalnya dengan tutor sebaya.'
        : 'Kurang dari 60% siswa tuntas. Sebaiknya materi ini dijelaskan ulang di kelas sebelum melanjutkan.';
      if (sulit.length) saran += ' Bahas kembali konsep pada soal yang paling sulit di atas.';
      tulis('• Kesimpulan: ' + saran, 'saran');
    }
    if (!adaData) tulis('Belum ada nilai yang masuk untuk kelas ini.', 'kecil');
    tulis('');
  });
  if (!kelasList.length) tulis('Belum ada data siswa. Isi lembar Siswa terlebih dahulu.', 'kecil');
  an.clear();
  an.getRange(1, 1, out.length, 1).setValues(out.map(o => [o.teks])).setWrap(true).setVerticalAlignment('top').setFontSize(11);
  an.setColumnWidth(1, 900);
  const warna = { judul: ['#2B3A67', '#FFFFFF', 14], kelas: ['#E0B04A', '#2A1D14', 12], bab: ['#E8ECF7', '#2B3A67', 11], baik: [null, '#1E7B45', 11], sedang: [null, '#9A6A1C', 11], kurang: [null, '#B23A1F', 11], saran: ['#FBF3E3', null, 11], kecil: [null, '#6B5848', 10] };
  out.forEach((o, i) => {
    const w = warna[o.gaya]; if (!w) return;
    const r = an.getRange(i + 1, 1);
    if (w[0]) r.setBackground(w[0]); if (w[1]) r.setFontColor(w[1]); r.setFontSize(w[2]);
    if (['judul', 'kelas', 'bab'].indexOf(o.gaya) >= 0) r.setFontWeight('bold');
  });
  an.setFrozenRows(1);
  if (diam !== true) { try { SpreadsheetApp.getUi().alert('Analisis sudah diperbarui. Lihat lembar Analisis.'); } catch (e) {} }
  try { perbaruiNilaiTambah(); } catch (e) {}
}


/* ---------- HAPUS DATA DAN TAHUN AJARAN BARU ---------- */
// lembar dan nomor kolom "Kelas" di dalamnya
const KOLOM_KELAS = [[LEMBAR_SISWA, 1], [LEMBAR_NILAI, 2], [LEMBAR_REKAP, 1], [LEMBAR_BUTIR, 2], [LEMBAR_ATUR, 1], [LEMBAR_STAR, 2]];

/** Menghapus semua baris milik satu kelas (siswa, nilai, rekap, butir soal, pengaturan). */
function hapusKelas() {
  const ui = SpreadsheetApp.getUi(), ss = SpreadsheetApp.getActiveSpreadsheet();
  const r = ui.prompt('Hapus data satu kelas', 'Ketik nama kelas persis seperti di lembar Siswa (contoh: XI D):', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const kelas = r.getResponseText().trim(); if (!kelas) return;
  if (ui.alert('Yakin?', 'Semua data kelas "' + kelas + '" (daftar siswa, kode, nilai, rekap, dan pengaturan) akan dihapus. Data kelas lain tidak berubah.', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  let jumlah = 0;
  KOLOM_KELAS.forEach(([nama, kol]) => {
    const sh = ss.getSheetByName(nama); if (!sh || sh.getLastRow() < 2) return;
    const nilai = sh.getRange(2, kol, sh.getLastRow() - 1, 1).getValues();
    for (let i = nilai.length - 1; i >= 0; i--) if (String(nilai[i][0]).trim() === kelas) { sh.deleteRow(i + 2); jumlah++; }
  });
  PropertiesService.getDocumentProperties().deleteProperty('kkm_' + kelas);
  try { perbaruiAnalisis(true); } catch (e) {}
  ui.alert(jumlah ? 'Selesai. ' + jumlah + ' baris data kelas "' + kelas + '" sudah dihapus.' : 'Tidak ada data dengan nama kelas "' + kelas + '". Periksa penulisannya.');
}

/** Menyimpan salinan file sebagai arsip, lalu mengosongkan data untuk tahun ajaran baru. */
function tahunAjaranBaru() {
  const ui = SpreadsheetApp.getUi(), ss = SpreadsheetApp.getActiveSpreadsheet();
  const t = new Date(), y = t.getFullYear(), m = t.getMonth(), lalu = m === 6 || m === 7 ? (y - 1) + '-' + y : m >= 8 ? y + '-' + (y + 1) : (y - 1) + '-' + y;
  const r = ui.prompt('Tahun ajaran baru', 'File ini akan disalin sebagai arsip, lalu semua nilai dikosongkan.\nNama tahun ajaran yang diarsipkan:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const label = r.getResponseText().trim() || lalu;
  const siswaJuga = ui.alert('Daftar siswa', 'Hapus juga daftar siswa dan kodenya?\n\nYA = hapus (isi siswa baru nanti)\nTIDAK = simpan daftar siswa (misalnya bila siswanya sama, hanya naik kelas)', ui.ButtonSet.YES_NO_CANCEL);
  if (siswaJuga === ui.Button.CANCEL || siswaJuga === ui.Button.CLOSE) return;
  const arsip = arsipkanDanKosongkan(label, siswaJuga === ui.Button.YES);
  ui.alert('Selesai.\n\nArsip tersimpan di Google Drive dengan nama:\n"' + arsip.nama + '"\n\nFile ini sudah kosong dan siap dipakai tahun ajaran baru. Alamat aplikasi web dan tautan kelas tetap sama.' + (siswaJuga === ui.Button.YES ? '\n\nMasukkan daftar siswa baru dari Ruang Guru > Daftar Siswa.' : '\n\nJangan lupa ubah nama kelas di lembar Siswa dan Pengaturan bila siswa naik kelas.'));
}


/* ---------- IMPOR DAFTAR SISWA DARI PANEL GURU ---------- */
/** Menambah siswa satu kelas (data: {kelas, nama:[...]}) lalu mengembalikan kode mereka. Hanya untuk guru (perlu token). */
function imporSiswa(p) {
  if (TOKEN_GURU.indexOf('__') === 0 || p.token !== TOKEN_GURU) return { ok: false, pesan: 'token' };
  const d = JSON.parse(p.data || '{}'), kelas = String(d.kelas || '').trim().slice(0, 40);
  const nama = (d.nama || []).map(x => String(x).replace(/\s+/g, ' ').trim().slice(0, 80)).filter(Boolean);
  if (!kelas || !nama.length) return { ok: false, pesan: 'Nama kelas atau daftar nama kosong.' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(LEMBAR_SISWA); if (!sh) { siapkanDiam(); sh = ss.getSheetByName(LEMBAR_SISWA); }
  const n = Math.max(0, sh.getLastRow() - 1);
  const data = n ? sh.getRange(2, 1, n, 4).getValues() : [];
  const ada = new Set(data.map(r => String(r[3]).trim().toUpperCase()).filter(Boolean));
  const kunciNama = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  const dikelas = data.filter(r => String(r[0]).trim() === kelas);
  let no = dikelas.reduce((m, r) => Math.max(m, +r[1] || 0), 0), baru = 0;
  const hasil = [];
  nama.forEach(nm => {
    let r = dikelas.find(x => kunciNama(x[2]) === kunciNama(nm));
    if (!r) {
      let k; do { k = Array.from({ length: 6 }, () => HURUF_KODE[Math.floor(Math.random() * HURUF_KODE.length)]).join(''); } while (ada.has(k));
      ada.add(k); r = [kelas, ++no, nm, k]; sh.appendRow(r); dikelas.push(r); baru++;
    } else if (!String(r[3]).trim()) {
      let k; do { k = Array.from({ length: 6 }, () => HURUF_KODE[Math.floor(Math.random() * HURUF_KODE.length)]).join(''); } while (ada.has(k));
      ada.add(k); r[3] = k; const i = data.indexOf(r); if (i >= 0) sh.getRange(i + 2, 4).setValue(k);
    }
    hasil.push([r[1], r[2], r[3]]);
  });
  isiKelasPengaturan([kelas]);
  return { ok: true, kelas: kelas, baru: baru, siswa: hasil };
}
function siapkanDiam() { try { siapkan(); } catch (e) {} }


/* ---------- PULIHKAN NILAI SAAT SISWA GANTI HP ---------- */
/** Nilai terbaik seorang siswa per kolom rekap, misalnya {"Indonesia Bab 4": 85}. */
function riwayatSiswa(s) {
  const rek = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_REKAP);
  if (!rek || rek.getLastRow() < 2 || rek.getLastColumn() < 4) return {};
  const data = rek.getRange(1, 1, rek.getLastRow(), rek.getLastColumn()).getValues(), judul = data[0].map(String), out = {};
  const r = data.slice(1).find(x => String(x[0]) === s.kelas && String(x[2]) === s.nama);
  if (!r) return {};
  for (let c = 3; c < judul.length; c++) if (judul[c] && r[c] !== '' && !isNaN(Number(r[c]))) out[judul[c]] = Number(r[c]);
  return out;
}


/* ---------- HISTORIA STAR ---------- */
// Bintang dari kuis: 1 bila nilai bab >= KKM, 2 bila >= 90, 3 bila 100. Bintang dari guru dicatat di lembar "Historia Star".
function lembarStar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(LEMBAR_STAR);
  if (!sh) {
    sh = ss.insertSheet(LEMBAR_STAR);
    sh.getRange(1, 1, 1, 7).setValues([['Tanggal', 'Kelas', 'No', 'Nama', 'Jumlah', 'Alasan', 'ID']]).setFontWeight('bold').setBackground('#E0A100').setFontColor('#FFFFFF');
    sh.setFrozenRows(1); [150, 80, 50, 240, 70, 260, 90].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  }
  return sh;
}
function bonusStar(kelas) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_STAR), out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  sh.getRange(2, 1, sh.getLastRow() - 1, 5).getValues().forEach(r => { if (String(r[1]).trim() === kelas) out[r[3]] = (out[r[3]] || 0) + (Number(r[4]) || 0); });
  return out;
}
function kkmKelas(kelas) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_ATUR);
  if (sh && sh.getLastRow() > 1) { const r = sh.getRange(2, 1, sh.getLastRow() - 1, RUANG.length + 2).getValues().find(x => String(x[0]).trim() === kelas); if (r && Number(r[RUANG.length + 1])) return Number(r[RUANG.length + 1]); }
  return Number(PropertiesService.getDocumentProperties().getProperty('kkm_' + kelas)) || 75;
}
function starKuis(kelas) {
  const rek = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_REKAP), out = {};
  if (!rek || rek.getLastRow() < 2 || rek.getLastColumn() < 4) return out;
  const kkm = kkmKelas(kelas), data = rek.getRange(1, 1, rek.getLastRow(), rek.getLastColumn()).getValues(), judul = data[0].map(String);
  data.slice(1).forEach(r => {
    if (String(r[0]).trim() !== kelas) return;
    let n = 0;
    for (let c = 3; c < judul.length; c++) if (/ Bab \d+$/.test(judul[c]) && r[c] !== '') { const v = Number(r[c]); n += v >= 100 ? 3 : v >= 90 ? 2 : v >= kkm ? 1 : 0; }
    out[r[2]] = n;
  });
  return out;
}
/** Daftar siswa satu kelas beserta Historia Star-nya (khusus guru). Tanpa kelas: daftar nama kelas. */
function papanStar(p) {
  if (TOKEN_GURU.indexOf('__') === 0 || p.token !== TOKEN_GURU) return { ok: false, pesan: 'token' };
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_SISWA);
  const data = sh && sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues() : [];
  const daftarKelas = Array.from(new Set(data.map(r => String(r[0]).trim()).filter(Boolean)));
  const kelas = String(p.kelas || '').trim();
  if (!kelas) return { ok: true, daftarKelas: daftarKelas };
  const kuis = starKuis(kelas), bonus = bonusStar(kelas);
  const siswa = data.filter(r => String(r[0]).trim() === kelas).map(r => ({ no: r[1], nama: r[2], kuis: kuis[r[2]] || 0, guru: bonus[r[2]] || 0 }))
    .map(s => Object.assign(s, { total: s.kuis + s.guru, poin: poinStar(s.kuis + s.guru) }));
  return { ok: true, daftarKelas: daftarKelas, kelas: kelas, siswa: siswa, konversi: aturanStar() };
}
/** Memberi Historia Star kepada beberapa siswa sekaligus. data: {kelas, nama:[...], jumlah, alasan, id} */
function beriStar(p) {
  if (TOKEN_GURU.indexOf('__') === 0 || p.token !== TOKEN_GURU) return { ok: false, pesan: 'token' };
  const d = JSON.parse(p.data || '{}'), kelas = String(d.kelas || '').trim(), jumlah = Math.max(-5, Math.min(10, Math.round(Number(d.jumlah) || 1)));
  const sis = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_SISWA).getRange(2, 1, Math.max(1, SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEMBAR_SISWA).getLastRow() - 1), 3).getValues();
  const sh = lembarStar(), id = String(d.id || Date.now()), kini = new Date();
  (d.nama || []).forEach(nm => { const r = sis.find(x => String(x[0]).trim() === kelas && String(x[2]) === nm); if (r) sh.appendRow([kini, kelas, r[1], r[2], jumlah, String(d.alasan || '').slice(0, 120), id]); });
  try { perbaruiNilaiTambah(); } catch (e) {}
  return papanStar({ token: p.token, kelas: kelas });
}
/** Membatalkan pemberian bintang terakhir (berdasarkan ID kiriman). */
function batalStar(p) {
  if (TOKEN_GURU.indexOf('__') === 0 || p.token !== TOKEN_GURU) return { ok: false, pesan: 'token' };
  const sh = lembarStar(), id = String(p.id || '');
  for (let i = sh.getLastRow(); i >= 2; i--) if (String(sh.getRange(i, 7).getValue()) === id) sh.deleteRow(i);
  try { perbaruiNilaiTambah(); } catch (e) {}
  return papanStar({ token: p.token, kelas: p.kelas });
}


/* ---------- KONVERSI HISTORIA STAR KE NILAI TAMBAH ---------- */
function aturanStar() {
  const pr = PropertiesService.getDocumentProperties();
  return { poin: Number(pr.getProperty('star_poin')) || 1, maks: pr.getProperty('star_maks') === null ? 10 : Number(pr.getProperty('star_maks')) };
}
function poinStar(n) { const a = aturanStar(); const v = n * a.poin; return Math.round((a.maks > 0 ? Math.min(v, a.maks) : v) * 10) / 10; }
function aturStar(p) {
  if (TOKEN_GURU.indexOf('__') === 0 || p.token !== TOKEN_GURU) return { ok: false, pesan: 'token' };
  const pr = PropertiesService.getDocumentProperties();
  pr.setProperty('star_poin', String(Math.max(0, Math.min(10, Number(p.poin) || 1))));
  pr.setProperty('star_maks', String(Math.max(0, Math.min(100, Number(p.maks) || 0))));
  try { perbaruiNilaiTambah(); } catch (e) {}
  return Object.assign({ ok: true }, aturanStar());
}
/** Lembar "Nilai Tambah": total Historia Star tiap siswa dan nilai tambahnya, untuk diolah bersama nilai lain. */
function perbaruiNilaiTambah() {
  const ss = SpreadsheetApp.getActiveSpreadsheet(), sis = ss.getSheetByName(LEMBAR_SISWA);
  if (!sis || sis.getLastRow() < 2) return;
  let sh = ss.getSheetByName(LEMBAR_TAMBAH); if (!sh) sh = ss.insertSheet(LEMBAR_TAMBAH);
  const a = aturanStar();
  const data = sis.getRange(2, 1, sis.getLastRow() - 1, 3).getValues().filter(r => String(r[2]).trim());
  const cache = {}, baris = data.map(r => {
    const k = String(r[0]).trim(); if (!cache[k]) cache[k] = { kuis: starKuis(k), guru: bonusStar(k) };
    const kuis = cache[k].kuis[r[2]] || 0, guru = cache[k].guru[r[2]] || 0;
    return [k, r[1], r[2], kuis, guru, kuis + guru, poinStar(kuis + guru)];
  });
  sh.clear();
  sh.getRange(1, 1, 1, 7).setValues([['Kelas', 'No', 'Nama', 'Star dari kuis', 'Star dari guru', 'Total Historia Star', 'Nilai tambah']]).setFontWeight('bold').setBackground('#E0A100').setFontColor('#FFFFFF');
  if (baris.length) sh.getRange(2, 1, baris.length, 7).setValues(baris);
  sh.getRange(1, 9).setValue('Aturan: 1 Historia Star = ' + a.poin + ' poin' + (a.maks > 0 ? ', maksimal ' + a.maks + ' poin' : ', tanpa batas') + '. Ubah aturan dari Ruang Guru > Historia Star.').setFontStyle('italic');
  sh.setFrozenRows(1); [80, 50, 240, 110, 110, 140, 110].forEach((w, i) => sh.setColumnWidth(i + 1, w));
}


/* ---------- TAHUN AJARAN BARU DARI APLIKASI ---------- */
/** Menyalin file sebagai arsip, lalu mengosongkan nilai (dan daftar siswa bila diminta). */
function arsipkanDanKosongkan(label, hapusSiswa) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const arsip = ss.copy('Arsip ' + ss.getName() + ' ' + label);
  const kosongkan = nama => { const sh = ss.getSheetByName(nama); if (sh && sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, sh.getMaxColumns()).clearContent().setBackground(null); };
  [LEMBAR_NILAI, LEMBAR_BUTIR, LEMBAR_STAR, LEMBAR_TAMBAH].forEach(kosongkan);
  const rek = ss.getSheetByName(LEMBAR_REKAP);
  if (rek) { kosongkan(LEMBAR_REKAP); if (rek.getMaxColumns() > 3) rek.getRange(1, 4, 1, rek.getMaxColumns() - 3).clearContent().setBackground(null); }
  const an = ss.getSheetByName(LEMBAR_ANALISIS); if (an && an.getLastRow() > 1) an.getRange(2, 1, an.getLastRow() - 1, an.getMaxColumns()).clear();
  if (hapusSiswa) { kosongkan(LEMBAR_SISWA); kosongkan(LEMBAR_ATUR); }
  else { const at = ss.getSheetByName(LEMBAR_ATUR); if (at && at.getLastRow() > 1) at.getRange(2, 2, at.getLastRow() - 1, RUANG.length).setValue(1); }
  const props = PropertiesService.getDocumentProperties(); Object.keys(props.getProperties()).filter(k => k.indexOf('kkm_') === 0).forEach(k => props.deleteProperty(k));
  return { nama: arsip.getName(), url: arsip.getUrl(), unduh: 'https://docs.google.com/spreadsheets/d/' + arsip.getId() + '/export?format=xlsx' };
}
function tahunBaruDariAplikasi(p) {
  if (TOKEN_GURU.indexOf('__') === 0 || p.token !== TOKEN_GURU) return { ok: false, pesan: 'token' };
  const label = String(p.label || '').replace(/[^\w\/\- ]/g, '').slice(0, 20) || String(new Date().getFullYear());
  return Object.assign({ ok: true }, arsipkanDanKosongkan(label, p.hapusSiswa === '1'));
}


/* ---------- OLAH NILAI: data satu kelas untuk diolah di aplikasi ---------- */
function dataOlahNilai(p) {
  if (TOKEN_GURU.indexOf('__') === 0 || p.token !== TOKEN_GURU) return { ok: false, pesan: 'token' };
  const ss = SpreadsheetApp.getActiveSpreadsheet(), kelas = String(p.kelas || '').trim();
  const sis = ss.getSheetByName(LEMBAR_SISWA), rek = ss.getSheetByName(LEMBAR_REKAP);
  const daftar = sis && sis.getLastRow() > 1 ? sis.getRange(2, 1, sis.getLastRow() - 1, 3).getValues().filter(r => String(r[0]).trim() === kelas) : [];
  let judul = [], data = [];
  if (rek && rek.getLastRow() > 1 && rek.getLastColumn() > 3) { const v = rek.getRange(1, 1, rek.getLastRow(), rek.getLastColumn()).getValues(); judul = v[0].map(String); data = v.slice(1); }
  const kolom = judul.slice(3).filter(Boolean), kuis = starKuis(kelas), bonus = bonusStar(kelas);
  const siswa = daftar.map(r => {
    const baris = data.find(x => String(x[0]).trim() === kelas && String(x[2]) === String(r[2])), nilai = {};
    if (baris) kolom.forEach(k => { const c = judul.indexOf(k); if (baris[c] !== '' && !isNaN(Number(baris[c]))) nilai[k] = Number(baris[c]); });
    const star = (kuis[r[2]] || 0) + (bonus[r[2]] || 0);
    return { no: r[1], nama: r[2], nilai: nilai, star: star, poin: poinStar(star) };
  });
  return { ok: true, kelas: kelas, kolom: kolom, siswa: siswa, konversi: aturanStar(), kkm: kkmKelas(kelas) };
}
