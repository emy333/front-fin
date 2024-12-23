import axiosInstance from "@/services/api";

/**
 * @param {string} date 
 * @param {number} userId 
 * @returns {Promise<number>} 
 */
export const getTotSaldo = async (date: string, userId: number): Promise<number> => {
    try {
        const result = await axiosInstance.get(`/finance/saldo/${date}/${userId}`);
        return result.data.saldo || 0;
    } catch (error) {
        console.error("Erro ao obter o saldo:", error);
        return 0;
    }
};
