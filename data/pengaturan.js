/* Pengaturan bawaan Ruang Historia.
   modeBabak: true  = setiap bab menjadi babak; bab berikutnya terbuka setelah kuis bab sebelumnya mencapai KKM.
   kkm      : nilai minimal kuis untuk lulus satu babak.
   pin      : sidik PIN guru (SHA-256), bukan PIN aslinya. Untuk mengganti PIN, minta bantuan pengembang.
   Setiap kelas dapat memakai pengaturan sendiri melalui "tautan kelas" dari Panel Guru. */
window.PENGATURAN = {
  modeBabak: true,
  kkm: 75,
  pin: "7c16c9cf793a3ea6c23ed762001c443ab7166d9960512e97b427072dbd8bf389"
};
