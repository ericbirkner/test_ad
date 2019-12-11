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
import { GChart } from 'vue-google-charts'
import axios from 'axios'
export default {
  components: {
    GChart
  },
  data() {
        return {
          loading:false,
          ano1:[],
          ano2:[],
          datos:[],
          baseUrl: 'https://mindicador.cl/api/',
          chartData: [
            ['fecha', 'valor']
          ],
          chartOptions: {
            chart: {
              title: "Eric Birkner",
              subtitle: "test gráfico"
            }
          }
        }
  },
  methods: {
        getUno () {
            this.loading=true;
            axios.get(this.baseUrl+'dolar/2018')
            .then(response => {
                this.ano1 = response.data.serie;
                this.datos = this.datos.concat(this.ano1);
            })
            .catch(response => {
                console.log(response);
            });
        },
        getDos () {

            axios.get(this.baseUrl+'dolar/2019')
            .then(response => {
                this.ano2 = response.data.serie;
                this.datos = this.datos.concat(this.ano2);

                /*
                this.datos.forEach(element =>
                  this.chartData.push([new Date(element.fecha), element.valor])
                );
                */
                for(var i=1;i<this.datos.length;i++){
                    //console.log(this.datos[i].valor+'/'+this.datos[i+1].valor);
                    let valor = this.datos[i].valor - this.datos[i-1].valor;
                    this.chartData.push([new Date(this.datos[i].fecha), valor])
                }

                //this.chartData.push(Object.values(this.datos));

                this.loading=false;
            })
            .catch(response => {
                console.log(response);
            });
        }
  },
  created: function() {
      this.getUno();
      this.getDos();

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
