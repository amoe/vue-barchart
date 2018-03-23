<template>
<div>
  <div class="svg-container">
    <svg version="1.1" viewBox="0 0 500 500" 
         preserveAspectRatio="xMinYMin meet" class="svg-content">
      <g :transform="marginTranslation">
        <rect v-for="point in points"
              v-on:click="onBarClicked"
              v-on:mouseover="showDetailTooltip"
              :x="getX(point)"
              :y="getY(point)"
              :width="getWidth(point)"
              :height="getHeight(point)"
              fill="#ff5f00"
              opacity="0.6">
          <title>Value: {{point.y}}</title>
        </rect>


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
            v-on:click="onXLabelClicked(category)"
            class="x-label" 
            x="0"
            :y="dimensions.height"
            :font-size="labelFontSize"
            :dx="getXLabelOffset(index)"
            :dy="xLabelOuterPadding"
            fill="black">{{category}}</text>

      <text v-for="n in nTicks"
            :y="getYLabelOffset(n)"
            x="0"
            :font-size="labelFontSize"
            :dx="yLabelOuterPadding"
            :dy="yLabelVerticalOffset"
            text-anchor="end">{{getYLabelText(n)}}</text>
      </g>
    </svg>
  </div>
</div>
</template>

<script>
import Vue from 'vue';
import Vuex from 'vuex';
import utility from '../utility';
import * as d3 from 'd3';

const LABEL_FONT_SIZE = "1rem";

// Gap between the x-axis and the x-label
const X_LABEL_OUTER_PADDING = "0.4em";

// Gap between the y-axis and the y-label.  Unfortunately this is somewhat
// dependent on the length of the text of the y-labels, because SVG doesn't have
// a box model.
const Y_LABEL_OUTER_PADDING = "-0.4rem";

// This setting will align the top of the highest y-label with the top of the y-axis.
const Y_LABEL_VERTICAL_OFFSET = "0.5em";

const margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 50
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
        'points': {
            type: Array,
            required: true
        },

    },
    created() {
        console.log("margin translation expr is %o", this.marginTranslation);
    },
    data: function() {
        const dimensions = {
            width: this.outerWidth - margin.left - margin.right,
            height: this.outerHeight - margin.top - margin.bottom
        };

        const heightScale = d3.scaleLinear().domain([0, 100]).range([0, dimensions.height]);
        
        return {
            heightScale,
            dimensions,
            nTicks: 10,
            yLabelOuterPadding: Y_LABEL_OUTER_PADDING,
            yLabelVerticalOffset: Y_LABEL_VERTICAL_OFFSET,
            labelFontSize: LABEL_FONT_SIZE,
            xLabelOuterPadding: X_LABEL_OUTER_PADDING
        };
    },
    created() {
        console.log("margin translation expr is %o", this.marginTranslation);
    },
    methods: {
        getYLabelText(n) {
            const intermediary = this.getIntermediaryScale();

            const result = intermediary(n);

            // Y label text is just the stringified result.
            return result;
        },
        getYLabelOffset(n) {
            // It's more like we would probably just create a new scale to do this.

            // Range here should be the same as the domain of the y-scale.
            const intermediary = this.getIntermediaryScale();

            const result = intermediary(n);

            const realResult = this.dimensions.height - this.heightScale(result);

            return realResult;
        },

        getIntermediaryScale() {
            return d3.scaleLinear()
                  .domain([0, this.nTicks])
                  .range([0, 100]);
        },
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
         },
         onBarClicked() {
             console.log("bar was clicked");
         },
         onXLabelClicked(category) {
             console.log("x-label was clicked, the category was %o", category);
         },
         showDetailTooltip() {
             console.log("showing the detail tooltip");
         }
     },
     computed: {
         domain() {
             return this.points.map(point => point.x);
         },
         marginTranslation() {
             return `translate(${margin.left}, ${margin.top})`;
         },
         // Bandscale has to be recomputed when the data changes; this is
         // transitively depending on the computed property 'domain' as above.
         xScale() {
             return d3.scaleBand()
                      .domain(this.domain)
                      .range([0, this.dimensions.width])
                      .paddingInner(0.1)
                      .align(0.5);
         }
     }
 });
</script>

<style>
text.x-label {
    writing-mode: tb;
    cursor: pointer;
}

text.x-label:hover {
    fill: #a0a0a0;
}
</style>
