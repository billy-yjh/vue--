<template>
  <el-container>
    <el-header>温度计算</el-header>
    <el-main>
      <div class="lb-section">
        <el-form
          ref="temperatureForm"
          :model="temperatureForm"
          label-width="100px"
          class="demo-ruleForm"
          style="width: 50%"
        >
          <el-form-item label="基金名称">
            <el-input
              v-model.trim="temperatureForm.fundName"
              type="text"
              autocomplete="off"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="基金代码">
            <el-input
              v-model.trim="temperatureForm.fundCode"
              type="text"
              autocomplete="off"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="PE温度">
            <el-input
              v-model.trim="temperatureForm.peTemperature"
              type="text"
              autocomplete="off"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="PB温度">
            <el-input
              v-model.trim="temperatureForm.pbTemperature"
              type="text"
              autocomplete="off"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="CtTemperature" label="长投温度">
            <div>长投温度: {{ CtTemperature }}</div>
            <div>定投建议：{{ hanldeInvestmentSuggest() }}</div>
          </el-form-item>
          <div class="lb-form-action">
            <el-button type="primary" @click="handleResult()">计算</el-button>
            <el-button type="info" @click="handleClear()">清空</el-button>
          </div>
        </el-form>
      </div>
      <div class="lb-section">
        <el-table v-loading="tableLoading" :data="temperatureList" border style="width: 70%">
          <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
          <el-table-column prop="fundName" label="基金名称" width="120"></el-table-column>
          <el-table-column prop="fundCode" label="基金代码" width="120"></el-table-column>
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="value" label="温度" width="80"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="cancleTemperature(scope.$index)">删除</el-button>
              <el-button type="text" @click="showDetail(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="lb-section">
        <el-dialog title="提示" :visible.sync="detailDialogVisible" width="70%">
          <eacharsModule echart_height="300px" echart_width="500px" :echart_List="nowEchartList" :date_List="nowDateList" ></eacharsModule>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import moment from "moment";
import echarts from "echarts";
import eacharsModule from "../../components/eacharsModule";
export default {
  components: {
    eacharsModule
  },
  data() {
    return {
      moment: moment,
      echarts: echarts,
      temperatureForm: {
        peTemperature: null,
        pbTemperature: null,
        fundName: null,
        fundCode: null
      },
      CtTemperature: null,
      investmentSuggest: null,
      temperatureList: [],
      tableLoading: false,
      detailDialogVisible: false,
      nowEchartList: [],
      nowDateList: [],
      allFund: {}
    };
  },
  created() {
    if (JSON.parse(localStorage.getItem("temperatureList"))) {
      this.temperatureList = JSON.parse(
        localStorage.getItem("temperatureList")
      );
    }
  },
  methods: {
    handleResult() {
      const peTemperature = Number(this.temperatureForm.peTemperature);
      const pbTemperature = Number(this.temperatureForm.pbTemperature);
      this.CtTemperature = (peTemperature + pbTemperature) / 2;
      this.handleTemperatureList(this.CtTemperature, this.temperatureForm);
    },
    // 获取建议
    hanldeInvestmentSuggest() {
      if (!this.CtTemperature) {
        alert("数据不存在");
      }
      if (this.CtTemperature < 10) {
        return "投资比例为100%";
      } else if (this.CtTemperature >= 10 && this.CtTemperature < 20) {
        return "投资比例为80%";
      } else if (this.CtTemperature >= 20 && this.CtTemperature < 25) {
        return "投资比例为60%";
      } else if (this.CtTemperature >= 25 && this.CtTemperature < 30) {
        return "投资比例为50%";
      } else if (this.CtTemperature >= 30 && this.CtTemperature < 40) {
        return "停止投资， 持有";
      } else if (this.CtTemperature >= 40 && this.CtTemperature < 50) {
        return "卖出50%的基金";
      } else {
        return "卖出所有的资金";
      }
    },
    // 获取 温度列表
    handleTemperatureList(target, detail) {
      const date = moment(new Date()).format("YYYY-MM-DD");
      const fundName = detail.fundName;
      const fundCode = detail.fundCode;
      const len = this.temperatureList.length;
      if (len && len > 0) {
        for (let i = 0; i < len; i++) {
          if (this.temperatureList[i].date !== date || this.temperatureList[i].fundCode !== fundCode) {
            this.temperatureList.push({
              date: date,
              value: target,
              fundName: fundName,
              fundCode: fundCode
            });
          }
        }
      } else {
        this.temperatureList.push({
          date: date,
          value: target,
          fundName: fundName,
          fundCode: fundCode
        });
      }
      localStorage.setItem(
        "temperatureList",
        JSON.stringify(this.temperatureList)
      );
    },
    // 删除某一项
    cancleTemperature(index) {
      this.temperatureList.splice(index, 1);
      console.log(this.temperatureList);
      localStorage.setItem(
        "temperatureList",
        JSON.stringify(this.temperatureList)
      );
    },
    // 清空表格
    handleClear() {
      this.temperatureForm = {
        peTemperature: null,
        pbTemperature: null,
        fundName: null,
        fundCode: null
      };
      this.CtTemperature = null;
      this.investmentSuggest = null;
    },
    showDetail(index, detail) {
      this.detailDialogVisible = true;
      this.nowEchartList = [20, 60, 80]
      this.nowDateList = ['2020-8-1', '2020-8-2', '2020-8-3']
    }
  }
};
</script>
<style lang="scss" scoped>
</style>