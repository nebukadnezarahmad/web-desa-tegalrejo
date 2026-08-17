"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { setoranBankSampah } from "@/lib/data/sampah";
import { useLayarSempit } from "@/lib/use-layar-sempit";

export function GrafikSetoran() {
  const sempit = useLayarSempit();

  return (
    <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-3 sm:p-6">
      <div className="h-[17rem] w-full sm:h-[20rem]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={setoranBankSampah}
            margin={
              sempit
                ? { top: 6, right: 6, bottom: 8, left: 0 }
                : { top: 8, right: 8, bottom: 20, left: 0 }
            }
          >
            <CartesianGrid stroke="var(--line)" vertical={false} />
            <XAxis
              dataKey="bulan"
              tick={{ fill: "var(--ink-muted)", fontSize: 12 }}
              stroke="var(--line-strong)"
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--ink-muted)", fontSize: 12 }}
              stroke="var(--line-strong)"
              tickLine={false}
              width={sempit ? 34 : 56}
              tickFormatter={(v) => (sempit ? `${v}` : `${v} kg`)}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-soft)" }}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "0.75rem",
                fontSize: "0.8125rem",
              }}
              formatter={(nilai, nama) => [`${nilai} kg`, nama]}
            />
            <Legend
              verticalAlign="top"
              height={sempit ? 34 : 40}
              iconSize={sempit ? 9 : 14}
              wrapperStyle={{ fontSize: "0.8125rem" }}
              formatter={(v: string) => (sempit ? v.split(" ")[0] : v)}
            />
            <Bar
              dataKey="organik"
              name="Organik (kompos)"
              fill="var(--green)"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
            <Bar
              dataKey="anorganik"
              name="Anorganik (bank sampah)"
              fill="var(--blue)"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
        Sampah organik diolah menjadi kompos di komposter komunal tiap dusun,
        sedangkan sampah anorganik bersih ditabung warga di bank sampah dan
        dihitung sebagai saldo.
      </p>
    </div>
  );
}
