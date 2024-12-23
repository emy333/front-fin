import axiosInstance from "@/services/api";

/**
 * @param {string} date 
 * @param {number} userId 
 * @returns {Promise<number>} 
 */
export const getTotDespesas = async (date: string, userId: number): Promise<number> => {
    try {
        const result = await axiosInstance.get(`/finance/saidas/total/${date}/${userId}`);
        return result.data.totalSaidas || 0;
    } catch (error) {
        console.error("Erro ao obter o total de saídas:", error);
        return 0;
    }
};
