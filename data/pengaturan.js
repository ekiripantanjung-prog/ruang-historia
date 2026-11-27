/* Pengaturan bawaan Ruang Historia.
   modeBabak: true  = setiap bab menjadi babak; bab berikutnya terbuka setelah kuis bab sebelumnya mencapai KKM.
   kkm      : nilai minimal kuis untuk lulus satu babak.
   pin      : sidik PIN guru (SHA-256), bukan PIN aslinya. Untuk mengganti PIN, minta bantuan pengembang.
   Setiap kelas dapat memakai pengaturan sendiri melalui "tautan kelas" dari Panel Guru. */
window.PENGATURAN = {
  modeBabak: true,
  kkm: 75,
  pin: "bc0c9ebd4149da168372573283d050281462baf25c4059620f365bb62c13b3ca"
};
