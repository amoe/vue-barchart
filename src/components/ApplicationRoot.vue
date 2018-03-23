<template>
<div>
  <h1>New Project from amoe-vue-template</h1>
  
  <p>Hi there!</p>
  <p>The value is: <code>{{count}}</code></p>
  <button v-on:click="greet">Greet</button>
  <button v-on:click="doIncrement">Inc</button>

  <button v-on:click="generatePoints">Generate Points</button>


  <!-- <div v-axis="value"></div> -->

  <b-chart :outer-width="width" 
           :outer-height="height"
           :points="points"></b-chart>
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
import * as nouns from '../nouns';

export default Vue.extend({
    components: { BChart },
    data: function() {
        return {
            points: [],
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
    created() {
        this.generatePoints();
        console.log("noun list: %o", nouns);
    },
    methods: {
         greet() {
             console.log("hello");
             console.log("state val is %o", this.$store.state.count);
         },
         doIncrement() {
             this.$store.dispatch('increment');
         },
        generatePoints() {
            const thisRun = _.shuffle(nouns);

            console.log("nouns are %o", nouns);

            this.points = [];   // This is fine and will update DOM
            const usedCategories = [];
            
            const nPoints = _.random(5, 10);
            
            // In the case of bar data, x just represents an unlabelled 
            // 'category' so it's unused.
            for (let i = 0; i < nPoints; i++) {
                const x = thisRun[i];
                const y = _.random(0, 50);
                
                console.log("value of x is %o", x);

                const thisPoint = {
                    x: x, y: y
                };
                
                usedCategories.push(x);
                this.points.push(thisPoint);
             }
            
            console.log("points generated were: %o", JSON.stringify(this.points));
         }
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
