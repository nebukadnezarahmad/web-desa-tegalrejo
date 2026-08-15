/**
 * Perhitungan status gizi anak berdasarkan Standar Antropometri Anak
 * (WHO Child Growth Standards, diadopsi Permenkes No. 2 Tahun 2020).
 *
 * Metode LMS:
 *   z = ((X / M)^L - 1) / (L * S)      bila L != 0
 *   z = ln(X / M) / S                  bila L = 0
 *
 * Dua indeks yang dihitung:
 *   TB/U: Tinggi Badan menurut Umur  -> menapis perawakan pendek (stunting)
 *   BB/U: Berat Badan menurut Umur   -> menapis berat badan kurang
 *
 * Ini alat penapisan untuk kader posyandu, bukan alat diagnosis.
 */

export type JenisKelamin = "L" | "P";

type Lms = { umur: number; l: number; m: number; s: number };

/* -------------------------------------------------------------------------
   Tinggi/Panjang Badan menurut Umur (L selalu 1, jadi z = (X - M) / SD)
   Nilai M dalam cm, s adalah koefisien variasi sehingga SD = M * s.
   ------------------------------------------------------------------------- */

const tbuLaki: Lms[] = [
  { umur: 0, l: 1, m: 49.8842, s: 0.03795 },
  { umur: 3, l: 1, m: 61.4292, s: 0.03437 },
  { umur: 6, l: 1, m: 67.6236, s: 0.03479 },
  { umur: 9, l: 1, m: 72.0246, s: 0.03539 },
  { umur: 12, l: 1, m: 75.7488, s: 0.03601 },
  { umur: 18, l: 1, m: 82.2587, s: 0.03694 },
  { umur: 24, l: 1, m: 87.1161, s: 0.03723 },
  { umur: 30, l: 1, m: 91.9327, s: 0.03751 },
  { umur: 36, l: 1, m: 96.0835, s: 0.03795 },
  { umur: 42, l: 1, m: 99.8916, s: 0.03849 },
  { umur: 48, l: 1, m: 103.3273, s: 0.03919 },
  { umur: 54, l: 1, m: 106.7031, s: 0.03998 },
  { umur: 60, l: 1, m: 110.0301, s: 0.04084 },
];

const tbuPerempuan: Lms[] = [
  { umur: 0, l: 1, m: 49.1477, s: 0.03790 },
  { umur: 3, l: 1, m: 59.8029, s: 0.03496 },
  { umur: 6, l: 1, m: 65.7311, s: 0.03568 },
  { umur: 9, l: 1, m: 70.1435, s: 0.03657 },
  { umur: 12, l: 1, m: 74.0155, s: 0.03746 },
  { umur: 18, l: 1, m: 80.7079, s: 0.03846 },
  { umur: 24, l: 1, m: 85.7153, s: 0.03877 },
  { umur: 30, l: 1, m: 90.7020, s: 0.03908 },
  { umur: 36, l: 1, m: 95.0515, s: 0.03957 },
  { umur: 42, l: 1, m: 99.0248, s: 0.04019 },
  { umur: 48, l: 1, m: 102.7312, s: 0.04098 },
  { umur: 54, l: 1, m: 106.2224, s: 0.04187 },
  { umur: 60, l: 1, m: 109.4123, s: 0.04283 },
];

/* -------------------------------------------------------------------------
   Berat Badan menurut Umur (LMS penuh, M dalam kg)
   ------------------------------------------------------------------------- */

const bbuLaki: Lms[] = [
  { umur: 0, l: 0.3487, m: 3.3464, s: 0.14602 },
  { umur: 3, l: 0.1738, m: 6.3762, s: 0.11727 },
  { umur: 6, l: 0.1257, m: 7.934, s: 0.1108 },
  { umur: 9, l: 0.1001, m: 8.9014, s: 0.10767 },
  { umur: 12, l: 0.0817, m: 9.6479, s: 0.10609 },
  { umur: 18, l: 0.051, m: 10.9385, s: 0.10471 },
  { umur: 24, l: 0.027, m: 12.1515, s: 0.1045 },
  { umur: 30, l: 0.0091, m: 13.3037, s: 0.1052 },
  { umur: 36, l: -0.0064, m: 14.3462, s: 0.1063 },
  { umur: 42, l: -0.0203, m: 15.312, s: 0.10771 },
  { umur: 48, l: -0.033, m: 16.3497, s: 0.10936 },
  { umur: 54, l: -0.0448, m: 17.4166, s: 0.11117 },
  { umur: 60, l: -0.0558, m: 18.3457, s: 0.11307 },
];

