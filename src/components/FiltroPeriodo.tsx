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
}

const FiltroPeriodo: React.FC<FiltroPeriodoProps> = ({ selectedMonth, setSelectedMonth }) => {
  const options = [
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

  // Atualiza o mês selecionado apenas quando ele não estiver definido ou for "00"
  useEffect(() => {
    if (!selectedMonth || selectedMonth === "00") {
      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      setSelectedMonth(currentMonth);
    }
  }, []); // Agora depende apenas do estado inicial

  return (
    <Select
      value={selectedMonth}
      onValueChange={(value) => setSelectedMonth(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecionar Mês">
          {options.find((option) => option.value === selectedMonth)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FiltroPeriodo;
