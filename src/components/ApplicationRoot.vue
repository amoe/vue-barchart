<template>
<div>
  <h1>New Project from amoe-vue-template</h1>
  
  <p>Hi there!</p>
  <p>The value is: <code>{{count}}</code></p>
  <button v-on:click="greet">Greet</button>
  <button v-on:click="doIncrement">Inc</button>

  <!-- <div v-axis="value"></div> -->

  <b-chart :outer-width="width" :outer-height="height"></b-chart>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Vuex from 'vuex';
import utility from '../utility';
import * as _ from 'lodash';
import * as d3 from 'd3';
import BChart from './BChart.vue';
import directives from '../directives';

export default Vue.extend({
    components: { BChart },
    data: function() {
        return {
            value: 42,
            // Because these are specified to be numbers, they must be declared
            // inside data.
            width: 500,
            height: 500
        };
    },
    directives: {
        axis: directives.axis
    },
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
