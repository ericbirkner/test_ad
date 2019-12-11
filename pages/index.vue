<template>
  <div class="container">
    <div>

      <h1 class="title">
        Eric Birkner
      </h1>

       <div v-if="loading" class="lds-ring"><div></div><div></div><div></div><div></div></div>

       <div class="grafico" v-else><GChart
          :settings="{ packages: ['corechart', 'table', 'map'], language: 'es' }"
          type="LineChart"
          :data="chartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>


// elimine la dependencia de axios aca, encapsulando la llamada al api en un archivo aparte
import { GChart } from 'vue-google-charts'
import { dollar } from '../api'


export default {
  components: {
    GChart
  },
  // aqui refactorize para eliminar el return
  // para devolver un objeto con el formato arrow function se hace () => ({})
  // tambien elimine las propiedades ano1, ano2 y datos por ser innecesarios
  data: () => ({
    loading:false,
    chartData: [
      ['fecha', 'valor']
    ],
    chartOptions: {
      chart: {
        title: "Eric Birkner",
        subtitle: "test gráfico"
      }
    }
  }),
  // Elimine las funciones, ya que eran muy especificas, si tuvieras que ir a buscar el año 2017, ¿Crearias una tercera funcion?
  // pues no, generalize la funcion, creando get, que se encarga de ir a buscar los datos de un solo año
  methods: {
        //Esta funcion se encarga de ir a buscar un solo año
        get ({ year }) {
          return dollar.get(year)
        },
        // Esta funcion se encarga de ir a buscar todos los años
        getAll(years) {
          // cuando comienze el flujo, comenzamos a cargar, aqui usaremos Promise.all
          // que es una función que recibe un array con promesas, por eso se hace esto
          // years.map(year => this.get({ year })), esto transforma el array de años en promesas que son devueltas en get
          // Promise.all termina cuando todas las promesas estan completas, y te devuelve un array con sus resultados

          //Comenzamos a cargar
          this.loading = true
          return Promise.all(years.map(year => this.get({ year })))
                                .then( result => {
                                
                                  const data = result
                                                .map(data => data.data.serie) //este map saca los datos que necesitamos
                                                .reduce((acc, current) => [...acc,...current], []) //este reduce, concatena todos los arrays
                                                .map(e => [new Date(e.fecha),e.valor]) //y este map transforma los datos en datos que nos sirvan para el grafico, como lo estabas haciendo en el forEach

                                  this.chartData = [...this.chartData, ...data]
                                  
                                  // terminamos de cargar
                                  this.loading = false
                                })
                                .catch(() => {
                                  // si falla, igual terminamos de cargar
                                  this.loading = false
                                })
        }
                        
  },
  created() {
     // Aqui ejecutamos getAll, le pasamos un array con los años que queremos ir a buscar, agregar mas años es trivial
     // bastaria con hacer algo como esto  this.getAll(['2017','2018','2019'])
     this.getAll(['2018','2019'])
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 20px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid grey;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: grey transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.grafico{
  width:900px;
  margin: 0 auto;
}


</style>
