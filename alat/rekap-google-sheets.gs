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
 */

const LEMBAR_SISWA = 'Siswa';
const LEMBAR_NILAI = 'Nilai';
const LEMBAR_REKAP = 'Rekap';
const LEMBAR_BUTIR = 'Butir Soal';
const LEMBAR_ANALISIS = 'Analisis';
const HURUF_KODE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Ruang Historia')
    .addItem('1. Siapkan lembar', 'siapkan')
    .addItem('2. Buat kode siswa', 'buatKode')
    .addItem('3. Perbarui analisis', 'perbaruiAnalisis')
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
  try { SpreadsheetApp.getUi().alert(baru + ' kode baru dibuat. Bagikan kode di kolom D kepada setiap siswa.'); } catch (e) {}
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const kunci = LockService.getScriptLock();
  try {
    kunci.waitLock(20000);
    if (p.aksi === 'cek') return keluar({ ok: true, nama: SpreadsheetApp.getActiveSpreadsheet().getName() });
    if (p.aksi === 'masuk') return keluar(masuk(p.kode));
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

function masuk(kode) {
  const s = cariSiswa(kode);
  return s ? { ok: true, nama: s.nama, kelas: s.kelas, no: s.no } : { ok: false, pesan: 'Kode tidak dikenal. Periksa lagi kodemu atau tanyakan kepada guru.' };
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
    const kkm = Number(props.getProperty('kkm_' + kelas)) || 75;
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
}
