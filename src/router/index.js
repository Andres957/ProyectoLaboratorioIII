import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import BilleteraCripto from "../views/BilleteraCripto.vue";
import Compra from "../components/OperarCompra.vue";
import Venta from "../components/OperarVenta.vue";
import Movimientos from '../components/HistorialMov.vue'
import EstadoActual from '../components/EstadoActual.vue'
import AnalisisInversiones from '../components/AnalisisInversiones.vue'

const routes = [
  {
    path: "/",
    name: "home",
    component: LoginView,
  },
  {
    path: "/Billetera",
    name: "Billetera",
    component: BilleteraCripto,
  },
  {
    path: "/OperarCompra",
    name: "Compra",
    component: Compra,
  },
  {
    path: "/OperarVenta",
    name: "Venta",
    component: Venta,
  },
  {
    path: "/Movimientos",
    name: "Movimientos",
    component: Movimientos,
  },
  {
    path: '/EstadoActual',
    name: 'EstadoActual',
    component: EstadoActual
  },
  {
    path: '/AnalisisInversiones',
    name: 'AnalisiInversiones',
    component: AnalisisInversiones
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
