<template>
  <b-row class="mt-3">
    <b-col>
      <b-row class="mb-3">
        <b-col cols="3">
          <b-button @click="regenerate" variant="primary">Generate Data</b-button>
        </b-col>
        <b-col cols="2" class="text-right p-2">
          <span>Tolerance Quantile: {{(quantile * 100).toFixed(1)}}%</span>
        </b-col>
        <b-col>
          <b-form-input id="range-2" v-model="quantile" type="range" min="0" max="1" step="0.05"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col>
          <b-card header="Rhythmic Exercise Performance Overall"
                  header-class="p-2"
                  header-bg-variant="primary"
                  header-text-variant="white"
                  body-class="p-2"
                  class="shadow-sm"
                  border-variant="primary">
            <b-row>
              <b-col>
                <b-card header="Frequency by miscount duration"
                        header-class="p-2"
                        header-bg-variant="light"
                        body-class="p-2"
                        class="shadow-sm"
                        border-variant="secondary">
                  <v-chart class="w-100" :options="missCounts"/>
                  <b-card-footer footer-bg-variant="light" class="m-0 p-2">
                    <h5 class="m-0 float-left mr-2">
                      <b-badge class="text-white" :style="{background: palette.ok}">Tolerated Error</b-badge>
                    </h5>
                    <h5 class="m-0">
                      <b-badge class="text-white" :style="{background: palette.notOk}">Out of tolerance</b-badge>
                    </h5>
                  </b-card-footer>
                </b-card>
              </b-col>
              <b-col>
                <b-card header="Tolerance Distribution"
                        header-class="p-2"
                        header-bg-variant="light"
                        body-class="p-2"
                        class="shadow-sm"
                        border-variant="secondary">
                  <v-chart class="w-100" :options="tolerancePie"/>
                </b-card>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card header="Exercise Submission Rate"
                  header-class="p-2"
                  header-bg-variant="primary"
                  header-text-variant="white"
                  body-class="p-2"
                  class="shadow-sm"
                  border-variant="primary">
            <v-chart :options="gauge" class="pt-5"/>
          </b-card>
        </b-col>
        <b-col>
          <b-card header="Start and Completion Rate by Exercise"
                  header-class="p-2"
                  header-bg-variant="primary"
                  header-text-variant="white"
                  body-class="p-2"
                  class="shadow-sm"
                  border-variant="primary">
            <v-chart :options="successByExercise" class="pt-5"/>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/gauge";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import {generateRhythm, exerciseCompletion} from "../lib/generator";

// Dark to lightgreen
// const greens = ["007f5f", "2b9348", "55a630", "80b918", "aacc00", "bfd200", "d4d700", "dddf00", "eeef20", "ffff3f"];

const palette = {
  ok: "#55a630",
  notOk: "#aacc00",
};

