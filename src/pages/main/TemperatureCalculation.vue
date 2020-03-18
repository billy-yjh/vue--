<template>
  <el-container>
    <el-header>温度计算</el-header>
    <el-main>
      <div class="lb-section">
        <el-form
          ref="fundForm"
          :model="fundForm"
          label-width="100px"
          class="demo-ruleForm"
          style="width: 50%"
        >
          <el-form-item label="基金名称">
            <el-input
              v-model.trim="fundForm.fundName"
              type="text"
              autocomplete="off"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="基金代码">
            <el-input
              v-model.trim="fundForm.fundCode"
              type="text"
              autocomplete="off"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <div class="lb-form-action">
            <el-button type="primary" @click="addFund()">添加</el-button>
            <el-button type="info" @click="handleClearFund()">清空</el-button>
          </div>
        </el-form>
      </div>
      <div class="lb-section">
        <el-table v-loading="tableLoading" :data="fundList" border style="width: 70%">
          <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
          <el-table-column prop="fundName" label="基金名称" width="120"></el-table-column>
          <el-table-column prop="fundCode" label="基金代码" width="120"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="cancleTemperature(scope.$index)">删除</el-button>
              <el-button type="text" @click="showDetail(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="lb-section">
        <el-dialog :title="dialogTitle" :visible.sync="detailDialogVisible" width="70%">
          <div class="lb-section">
            <el-form
              ref="temperatureForm"
              :model="temperatureForm"
              label-width="100px"
              class="demo-ruleForm"
              style="width: 50%"
            >
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
          <eacharsModule
            echart_height="300px"
            echart_width="500px"
            :echart_List="nowEchartList"
            :date_List="nowDateList"
          ></eacharsModule>
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
      fundForm: {
        fundName: null,
        fundCode: null
      },
      fundList: [],
      dialogTitle: '',
      localStorageKey: '',
      temperatureForm: {
        peTemperature: null,
        pbTemperature: null
      },
      CtTemperature: null,
      investmentSuggest: null,
      tableLoading: false,
      detailDialogVisible: false,
      nowEchartList: [],
      nowDateList: [],
      allFund: {}
    };
  },
  created() {
    if (JSON.parse(localStorage.getItem("fundList"))) {
      this.fundList = JSON.parse(
        localStorage.getItem("fundList")
      );
    }
  },
  methods: {
    // 添加基金
    addFund() {
      if (!this.fundForm.fundName) {
        this.$message({
          message: "请输入基金名称",
          type: "error"
        });
      }
      if (!this.fundForm.fundCode) {
        this.$message({
          message: "请输入基金代码",
          type: "error"
        });
      }
      const len = this.fundList.length;
      if (len && len > 0) {
        for (let i = 0; i < len; i++) {
          if (this.fundList[i].fundCode === this.fundForm.fundCode) {
            this.fundList.push({
              fundName: this.fundForm.fundName,
              fundCode: this.fundForm.fundCode
            });
          }
        }
      } else {
        this.fundList.push({
          fundName: this.fundForm.fundName,
          fundCode: this.fundForm.fundCode
        });
      }
      localStorage.setItem(
        "fundList",
        JSON.stringify(this.fundList)
      );
    },
    // 清空添加基金的表格
    handleClearFund() {
      this.fundForm = {
        fundName: null,
        fundCode: null
      }
    },
    // 计算温度
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
      let fundTemperatureList
      if (this.localStorageKey && JSON.parse(localStorage.getItem(this.localStorageKey))) {
        fundTemperatureList = JSON.parse(
          localStorage.getItem(this.localStorageKey)
        );
      } else {
        fundTemperatureList = []
      }
      const len = fundTemperatureList.length
      if (len && len > 0) {
        for (let i = 0; i < len; i++) {
          if (
            fundTemperatureList[i].date !== date
          ) {
            fundTemperatureList.push({
              date: date,
              value: target
            });
            this.refreshEcharts(date, target)
          }
        }
      } else {
        fundTemperatureList.push({
          date: date,
          value: target
        });
        this.refreshEcharts(date, target)
      }
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(fundTemperatureList)
      );
    },
    // 刷新 画图工具
    refreshEcharts(date, temperature) {
      this.nowEchartList.push(temperature)
      this.nowDateList.push(date)
      localStorage.setItem(
        `${this.localStorageKey}-nowEchartList`,
        JSON.stringify(this.nowEchartList)
      )
      localStorage.setItem(
        `${this.localStorageKey}-nowDateList`,
        JSON.stringify(this.nowDateList)
      )
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
        pbTemperature: null
      };
      this.CtTemperature = null;
      this.investmentSuggest = null;
    },
    // 展示弹框
    showDetail(index, detail) {
      this.handleClear()
      this.detailDialogVisible = true;
      this.dialogTitle = detail.fundName
      this.localStorageKey = detail.fundCode
      // y轴数据
      if (JSON.parse(localStorage.getItem(`${detail.fundCode}-nowEchartList`))) {
        this.nowEchartList = JSON.parse(
          localStorage.getItem(`${detail.fundCode}-nowEchartList`)
        );
      } else {
        this.nowEchartList = []
      }
      // x轴数据
      if (JSON.parse(localStorage.getItem(`${detail.fundCode}-nowDateList`))) {
        this.nowDateList = JSON.parse(
          localStorage.getItem(`${detail.fundCode}-nowDateList`)
        );
      } else {
        this.nowDateList = []
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>