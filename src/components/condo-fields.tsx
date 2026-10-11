"use client";

import { useState } from "react";
import { inputClass } from "./form-message";

export type CondoOption = { id: number; name: string; district: string };

export function CondoFields({
  condos,
  defaultCondo,
  defaultName = "",
  defaultDistrict = "",
}: {
  condos: CondoOption[];
  defaultCondo?: string;
  defaultName?: string;
  defaultDistrict?: string;
}) {
  const [choice, setChoice] = useState(defaultCondo || (condos.length ? "" : "nuevo"));
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-bold">Tu condominio</span>
        <select
          name="condo"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          className={`${inputClass} mt-1`}
          required
        >
          <option value="" disabled>
            Elige tu condominio…
          </option>
          {condos.map((condo) => (
            <option key={condo.id} value={condo.id}>
              {condo.name}
              {condo.district ? ` · ${condo.district}` : ""}
            </option>
          ))}
          <option value="nuevo">➕ Mi condominio no está en la lista</option>
        </select>
      </label>
      {choice === "nuevo" && (
        <div className="grid gap-3 rounded-2xl bg-leaf-soft p-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold">Nombre del condominio</span>
            <input name="condoName" defaultValue={defaultName} placeholder="Ej.: Residencial Los Parques" className={`${inputClass} mt-1`} />
          </label>
          <label className="block">
            <span className="text-sm font-bold">Distrito</span>
            <input name="condoDistrict" defaultValue={defaultDistrict} placeholder="Ej.: Surco" className={`${inputClass} mt-1`} />
          </label>
        </div>
      )}
    </div>
  );
}
