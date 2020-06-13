<template>
  <b-row class="mt-3">
    <b-col>
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
                <b-card header="Tolerance Division Runs"
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
          <b-card header="Submission Rate"
                  header-class="p-2"
                  header-bg-variant="primary"
                  header-text-variant="white"
                  body-class="p-2"
                  class="shadow-sm"
                  border-variant="primary">
            <v-chart :options="gauge" class="pt-5" />
          </b-card>
        </b-col>
        <b-col>

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

/**
 * General normal distributed random variable.
 * @see https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
 * @param {Number} min
 * @param {Number} max
 * @param {Number} skew
 * @returns {Number}
 */
function randn_bm(min, max, skew, sigma = 1.0, mu = 0) {
  let u = 0, v = 0;
  while (u === 0) {
    u = Math.random();
  }
  // Converting [0,1) to (0,1)
  while (v === 0) {
    v = Math.random();
  }
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    num = randn_bm(min, max, skew);
  }

  // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min

  return sigma * num + mu;
}

export default {
  name: "Dashboard",
  components: {"v-chart": ECharts},
  data() {
    // Normal distribution saved in array.
    // The array is divided into two parts, 0..sampleSize < 0 and n..2sampleSize > 0
    const sampleSize = 60000;
    const spanSize = 500;
    const randomStudentMissCounts = new Array(sampleSize).fill(0)
      .map(_ => parseInt(randn_bm(-spanSize, spanSize, 1, 1)));
    const groupedMissCounts = new Array(2 * spanSize).fill(0);
    randomStudentMissCounts.forEach(v => groupedMissCounts[v + spanSize] += 1);
    // Flatten the middle "spike", due to artificial data.
    groupedMissCounts.forEach((val, i) => {
      // Make it more unlikely, that some counted exactly mathematically perfect
      const dX = Math.pow(Math.abs(i - spanSize) * 2 / spanSize, 2.8);
      groupedMissCounts[i] = val * dX * 11;
    });
    // Flatten center spike
    // groupedMissCounts[groupedMissCounts.length / 2] = (groupedMissCounts[groupedMissCounts.length / 2 - 1] + groupedMissCounts[groupedMissCounts.length / 2 + 1]) / 2;
    const partitionTolerance = [0, 0];

    // For quantile color lookup later
    const isTolerated = groupedMissCounts.map((val, i) => {
      const dX = Math.abs(i - spanSize);
      const tolerated = dX < spanSize * 0.55;
      partitionTolerance[tolerated ? 0 : 1] += val;
      return tolerated;
    });

    const data = [];

    for (let i = 0; i <= 360; i++) {
      const t = i / 180 * Math.PI;
      const r = Math.sin(2 * t) * Math.cos(2 * t);
      data.push([r, i]);
    }
    // Dark to lightgreen
    // const greens = ["007f5f", "2b9348", "55a630", "80b918", "aacc00", "bfd200", "d4d700", "dddf00", "eeef20", "ffff3f"];

    const palette = {
      ok: "#55a630",
      notOk: "#aacc00",
    };

    return {
      palette: palette,
      missCounts: {
        width: "auto",
        grid: {
          left: 40,
          top: 30,
          right: 40,
          bottom: 70,
        },
        itemStyle: {
          color: i => isTolerated[i.dataIndex] ? palette.ok : palette.notOk,
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
            data: groupedMissCounts,
          },
        ],
      },
      gauge: {
        title: {text: "Something"},
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
            data: [{value: 70.5}],
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
    };
  },
};
</script>

<style scoped>

</style>