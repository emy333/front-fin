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
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  useEffect(() => {
    if (!selectedMonth) {
      const currentMonth = (new Date().getMonth() + 1).toString();
      setSelectedMonth(currentMonth);
    }
  }, [selectedMonth, setSelectedMonth]);

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
