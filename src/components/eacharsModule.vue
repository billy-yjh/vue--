<template>
  <div ref="eachars" :style="{height: echart_height, width: echart_width}"></div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    echart_height: {
      type: String,
      default() {
        return "300px";
      }
    },
    echart_width: {
      type: String,
      default() {
        return "500px";
      }
    },
    echart_List: {
      type: Array,
      default() {
        return []
      }
    },
    date_List: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      echarts: echarts
    };
  },
  mounted() {
    this.init();
    const self = this;
    window.addEventListener("resize", function(event) {
      //改变窗口大小，echarts图表响应式改变
      self.chart.resize();
    });
  },
  methods: {
    init() {
      // 引用时 要先用echarts的init方法初始化一下
      const myChart = echarts.init(this.$refs.eachars);
      const option = {
        xAxis: {
          type: "category",
          data: this.date_List
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.echart_List,
            type: "line"
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>