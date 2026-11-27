"""Membaca foto/ilustrasi yang diunggah guru ke folder gambar/guru/,
mengecilkannya, lalu menulis daftar gambar/guru.json untuk ditampilkan di bab yang sesuai.

Format nama file:  <ruang>-<nomor bab> <judul>.jpg
  contoh: indonesia-8 Soekarno membacakan teks Proklamasi.jpg
Boleh ditambah keterangan/sumber setelah dua tanda minus:
  contoh: indonesia-8 Rapat Ikada -- Sumber ANRI.jpg
Ruang: indonesia, dunia, ski.  Dijalankan oleh GitHub Actions (alur kerja 'Gambar guru')."""
import json, os, re, hashlib
from PIL import Image, ImageOps

ASAL, TUJUAN = 'gambar/guru', 'gambar/guru-tampil'
POLA = re.compile(r'^(indonesia|dunia|ski)\s*[-_ ]\s*(\d{1,2})\s*[-_ ]\s*(.+)$', re.I)
os.makedirs(TUJUAN, exist_ok=True)
hasil, dipakai, salah = {}, set(), []
for nama in sorted(os.listdir(ASAL)):
    dasar, ext = os.path.splitext(nama)
    if ext.lower() not in ('.jpg', '.jpeg', '.png', '.webp', '.gif'): continue
    m = POLA.match(dasar.strip())
    if not m: salah.append(nama); continue
    kid, bab, sisa = m.group(1).lower(), int(m.group(2)), m.group(3)
    judul, _, ket = (x.strip() for x in sisa.partition('--'))
    kode = hashlib.md5(nama.encode()).hexdigest()[:10]
    out = f'{TUJUAN}/{kid}-{bab:02d}-{kode}.jpg'
    try:
        im = ImageOps.exif_transpose(Image.open(f'{ASAL}/{nama}')).convert('RGB')
        im.thumbnail((1280, 1280))
        im.save(out, 'JPEG', quality=84, optimize=True)
    except Exception as e:
        salah.append(f'{nama} (tidak bisa dibuka: {e})'); continue
    dipakai.add(out)
    hasil.setdefault(f'{kid}-{bab}', []).append({'file': out, 'judul': judul.replace('_', ' '), 'ket': ket.replace('_', ' '), 'guru': True})
for n in os.listdir(TUJUAN):
    if f'{TUJUAN}/{n}' not in dipakai: os.remove(f'{TUJUAN}/{n}')
json.dump(hasil, open('gambar/guru.json', 'w'), ensure_ascii=False, indent=1)
print('gambar guru:', sum(len(v) for v in hasil.values()))
if salah: print('Nama file tidak sesuai format, dilewati:\n  ' + '\n  '.join(salah))
