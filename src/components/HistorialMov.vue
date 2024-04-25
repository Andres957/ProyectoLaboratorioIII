<template>
  <v-container class="form-container">
    <v-row>
      <v-col cols="12">
        <v-list dense>
          <v-list-item v-for="transaccion in transacciones" :key="transaccion._id">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold transaccion-info">
                Transacción realizada el día: {{ transaccion.datetime }}
              </v-list-item-title>
              <v-list-item-subtitle class="transaccion-details">
                Criptomoneda: {{ transaccion.crypto_code }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
                Cantidad: {{ transaccion.crypto_amount }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
                Dinero (ARS): {{ transaccion.money }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="transaccion-details">
                Acción: {{ transaccion.action }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="editarTransaccion(transaccion)" class="action-button">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="confirmacionEliminar(transaccion._id)" class="action-button">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogEditarTransaccion" max-width="500">
      <v-card class="elevation-24">
        <v-card-title class="text-center">Editar Transacción</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="guardarTransaccionEditada">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="transaccionEditada.datetime" label="Fecha y Hora" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="transaccionEditada.crypto_code" label="Criptomoneda" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="transaccionEditada.crypto_amount" label="Cantidad" type="number" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="transaccionEditada.money" label="Dinero (ARS)" type="number" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="transaccionEditada.action" label="Acción" required></v-text-field>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-btn type="submit" color="orange">Guardar Cambios</v-btn>
                <v-btn color="error" @click="cerrarFormulario">Cancelar</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import apiClient from '@/services/apiClient';
import { useStore } from 'vuex'; 
export default {
  data() {
    return {
      transacciones: [],
      dialogEditarTransaccion: false,
      transaccionEditada: {},
    }
  },

  created() {
    this.cargarHistorial();
  },

  methods: {
    async cargarHistorial() {
      try {
        const store = useStore();
        const response = await apiClient.get(`/transactions?q={"user_id": "${store.state.userId}"}`);
        this.transacciones = response.data;
        console.log('Datos cargados:', this.transacciones);
      } catch (error) {
        console.error('Error al cargar el historial de movimientos:', error);
      }
    },
    
    async editarTransaccion(transaccion) {
      this.transaccionEditada = { ...transaccion };
      this.dialogEditarTransaccion = true;
      console.log('Transacción editada:', this.transaccionEditada);
    },

    async guardarTransaccionEditada() {
      try {
        await apiClient.patch(`/transactions/${this.transaccionEditada._id}`, this.transaccionEditada);
        this.cerrarFormulario();
        console.log('Transacción editada y guardada con éxito:', this.transaccionEditada);
        this.$store.commit('actualizarTransacciones', this.transacciones);
        this.$emit('actualizarVentas');
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
      }
    },

    cerrarFormulario() {
      this.dialogEditarTransaccion = false;
      this.transaccionEditada = {};
    },
  
    async eliminarTransaccion(transaccionId) {
  try {
    await apiClient.delete(`/transactions/${transaccionId}`);
    this.cargarHistorial();    // Actualizar el estado Vuex con las transacciones actualizadas
    this.$store.commit('actualizarTransacciones', this.transacciones);
    // Emitir un evento para actualizar las ventas en el componente OperarVenta
    this.$emit('actualizarVentas');
  } catch (error) {
    console.error('Error al eliminar la transacción:', error);
  }
},

  
    async confirmacionEliminar(transaccionId) {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
        await this.eliminarTransaccion(transaccionId);
      }
    }, 
  },
};
</script>

<style scoped>
.form-container {
  background-color: bisque; /* Fondo verde */
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #00ff00;
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

/* Animación para el borde pulsante */
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

.transaccion-info {
  font-weight: bold;
}

.transaccion-details {
  color: #28a745; /* Verde */
}

.action-button {
  color: #dc3545; /* Rojo */
}
.v-btn--orange {
  background-color: orange !important;
}
</style>
