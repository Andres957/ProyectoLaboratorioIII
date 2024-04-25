<template>
  <div class="background-image">
    <h1 class="text-white">Te damos la Bienvenida {{ userId }}, ahora te invitamos a Operar</h1>
    <v-row justify="center">
      <!-- Card para COMPRAR CRYPTO -->
      <v-col cols="12" sm="6" md="3" lg="3">
        <router-link to="/OperarCompra">
          <v-card class="style-card rounded-xl">
            <v-card-text class="style-link">COMPRA</v-card-text>
          </v-card>
        </router-link>
      </v-col>
      <!-- Card para VENDER CRYPTO -->
      <v-col cols="12" sm="6" md="3" lg="3">
        <router-link to="/OperarVenta">
          <v-card class="style-card rounded-xl">
            <v-card-text class="style-link">VENTA</v-card-text>
          </v-card>
        </router-link>
      </v-col>
      <!-- Card para MOVIMIENTOS -->
      <v-col cols="12" sm="6" md="3" lg="3">
        <router-link to="/Movimientos">
          <v-card class="style-card rounded-xl">
            <v-card-text class="style-link">MOVIMIENTOS</v-card-text>
          </v-card>
        </router-link>
      </v-col>
      <!-- Card para ESTADO ACTUAL -->
      <v-col cols="12" sm="6" md="3" lg="3">
        <router-link to="/EstadoActual">
          <v-card class="style-card rounded-xl">
            <v-card-text class="style-link">ESTADO ACTUAL</v-card-text>
          </v-card>
        </router-link>
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="3" >
        <router-link to="/AnalisisInversiones">
          <v-card class="style-card rounded-xl">
            <v-card-text class="style-link">ANALISIS DE iNVERSIONES</v-card-text>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'BilleteraCripto',
  computed: {
    userId() {
      return this.$store.state.userId;
    },
  },
};
</script>

<style scoped>
/* Establecemos la imagen de fondo */
.background-image {
  background-image: url('~@/assets/criptomonedas-monero.webp'); /* Reemplaza '~@/assets/criptomonedas-monero.webp' por la ruta correcta de tu imagen */
  background-size: cover;
  background-position: center;
  height: 100vh; /* Ajusta la altura según sea necesario */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  color: #d679a0;
  text-align: center;
}

/* Estilo para las cards */
.style-card {
  cursor: pointer;
  margin-bottom: 10px; /* Reducimos el margen inferior */
  background-color: orange;
  transition: transform 0.3s ease;
}

/* Estilo para los enlaces dentro de las cards */
.style-link {
  text-align: center;
  font-weight: bold;
  color: white;
}

/* Animación al pasar el mouse sobre las cards */
.style-card:hover {
  transform: scale(1.03);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
</style>
