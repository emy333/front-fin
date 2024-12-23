import axiosInstance from "@/services/api";

/**
 * @param {string} date 
 * @param {number} userId 
 * @returns {Promise<number>} 
 */
export const getTotPagas = async (date: string, userId: number): Promise<number> => {
    try {
        const result = await axiosInstance.get(`/finance/despesasPagas/total/${date}/${userId}`);
        const totalPagas = result.data.totalSaidasPagas ? Number(result.data.totalSaidasPagas) : 0; 
        return totalPagas;
    } catch (error) {
        console.error("Erro ao obter o total pagos:", error);
        return 0;
    }
};


