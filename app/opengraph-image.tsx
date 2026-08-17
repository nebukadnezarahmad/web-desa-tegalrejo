import { ImageResponse } from "next/og";
import { desa } from "@/lib/data/desa";

export const alt = `${desa.merek} - Portal ${desa.nama}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Gambar pratayang saat tautan situs dibagikan.
 *
 * Digambar dengan Satori, bukan berkas statis, supaya nama desa selalu
 * ikut berubah bila identitas di lib/data/desa.ts diganti. Hurufnya
 * memakai bawaan sistem: memuat berkas huruf sendiri menambah ketergantungan
 * pada berkas yang bisa hilang tanpa ketahuan.
 */
export default function Gambar() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px",
          borderBottom: "24px solid #15803d",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "#15803d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            B
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "34px", fontWeight: 800, color: "#111827" }}>
              {desa.merek}
            </span>
            <span style={{ fontSize: "22px", color: "#4b5563" }}>
              {desa.nama}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <span
            style={{
              fontSize: "62px",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Satu pintu layanan dan
            <br />
            informasi warga desa
          </span>
          <span style={{ fontSize: "26px", color: "#4b5563" }}>
            Lapor warga · Lapak UMKM · Gizi balita · Jadwal sampah
          </span>
        </div>

        <span style={{ fontSize: "22px", color: "#6b7280" }}>
          {desa.kecamatan}, {desa.kabupaten}
        </span>
      </div>
    ),
    size,
  );
}
