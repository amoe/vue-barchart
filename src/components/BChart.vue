<template>
<div>
  <button v-on:click="generatePoints">Generate Points</button>
  
  <div class="svg-container">
    <svg version="1.1" viewBox="0 0 500 500" 
         preserveAspectRatio="xMinYMin meet" class="svg-content">
      <g :transform="marginTranslation">
        <rect v-for="point in points"
              :x="getX(point)"
              :y="getY(point)"
              :width="getWidth(point)"
              :height="getHeight(point)"
              fill="#ff5f00"
              opacity="0.6"/>

      <line id="x-axis"
            x1="0"
            :y1="dimensions.height" 
            :x2="dimensions.width"
            :y2="dimensions.height"
            stroke="black" stroke-width="1"/>

      <line id="y-axis"
            x1="0" y1="0"
            x2="0" :y2="dimensions.height"
            stroke="black" stroke-width="1"/>


      <text v-for="(category, index) in domain"
            class="x-label" 
            x="0"
            :y="dimensions.height"
            font-size="1rem"
            :dx="getXLabelOffset(index)"
            dy="0.4rem"
            fill="black">{{category}}</text>
      </g>
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

const margin = {
    top: 20,
    right: 20,
    bottom: 200,
    left: 20
};

export default Vue.extend({
    props: {
        'outerWidth': {
            type: Number,
            required: true
        },
        'outerHeight': {
            type: Number,
            required: true
        },
    },
    data: function() {
        const dimensions = {
            width: this.outerWidth - margin.left - margin.right,
            height: this.outerHeight - margin.top - margin.bottom
        };

        const heightScale = d3.scaleLinear().domain([0, 100]).range([0, dimensions.height]);
        
        return {
            points: [],
            // xscale must be reset sometimes because it's a band scale
            // so it needs to know what categories were used 'in practice'
            xScale: null,
            heightScale,
            dimensions
        };
    },
    created() {
        console.log("margin translation expr is %o", this.marginTranslation);
        this.generatePoints();
    },
    methods: {
        getWidth(point) {
            return this.xScale.bandwidth();
        },
        getHeight(point) {
            return this.heightScale(point.y);
        },
        getX(point) {
            return this.xScale(point.x);
        },
        getY(point) {
            return this.dimensions.height - this.heightScale(point.y);
        },
        generatePoints() {
            const thisRun = _.shuffle(nouns);
            this.points = [];   // This is fine and will update DOM
            const usedCategories = [];
            
            const nPoints = _.random(5, 10);
            
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
            
            this.resetBandScale(this.domain);
         },

        resetBandScale(categories) {
            this.xScale = d3.scaleBand()
              .domain(categories)
              .range([0, this.dimensions.width])
              .paddingInner(0.1)
              .align(0.5);

            console.log("band scale is %o", this.xScale);

            // When scale has no ticks, the ticks are just the domain.  (because ordinal scale.)
            console.log("ticks value is %o", this.domain);
        },
         greet() {
             console.log("hello");
             console.log("state val is %o", this.$store.state.count);
         },
         doIncrement() {
             this.$store.dispatch('increment');
         },
         getXLabelOffset(index) {
             const s = this.xScale;

             // See this diagram to see why this works:
             // https://raw.githubusercontent.com/d3/d3-scale/master/img/band.png
             const usedSpaceSoFar = s.step() * index;
             const val = s.paddingOuter() + usedSpaceSoFar + (s.bandwidth() / 2);

             return val;
         }
     },
     computed: {
         domain() {
             return this.points.map(point => point.x);
         },
         marginTranslation() {
             return `translate(${margin.left}, ${margin.top})`;
         }
     }
 });
</script>

<style>
text.x-label {
    writing-mode: tb;
}
</style>
