import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltroPeriodoProps {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  ano: number;
  setAno: (value: number) => void;
}

const FiltroPeriodo: React.FC<FiltroPeriodoProps> = ({ selectedMonth, setSelectedMonth, ano, setAno }) => {
  const optionsMonth = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  const optionsYear = Array.from({ length: 10 }, (_, index) => {
    const year = new Date().getFullYear() - index;
    return { value: year.toString(), label: year.toString() };
  });

  useEffect(() => {
    if (!selectedMonth || selectedMonth === "00") {
      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      setSelectedMonth(currentMonth);
    }
  }, []);

  return (
    <div className="flex gap-2">
      <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value)}>
        <SelectTrigger className="lg:w-[180px]">
          <SelectValue placeholder="Selecionar Mês">
            {optionsMonth.find((option) => option.value === selectedMonth)?.label}
          </SelectValue> 
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {optionsMonth.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={ano.toString()} onValueChange={(value) => setAno(Number(value))}>
        <SelectTrigger className="lg:w-[180px]">
          <SelectValue placeholder="Selecionar Ano">
            {optionsYear.find((option) => option.value === ano.toString())?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {optionsYear.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FiltroPeriodo;
