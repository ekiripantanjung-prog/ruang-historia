/* RUANG HISTORIA — daftar koleksi dan bab.
   Setiap koleksi adalah satu "ruang" (mata pelajaran). Bab yang sudah punya file data
   otomatis terbuka; yang belum tampil sebagai "Segera hadir".

   Menambah bab:     buat data/<koleksi>/babNN.js (salin pola data/indonesia/bab01.js),
                     lalu tambahkan <script src="data/<koleksi>/babNN.js"></script> di index.html.
   Menambah koleksi: tambahkan satu objek baru ke daftar di bawah. */
window.KOLEKSI = [
  {
    id: "indonesia", judul: "Sejarah Indonesia", warna: "#7a3f22",
    ringkas: "Dari manusia purba sampai Reformasi",
    awal: "± 1,5 juta tahun lalu", akhir: "hari ini",
    bab: [
      { id: 1,  judul: "Masa Praaksara", ringkas: "Manusia purba, zaman batu dan logam, asal-usul nenek moyang", warna: "#7a3f22", masa: "± 1,5 juta tahun lalu – abad ke-5 M" },
      { id: 2,  judul: "Masa Hindu-Buddha", ringkas: "Teori masuknya pengaruh India, Kutai sampai Majapahit", warna: "#9a6a1c", masa: "abad ke-4 – ke-16 M" },
      { id: 3,  judul: "Masa Islam", ringkas: "Jalur dagang, Samudra Pasai, Demak, Mataram Islam, Wali Songo", warna: "#2f6b4f", masa: "abad ke-13 – ke-18 M" },
      { id: 4,  judul: "Bangsa Eropa dan Kolonialisme", ringkas: "Rempah, VOC, Daendels, Raffles, Tanam Paksa", warna: "#5a4a7a", masa: "1453 – 1900-an" },
      { id: 5,  judul: "Perlawanan terhadap Penjajah", ringkas: "Pattimura, Padri, Diponegoro, Aceh, Banjar, Bali", warna: "#8a2f2f", masa: "1800-an – 1900-an" },
      { id: 6,  judul: "Pergerakan Nasional", ringkas: "Budi Utomo, Sarekat Islam, Muhammadiyah, NU, Sumpah Pemuda", warna: "#a04a20", masa: "1908 – 1942" },
      { id: 7,  judul: "Pendudukan Jepang", ringkas: "Romusha, PETA, BPUPKI, perumusan Pancasila", warna: "#7a2a3a", masa: "1942 – 1945" },
      { id: 8,  judul: "Proklamasi dan Revolusi", ringkas: "Rengasdengklok, Resolusi Jihad, 10 November, KMB", warna: "#b0302a", masa: "1945 – 1949" },
      { id: 9,  judul: "Demokrasi Liberal dan Terpimpin", ringkas: "Pemilu 1955, Dekrit 5 Juli 1959, peristiwa 1965", warna: "#3a5a7a", masa: "1950 – 1966" },
      { id: 10, judul: "Orde Baru", ringkas: "Pembangunan, stabilitas, swasembada, krisis 1997–1998", warna: "#4a5a3a", masa: "1966 – 1998" },
      { id: 11, judul: "Reformasi", ringkas: "Mei 1998, amandemen UUD 1945, otonomi daerah, pemilu langsung", warna: "#1f5f7a", masa: "1998 – sekarang" }
    ]
  },
  {
    id: "dunia", judul: "Sejarah Dunia", warna: "#1f4f7a",
    ringkas: "Dari peradaban awal sampai dunia global",
    awal: "± 3500 SM", akhir: "hari ini",
    bab: [
      { id: 1, judul: "Peradaban Awal Dunia", ringkas: "Mesopotamia, Mesir, Lembah Indus, Tiongkok", warna: "#9a6a1c", masa: "± 3500 – 500 SM" },
      { id: 2, judul: "Yunani dan Romawi", ringkas: "Demokrasi Athena, filsafat, Republik dan Kekaisaran Romawi", warna: "#5a4a7a", masa: "± 800 SM – 476 M" },
      { id: 3, judul: "Abad Pertengahan dan Peradaban Islam", ringkas: "Eropa feodal, Baitul Hikmah, Andalusia, Perang Salib", warna: "#2f6b4f", masa: "476 – 1453" },
      { id: 4, judul: "Renaisans, Penjelajahan, dan Reformasi Gereja", ringkas: "Humanisme, penjelajahan samudra, Martin Luther", warna: "#a04a20", masa: "1300-an – 1600-an" },
      { id: 5, judul: "Zaman Revolusi", ringkas: "Revolusi Amerika, Prancis, dan Industri", warna: "#8a2f2f", masa: "1760 – 1850" },
      { id: 6, judul: "Imperialisme dan Nasionalisme Asia-Afrika", ringkas: "Kolonialisme Barat, kebangkitan bangsa-bangsa Asia", warna: "#7a3f22", masa: "1800-an – 1900-an" },
      { id: 7, judul: "Perang Dunia I dan II", ringkas: "Sebab, jalannya perang, dan dampaknya", warna: "#4a4a4a", masa: "1914 – 1945" },
      { id: 8, judul: "Perang Dingin dan Dekolonisasi", ringkas: "Blok Barat-Timur, KAA 1955, Gerakan Non-Blok", warna: "#3a5a7a", masa: "1947 – 1991" },
      { id: 9, judul: "Dunia Kontemporer", ringkas: "Globalisasi, teknologi informasi, isu dunia masa kini", warna: "#1f5f7a", masa: "1991 – sekarang" }
    ]
  },
  {
    id: "ski", judul: "Sejarah Kebudayaan Islam", warna: "#2f6b4f",
    ringkas: "Dari dakwah Rasulullah sampai Islam di Nusantara",
    awal: "abad ke-7 M", akhir: "hari ini",
    bab: [
      { id: 1, judul: "Dakwah Rasulullah di Mekkah dan Madinah", ringkas: "Strategi dakwah, hijrah, Piagam Madinah", warna: "#2f6b4f", masa: "610 – 632 M" },
      { id: 2, judul: "Khulafaur Rasyidin", ringkas: "Abu Bakar, Umar, Utsman, Ali", warna: "#3a6a5a", masa: "632 – 661 M" },
      { id: 3, judul: "Dinasti Umayyah", ringkas: "Damaskus, perluasan wilayah, Umar bin Abdul Aziz", warna: "#5a6a2a", masa: "661 – 750 M" },
      { id: 4, judul: "Dinasti Abbasiyah", ringkas: "Baghdad, Baitul Hikmah, masa keemasan ilmu", warna: "#1f5f7a", masa: "750 – 1258 M" },
      { id: 5, judul: "Islam di Andalusia", ringkas: "Cordoba, Granada, jembatan ilmu ke Eropa", warna: "#9a6a1c", masa: "711 – 1492 M" },
      { id: 6, judul: "Tiga Kerajaan Besar", ringkas: "Turki Usmani, Safawi, Mughal", warna: "#8a2f2f", masa: "1300-an – 1900-an" },
      { id: 7, judul: "Gerakan Pembaruan Islam", ringkas: "Jamaluddin al-Afghani, Muhammad Abduh, pengaruhnya di Indonesia", warna: "#5a4a7a", masa: "1800-an – 1900-an" },
      { id: 8, judul: "Islam di Nusantara", ringkas: "Jalur masuk, Wali Songo, pesantren, ulama Nusantara", warna: "#7a3f22", masa: "abad ke-13 – sekarang" }
    ]
  }
];
window.BAB = {};
window.TAMBAH_BAB = function (b) { (window.BAB[b.koleksi] = window.BAB[b.koleksi] || {})[b.id] = b; };
