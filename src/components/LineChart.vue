<script>
import { Line } from "vue-chartjs";
import { calculateBalanceOvertime } from "../common/api";

export default {
  extends: Line,
  props: ["chartdata", "options"],
  options: {
    responsive: true,
    maintainAspectRatio: true,
  },
  mounted() {
    calculateBalanceOvertime().then((dataSet) => {
      this.renderChart(dataSet, this.options);
    });
  },
};
</script>
<style scoped>
#line-chart {
  max-width: 800px !important;
  max-height: 800px !important;
  margin: auto;
}
</style>