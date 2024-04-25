<template>
  <div class="background-image">
    <v-row>
      <!-- Utilizamos el componente v-col para controlar el diseño -->
      <v-col cols="12" sm="6" class="vertical-text">
        <!-- Aplicamos el estilo de cursiva y doble subrayado a "Billetera de Criptomonedas" -->
        <h1>
          <span class="font-italic text-red text-decoration-underline text-decoration-line-through">Billetera de Criptomonedas</span>
        </h1>
      </v-col>
      <!-- Utilizamos el componente v-col para controlar el diseño -->
      <v-col cols="12" sm="6">
        <!-- Utilizamos el componente LoginVue -->
        <div class="login-view"> 
          <LoginVue />  
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// Importamos el componente LoginVue desde la ubicación correcta
import LoginVue from '@/components/LoginVue.vue';

export default {
  name: 'LoginView',
  components: {
    // Registramos el componente LoginVue para que esté disponible en este componente
    LoginVue,  
  },
}; 
</script>

<style scoped>
.vertical-text {
  writing-mode: vertical-rl; /* Orientación de escritura vertical, de derecha a izquierda */
  transform: rotate(220deg); /* Invierte la rotación para que la escritura sea legible */
  text-align: center; /* Centra el texto dentro del contenedor */
  height: 100vh; /* Altura del contenedor para ocupar toda la página */
  display: flex;
  justify-content: center;
  align-items: center;
  font-style:inherit; /* Aplica cursiva */
  font-weight: bold; /* Establece el grosor de la letra a negrita */
  font-size: 22px;
}
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Establecemos la imagen de fondo */
.background-image {
  background-image: url('../assets/criptomonedas-monero.webp');
  background-size: cover;
  background-position: center;
  height: 100vh; /* Ajusta la altura según sea necesario */
}

/* Definimos el estilo para eliminar el subrayado del texto */
.text-decoration-underline {
  text-decoration: underline;
}

.text-decoration-line-through {
  text-decoration: line-through;
}
</style>
