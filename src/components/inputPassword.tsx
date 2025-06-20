import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordInputProps {
  id: string;
  label: string;
  register: any;
  error?: string;
}

export function PasswordInput({ id, label, register, error }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Label htmlFor={id} className="mb-2 block font-semibold text-purple">
        {label}
      </Label>
      <div className="relative flex items-center">
        <Input
          id={id}
          type={show ? "text" : "password"}
          {...register(id)}
          className="pr-10"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 text-gray-500"
          tabIndex={-1}
        >
          {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
