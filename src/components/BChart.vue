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
            fill="black"><title>{{category}}</title>{{category}}</text>

      <!-- This loop is 1-based -->
      <text v-for="n in nTicks"
            :y="getYLabelOffset(n)"
            x="0"
            :font-size="labelFontSize"
            :dx="yLabelOuterPadding"
            :dy="yLabelVerticalOffset"
            text-anchor="end">{{getYLabelText(n - 1)}}</text>
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
import _ from 'lodash';
import * as log from 'loglevel';
import {sprintf} from 'sprintf-js';

const LABEL_FONT_SIZE = "1rem";

// Gap between the x-axis and the x-label
const X_LABEL_OUTER_PADDING = "0.4em";

// Gap between the y-axis and the y-label.  Unfortunately this is somewhat
// dependent on the length of the text of the y-labels, because SVG doesn't have
// a box model.
// Using em because Firefox doesn't support rem in SVG for some reason, at least
// FF52 doesn't lay this text out properly with rem.
const Y_LABEL_OUTER_PADDING = "-0.4em";

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
        log.debug("margin translation expr is %o", this.marginTranslation);
    },
    data: function() {
        const dimensions = {
            width: this.outerWidth - margin.left - margin.right,
            height: this.outerHeight - margin.top - margin.bottom
        };
        return {
            dimensions,
            nTicks: 10,
            yLabelOuterPadding: Y_LABEL_OUTER_PADDING,
            yLabelVerticalOffset: Y_LABEL_VERTICAL_OFFSET,
            labelFontSize: LABEL_FONT_SIZE,
            xLabelOuterPadding: X_LABEL_OUTER_PADDING
        };
    },
    created() {
        log.debug("margin translation expr is %o", this.marginTranslation);
        log.debug("ymax is %o", this.yMax);
        log.debug("ymax is %o", this.yMin);
        log.debug("ticks are %o", this.yTicks);
    },
    methods: {
        getYLabelText(n) {
            log.debug("yticks is %o", this.yTicks);
            log.debug("requested n as %o", n);

            const thisTickValue = this.yTicks[n];

            // This is half-way between a magic number and something that's
            // an innate constant, being-as-it-is the base of our number system.
            if (this.adjustedBounds.max > 10) {
                // We're flat out truncating non-integer values in this case,
                // because we just DGAF.
                return sprintf("%.0f", thisTickValue);
            } else {
                return sprintf("%.2f", thisTickValue);
            }
        },
        getYLabelOffset(n) {
            // It's more like we would probably just create a new scale to do this.
            // Range here should be the same as the domain of the y-scale.

            if (!this.points.length) {
                return 0;
            }

            const intermediary = this.getIntermediaryScale();
            const result = intermediary(n);
            const realResult = this.dimensions.height - this.heightScale(result);
            return realResult;
        },

        getIntermediaryScale() {
            return d3.scaleLinear()
                  .domain([0, this.nTicks])
                  .range([0, this.adjustedBounds.max]);
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
         getXLabelOffset(index) {
             const s = this.xScale;

             // See this diagram to see why this works:
             // https://raw.githubusercontent.com/d3/d3-scale/master/img/band.png
             const usedSpaceSoFar = s.step() * index;
             const val = s.paddingOuter() + usedSpaceSoFar + (s.bandwidth() / 2);

             return val;
         },
         onBarClicked() {
             log.debug("bar was clicked");
         },
         onXLabelClicked(category) {
             log.debug("x-label was clicked, the category was %o", category);
             this.$emit('x-label-clicked', category);
         },
         showDetailTooltip() {
             log.debug("showing the detail tooltip");
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
         },
         yMax() {
             return _.max(this.points.map(point => point.y));
         },
         yMin() {
             return _.min(this.points.map(point => point.y));
         },
         adjustedBounds() {
             return utility.getAdjustedBounds(this.yMin, this.yMax);
         },
         heightScale() {
             return d3.scaleLinear().domain([0, this.adjustedBounds.max]).range([0, this.dimensions.height]);
         },
         yTicks() {
             return utility.generateTicks(0, this.yMax, 10);
         }
     }
 });
</script>

<style>
text.x-label {
    writing-mode: tb;   /* Write labels top-to-bottom! */
    cursor: pointer;
}

text.x-label:hover {
    fill: #a0a0a0;
}
</style>
