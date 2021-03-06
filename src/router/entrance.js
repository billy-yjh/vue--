import Layout from "../layout/layout.vue"
import Welcome from "../pages/main/welcome.vue"
import TemperatureCalculation from "../pages/main/TemperatureCalculation.vue"
import BergFormula from "../pages/main/BergFormula.vue"

export default [
  {
    path: '/',
    name: 'welcome',
    component: Layout,
    redirect: '/welcome',
    children: [{
      component: Welcome,
      path: 'welcome',
      name: 'welcome'
    }]
  },
  {
    path: '/main',
    name: 'entrance-welcome',
    component: Layout,
    children: [
      {
        path: 'temperaturevalculation',
        name: 'entrance-temperaturevalculation',
        component: TemperatureCalculation
      },
      {
        path: 'bergformula',
        name: 'entrance-bergformula',
        component: BergFormula
      }
    ]
  }
]
