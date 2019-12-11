<template>
  <div class="container">
    <div>

      <h1 class="title">
        Eric Birkner
      </h1>

       <div v-if="loading" class="lds-ring">
         <div></div>
         <div></div>
         <div></div>
         <div></div>
        </div>

       <div class="grafico" v-else>
         <GChart
          :settings="{ packages: ['corechart', 'table', 'map'], language: 'es' }"
          type="LineChart"
          :data="chartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style src="./style.css" />