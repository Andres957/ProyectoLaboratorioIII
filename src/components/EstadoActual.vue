<template>
  <v-container>
    <h2>Analisis del estado actual</h2>
    <v-row>
      <v-col cols="12" md="6" v-for="(crypto, key) in datosCrypto" :key="key">
        <v-card class="crypto-card" elevation="12">
          <v-card-title>{{ key }}</v-card-title>
          <v-card-text>
            <div>Cantidad: {{ crypto.cantidad }}</div>
            <div>Dinero: {{ formatCurrency(crypto.money) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="total-card" elevation="12">
          <v-card-title><strong>Total</strong></v-card-title>
          <v-card-text class="celda-total">{{ formatCurrency(totalDinero) }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiClient from '@/services/apiClient';
import createCryptoApiClient from '@/services/cryptoApi'; // Cambiado aquí
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const datosCrypto = ref({});
    const totalDinero = ref(0);

    const cargarDatos = async () => {
      try {
        const response = await apiClient.get(`/transactions?q={"user_id": "${store.state.userId}"}`);
        const transacciones = response.data;
        const cryptoCantidad = {};
        transacciones.forEach((transaccion) => {
          const cryptoTipo = transaccion.crypto_code;
          if (!cryptoCantidad[cryptoTipo]) {
            cryptoCantidad[cryptoTipo] = 0;
          }
          if (transaccion.action === 'purchase') {
            cryptoCantidad[cryptoTipo] += parseFloat(transaccion.crypto_amount);
          } else if (transaccion.action === 'sale') {
            cryptoCantidad[cryptoTipo] -= parseFloat(transaccion.crypto_amount);
          }
        });

        const cryptoApiClient = createCryptoApiClient(); // Cambiado aquí
        const precioBitcoin = await cryptoApiClient.getDetails('btc');
        const precioEthereum = await cryptoApiClient.getDetails('eth');
        const precioUsdc = await cryptoApiClient.getDetails('usdc');

        const cryptoValues = {};
        for (const cryptoTipo in cryptoCantidad) {
          const cantidad = cryptoCantidad[cryptoTipo];
          let precio = 0;

          if (cryptoTipo === 'btc') {
            precio = precioBitcoin.ask;
          } else if (cryptoTipo === 'eth') {
            precio = precioEthereum.ask;
          } else if (cryptoTipo === 'usdc') {
            precio = precioUsdc.ask;
          }

          cryptoValues[cryptoTipo] = {
            cantidad,
            money: cantidad * precio,
          };
        }

        let totalDineroValue = 0;
        for (const cryptoTipo in cryptoValues) {
          totalDineroValue += cryptoValues[cryptoTipo].money;
        }

        datosCrypto.value = cryptoValues;
        totalDinero.value = totalDineroValue;
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
    };

    onMounted(() => {
      cargarDatos();
    });

    return {
      datosCrypto,
      totalDinero,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
.crypto-card {
  background-color: bisque; /* Fondo verde */
  border: 2px solid #00ff00;
  margin-bottom: 20px;
}

.total-card {
  background-color: #f2f2f2; /* Fondo gris */
  border: 2px solid #dc3545; /* Borde rojo */
}

.celda-total {
  font-weight: bold;
}
</style>
