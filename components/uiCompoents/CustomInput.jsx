import { Description, Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";

export default function CustomInput({ label, desc, onClick, value, setValue }) {
  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-slate-700 ml-2">{label}</Label>
        {desc && (
          <Description className="text-sm/6 text-gray-600/50">{desc}</Description>
        )}
        <Input
          className={clsx(
            "block w-full rounded-lg border bg-white/5 py-1.5 px-3 text-sm/6 text-gray-600",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-gray-500/25"
          )}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Field>
    </div>
  );
}
