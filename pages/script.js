
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