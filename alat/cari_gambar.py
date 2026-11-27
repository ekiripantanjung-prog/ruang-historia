"""Cari foto berlisensi terbuka di Wikimedia Commons untuk setiap bab, unduh versi kecilnya,
lalu tulis daftar sumber dan lisensinya ke gambar/daftar.json.
Dijalankan oleh GitHub Actions (alur kerja 'Cari gambar')."""
import json, os, re, time, urllib.parse, urllib.request

API = 'https://commons.wikimedia.org/w/api.php'
UA = {'User-Agent': 'RuangHistoria/1.0 (aplikasi belajar sejarah madrasah; github.com/ekiripantanjung-prog/ruang-historia)'}
BOLEH = re.compile(r'^(public domain|pd|cc0|cc by(-sa)? ?\d|cc-by(-sa)?-\d|attribution|gfdl)', re.I)
DILARANG = re.compile(r'\b(nc|nd|fair use|non-free)\b', re.I)
# hindari foto orang (kebijakan aplikasi: tampilkan artefak, situs, dokumen, bukan potret tokoh)
ORANG = re.compile(r'portrait|potret|pilgrim|people|crowd|president|presiden|soldier|tentara|patung|statue|selfie|wisatawan|tourist|sahkan|interview|wawancara|\bman\b|\bwoman\b', re.I)

def api(params):
    params = dict(params, format='json', formatversion=2)
    url = API + '?' + urllib.parse.urlencode(params)
    for _ in range(3):
        try:
            time.sleep(0.6)  # sopan pada server Commons, menghindari pembatasan
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return json.load(r)
        except Exception as e:
            err = e; time.sleep(10)
    raise err

def bersih(html):
    t = re.sub(r'<[^>]+>', '', html or '')
    return re.sub(r'\s+', ' ', t).strip()[:300]

def info_berkas(judul):
    d = api({'action': 'query', 'titles': judul, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|mime|size', 'iiurlwidth': 960})
    p = d['query']['pages'][0]
    if p.get('missing') or 'imageinfo' not in p: return None
    ii = p['imageinfo'][0]; m = ii.get('extmetadata', {})
    g = lambda k: bersih(m.get(k, {}).get('value', ''))
    return {'berkas': p['title'], 'thumb': ii.get('thumburl'), 'mime': ii.get('mime'), 'lebar': ii.get('width', 0),
            'lisensi': g('LicenseShortName'), 'pembuat': g('Artist') or g('Credit'), 'keterangan': g('ImageDescription'),
            'tanggal': g('DateTimeOriginal'), 'halaman': ii.get('descriptionurl')}

def cocok(f):
    return (f and f['thumb'] and f['mime'] in ('image/jpeg', 'image/png') and f['lebar'] >= 500
            and BOLEH.search(f['lisensi'] or '') and not DILARANG.search(f['lisensi'] or ''))

def cari(q, wajib=None, hindari=None):
    if q.startswith('File:'):
        f = info_berkas(q); return f if cocok(f) else None
    for kata in (q + ' filetype:bitmap', q):
        d = api({'action': 'query', 'list': 'search', 'srsearch': kata, 'srnamespace': 6, 'srlimit': 12})
        for h in d['query']['search']:
            if ORANG.search(h['title']) or (wajib and not re.search(wajib, h['title'], re.I)) or (hindari and re.search(hindari, h['title'], re.I)): continue
            f = info_berkas(h['title'])
            if cocok(f): return f
    return None

def unduh(url, nama):
    for _ in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                data = r.read()
            if len(data) > 2000:
                open(nama, 'wb').write(data); return True
        except Exception as e:
            print('gagal unduh', url, e); time.sleep(8)
    return False

def main():
    minta = json.load(open('alat/permintaan_gambar.json'))
    lama = {}
    try: lama = json.load(open('gambar/daftar.json'))
    except Exception: pass
    hasil = {}
    for kunci, daftar in minta.items():
        k, n = kunci.split('-'); n = int(n)
        os.makedirs(f'gambar/{k}', exist_ok=True)
        keluaran = []
        sebelumnya = {x['judul']: x for x in lama.get(kunci, [])}
        for i, item in enumerate(daftar):
            nama = f'gambar/{k}/bab{n:02d}-{i + 1}.jpg'
            x = sebelumnya.get(item['judul'])
            # pakai ulang hasil lama bila sama dan berkasnya masih ada (hemat waktu)
            if x and not item.get('ulang') and os.path.exists(x['file']) and x['berkas'] == (item['cari'][0] if item['cari'][0].startswith('File:') else x['berkas']):
                if x['file'] != nama:
                    os.replace(x['file'], nama + '.tmp'); x = dict(x, file=nama, _pindah=True)
                keluaran.append(dict(x, ket=item.get('ket', x.get('ket', ''))))
                continue
            f = None
            for q in item['cari']:
                try: f = cari(q, item.get('wajib'), item.get('hindari'))
                except Exception as e: print('gagal', q, e)
                if f: break
            if not f:
                print('TIDAK KETEMU', kunci, item['judul']); continue
            if not unduh(f['thumb'], nama + '.tmp'):
                print('LEWATI (gagal unduh)', kunci, item['judul']); continue
            keluaran.append(dict(f, file=nama, judul=item['judul'], ket=item.get('ket', ''), _pindah=True))
            print('OK', kunci, item['judul'], '->', f['berkas'], '|', f['lisensi'])
            time.sleep(0.5)
        hasil[kunci] = keluaran
    for v in hasil.values():
        for x in v:
            if x.pop('_pindah', False): os.replace(x['file'] + '.tmp', x['file'])
    # hapus berkas lama yang tidak lagi dipakai (folder guru/ tidak disentuh)
    pakai = {x['file'] for v in hasil.values() for x in v}
    for k in ('indonesia', 'dunia', 'ski'):
        if os.path.isdir(f'gambar/{k}'):
            for n in os.listdir(f'gambar/{k}'):
                if f'gambar/{k}/{n}' not in pakai: os.remove(f'gambar/{k}/{n}')
    json.dump(hasil, open('gambar/daftar.json', 'w'), ensure_ascii=False, indent=1)
    print('selesai:', sum(len(v) for v in hasil.values()), 'gambar')

main()
