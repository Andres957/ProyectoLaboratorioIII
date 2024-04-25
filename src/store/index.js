import { createStore } from 'vuex';
import apiClient from '@/services/apiClient';

const storedUserId = localStorage.getItem('userId');

const store = createStore({
  state: {
    userId: storedUserId || null,
    compras: [],
    ventas: [],
    criptoDisponibles: {
      btc: 0,
      eth: 0,
      usdc: 0,
    },
  },
  
  getters: {
    // Getter para obtener la cantidad disponible
    btcDisponible: state => state.criptoDisponibles.btc,

    ethDisponible: state => state.criptoDisponibles.eth,

    usdcDisponible: state => state.criptoDisponibles.usdc
  },

  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
      localStorage.setItem('userId', userId);
    },
    resetState(state) {
      state.userId = null;
      state.compras = [];
      state.ventas = [];
      state.criptoDisponibles = { btc: 0, eth: 0, usdc: 0 };
      localStorage.removeItem('compras');
      localStorage.removeItem('ventas');
      localStorage.removeItem('criptoDisponibles');
    },
    agregarCompra(state, compra) {
      state.compras.push(compra);
      const criptoDisponibles = calcularCriptoDisponibles(state.compras, state.ventas);
      state.criptoDisponibles = criptoDisponibles;
      localStorage.setItem('criptoDisponibles', JSON.stringify(criptoDisponibles));
    },
    agregarVenta(state, venta) {
      state.ventas.push(venta);
      const criptoDisponibles = calcularCriptoDisponibles(state.compras, state.ventas);
      state.criptoDisponibles = criptoDisponibles;
      localStorage.setItem('criptoDisponibles', JSON.stringify(criptoDisponibles));
    },
    actualizarCriptoDisponibles(state, criptoDisponibles) {
      state.criptoDisponibles = criptoDisponibles;
      localStorage.setItem('criptoDisponibles', JSON.stringify(criptoDisponibles));
    },
    //no lo use
    actualizarTransacciones(state, transacciones) {
      state.transacciones = transacciones;
      const criptoDisponibles = calcularCriptoDisponibles(state.compras, state.ventas);
      state.criptoDisponibles = criptoDisponibles;
    }
  },
  actions: {
    async cambiarUsuario(context, nuevoUserId) {
      context.commit('resetState');
      context.commit('setUserId', nuevoUserId);
      await context.dispatch('actualizarCriptoDisponibles');
    },
    async actualizarCriptoDisponibles({ commit, state }) {
      // Lógica para calcular las criptomonedas disponibles
      const criptoDisponibles = calcularCriptoDisponibles(state.compras, state.ventas);
      commit('actualizarCriptoDisponibles', criptoDisponibles);
      localStorage.setItem('criptoDisponibles', JSON.stringify(criptoDisponibles));
    },
  
    async guardarCompra({ commit, state }, datosCompra) {
      try {
        const response = await apiClient.post('/transactions', datosCompra);
        if (response.status === 201) {
          commit('agregarCompra', response.data);
          localStorage.setItem('compras', JSON.stringify(state.compras));
        } else {
          console.error(`Error inesperado en el servidor: ${response.status}`);
          throw new Error('Error en la respuesta del servidor.');
        }
      } catch (error) {
        console.error(`Error al guardar la compra: ${error.message}`);
        throw error;
      }
    },
    async guardarVenta({ commit, state }, datosVenta) {
      try {
        const response = await apiClient.post('/transactions', datosVenta);
        if (response.status === 201) {
          commit('agregarVenta', response.data);
          localStorage.setItem('ventas', JSON.stringify(state.ventas));
        } else {
          console.error(`Error inesperado en el servidor: ${response.status}`);
          throw new Error('Error en la respuesta del servidor.');
        }
      } catch (error) {
        console.error(`Error al guardar la venta: ${error.message}`);
        throw error;
      }
    },
    
  },
});


function calcularCriptoDisponibles(compras, ventas) {
  const criptoDisponibles = { btc: 0, eth: 0, usdc: 0 };
  compras.forEach(compra => {
    criptoDisponibles[compra.crypto_code] += Number(compra.crypto_amount);
  });
  ventas.forEach(venta => {
    criptoDisponibles[venta.crypto_code] -= Number(venta.crypto_amount);
  });
  return criptoDisponibles;
}

export default store;