const bbuPerempuan: Lms[] = [
  { umur: 0, l: 0.3809, m: 3.2322, s: 0.14171 },
  { umur: 3, l: 0.171, m: 5.8458, s: 0.12619 },
  { umur: 6, l: 0.1054, m: 7.297, s: 0.12204 },
  { umur: 9, l: 0.0689, m: 8.2254, s: 0.12143 },
  { umur: 12, l: 0.0402, m: 8.9481, s: 0.12204 },
  { umur: 18, l: -0.0059, m: 10.2315, s: 0.12446 },
  { umur: 24, l: -0.0407, m: 11.4775, s: 0.12703 },
  { umur: 30, l: -0.0683, m: 12.6438, s: 0.1297 },
  { umur: 36, l: -0.0909, m: 13.7784, s: 0.13236 },
  { umur: 42, l: -0.1099, m: 14.879, s: 0.13497 },
  { umur: 48, l: -0.1261, m: 15.9744, s: 0.13757 },
  { umur: 54, l: -0.1401, m: 17.0755, s: 0.14016 },
  { umur: 60, l: -0.1524, m: 18.1699, s: 0.14275 },
];

export const UMUR_MAKS_BULAN = 60;

/** Interpolasi linear parameter LMS pada umur (bulan) yang diminta. */
function lmsPadaUmur(tabel: Lms[], umurBulan: number): Lms {
  const umur = Math.min(Math.max(umurBulan, 0), UMUR_MAKS_BULAN);

  const tepat = tabel.find((t) => t.umur === umur);
  if (tepat) return tepat;

  let bawah = tabel[0];
  let atas = tabel[tabel.length - 1];
  for (let i = 0; i < tabel.length - 1; i++) {
    if (umur >= tabel[i].umur && umur <= tabel[i + 1].umur) {
      bawah = tabel[i];
      atas = tabel[i + 1];
      break;
    }
  }

  const rentang = atas.umur - bawah.umur;
  const rasio = rentang === 0 ? 0 : (umur - bawah.umur) / rentang;

  return {
    umur,
    l: bawah.l + (atas.l - bawah.l) * rasio,
    m: bawah.m + (atas.m - bawah.m) * rasio,
    s: bawah.s + (atas.s - bawah.s) * rasio,
  };
}

function hitungZ(nilai: number, { l, m, s }: Lms): number {
  if (Math.abs(l) < 1e-7) return Math.log(nilai / m) / s;
  return (Math.pow(nilai / m, l) - 1) / (l * s);
}

/* ------------------------------- Klasifikasi ------------------------------ */

export type Tingkat = "buruk" | "kurang" | "normal" | "lebih";

export type HasilIndeks = {
  kode: "TB/U" | "BB/U";
  nama: string;
  zScore: number;
  median: number;
  satuan: string;
  kategori: string;
  tingkat: Tingkat;
  penjelasan: string;
  waspada: boolean;
};

