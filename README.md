# Ruang Historia

Ruang belajar sejarah interaktif untuk MA/SMA/SMK. Setiap "ruang" adalah satu mata pelajaran: **Sejarah Indonesia** (Praaksara sampai Reformasi), **Sejarah Dunia**, dan **Sejarah Kebudayaan Islam**. Ruang lain bisa ditambahkan. Isinya materi, gambar interaktif, video, kuis dengan pembahasan, soal uraian berikut rubriknya, dan ujian akhir. Materinya diperkaya nilai Panca Cinta (Kurikulum Berbasis Cinta, Kemenag).

Satu folder ini bisa dipakai untuk dua bentuk:

1. **Aplikasi web**: gratis di GitHub Pages, dibuka lewat tautan, dan bisa dipasang ke layar utama HP.
2. **Aplikasi Android (APK)**: dibuat otomatis oleh GitHub setiap kali isi folder diperbarui.

---

## A. Unggah ke GitHub (cukup sekali)

1. Masuk ke github.com dan buat repositori baru, misalnya `ruang-historia`. Pilih **Public**, karena GitHub Pages gratis untuk repositori publik.
2. Di repositori baru, klik **Add file → Upload files**.
3. Ekstrak file zip ini di komputer, lalu seret **semua isi folder** ke halaman unggah. Folder `.github` ikut diunggah juga.
   - Kalau folder `.github` tidak ikut (ini sering terjadi karena namanya diawali titik), buat file secara manual: **Add file → Create new file**, beri nama `.github/workflows/apk.yml`, lalu tempel isi file `apk.yml` dari zip.
4. Klik **Commit changes**.

## B. Aktifkan aplikasi web (GitHub Pages)

1. Di repositori, buka **Settings → Pages**.
2. Pada **Source**, pilih **Deploy from a branch**. Pilih cabang **main** dan folder **/ (root)**, lalu **Save**.
3. Tunggu 1–2 menit. Alamat aplikasi akan muncul, misalnya:
   `https://namaakun.github.io/ruang-historia/`
4. Bagikan alamat itu ke siswa. Di HP (Chrome), siswa bisa membuka menu ⋮ lalu memilih **Tambahkan ke layar utama** supaya aplikasi tampil seperti aplikasi biasa dan bisa dibuka tanpa internet.

## C. Ambil APK Android

1. Setelah diunggah, buka tab **Actions** di repositori. Proses **Buat APK Android** berjalan sekitar 5–8 menit.
2. Kalau sudah centang hijau, buka halaman utama repositori, lalu **Releases → APK terbaru → Ruang-Historia.apk**.
3. Bagikan tautan file itu ke siswa. Saat memasang, HP akan meminta izin **pasang dari sumber tidak dikenal**. Izinkan untuk browser atau aplikasi file yang dipakai.
4. Kalau proses Actions tidak jalan, buka **Settings → Actions → General**, pilih **Allow all actions**, lalu buka tab Actions dan klik **Run workflow**.

> Catatan: APK ini versi *debug*. Bisa dipasang langsung di HP, tetapi tidak untuk Play Store. Untuk menerbitkan di Play Store dibutuhkan akun Google Play Console dan APK/AAB yang ditandatangani.

---

## D. Mengubah atau menambah materi

Semua isi ada di folder `data/`:

| File | Isi |
|---|---|
| `data/koleksi.js` | Daftar ruang (Sejarah Indonesia, Sejarah Dunia, SKI) beserta daftar babnya |
| `data/indonesia/bab01.js` | Isi lengkap Sejarah Indonesia Bab 1: materi, kartu tokoh, istilah, video, 20 soal pilihan ganda, 3 soal uraian |

**Menambah bab baru** (contoh: Sejarah Dunia Bab 1)

1. Salin `data/indonesia/bab01.js` ke `data/dunia/bab01.js`. Ubah `koleksi: "indonesia"` menjadi `koleksi: "dunia"`, sesuaikan `id`, lalu ganti isinya.
2. Di `index.html`, tambahkan baris `<script src="data/dunia/bab01.js"></script>` di atas baris `app.js`.
3. Taruh videonya di `video/dunia/bab01.mp4`, lalu tulis alamat itu di bagian `video.src`.
4. Di `sw.js`, tambahkan `'data/dunia/bab01.js'` ke daftar FILE dan naikkan `VERSI` (misalnya `historia-v2`) supaya HP siswa mengambil versi baru.
5. Unggah perubahan ke GitHub. Situs web langsung diperbarui dan APK baru dibuat otomatis.

**Menambah ruang baru** (misalnya Sejarah Lokal): tambahkan satu objek baru di `data/koleksi.js` dengan `id` huruf kecil tanpa spasi, misalnya `lokal`.

**Format soal**

```js
{ s: "stimulus/kutipan (boleh dihapus)", q: "pertanyaan", o: ["A", "B", "C", "D", "E"], a: 1, l: "C4", p: "pembahasan" }
```

`a` adalah nomor jawaban benar, dimulai dari 0 (0 = A, 1 = B, dan seterusnya). `l` adalah level kognitif.

## E. Mencoba di komputer

Buka folder ini dengan ekstensi Live Server (VS Code), atau jalankan `python -m http.server` lalu buka `http://localhost:8000`. Membuka `index.html` dengan klik dua kali juga bisa, tetapi mode tanpa internet tidak aktif.

---

Nilai siswa tersimpan di perangkat masing-masing (tidak dikirim ke server mana pun).

## Pengembang dan hak cipta

**Eki Ripan Junapratama Rahmatullah, S.Pd., M.Pd., Gr.** (Eki Ripan J.R. Tanjung), Guru Sejarah MAN 1 Belitung.

© 2026 Eki Ripan Junapratama Rahmatullah. Hak cipta dilindungi undang-undang (UU No. 28 Tahun 2014 tentang Hak Cipta).

Bagian dari keluarga aplikasi HISTORIA PLAY!, ASESMENKU, EVIDENKU, dan SEMEDI.
