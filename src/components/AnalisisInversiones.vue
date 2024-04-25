<template>
  <v-container class="form-container">
    <h2>Análisis de Inversiones</h2>
    <v-row>
      <v-col cols="12">
        <v-list dense>
          <v-list-item v-for="balance in balances" :key="balance.crypto_code">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold transaccion-info">
                Criptomoneda: {{ balance.crypto_code }}
              </v-list-item-title>
              <v-list-item-subtitle class="transaccion-details">
                Total Compras: {{ balance.totalCompras }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
                Total Ventas: {{ balance.totalVentas }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
                Disponibilidad: {{ balance.disponibilidad.toFixed(2) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
                Total Dinero Compras: $ {{ balance.totalMoneyCompras.toFixed(2) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
                Total Dinero Ventas: $ {{ balance.totalMoneyVentas.toFixed(2) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
                Precio Actual: $ {{ balance.precioActual.toFixed(2) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
                Resultado: $ {{ balance.importeResultante.toFixed(2) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
  ¿Transacción efectiva?: {{ balance.efectiva ? 'Sí' : 'No' }}
</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apiClient from '@/services/apiClient';
import createCryptoApiClient from '@/services/cryptoApi'; 
import { useStore } from 'vuex';

export default {
  data() {
    return {
      balances: [],
    };
  },
  created() {
    this.analizarInversiones();
  },
  methods: {
    async analizarInversiones() {
      try {
        const cryptoApiClient = createCryptoApiClient();
        console.log('CryptoApiClient:', cryptoApiClient);
        const store = useStore();
        const userId = store.state.userId;
        console.log('ID de usuario:', userId); // Añadido para verificar el ID de usuario
        const historialResponse = await apiClient.get(`/transactions?q={"user_id": "${userId}"}`);
        const historial = historialResponse.data;

        if (!Array.isArray(historial)) {
          console.error('El historial no es un array:', historial);
          return;
        }

        const balancesMap = new Map();

        historial.forEach(transaction => {
          console.log('Transacción:', transaction);
          if (['btc', 'usdc', 'eth'].includes(transaction.crypto_code)) { 
            if (transaction.action === 'purchase') {
              if (balancesMap.has(transaction.crypto_code)) {
                const balance = balancesMap.get(transaction.crypto_code);
                balance.totalCompras += parseFloat(transaction.crypto_amount);
                balance.totalMoneyCompras += parseFloat(transaction.money);
              } else {
                balancesMap.set(transaction.crypto_code, {
                  crypto_code: transaction.crypto_code,
                  disponibilidad: 0,
                  totalCompras: parseFloat(transaction.crypto_amount),
                  totalVentas: 0,
                  totalMoneyCompras: parseFloat(transaction.money),
                  totalMoneyVentas: 0,
                  precioActual: 0, 
                  importeResultante: 0
                });
              }
            } else if (transaction.action === 'sale') {
              if (balancesMap.has(transaction.crypto_code)) {
                const balance = balancesMap.get(transaction.crypto_code);
                balance.totalVentas += parseFloat(transaction.crypto_amount);
                balance.totalMoneyVentas += parseFloat(transaction.money);
              } else {
                balancesMap.set(transaction.crypto_code, {
                  crypto_code: transaction.crypto_code,
                  disponibilidad: 0,
                  totalCompras: 0,
                  totalVentas: parseFloat(transaction.crypto_amount),
                  totalMoneyCompras: 0,
                  totalMoneyVentas: parseFloat(transaction.money),
                  precioActual: 0, 
                  importeResultante: 0
                });
              }
            }
          }
        });

        // Agregar 0 a las criptomonedas que el usuario no ha comprado o vendido
        ['btc', 'usdc', 'eth'].forEach(cryptoCode => {
          console.log('Crypto Code:', cryptoCode); 
          if (!balancesMap.has(cryptoCode)) {
            balancesMap.set(cryptoCode, {
              crypto_code: cryptoCode,
              disponibilidad: 0,
              totalCompras: 0,
              totalVentas: 0,
              totalMoneyCompras: 0,
              totalMoneyVentas: 0,
              precioActual: null, 
              importeResultante: 0
            });
          }
        });
        const balances = [];
    for (const [crypto_code, balance] of balancesMap) {
    const precio = await cryptoApiClient.getDetails(crypto_code); 
    
    console.log('Precio obtenido:', precio);
    const disponibilidad = balance.totalCompras - balance.totalVentas;
    console.log('Disponibilidad:', disponibilidad);
    
     const preciocrypto = parseFloat(precio.ask);
    const precioActual = disponibilidad * preciocrypto;
    const importeResultante = balance.totalMoneyVentas+  precioActual - balance.totalMoneyCompras;
    const efectiva = importeResultante > 0;
    balances.push({
        crypto_code: balance.crypto_code,
        disponibilidad,
        totalCompras: balance.totalCompras,
        totalVentas: balance.totalVentas,
        totalMoneyCompras: balance.totalMoneyCompras,
        totalMoneyVentas: balance.totalMoneyVentas,
        precioActual,
        importeResultante,
        efectiva
    });
    console.log('totalMoneyVentas:', balance.totalMoneyVentas);
console.log('totalMoneyCompras:', balance.totalMoneyCompras);
console.log('Precio obtenido:', precio.ask);
console.log('Disponibilidad:', disponibilidad);
console.log('Balances:', balances);
}


                
                this.balances = balances;
            } catch (error) {
                console.log("Error recuperando el historial de usuario", error);
            }
        },
       async getCryptoInfo(crypto, action) {
    try {
        const cryptoApiClient = createCryptoApiClient(); // Crear instancia del cliente API
        const response = await cryptoApiClient.getCryptoInfo(crypto, action); // Llamar al método en la instancia
        return parseFloat(response);
    } catch (error) {
        console.error('Error al obtener información de la criptomoneda:', error);
        throw error;
    }
},


  }
};
</script>

<style scoped>
.form-container {
  background-color: bisque;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #00ff00;
}

.transaccion-info {
  font-weight: bold;
}

.transaccion-details {
  color: #28a745;
}
</style>
