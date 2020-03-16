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
          </div>
        </el-form>
      </div>
      <div class="lb-section">
        <el-table v-loading="tableLoading" :data="temperatureList" border style="width: 40%">
          <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="value" label="温度" width="80"></el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="cancleTemperature(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      moment: moment,
      temperatureForm: {
        peTemperature: null,
        pbTemperature: null
      },
      CtTemperature: null,
      investmentSuggest: null,
      temperatureList: [],
      tableLoading: false
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
      this.handleTemperatureList(this.CtTemperature);
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
    handleTemperatureList(target) {
      const date = moment(new Date()).format("YYYY-MM-DD");
      const len = this.temperatureList.length;
      if (len && len > 0) {
        for (let i = 0; i < len; i++) {
          if (this.temperatureList[i].date !== date) {
            this.temperatureList.push({ date: date, value: target });
          }
        }
      } else {
        this.temperatureList.push({ date: date, value: target });
      }
      localStorage.setItem(
        "temperatureList",
        JSON.stringify(this.temperatureList)
      );
    },
    // 删除某一项
    cancleTemperature(index) {
      this.temperatureList.splice(index, 1)
      console.log(this.temperatureList)
      localStorage.setItem(
        "temperatureList",
        JSON.stringify(this.temperatureList)
      );
    }
  }
};
</script>
<style lang="scss" scoped>
</style>