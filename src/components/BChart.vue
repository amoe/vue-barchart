<template>
<div>
  <button v-on:click="generatePoints">Generate Points</button>
  
  
  <div class="svg-container">
    <svg version="1.1" viewBox="0 0 500 500" 
         preserveAspectRatio="xMinYMin meet" class="svg-content">
      <rect v-for="(point, index) in points"
            :x="getX(point, index)"
            :y="getY(point, index)"
            :width="getWidth(point, index)"
            :height="getHeight(point)"
            fill="#F7941E"
            opacity="0.6"/>
    </svg>
  </div>
</div>
</template>

<script>
import Vue from 'vue';
import Vuex from 'vuex';
import utility from '../utility';
import * as _ from 'lodash';
import * as d3 from 'd3';
import nouns from '../nouns';

const height = 500;
const scaleHeight = d3.scaleLinear().domain([0, 100]).range([0, 500]);

export default Vue.extend({
    data: function() {
        return {
            points: [],
            // xscale must be reset sometimes because it's a band scale
            // so it needs to know what categories were used 'in practice'
            xScale: null
        };
    },
    created() {
        this.generatePoints();
    },
    methods: {
        getWidth(point, index) {
            return this.xScale.bandwidth();
        },
        getHeight(point) {
            return scaleHeight(point.y);
        },
        getX(point, index) {
            return this.xScale(point.x);
        },
        getY(point, index) {
            return height - scaleHeight(point.y);
        },
        generatePoints() {
            const thisRun = _.shuffle(nouns);
            this.points = [];   // This is fine and will update DOM
            const usedCategories = [];
            
            const nPoints = _.random(5, 50);
            
            // In the case of bar data, x just represents an unlabelled 
            // 'category' so it's unused.
            for (let i = 0; i < nPoints; i++) {
                const x = thisRun[i];
                const y = _.random(0, 100);
                
                const thisPoint = {
                    x: x, y: y
                };
                
                usedCategories.push(x);
                this.points.push(thisPoint);
             }
            
            console.log("points list is now %o", JSON.stringify(this.points));

            this.resetBandScale(usedCategories);
         },

        resetBandScale(categories) {
            this.xScale = d3.scaleBand()
              .domain(categories)
              .range([0, 500])
              .paddingInner(0.1)
              .align(0.5);
        },
         greet() {
             console.log("hello");
             console.log("state val is %o", this.$store.state.count);
         },
         doIncrement() {
             this.$store.dispatch('increment');
         },
     }
 });
</script>

<style>
</style>