/** TB/U: ambang batas Permenkes No. 2 Tahun 2020 */
function klasifikasiTbu(z: number, median: number): HasilIndeks {
  const dasar = {
    kode: "TB/U" as const,
    nama: "Tinggi Badan menurut Umur",
    zScore: z,
    median,
    satuan: "cm",
    waspada: z >= -2 && z < -1,
  };

  if (z < -3)
    return {
      ...dasar,
      kategori: "Sangat pendek",
      tingkat: "buruk",
      penjelasan:
        "Tinggi badan jauh di bawah standar anak seumurannya. Ini tanda perawakan sangat pendek yang perlu penanganan tenaga kesehatan segera.",
    };
  if (z < -2)
    return {
      ...dasar,
      kategori: "Pendek",
      tingkat: "kurang",
      penjelasan:
        "Tinggi badan di bawah standar anak seumurannya. Kondisi ini yang dikenal sebagai perawakan pendek atau stunting.",
    };
  if (z > 3)
    return {
      ...dasar,
      kategori: "Tinggi",
      tingkat: "lebih",
      penjelasan:
        "Tinggi badan di atas rentang standar. Umumnya bukan masalah, namun sebaiknya tetap dikonfirmasi ke bidan desa.",
    };
  return {
    ...dasar,
    kategori: "Normal",
    tingkat: "normal",
    penjelasan:
      "Tinggi badan sesuai standar anak seumurannya. Pertahankan pola makan dan pemantauan rutin di posyandu.",
  };
}

/** BB/U: ambang batas Permenkes No. 2 Tahun 2020 */
function klasifikasiBbu(z: number, median: number): HasilIndeks {
  const dasar = {
    kode: "BB/U" as const,
    nama: "Berat Badan menurut Umur",
    zScore: z,
    median,
    satuan: "kg",
    waspada: z >= -2 && z < -1,
  };

  if (z < -3)
    return {
      ...dasar,
      kategori: "Berat badan sangat kurang",
      tingkat: "buruk",
      penjelasan:
        "Berat badan jauh di bawah standar. Anak perlu segera diperiksa tenaga kesehatan untuk mencari penyebabnya.",
    };
  if (z < -2)
    return {
      ...dasar,
      kategori: "Berat badan kurang",
      tingkat: "kurang",
      penjelasan:
        "Berat badan di bawah standar anak seumurannya. Perlu perbaikan asupan dan pemantauan lebih rapat.",
    };
  if (z > 1)
    return {
      ...dasar,
      kategori: "Risiko berat badan lebih",
      tingkat: "lebih",
      penjelasan:
        "Berat badan di atas rentang normal. Perhatikan porsi makanan manis dan gorengan, serta perbanyak aktivitas bermain.",
    };
  return {
    ...dasar,
    kategori: "Berat badan normal",
    tingkat: "normal",
    penjelasan:
      "Berat badan sesuai standar anak seumurannya. Lanjutkan penimbangan setiap bulan di posyandu.",
  };
}

/* --------------------------------- Publik -------------------------------- */

export type HasilGizi = {
  tbu: HasilIndeks;
  bbu: HasilIndeks;
  ringkasan: string;
  tingkatTertinggi: Tingkat;
  rekomendasi: string[];
};

export type MasukanGizi = {
  umurBulan: number;
  jenisKelamin: JenisKelamin;
  tinggiCm: number;
  beratKg: number;
};

export function hitungStatusGizi({
  umurBulan,
  jenisKelamin,
  tinggiCm,
  beratKg,
}: MasukanGizi): HasilGizi {
  const laki = jenisKelamin === "L";

  const lmsTbu = lmsPadaUmur(laki ? tbuLaki : tbuPerempuan, umurBulan);
  const lmsBbu = lmsPadaUmur(laki ? bbuLaki : bbuPerempuan, umurBulan);

  const tbu = klasifikasiTbu(hitungZ(tinggiCm, lmsTbu), lmsTbu.m);
  const bbu = klasifikasiBbu(hitungZ(beratKg, lmsBbu), lmsBbu.m);

  const urutan: Record<Tingkat, number> = {
    buruk: 3,
    kurang: 2,
    lebih: 1,
    normal: 0,
  };
  const tingkatTertinggi =
    urutan[tbu.tingkat] >= urutan[bbu.tingkat] ? tbu.tingkat : bbu.tingkat;

  return {
    tbu,
    bbu,
    tingkatTertinggi,
    ringkasan: susunRingkasan(tbu, bbu),
    rekomendasi: susunRekomendasi(tbu, bbu, umurBulan),
  };
}

