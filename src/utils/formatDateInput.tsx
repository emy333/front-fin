import { format } from "date-fns";

export const formatarData = (data: any) => {
    if (!data) return "";

    const dataObjeto = new Date(data);
    const dataCorreta = new Date(dataObjeto.getTime() + dataObjeto.getTimezoneOffset() * 60000);

    return format(dataCorreta, "dd/MM/yyyy");
};
