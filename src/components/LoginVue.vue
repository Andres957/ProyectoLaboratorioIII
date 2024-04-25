<template>
  <v-container class="login" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-24" color="yellow lighten-1" dark>
          <v-card-title
            class="headline"
            style="font-family: 'Arial'; color: red"
          >
            Registrate !!!
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="iniciarSesion">
              <v-text-field
                v-model="idUsuario"
                label="ID Usuario"
                outlined
                dense
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="ma-auto"
              type="submit"
              color="red"
              dark
              large
              @click="iniciarSesion"
            >
              Ingresar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-24" color="blue lighten-1" dark>
          <v-card-title
            class="headline"
            style="font-family: 'Arial'; color: white"
          >
            Precios actuales
          </v-card-title>
          <v-card-text>
            <!-- Tarjetas para mostrar los precios -->
            <v-card color="green lighten-2" dark class="mb-2">
              <v-card-title>Bitcoin</v-card-title>
              <v-card-text>ARS ${{ precios.btc }}</v-card-text>
            </v-card>

            <v-card color="blue lighten-2" dark class="mb-2">
              <v-card-title>Ethereum</v-card-title>
              <v-card-text>ARS ${{ precios.eth }}</v-card-text>
            </v-card>

            <v-card color="yellow lighten-2" dark class="mb-2">
              <v-card-title>USDC</v-card-title>
              <v-card-text>ARS ${{ precios.usdc }}</v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import createCryptoApiClient from '../services/cryptoApi';

export default {
  name: 'LoginVue',
  data() {
    return {
      idUsuario: '',
      precios: {
        btc: null,
        eth: null,
        usdc: null,
      },
    };
  },
  methods: {
    iniciarSesion() {
      console.log('userId:', this.idUsuario);
      this.$store.commit('setUserId', this.idUsuario);
      localStorage.setItem('userId', this.idUsuario);  

      
      console.log('userId en el store después de iniciar sesión:', this.$store.state.userId);
      this.$router.push('/billetera');
    },
    async obtenerPrecios() {
      const cryptoApiClient = createCryptoApiClient();

      try {
        const [preciosBtc, preciosEth, preciosUsdc] = await Promise.all([
          cryptoApiClient.getDetails('btc'),
          cryptoApiClient.getDetails('eth'),
          cryptoApiClient.getDetails('usdc'),
        ]);

        this.precios.btc = preciosBtc.ask;
        this.precios.eth = preciosEth.ask;
        this.precios.usdc = preciosUsdc.ask;
      } catch (error) {
        console.error('Error al obtener los precios de criptomonedas:', error);
      }
    },
  },
  mounted() {
    this.obtenerPrecios();
  },
};
</script>

<style scoped>

h1 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.v-card {
  position: relative;
  overflow: hidden; 
}

.v-card::before,
.v-card::after {
  content: '';
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