function susunRingkasan(tbu: HasilIndeks, bbu: HasilIndeks): string {
  if (tbu.tingkat === "buruk" || bbu.tingkat === "buruk")
    return "Ada indikasi masalah gizi berat. Bawa anak ke puskesmas dalam waktu dekat.";
  if (tbu.tingkat === "kurang" && bbu.tingkat === "kurang")
    return "Tinggi dan berat badan sama-sama di bawah standar. Perlu pendampingan gizi dari bidan desa.";
  if (tbu.tingkat === "kurang")
    return "Tinggi badan di bawah standar meski berat badan masih dalam rentang wajar. Ini pola yang khas pada perawakan pendek.";
  if (bbu.tingkat === "kurang")
    return "Berat badan di bawah standar. Fokuskan perbaikan pada jumlah dan mutu asupan harian.";
  if (bbu.tingkat === "lebih")
    return "Pertumbuhan tinggi badan baik, namun berat badan melebihi rentang normal.";
  if (tbu.waspada || bbu.waspada)
    return "Masih dalam rentang normal, tetapi mendekati batas bawah. Pantau lebih rapat pada penimbangan berikutnya.";
  return "Pertumbuhan anak sesuai standar. Lanjutkan pemantauan rutin setiap bulan.";
}

function susunRekomendasi(
  tbu: HasilIndeks,
  bbu: HasilIndeks,
  umurBulan: number,
): string[] {
  const saran: string[] = [];
  const bermasalah =
    tbu.tingkat === "buruk" ||
    tbu.tingkat === "kurang" ||
    bbu.tingkat === "buruk" ||
    bbu.tingkat === "kurang";

  if (tbu.tingkat === "buruk" || bbu.tingkat === "buruk") {
    saran.push(
      "Bawa anak ke Puskesmas Pembantu Watubelah dalam waktu tujuh hari untuk pemeriksaan menyeluruh.",
    );
  }

  if (bermasalah) {
    saran.push(
      "Hubungi bidan desa atau kader posyandu di RT setempat agar anak masuk daftar pendampingan gizi.",
    );
    saran.push(
      "Tambahkan sumber protein hewani setiap hari: telur, ikan, hati ayam, atau susu. Protein hewani paling berpengaruh pada pertambahan tinggi badan.",
    );
  }

  if (umurBulan < 6) {
    saran.push(
      "Pada usia di bawah enam bulan, cukupkan ASI eksklusif tanpa tambahan makanan atau minuman lain.",
    );
  } else if (umurBulan < 24) {
    saran.push(
      "Lanjutkan ASI hingga usia dua tahun sambil memberi makanan pendamping yang bertekstur sesuai usia, tiga kali makan utama dan dua kali selingan.",
    );
  } else {
    saran.push(
      "Berikan tiga kali makan utama dan dua kali selingan dengan lauk hewani di setiap waktu makan.",
    );
  }

  if (bbu.tingkat === "lebih") {
    saran.push(
      "Kurangi minuman manis kemasan dan gorengan. Perbanyak waktu bermain aktif di luar rumah minimal satu jam sehari.",
    );
  }

  saran.push(
    "Timbang dan ukur ulang di posyandu bulan depan. Satu kali pengukuran belum menggambarkan arah pertumbuhan.",
  );

  if (bermasalah) {
    saran.push(
      "Pastikan anak sudah menerima imunisasi lengkap sesuai usia dan obat cacing setiap enam bulan mulai usia satu tahun.",
    );
  }

  return saran;
}

/** Median rujukan untuk grafik pertumbuhan. */
export function kurvaMedianTinggi(jenisKelamin: JenisKelamin) {
  const tabel = jenisKelamin === "L" ? tbuLaki : tbuPerempuan;
  return tabel.map((t) => {
    const sd = t.m * t.s;
    return {
      umur: t.umur,
      median: Number(t.m.toFixed(1)),
      minus2sd: Number((t.m - 2 * sd).toFixed(1)),
      plus2sd: Number((t.m + 2 * sd).toFixed(1)),
    };
  });
}
