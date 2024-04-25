<template>
  <div>
    <p>COMPRAR CRIPTOMONEDAS</p>
  
    <v-container class="form-container">
      <v-form @submit.prevent="nuevaCompra">
        
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
          Guardar Compra
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
import apiClient from "@/services/apiClient";
import createCryptoApiClient from "@/services/cryptoApi";

export default {
  
  data() {
    return {
      userId: "",
      cryptoCode: "btc",
      cryptoAmount: "",
      money: "",
      datetime: "",
      preciosCripto: {},
    };
  },
  methods: {
    async nuevaCompra() {
    
    if (this.cryptoAmount <= 0 || this.money <= 0) {
        alert("La cantidad de criptomonedas y el monto deben ser mayores a 0.");
        return;
    }

    const datosCompra = {
        user_id: this.$store.state.userId,
        action: 'purchase',
        crypto_code: this.cryptoCode,
        crypto_amount: this.cryptoAmount,
        money: this.money,
        datetime: this.datetime,
    };

    try {
        const response = await apiClient.post("/transactions", datosCompra);

        if (response.status === 201) {
    console.log("Compra guardada exitosamente:", response.data);
    alert("Compra guardada exitosamente");
    this.$store.commit('agregarCompra', response.data);
    console.log("Estado del store después de agregar la compra:", this.$store.state.compras);
} else {
    console.error("Código de estado inesperado:", response.status);
    alert("Ha ocurrido un error inesperado al guardar la compra.");
}
    } catch (error) {
        console.error("Error al guardar la compra:", error);
        alert("Error de red o servidor. Inténtalo de nuevo más tarde.");
    }
  },


    async obtenerPrecios() {
      try {
        const cryptoApiClient = createCryptoApiClient();
        const [preciosBtc, preciosUsdc, preciosEth] = await Promise.all([
          cryptoApiClient.getDetails("btc"),
          cryptoApiClient.getDetails("usdc"),
          cryptoApiClient.getDetails("eth"),
        ]);

        this.preciosCripto = {
          btc: preciosBtc.ask,
          usdc: preciosUsdc.ask,
          eth: preciosEth.ask,
        };
      } catch (error) {
        console.error(
          "Error al obtener los precios de las criptomonedas:",
          error
        );
      }
    },

    calcularDineroEnARS() {
      const precioActual = this.preciosCripto[this.cryptoCode];
      if (precioActual && this.cryptoAmount) {
        this.money = this.cryptoAmount * precioActual;
      }
    },
  },
    mounted() {
    this.obtenerPrecios();
    
    const now = new Date();
    now.setHours(now.getHours() - 3);
    const datetimeLocal = now.toISOString().slice(0, 16);
  
    this.datetime = datetimeLocal;
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
