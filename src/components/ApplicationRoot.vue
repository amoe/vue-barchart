<template>
<div>
  <h1>New Project from amoe-vue-template</h1>
  
  <p>Hi there!</p>
  <p>The value is: <code>{{count}}</code></p>
  <button v-on:click="greet">Greet</button>
  <button v-on:click="doIncrement">Inc</button>
  <button v-on:click="generatePoints">Generate Points</button>
  
  
  <div class="svg-container">
    <svg version="1.1" viewBox="0 0 500 500" 
         preserveAspectRatio="xMinYMin meet" class="svg-content">
      <rect v-for="(point, index) in points"
            :x="getX(point, index)"
            y="10"
            width="5"
            :height="getHeight(point)"
            fill="#F7941E"
            opacity="0.6"/>
    </svg>
  </div>
</div>
</template>

<script lang="ts">
    import Vue from 'vue';
import Vuex from 'vuex';
import utility from '../utility';
import * as _ from 'lodash';
import * as d3 from 'd3';

const scaleHeight = d3.scaleLinear().domain([0, 100]).range([0, 500]);

export default Vue.extend({
    components: {
    },
    data: function() {
        return {
            points: []
        };
    },
    created() {
        this.generatePoints();
    },
    methods: {
        getHeight(point) {
            return scaleHeight(point.y);
        },
        getX(point, index) {
            return index * 10;
        },
         generatePoints() {
             this.points = [];   // This is fine and will update DOM

             const nPoints = _.random(5, 50);
             
             // In the case of bar data, x just represents an unlabelled 
             // 'category' so it's unused.
             for (let i = 0; i < nPoints; i++) {
                 const x = i;
                 const y = _.random(0, 100);

                 const thisPoint = {
                     x: x, y: y
                 };
                 
                 this.points.push(thisPoint);
             }
         },
         greet() {
             console.log("hello");
             console.log("state val is %o", this.$store.state.count);
         },
         doIncrement() {
             this.$store.dispatch('increment');
         },
     },
     // mapState doesn't work with typescript: "Property 'mapState' does not exist on type"
     // So we manually create the relevant computed properties.
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
