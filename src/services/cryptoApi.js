import axios from 'axios';

const baseURL = 'https://criptoya.com/api/satoshitango/';

function createCryptoApiClient() {
    const instance = axios.create({
        baseURL,
    });

    return {
        getDetails: async (cryptoCode) => {
            try {
                const response = await instance.get(`${cryptoCode}/ars`);
                console.log(`Detalles de ${cryptoCode}:`, response.data); // Agregado para depurar
                if (response.data) {
                    return response.data;
                }
            } catch (error) {
                console.error(`Error al obtener detalles de ${cryptoCode}:`, error);
                throw error;
            }
        },
    };
}

export default createCryptoApiClient;
