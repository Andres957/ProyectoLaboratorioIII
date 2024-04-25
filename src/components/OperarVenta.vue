<template>
  <div>
    
    <v-row justify="center" class="mb-4">
      <v-col cols="12" sm="4">
        <v-card class="elevation-24" color="green lighten-2" dark>
          <v-card-title>Bitcoin</v-card-title>
          <v-card-text>Disponible: {{ btcDisponible }} BTC</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="elevation-24" color="blue lighten-2" dark>
          <v-card-title>Ethereum</v-card-title>
          <v-card-text>Disponible: {{ ethDisponible }} ETH</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="elevation-24" color="yellow lighten-2" dark>
          <v-card-title>USDC</v-card-title>
          <v-card-text
            >Disponible: {{ usdcDisponible }} USDC</v-card-text
          >
        </v-card>
      </v-col>
    </v-row>

    
    <v-container class="form-container">
      <v-form @submit.prevent="nuevaVenta">
        
        <v-select
          v-model="cryptoCode"
          :items="['btc', 'usdc', 'eth']"
          label="Criptomoneda"
          required
          outlined
          class="yellow-field"
        ></v-select>

        <v-text-field
          v-model="cryptoAmount"
          label="Cantidad"
          type="number"
          step="0.0001"
          required
          outlined
          class="yellow-field"
          @input="calcularDineroEnARS"
        ></v-text-field>

        <v-text-field
          v-model="money"
          label="Dinero (ARS)"
          type="number"
          step="0.01"
          required
          outlined
          class="yellow-field"
        ></v-text-field>

        <v-text-field
          v-model="datetime"
          label="Fecha y Hora"
          type="datetime-local"
          required
          outlined
          class="yellow-field"
        ></v-text-field>

        <v-btn type="submit" color="primary" dark class="submit-btn">
          Guardar Venta
        </v-btn>
      </v-form>
    </v-container>

    
    <v-row justify="center">
      <v-col cols="12" sm="4">
        <v-card class="elevation-24" color="green lighten-2" dark>
          <v-card-title>Bitcoin</v-card-title>
          <v-card-text>ARS ${{ preciosCripto.btc }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="elevation-24" color="blue lighten-2" dark>
          <v-card-title>Ethereum</v-card-title>
          <v-card-text>ARS ${{ preciosCripto.eth }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="elevation-24" color="yellow lighten-2" dark>
          <v-card-title>USDC</v-card-title>
          <v-card-text>ARS ${{ preciosCripto.usdc }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import {  computed } from "vue";
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex"; 
import createCryptoApiClient from "@/services/cryptoApi"; 
import apiClient from "@/services/apiClient";

export default {
  setup() {
    const cryptoCode = ref("btc");
    const cryptoAmount = ref("");
    const money = ref("");
    const datetime = ref("");
    const preciosCripto = ref({
      btc: 0,
      eth: 0,
      usdc: 0,
    });

    const store = useStore(); 
  
     const btcDisponible = computed(() => store.getters.btcDisponible);
    const ethDisponible = computed(() => store.getters.ethDisponible);
    const usdcDisponible = computed(() => store.getters.usdcDisponible);
    
    watch(
      () => store.state.transacciones,
      () => {
        const criptoDisponibles = store.state.criptoDisponibles;
        btcDisponible.value = criptoDisponibles.btc;
        ethDisponible.value = criptoDisponibles.eth;
        usdcDisponible.value = criptoDisponibles.usdc;
      }
    );
    
    const cryptoApiClient = createCryptoApiClient();
    const obtenerPrecios = async () => {
      try {
        const preciosBTC = await cryptoApiClient.getDetails("btc");
        const preciosETH = await cryptoApiClient.getDetails("eth");
        const preciosUSDC = await cryptoApiClient.getDetails("usdc");

        preciosCripto.value = {
          btc: preciosBTC.bid,
          eth: preciosETH.bid,
          usdc: preciosUSDC.bid,
        };
      } catch (error) {
        console.error(
          "Error al obtener precios de criptomonedas desde CriptoYa:",
          error
        );
      }
    };


    const cargarVentasGuardadas = () => {
      const ventasGuardadas = JSON.parse(localStorage.getItem("ventas"));
      if (ventasGuardadas) {
        ventasGuardadas.forEach(venta => {
          store.commit("agregarVenta", venta);
        });
        calcularCriptoDisponibles();
      }
    };

    const calcularCriptoDisponibles = () => {
      let disponibles = {
        btc: 0,
        eth: 0,
        usdc: 0,
      };

      //PARA ACTUALIZAR CANTIDADES
      store.state.compras.forEach((compra) => {
        if (compra.crypto_code === 'btc') {
          disponibles.btc += Number(compra.crypto_amount);
        } else if (compra.crypto_code === 'eth') {
          disponibles.eth += Number(compra.crypto_amount);
        } else if (compra.crypto_code === 'usdc') {
          disponibles.usdc += Number(compra.crypto_amount);
        }
      });
      store.state.ventas.forEach((venta) => {
    if (venta.crypto_code === 'btc') {
      disponibles.btc -= Number(venta.crypto_amount);
    } else if (venta.crypto_code === 'eth') {
      disponibles.eth -= Number(venta.crypto_amount);
    } else if (venta.crypto_code === 'usdc') {
      disponibles.usdc -= Number(venta.crypto_amount);
    }
  });

      
      store.commit('actualizarCriptoDisponibles', disponibles);
    };

    
    const calcularDineroEnARS = () => {
      const precioActual = preciosCripto.value[cryptoCode.value];
      if (precioActual && cryptoAmount.value) {
        money.value = cryptoAmount.value * precioActual;
      }
    };

  
    const nuevaVenta = async () => {
      if (cryptoAmount.value <= 0 || money.value <= 0) {
        alert("La cantidad de criptomonedas y el monto deben ser mayores a 0.");
        return;
      }

      const disponibles = store.state.criptoDisponibles;

      if (cryptoAmount.value > disponibles[cryptoCode.value]) {
        alert(
          `La cantidad a vender es mayor que la cantidad disponible de ${cryptoCode.value}`
        );
        return;
      }

      const datosVenta = {
        user_id: store.state.userId,
        action: "sale",
        crypto_code: cryptoCode.value,
        crypto_amount: cryptoAmount.value,
        money: money.value,
        datetime: datetime.value,
      };

      try {
        const response = await apiClient.post("/transactions", datosVenta);
        console.log("Venta guardada:", response.data);
        console.log("Respuesta de la API:", response);

        
        store.commit("agregarVenta", response.data);

        
        cryptoAmount.value = "";
        money.value = "";

        cargarVentasGuardadas();
        calcularCriptoDisponibles();
      } catch (error) {
        console.error("Error al guardar la venta:", error);
      }
    };

    const ajustarHoraArgentina = () => {
      const now = new Date();
      now.setHours(now.getHours() - 3);
      const datetimeLocal = now.toISOString().slice(0, 16);
      datetime.value = datetimeLocal;
    };

    
    onMounted(async () => {
      await obtenerPrecios();
      cargarVentasGuardadas(); 
      calcularCriptoDisponibles();
      ajustarHoraArgentina();
    });

    return {
      cryptoCode,
      cryptoAmount,
      money,
      datetime,
      preciosCripto,
      btcDisponible,
      ethDisponible,
      usdcDisponible,
      nuevaVenta,
      calcularDineroEnARS,
    };
  },
};
</script>

<style scoped>
.form-container {
  background-color: bisque; 
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #00ff00;
}

.yellow-field .v-input__control {
  background-color: yellow; 
}

.submit-btn {
  margin-top: 20px;
}

.elevation-24 {
  position: relative;
  overflow: hidden;
}

.elevation-24::before,
.elevation-24::after {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  width: calc(100% + 6px);
  height: calc(100% + 6px);
  background: linear-gradient(45deg, orange, transparent, orange);
  border-radius: 12px;
  animation: pulseBorder 2s infinite;
  pointer-events: none;
}


@keyframes pulseBorder {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}
</style>
