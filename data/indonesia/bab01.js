TAMBAH_BAB({
  koleksi: "indonesia",
  id: 1,
  judul: "Masa Praaksara",
  sub: "Menggali jejak kehidupan sebelum tulisan",
  tujuan: [
    "Menjelaskan pengertian dan batas akhir masa praaksara di Indonesia",
    "Menjelaskan cara ilmuwan mengetahui kehidupan masa praaksara",
    "Membandingkan corak kehidupan dan hasil budaya tiap zaman",
    "Mengidentifikasi jenis manusia purba dan situs penemuannya di Indonesia",
    "Menganalisis teori asal-usul nenek moyang bangsa Indonesia",
    "Meneladani nilai Panca Cinta dari kehidupan masa praaksara",
    "Menjelaskan periodisasi geologi dan kaitannya dengan kehidupan manusia purba",
    "Mengidentifikasi hasil kebudayaan Pacitan, Ngandong, dan zaman logam"
  ],

  video: {
    src: "video/indonesia/bab01.mp4",
    judul: "Masa Praaksara dalam 2 menit",
    durasi: "2 menit 30 detik",
    catatan: "Video dengan musik latar lembut, tanpa narasi suara; keterangan tampil sebagai teks. Guru dapat membacakan atau mengulas sambil memutar."
  },

  /* Penjelajah interaktif: lapisan tanah. Urutan dari atas (muda) ke bawah (tua). */
  jelajah: {
    judul: "Penampang galian: klik tiap lapisan",
    catatan: "Pembagian lima zaman ini adalah pembagian klasik berdasarkan alat. Arkeolog Indonesia seperti R.P. Soejono lebih memakai pembagian berdasarkan corak hidup: berburu tingkat sederhana, berburu tingkat lanjut, bercocok tanam, dan perundagian.",
    atas: "Permukaan tanah, hari ini",
    lapisan: [
      { n: "Perundagian", t: "Masa logam, ± 500 SM – awal Masehi", c: "#8a5a2b", ikon: "logam",
        d: [["Alat", "Nekara, moko, kapak corong, bejana perunggu, perhiasan"], ["Kehidupan", "Desa makin besar, muncul golongan undagi (tukang terampil), perdagangan antarpulau"], ["Situs", "Nekara Bulan Pejeng (Bali), moko di Alor, Sangeang (NTB)"]],
        ket: "Teknik cetak logam: a cire perdue (cetakan lilin) dan bivalve (cetakan setangkup). Pengaruhnya dari budaya Dongson, Vietnam utara." },
      { n: "Megalitikum", t: "Tradisi batu besar, sejak masa bercocok tanam sampai kini", c: "#6f6a60", ikon: "batu",
        d: [["Alat", "Menhir, dolmen, sarkofagus, kubur batu, waruga, punden berundak, arca"], ["Kehidupan", "Pemujaan roh nenek moyang, kerja bersama dalam jumlah besar"], ["Situs", "Lembah Bada (Sulteng), Pasemah (Sumsel), Gunung Padang (Jabar), waruga Minahasa"]],
        ket: "Tradisi megalitik masih hidup di Nias, Sumba, dan Toraja. Megalitikum adalah tradisi yang berlanjut, bukan zaman yang berhenti." },
      { n: "Neolitikum", t: "Batu muda, di Nusantara ± 4.000 tahun lalu", c: "#5d6b4b", ikon: "kapak",
        d: [["Alat", "Kapak persegi (Indonesia barat), kapak lonjong (Indonesia timur), gerabah, alat tenun"], ["Kehidupan", "Menetap, bercocok tanam, beternak: revolusi neolitik"], ["Situs", "Kendeng Lembu (Jatim), Minanga Sipakko dan Kalumpang (Sulbar)"]],
        ket: "Kapak diasah sampai halus (diupam). Masa ini berkaitan dengan kedatangan penutur bahasa Austronesia." },
      { n: "Mesolitikum", t: "Batu tengah, mulai ± 10.000 tahun lalu", c: "#9a6a3c", ikon: "kerang",
        d: [["Alat", "Kapak Sumatra (pebble), alat tulang, alat serpih, lukisan gua"], ["Kehidupan", "Semi menetap di gua dan pantai, mulai bercocok tanam sederhana"], ["Situs", "Kjokkenmoddinger pantai timur Sumatra, Gua Lawa Sampung (Ponorogo), gua Maros-Pangkep"]],
        ket: "Kjokkenmoddinger berarti sampah dapur: timbunan kulit kerang setinggi beberapa meter, diteliti P.V. van Stein Callenfels pada 1925." },
      { n: "Paleolitikum", t: "Batu tua, > 1,5 juta – ± 10.000 tahun lalu", c: "#7a3f22", ikon: "genggam",
        d: [["Alat", "Kapak perimbas (chopper), kapak genggam, alat serpih (flakes)"], ["Kehidupan", "Berburu dan mengumpulkan makanan, berpindah-pindah, mengenal api"], ["Situs", "Pacitan (Jatim), Ngandong (Ngawi), Sangiran (Sragen)"]],
        ket: "Kebudayaan Pacitan diteliti G.H.R. von Koenigswald pada 1935. Alatnya masih kasar, belum diasah." }
    ]
  },

  bagian: [
    { judul: "A. Apa itu praaksara?",
      isi: `<p><b>Praaksara</b> berasal dari kata <i>pra</i> (sebelum) dan <i>aksara</i> (tulisan). Masa praaksara adalah masa ketika manusia belum mengenal tulisan. Istilah lamanya "prasejarah", tetapi istilah itu kurang tepat: manusia yang belum menulis pun tetap punya sejarah.</p>
<p>Di Indonesia, masa praaksara berakhir sekitar abad ke-5 Masehi, ketika Kerajaan Kutai di Kalimantan Timur meninggalkan prasasti <b>Yupa</b>. Setiap wilayah keluar dari masa praaksara pada waktu berbeda. Mesir sudah menulis sekitar 3000 SM, jauh sebelum Nusantara.</p>`,
      cinta: null },
    { judul: "B. Bagaimana kita mengetahuinya?",
      isi: `<p>Tanpa tulisan, sejarawan bekerja seperti detektif. Mereka membaca <b>fosil</b> (sisa makhluk hidup yang membatu), <b>artefak</b> (benda buatan manusia), dan <b>lapisan tanah</b>. Hukum dasarnya disebut <b>hukum superposisi</b>: pada lapisan yang tidak terganggu, lapisan bawah lebih tua daripada lapisan atas.</p>
<table><thead><tr><th>Ilmu bantu</th><th>Yang dipelajari</th></tr></thead><tbody>
<tr><td>Arkeologi</td><td>Artefak, situs, dan bekas aktivitas manusia</td></tr>
<tr><td>Paleoantropologi</td><td>Fosil manusia purba dan perubahan fisiknya</td></tr>
<tr><td>Geologi</td><td>Lapisan bumi dan umur batuan</td></tr>
<tr><td>Paleontologi</td><td>Fosil hewan dan tumbuhan purba</td></tr>
<tr><td>Penanggalan radiometrik</td><td>Umur benda dari peluruhan unsur, misalnya karbon-14 atau uranium</td></tr>
</tbody></table>`,
      cinta: ["Cinta ilmu", "Arkeolog bisa menggali satu situs selama puluhan tahun dengan kuas kecil supaya tidak ada jejak yang rusak. Kesabaran dan ketelitian adalah bagian dari mencintai ilmu."] },
    { judul: "C. Kehidupan manusia praaksara",
      isi: `<h4>Masa berburu dan mengumpulkan makanan</h4>
<p>Manusia hidup berpindah (nomaden) dalam kelompok kecil, mengikuti hewan buruan dan musim buah. Corak ini disebut <i>food gathering</i>. Tempat tinggalnya gua dan ceruk batu (<i>abris sous roche</i>). Api sudah dikenal untuk memasak, menghangatkan badan, dan mengusir hewan.</p>
<p>Di Sulawesi Selatan, manusia masa itu meninggalkan lukisan gua. Lukisan di Leang Karampuang, Maros, berumur sekurang-kurangnya <b>51.200 tahun</b> dan menggambarkan manusia bersama babi (Oktaviana dkk., <i>Nature</i>, 2024). Ini salah satu lukisan bercerita tertua di dunia.</p>
<h4>Masa bercocok tanam: revolusi neolitik</h4>
<p>Perubahan dari mencari makanan menjadi menghasilkan makanan (<i>food producing</i>) disebut <b>revolusi neolitik</b>, istilah dari arkeolog V. Gordon Childe. Manusia mulai menetap, membuka ladang, beternak, membuat gerabah, dan menenun.</p>
<p>Hidup menetap melahirkan aturan bersama, pemimpin yang dipilih karena dianggap paling mampu (<i>primus inter pares</i>), dan gotong royong. Muncul pula kepercayaan <b>animisme</b> (percaya pada roh nenek moyang) dan <b>dinamisme</b> (percaya pada kekuatan gaib dalam benda).</p>
<h4>Masa perundagian</h4>
<p>Manusia pandai mengolah logam. Muncul golongan <b>undagi</b>, yaitu tukang yang terampil. Masyarakat makin teratur dan perdagangan antarpulau berkembang.</p>`,
      cinta: ["Cinta sesama dan lingkungan", "Manusia praaksara bertahan hidup karena membaca alam dengan cermat dan bekerja bersama. Mendirikan satu menhir butuh puluhan orang. Gotong royong yang kita kenal hari ini punya akar yang sangat tua."] },
    { judul: "D. Manusia purba di Indonesia",
      isi: `<p>Indonesia adalah salah satu kawasan terpenting di dunia untuk penelitian manusia purba. Situs <b>Sangiran</b> di Sragen, Jawa Tengah, ditetapkan UNESCO sebagai Warisan Dunia pada 1996. Kartu di bawah merangkum temuan utama.</p>
<p class="catatan">Catatan ilmiah: penemuan baru terus memperbarui pengetahuan. Misalnya, sebagian peneliti kini meragukan Meganthropus sebagai manusia purba dan menganggapnya kera besar. Ilmu memang terbuka untuk dikoreksi oleh bukti baru.</p>`,
      kartu: true,
      cinta: ["Cinta tanah air", "Situs purba adalah warisan bangsa yang diakui dunia. Menjaganya, tidak merusak dan tidak menjual temuan, adalah bentuk cinta tanah air."] },
    { judul: "E. Periodisasi berdasarkan geologi",
      isi: "<p>Sebelum membahas manusia, para ahli membagi sejarah bumi berdasarkan lapisan batuan dan fosil yang ditemukan di dalamnya. Pembagian ini disebut <b>periodisasi geologi</b>.</p>\n<table><thead><tr><th>Zaman</th><th>Waktu (perkiraan)</th><th>Ciri utama</th></tr></thead><tbody>\n<tr><td><b>Arkaikum</b> (zaman tertua)</td><td>± 4,5–2,5 miliar tahun lalu</td><td>Kulit bumi masih panas; belum ada kehidupan atau baru kehidupan sangat sederhana</td></tr>\n<tr><td><b>Paleozoikum</b> (zaman primer)</td><td>± 540–250 juta tahun lalu</td><td>Muncul ikan, amfibi, reptil awal, dan tumbuhan paku</td></tr>\n<tr><td><b>Mesozoikum</b> (zaman sekunder)</td><td>± 250–66 juta tahun lalu</td><td>Zaman reptil raksasa (dinosaurus); muncul burung dan mamalia kecil</td></tr>\n<tr><td><b>Neozoikum: Tersier</b></td><td>± 66–2,6 juta tahun lalu</td><td>Mamalia berkembang pesat; muncul kera besar</td></tr>\n<tr><td><b>Neozoikum: Kuarter</b></td><td>± 2,6 juta tahun lalu–sekarang</td><td>Zaman manusia. Terbagi menjadi <b>Pleistosen</b> (Dilluvium, zaman es) dan <b>Holosen</b> (Alluvium, sejak ± 11.700 tahun lalu)</td></tr>\n</tbody></table>\n<p>Manusia purba di Indonesia hidup pada masa <b>Pleistosen</b>. Pada zaman es, permukaan laut turun sehingga Sumatra, Jawa, dan Kalimantan menyatu dengan daratan Asia sebagai <b>Paparan Sunda</b>, sedangkan Papua menyatu dengan Australia sebagai <b>Paparan Sahul</b>. Karena itulah manusia dan hewan dapat berpindah dari daratan Asia ke Nusantara. Fauna di bagian barat Indonesia mirip fauna Asia, dan di bagian timur mirip fauna Australia; batas keduanya dikenal sebagai <b>Garis Wallace</b>.</p>",
      cinta: ["Cinta lingkungan", "Bumi kita terbentuk dalam waktu yang sangat panjang. Menjaga alam berarti menghormati proses jutaan tahun yang membuat bumi layak dihuni."] },
    { judul: "F. Kebudayaan Pacitan, Ngandong, dan zaman logam",
      isi: "<p>Hasil budaya manusia praaksara sering dinamai menurut tempat penemuannya.</p>\n<ul>\n<li><b>Kebudayaan Pacitan</b> (Jawa Timur): alat batu kasar seperti <b>kapak genggam</b> (<i>chopper</i>) dan kapak perimbas. Diteliti oleh von Koenigswald pada 1935. Pendukungnya diduga Pithecanthropus.</li>\n<li><b>Kebudayaan Ngandong</b> (Ngawi, Jawa Timur): <b>alat tulang</b> dan tanduk rusa, serta <b>flakes</b> (alat serpih) dari batu kalsedon. Pendukungnya diduga Homo soloensis.</li>\n<li><b>Kebudayaan Bacson-Hoabinh</b> (Vietnam): asal kebudayaan mesolitikum, misalnya <b>kapak Sumatra</b> (pebble) dan <b>kjokkenmoddinger</b> (sampah dapur kerang) di pantai timur Sumatra.</li>\n<li><b>Kebudayaan Dongson</b> (Vietnam): asal kebudayaan logam di Nusantara.</li>\n</ul>\n<p>Pada <b>zaman logam</b> (masa perundagian), manusia mengenal perunggu dan besi. Benda logamnya antara lain:</p>\n<ul>\n<li><b>Nekara</b>: genderang perunggu besar untuk upacara memanggil hujan, misalnya Nekara Bulan Pejeng di Bali. Nekara kecil dan ramping dari Alor disebut <b>moko</b>, dipakai sebagai mas kawin.</li>\n<li><b>Kapak corong</b> (kapak sepatu) dan <b>candrasa</b> (kapak upacara berhias).</li>\n<li><b>Bejana perunggu</b>, <b>arca perunggu</b>, dan <b>perhiasan</b> seperti gelang, cincin, dan kalung.</li>\n</ul>\n<p>Logam dicetak dengan dua teknik: <b>bivalve</b> (cetakan setangkup dari batu yang dapat dipakai berulang kali) dan <b>a cire perdue</b> (cetakan lilin yang dibungkus tanah liat, lalu lilinnya dilelehkan; cetakan hanya sekali pakai).</p>",
      cinta: ["Cinta ilmu", "Kemampuan mengolah logam menunjukkan nenek moyang kita cerdas dan kreatif. Kecerdasan itu warisan yang patut kita lanjutkan dengan rajin belajar dan berkarya."] },
    { judul: "G. Asal-usul nenek moyang bangsa Indonesia",
      isi: `<p>Pendapat yang paling banyak didukung bukti saat ini adalah teori <b>Out of Taiwan</b> (Peter Bellwood). Penutur bahasa Austronesia bergerak dari Taiwan ke Filipina, lalu masuk ke Sulawesi dan Kalimantan sekitar 4.000 tahun lalu, membawa padi, gerabah, dan kapak batu yang diupam halus. Buktinya berasal dari bahasa, arkeologi, dan DNA.</p>
<p>Sebelum mereka datang, Nusantara sudah dihuni manusia modern yang tiba sekitar 50.000 tahun lalu, leluhur penduduk Papua dan Melanesia. Para pendatang dan penghuni lama kemudian berbaur.</p>
<p>Teori lain, <b>Out of Sundaland</b> (Stephen Oppenheimer), berpendapat leluhur justru berasal dari Paparan Sunda yang tenggelam akibat naiknya permukaan laut. Buku lama juga menyebut gelombang <b>Proto-Melayu</b> dan <b>Deutro-Melayu</b>; pembagian itu kini dianggap terlalu sederhana, tetapi masih sering muncul dalam soal.</p>`,
      cinta: ["Cinta kepada Allah", "Dalam QS Al-Hujurat ayat 13, Allah menjadikan manusia berbangsa-bangsa dan bersuku-suku supaya saling mengenal. Keragaman asal-usul kita bukan alasan untuk saling merendahkan, tetapi bekal untuk saling mengenal sebagai satu bangsa."] }
  ],

  kartu: [
    { nama: "Meganthropus palaeojavanicus", info: "Sangiran, 1941", isi: "Ditemukan G.H.R. von Koenigswald berupa rahang yang sangat besar, dijuluki 'manusia raksasa dari Jawa'. Rahang kuat menunjukkan makanan utama tumbuhan. Statusnya kini diperdebatkan." },
    { nama: "Pithecanthropus erectus", info: "Trinil, Ngawi, 1891", isi: "Ditemukan Eugène Dubois: atap tengkorak, geraham, dan tulang paha. Namanya berarti manusia kera yang berjalan tegak. Kini digolongkan sebagai Homo erectus." },
    { nama: "Homo soloensis", info: "Ngandong, 1931–1933", isi: "Belasan tengkorak ditemukan di tepi Bengawan Solo oleh Ter Haar dan Oppenoorth. Penanggalan terbaru (Rizal dkk., 2020): ± 117.000–108.000 tahun lalu." },
    { nama: "Homo floresiensis", info: "Liang Bua, Flores, 2003", isi: "Ditemukan tim peneliti Indonesia dan Australia. Tinggi ± 1 meter, dijuluki 'hobbit'. Fosilnya berumur ± 100.000–60.000 tahun lalu (Sutikna dkk., 2016)." },
    { nama: "Homo wajakensis", info: "Wajak, Tulungagung, 1889", isi: "Diteliti Eugène Dubois. Sudah termasuk Homo sapiens, manusia modern seperti kita. Penanggalan terbaru: ± 37.000–28.000 tahun lalu." }
  ],

  glosarium: [
    ["Artefak", "Benda hasil buatan manusia, misalnya kapak batu dan gerabah"],
    ["Fosil", "Sisa makhluk hidup yang telah membatu"],
    ["Abris sous roche", "Gua atau ceruk batu yang dijadikan tempat tinggal"],
    ["Kjokkenmoddinger", "Timbunan sampah kulit kerang dan siput, 'sampah dapur'"],
    ["Menhir", "Tugu batu tegak untuk pemujaan roh nenek moyang"],
    ["Dolmen", "Meja batu tempat sesaji, kadang di atas kubur"],
    ["Sarkofagus", "Peti mayat dari batu, berbentuk seperti lesung bertutup"],
    ["Punden berundak", "Bangunan bertingkat untuk pemujaan, cikal bakal bentuk candi"],
    ["Nekara", "Genderang perunggu berpinggang, dipakai dalam upacara"],
    ["Undagi", "Golongan tukang terampil pada masa perundagian"],
    ["Animisme", "Kepercayaan pada roh nenek moyang"],
    ["Dinamisme", "Kepercayaan pada kekuatan gaib dalam benda"],
    ["Pleistosen", "Kala zaman es pada awal zaman Kuarter, masa hidup manusia purba"],
    ["Holosen", "Kala sejak ± 11.700 tahun lalu sampai sekarang (Alluvium)"],
    ["Paparan Sunda", "Daratan yang menyatukan Indonesia barat dengan Asia pada zaman es"],
    ["Paparan Sahul", "Daratan yang menyatukan Papua dengan Australia pada zaman es"],
    ["Chopper", "Kapak genggam/perimbas dari kebudayaan Pacitan"],
    ["Flakes", "Alat serpih dari batu"],
    ["Moko", "Nekara kecil dari Alor yang dipakai sebagai mas kawin"],
    ["Bivalve", "Teknik cetak logam dengan cetakan batu setangkup"],
    ["A cire perdue", "Teknik cetak logam dengan cetakan lilin yang sekali pakai"]
  ],

  /* Soal pilihan ganda. a = indeks jawaban benar (0 = A). s = stimulus (opsional). l = level kognitif. */
  soal: [
    { q: "Seorang arkeolog menemukan kapak batu yang sudah diasah halus di sebuah bukit, bersama sisa tembikar dan biji padi. Temuan itu paling tepat digolongkan ke zaman…", o: ["Paleolitikum", "Mesolitikum", "Neolitikum", "Megalitikum", "Perundagian"], a: 2, l: "C3", p: "Kapak yang diasah halus, tembikar, dan sisa pertanian adalah ciri Neolitikum (masa bercocok tanam)." },
    { q: "Kelasmu ingin membuat pameran mini tentang masa praaksara untuk adik kelas. Rancangan pameran yang paling tepat adalah…", o: ["memajang foto artis yang berpakaian zaman purba", "menyusun alur ruang dari Paleolitikum sampai Perundagian, disertai replika alat, peta situs, dan keterangan singkat", "menampilkan daftar nama manusia purba tanpa penjelasan", "membuat lomba menggambar bebas tanpa tema", "memutar film fiksi tentang dinosaurus"], a: 1, l: "C6", p: "Pameran yang baik disusun kronologis, memakai bukti (replika, peta situs), dan memberi penjelasan." },
    { q: "Kamu diminta menulis cerita bergambar tentang sehari-hari keluarga pada masa bercocok tanam. Isi cerita yang paling sesuai dengan fakta sejarah adalah…", o: ["keluarga berburu mamut lalu pindah setiap minggu", "keluarga membaca prasasti di candi", "keluarga berdagang dengan pedagang Portugis", "keluarga tinggal menetap, menanam padi, beternak, membuat gerabah, dan bergotong royong membangun rumah panggung", "keluarga bekerja di pabrik logam"], a: 3, l: "C6", p: "Masa bercocok tanam ditandai hidup menetap, pertanian, peternakan, gerabah, dan gotong royong." },
    { q: "Manusia purba di Indonesia hidup pada kala…", o: ["Arkaikum", "Paleozoikum", "Mesozoikum", "Pleistosen", "Tersier"], a: 3, l: "C1", p: "Pleistosen (Dilluvium) adalah bagian awal zaman Kuarter, ketika manusia purba hidup dan terjadi zaman es." },
    { q: "Pada zaman es, Sumatra, Jawa, dan Kalimantan menyatu dengan daratan Asia membentuk…", o: ["Paparan Sahul", "Paparan Sunda", "Garis Wallace", "Lempeng Pasifik", "Dataran Tinggi Dieng"], a: 1, l: "C1", p: "Turunnya permukaan laut membuat Indonesia bagian barat menyatu dengan Asia sebagai Paparan Sunda." },
    { s: "Pada zaman es, permukaan laut turun hingga lebih dari 100 meter. Selat-selat dangkal di antara Sumatra, Jawa, Kalimantan, dan daratan Asia berubah menjadi daratan.", q: "Kesimpulan yang paling tepat dari kenyataan tersebut adalah…", o: ["manusia purba datang ke Nusantara dengan kapal besar", "hewan dan manusia purba dapat berjalan kaki dari daratan Asia ke Jawa", "Indonesia tidak pernah dihuni manusia purba", "Papua menyatu dengan Asia", "zaman es terjadi pada masa Mesozoikum"], a: 1, l: "C4", p: "Daratan yang menyatu memungkinkan perpindahan manusia dan hewan melalui darat." },
    { q: "Alat tulang dan tanduk rusa serta alat serpih (flakes) merupakan ciri kebudayaan…", o: ["Pacitan", "Ngandong", "Dongson", "Bacson-Hoabinh", "Bali"], a: 1, l: "C1", p: "Kebudayaan Ngandong di Ngawi menghasilkan alat tulang, tanduk rusa, dan flakes." },
    { q: "Nekara berukuran kecil dan ramping dari Alor yang dipakai sebagai mas kawin disebut…", o: ["candrasa", "moko", "menhir", "waruga", "dolmen"], a: 1, l: "C1", p: "Moko adalah nekara kecil dari Alor, NTT, yang sampai kini masih bernilai adat." },
    { q: "Teknik pembuatan benda logam dengan cetakan batu setangkup yang dapat dipakai berulang kali disebut…", o: ["a cire perdue", "bivalve", "tempa", "upam", "serpih"], a: 1, l: "C2", p: "Bivalve memakai dua cetakan yang dapat dipakai lagi, berbeda dengan a cire perdue yang sekali pakai." },
    { q: "Kebudayaan logam di Nusantara diperkirakan berasal dari kebudayaan…", o: ["Pacitan", "Ngandong", "Dongson di Vietnam", "Mohenjo-daro", "Mesopotamia"], a: 2, l: "C1", p: "Kebudayaan Dongson di Vietnam utara dianggap asal kebudayaan perunggu di Asia Tenggara." },
    { q: "Masa praaksara di Indonesia dianggap berakhir dengan ditemukannya…", o: ["Prasasti Yupa dari Kutai", "Candi Borobudur", "Nekara Bulan Pejeng", "Fosil di Sangiran", "Prasasti Ciaruteun"], a: 0, l: "C1", p: "Prasasti Yupa (abad ke-5 M) adalah bukti tulisan tertua di Indonesia, menandai akhir masa praaksara." },
    { q: "Istilah 'praaksara' dianggap lebih tepat daripada 'prasejarah' karena…", o: ["lebih mudah diucapkan", "manusia tanpa tulisan pun tetap memiliki sejarah", "dipakai oleh ilmuwan Eropa", "masa itu belum ada manusia", "tulisan sudah ada tetapi belum ditemukan"], a: 1, l: "C2", p: "Sejarah adalah kehidupan manusia di masa lalu. Yang belum ada hanyalah tulisan, bukan sejarahnya." },
    { s: "Dalam sebuah galian yang lapisannya tidak terganggu, arkeolog menemukan kapak persegi pada kedalaman 1 meter dan kapak perimbas pada kedalaman 4 meter.", q: "Kesimpulan yang paling tepat dari temuan tersebut adalah…", o: ["Kapak persegi lebih tua daripada kapak perimbas", "Kedua kapak dibuat pada masa yang sama", "Kapak perimbas lebih tua daripada kapak persegi", "Kapak persegi dibawa dari luar negeri", "Umur kapak tidak dapat diperkirakan sama sekali"], a: 2, l: "C4", p: "Menurut hukum superposisi, pada lapisan yang tidak terganggu, lapisan yang lebih dalam lebih tua. Ini juga cocok dengan urutan zaman: perimbas (Paleolitikum) lebih tua dari kapak persegi (Neolitikum)." },
    { q: "Ilmu yang khusus mempelajari fosil manusia purba disebut…", o: ["Arkeologi", "Geologi", "Paleontologi", "Paleoantropologi", "Epigrafi"], a: 3, l: "C1", p: "Paleoantropologi mempelajari fosil manusia purba. Paleontologi mempelajari fosil hewan dan tumbuhan." },
    { q: "Timbunan kulit kerang di pantai timur Sumatra disebut…", o: ["Abris sous roche", "Punden berundak", "Kjokkenmoddinger", "Sarkofagus", "Waruga"], a: 2, l: "C1", p: "Kjokkenmoddinger (bahasa Denmark) berarti sampah dapur, peninggalan masa Mesolitikum." },
    { q: "Gua Lawa di Sampung, Ponorogo, merupakan contoh…", o: ["kjokkenmoddinger", "abris sous roche", "punden berundak", "kubur peti batu", "situs perundagian"], a: 1, l: "C2", p: "Abris sous roche adalah gua atau ceruk batu yang dijadikan tempat tinggal. Gua Lawa diteliti van Stein Callenfels pada 1928–1931." },
    { q: "Revolusi neolitik adalah perubahan dari…", o: ["alat batu ke alat logam", "food gathering ke food producing", "hidup di gua ke hidup di istana", "animisme ke dinamisme", "masa praaksara ke masa aksara"], a: 1, l: "C2", p: "Manusia beralih dari mencari makanan menjadi menghasilkan makanan, lalu mulai hidup menetap." },
    { q: "Kapak lonjong banyak ditemukan di wilayah…", o: ["Indonesia barat", "Indonesia timur", "Jawa saja", "Sumatra saja", "seluruh Indonesia secara merata"], a: 1, l: "C1", p: "Kapak persegi dominan di Indonesia barat, kapak lonjong di Indonesia timur, misalnya Papua dan Maluku." },
    { q: "Hasil kebudayaan Pacitan yang diteliti von Koenigswald (1935) terutama berupa…", o: ["nekara perunggu", "kapak perimbas (chopper)", "kapak persegi yang diupam", "gerabah berhias", "menhir"], a: 1, l: "C1", p: "Kebudayaan Pacitan menghasilkan kapak perimbas dan kapak genggam yang masih kasar, ciri Paleolitikum." },
    { q: "Fosil Pithecanthropus erectus pertama kali ditemukan oleh Eugène Dubois di…", o: ["Sangiran", "Trinil", "Ngandong", "Wajak", "Liang Bua"], a: 1, l: "C1", p: "Dubois menemukannya di Trinil, Ngawi, pada 1891." },
    { q: "Homo floresiensis ditemukan pada tahun 2003 di…", o: ["Trinil", "Sangiran", "Liang Bua", "Wajak", "Gua Lawa"], a: 2, l: "C1", p: "Liang Bua di Flores, oleh tim peneliti Indonesia dan Australia." },
    { q: "Di antara manusia purba berikut, yang sudah tergolong Homo sapiens adalah…", o: ["Meganthropus palaeojavanicus", "Pithecanthropus erectus", "Homo soloensis", "Homo wajakensis", "Pithecanthropus mojokertensis"], a: 3, l: "C2", p: "Homo wajakensis sudah termasuk manusia modern (Homo sapiens)." },
    { q: "Situs Sangiran ditetapkan sebagai Warisan Dunia oleh UNESCO pada tahun…", o: ["1945", "1971", "1991", "1996", "2004"], a: 3, l: "C1", p: "Sangiran Early Man Site ditetapkan UNESCO pada 1996." },
    { q: "Menurut teori Out of Taiwan, penutur bahasa Austronesia mulai masuk ke Nusantara sekitar…", o: ["400 tahun lalu", "4.000 tahun lalu", "40.000 tahun lalu", "400.000 tahun lalu", "1,5 juta tahun lalu"], a: 1, l: "C1", p: "Sekitar 4.000 tahun lalu, melalui Filipina ke Sulawesi dan Kalimantan." },
    { s: "Dulu Homo soloensis diperkirakan berumur sekitar 550.000 tahun. Penelitian tahun 2020 dengan beberapa metode penanggalan menunjukkan umurnya sekitar 117.000–108.000 tahun.", q: "Pernyataan yang paling tepat berdasarkan informasi tersebut adalah…", o: ["Penelitian lama pasti salah dan harus dihapus dari buku", "Pengetahuan sejarah dapat diperbarui ketika muncul bukti dan metode baru", "Umur fosil tidak penting dalam sejarah", "Homo soloensis lebih tua dari Pithecanthropus", "Penanggalan radiometrik tidak dapat dipercaya"], a: 1, l: "C5", p: "Ilmu sejarah bersifat terbuka: kesimpulan dapat direvisi ketika ada bukti dan metode yang lebih baik." },
    { q: "Lukisan gua di Leang Karampuang, Maros, penting bagi dunia karena…", o: ["dibuat pada masa penjajahan Belanda", "termasuk lukisan bercerita tertua di dunia, ± 51.200 tahun", "menggambarkan bangunan candi", "ditulis dengan aksara Pallawa", "ditemukan di dasar laut"], a: 1, l: "C2", p: "Penelitian 2024 menunjukkan umurnya sekurang-kurangnya 51.200 tahun, menggambarkan manusia bersama babi." },
    { q: "Fungsi utama menhir pada masa megalitikum adalah…", o: ["tempat menyimpan padi", "sarana pemujaan roh nenek moyang", "alat untuk berburu", "batas wilayah kerajaan", "tempat tinggal kepala suku"], a: 1, l: "C2", p: "Menhir adalah tugu batu tegak yang dipakai dalam pemujaan roh nenek moyang." },
    { q: "Teknik a cire perdue dalam pembuatan benda logam artinya…", o: ["teknik cetakan setangkup dari batu", "teknik cetakan lilin yang hilang", "teknik menempa logam panas", "teknik mengasah logam", "teknik mewarnai logam"], a: 1, l: "C2", p: "Model dibuat dari lilin, dibungkus tanah liat, lalu dipanaskan sehingga lilin mencair dan diganti logam cair." },
    { q: "Nekara perunggu terbesar di Indonesia, dikenal sebagai 'Bulan Pejeng', berada di…", o: ["Alor", "Bali", "Sumbawa", "Jawa Barat", "Sulawesi Tengah"], a: 1, l: "C1", p: "Nekara Bulan Pejeng tersimpan di Pura Penataran Sasih, Gianyar, Bali." },
    { s: "Di Nias, tradisi lompat batu masih dilakukan. Di Sumba, sebagian masyarakat masih membangun kubur batu besar untuk keluarga yang meninggal.", q: "Fakta tersebut paling tepat menunjukkan bahwa…", o: ["masa praaksara belum berakhir di Indonesia", "tradisi megalitik berlanjut hingga masa kini", "masyarakat Nias dan Sumba belum mengenal tulisan", "batu besar hanya dipakai untuk olahraga", "budaya megalitik berasal dari Eropa"], a: 1, l: "C4", p: "Megalitikum adalah tradisi yang berlanjut. Masyarakat yang sudah mengenal tulisan pun dapat melanjutkan tradisi batu besar." }
  ],

  esai: [
    { q: "Jelaskan dampak revolusi neolitik terhadap kehidupan sosial masyarakat praaksara! Berikan minimal tiga dampak.",
      rubrik: ["4: menyebut ≥3 dampak (menetap, pembagian kerja, pemimpin/aturan, gotong royong, kepercayaan) dengan penjelasan sebab-akibat", "3: menyebut 3 dampak tanpa penjelasan lengkap", "2: menyebut 1–2 dampak", "1: jawaban tidak relevan"] },
    { q: "Bandingkan teori Out of Taiwan dan Out of Sundaland. Menurutmu, teori mana yang didukung bukti lebih kuat? Jelaskan alasanmu.",
      rubrik: ["4: menjelaskan isi kedua teori, membandingkan bukti (bahasa, arkeologi, DNA), dan memberi pendapat beralasan", "3: menjelaskan kedua teori dan memberi pendapat tanpa bukti yang jelas", "2: hanya menjelaskan satu teori", "1: jawaban tidak relevan"] },
    { q: "Kaitkan keragaman asal-usul nenek moyang bangsa Indonesia dengan pesan QS Al-Hujurat ayat 13. Bagaimana sikapmu terhadap teman yang berbeda suku?",
      rubrik: ["4: menghubungkan fakta pembauran nenek moyang dengan pesan saling mengenal, dan memberi contoh sikap nyata", "3: menghubungkan keduanya tanpa contoh sikap", "2: hanya membahas salah satu", "1: jawaban tidak relevan"] },
    { q: "Rancanglah sebuah poster garis waktu masa praaksara di Indonesia (Paleolitikum sampai Perundagian). Tuliskan isi tiap tahap: ciri kehidupan, alat, dan satu situs penemuannya, lalu satu nilai Panca Cinta yang dapat diteladani.",
      rubrik: ["4: lima tahap lengkap dan runtut, masing-masing memuat ciri, alat, situs yang tepat, serta nilai yang relevan", "3: lima tahap runtut dengan sedikit kekeliruan atau tanpa nilai", "2: hanya sebagian tahap atau urutan keliru", "1: jawaban tidak sesuai atau tidak dikerjakan"], l: "C6" }
  ]
});
