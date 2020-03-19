<template>
  <el-container>
    <el-header>博格公式计算</el-header>
    <div>
      <div class="lb-section-header">股市长期回报率 = 初始投资时刻的股息率 +投资期内的盈利增长率 + 投资期内的市盈率变化率</div>
      <div class="lb-section-header">初始投资时刻的股息率 (理杏仁 -> 股息率)</div>
      <div class="lb-section-header">投资期内的盈利增长率 (10年GDP的平均值)</div>
      <div class="lb-section-header">
        投资期内的市盈率变化率 (理杏仁 -> PE 10 年; 市盈率:市值加权; 危险值:80%分位点; 中位值:50%分位点; 机会值:50%分位点)<br />
        年化收益率的计算公式=【（未来的价格/现在的价格）^(1/n)-1】*100%
      </div>
      <div class="lb-section">
        <el-form
          ref="bergFormulaFrom"
          :model="bergFormulaFrom"
          label-width="170px"
          style="width: 50%"
          class="demo-ruleForm"
        >
          <el-form-item label="初始投资时刻的股息率">
            <el-input v-model.trim="bergFormulaFrom.initialDividendRate" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="投资期内的盈利增长率">
            <el-input v-model.trim="bergFormulaFrom.profitGrowthRate" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="当前值">
            <el-input v-model.trim="bergFormulaFrom.currentValue" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="乐观值">
            <el-input v-model.trim="bergFormulaFrom.optimisticValue" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="中性值">
            <el-input v-model.trim="bergFormulaFrom.neutralValue" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="悲观值">
            <el-input v-model.trim="bergFormulaFrom.pessimisticValue" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="optimisticResult || neutralResult || pessimisticResult">
            <div>乐观年投资回报率：{{optimisticResult}}</div>
            <div>中性年投资回报率：{{neutralResult}}</div>
            <div>悲观年投资回报率：{{pessimisticResult}}</div>
          </el-form-item>
          <div class="lb-form-action">
            <el-button type="primary" @click="handleCalculate()">计算</el-button>
            <el-button @click="handleClear()">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      bergFormulaFrom: {
        initialDividendRate: null,
        profitGrowthRate: null,
        // 当前值
        currentValue: null,
        // 乐观值
        optimisticValue: null,
        // 中性值
        neutralValue: null,
        // 悲观值
        pessimisticValue: null
      },
      optimisticResult: null,
      neutralResult: null,
      pessimisticResult: null
    }
  },
  methods: {
    handleClear() {
      this.bergFormulaFrom = {
        initialDividendRate: null,
        profitGrowthRate: null,
        // 乐观盈利增长率
        optimisticProfitGrowthRate: null,
        // 中性盈利增长率
        neutralProfitGrowthRate: null,
        // 悲观盈利增长率
        pessimisticProfitGrowthRate: null
      }
    },
    handleCalculate() {
      if (!this.bergFormulaFrom.initialDividendRate) {
        this.$message({
          message: '请填写 初始投资时刻的股息率',
          type: 'error'
        });
      }
      if (!this.bergFormulaFrom.profitGrowthRate) {
        this.$message({
          message: '请填写 投资期内的盈利增长率',
          type: 'error'
        });
      }
      if (!this.bergFormulaFrom.currentValue) {
        this.$message({
          message: '请填写 当前值',
          type: 'error'
        });
      }
      if (!this.bergFormulaFrom.optimisticValue && !this.bergFormulaFrom.neutralValue && !this.bergFormulaFrom.pessimisticValue) {
        this.$message({
          message: '请填写至少一数值',
          type: 'error'
        });
      }
      if (this.bergFormulaFrom.optimisticValue) {
        const optimisticRate = this.handleProfitGrowthRate(this.bergFormulaFrom.optimisticValue, 3)
        this.optimisticResult = ((Number(this.bergFormulaFrom.initialDividendRate) + Number(this.bergFormulaFrom.profitGrowthRate) + optimisticRate) * 100).toFixed(2) + " %"
      }
      if (this.bergFormulaFrom.neutralValue) {
        const neutralRate = this.handleProfitGrowthRate(this.bergFormulaFrom.neutralValue, 3)
        this.neutralResult = ((Number(this.bergFormulaFrom.initialDividendRate) + Number(this.bergFormulaFrom.profitGrowthRate) + neutralRate) * 100).toFixed(2) + " %"
      }
      if (this.bergFormulaFrom.pessimisticValue) {
        const pessimistic = this.handleProfitGrowthRate(this.bergFormulaFrom.pessimisticValue, 3)
        this.pessimisticResult = ((Number(this.bergFormulaFrom.initialDividendRate) + Number(this.bergFormulaFrom.profitGrowthRate) + pessimistic) * 100).toFixed(2) + " %"
      }
    },
    handleProfitGrowthRate(value, year) {
      const base = Number(value) / Number(this.bergFormulaFrom.currentValue)
      const exponent = 1 / Number(year)
      const result = (Math.pow(base, exponent) - 1)
      return result
    }
  }
};
</script>
<style lang="scss" scoped>
</style>