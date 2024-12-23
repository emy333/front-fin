import axiosInstance from "@/services/api";

/**
 * @param {string} date 
 * @param {number} userId 
 * @returns {Promise<number>} 
 */
export const getTotOrcamento = async (date: string, userId: number): Promise<number> => {
    try {
        const result = await axiosInstance.get(`/finance/entradas/total/${date}/${userId}`);
        console.log("Resposta da API:", result.data); 
        const totalEntradas = result.data.totalEntradas ? Number(result.data.totalEntradas) : 0; 
        return totalEntradas;
    } catch (error) {
        console.error("Erro ao obter o orçamento:", error);
        return 0;
    }
};