export default {
  name: "Dashboard",
  components: {"v-chart": ECharts},
  data() {
    const {isTolerated, sampleSize, spanSize, histogram, partitionTolerance} = generateRhythm({quantile: 0.55});
    const completionRate = exerciseCompletion();
    const submissionRate = completionRate.map(v => v[1])
      .reduce((a, b) => a + b) / completionRate.map(v => v[0])
      .reduce((a, b) => a + b) * 100;

    return {
      isTolerated, sampleSize, spanSize, histogram, partitionTolerance,
      quantile: 0.55,
      palette: palette,
      missCounts: {
        width: "auto",
        legend: {
          padding: 5,
          show: true,
          right: 10,
          top: 10,
        },
        itemStyle: {
          color: i => this.isTolerated[i.dataIndex] ? palette.ok : palette.notOk,
        },
        xAxis: {
          name: `Counting error, either to fast (-) or too slow (+) (Samples: ${sampleSize})`,
          nameLocation: "center",
          nameTextStyle: {
            padding: [18, 0, 0, 0],
          },
          silent: true,
          data: new Array(2 * spanSize + 1).fill(0)
            .map((e, i) => i - spanSize),
          axisLabel: {
            interval: (index, value) => value % (spanSize / 4) === 0,
            showMinLabel: true,
            showMaxLabel: true,
            formatter: "{value}ms",
          },
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: histogram,
          },
        ],
      },
      gauge: {
        min: 0,
        max: 100,
        series: [
          {
            type: "gauge",
            startAngle: 180,
            radius: "100%",
            endAngle: 0,
            grid: {
              bottom: 0,
            },
            axisLabel: {
              show: true,
              fontSize: 8,
              formatter: "{value}%",
              color: "#000",
            },
            axisLine: {
              lineStyle: {
                width: 55,
                color: [[0.25, "#d4d700ff"], [0.75, "#aacc00ff"], [1.0, "#80b918ff"] /* [0.6, "#55a630ff"], [0.8, "#2b9348ff"], [1.0, "#007f5fff"],/*[0.6, "#bfd200ff"], [0.7, "#d4d700ff"], [0.8, "#dddf00ff"], [0.9, "#eeef20ff"], [1.0, "#ffff3fff"]*/],
              },
            },
            axisTick: {
              show: false,
              length: 65,
              lineStyle: {
                color: "auto",
              },
            },
            splitLine: {
              length: 70,
              lineStyle: {
                color: "auto",
              },
            },
            pointer: {
              width: 6,
              length: "90%",
            },
            itemStyle: {
              borderColor: "#a2a2a2",
              borderWidth: 1,
              //   color: "#000", // pointer color
            },
            title: {},
            detail: {
              formatter: value => `${value.toFixed(0)}%`,
              fontWeight: "bolder",
            },
            data: [{value: submissionRate}],
            padding: 0,
          },
        ],
      },
      tolerancePie: {
        series: [
          {
            type: "pie",
            radius: ["60%", "80%"],
            color: [palette.notOk, palette.ok],
            data: [
              {value: partitionTolerance[0], name: `Tolerable`},
              {value: partitionTolerance[1], name: `Intolerable`},
            ].sort(function (a, b) { return a.value - b.value; }),
            roseType: "radius",
            label: {
              fontSize: 16,
            },
          },
        ],
      },
      successByExercise: {
        trigger: "axis",
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: "shadow",        // 默认为直线，可选为：'line' | 'shadow'
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          data: ["Started", "Completed"],
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: new Array(8).fill(0)
            .map((_, i) => `Exercise ${i + 1}`)
            .reverse(),
        },
        series: [
          {
            name: "Started",
            type: "bar",
            color: palette.notOk,
            stack: "总量",
            label: {
              show: true,
              position: "insideRight",
            },
            data: completionRate.map(v => v[0]),
          },
          {
            name: "Completed",
            type: "bar",
            stack: "总量",
            color: palette.ok,
            label: {
              show: true,
              position: "insideRight",
            },
            data: completionRate.map(v => v[1]),
          },
        ],
      },
    };
  },
  methods: {
    regenerate() {
      const {isTolerated, histogram, partitionTolerance} = generateRhythm({quantile: this.quantile});
      this.isTolerated = isTolerated;
      this.missCounts.series[0].data = histogram;
      this.tolerancePie.series[0].data = [
        {value: partitionTolerance[0], name: `Tolerable`},
        {value: partitionTolerance[1], name: `Intolerable`},
      ].sort(function (a, b) { return a.value - b.value; });
      const completionRate = exerciseCompletion();
      this.gauge.series[0].data[0].value = completionRate.map(v => v[1])
        .reduce((a, b) => a + b) / completionRate.map(v => v[0])
        .reduce((a, b) => a + b) * 100;
      this.successByExercise.series[0].data = completionRate.map(v => v[0]);
      this.successByExercise.series[0].data = completionRate.map(v => v[1]);
    },
  },
};
</script>

<style scoped>

</style>