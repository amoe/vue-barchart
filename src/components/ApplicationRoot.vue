<template>
<div>
  <h1>New Project from amoe-vue-template</h1>
  
  <p>Hi there!</p>
  <p>The value is: <code>{{count}}</code></p>
  <button v-on:click="greet">Greet</button>
  <button v-on:click="doIncrement">Inc</button>
  
  <b-chart></b-chart>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Vuex from 'vuex';
import utility from '../utility';
import * as _ from 'lodash';
import * as d3 from 'd3';
import BChart from './BChart.vue';

export default Vue.extend({
    components: { BChart },
    methods: {
         greet() {
             console.log("hello");
             console.log("state val is %o", this.$store.state.count);
         },
         doIncrement() {
             this.$store.dispatch('increment');
         },
     },
     computed: {
         count: function (this: any) {
             return this.$store.state.count;
         }
     }
 });
</script>

<style>
body {
    max-width: 64rem;
    margin-left: auto;
    margin-right: auto;
    background-color: #fdfdfd;
}

h1,h2 { font-family: Georgia; }

p, label { font-family: Arial, sans-serif; }
</style>
