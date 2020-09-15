<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 员工考勤</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <p class="handle-name">员工：{{vipName}}考勤</p>
                <el-date-picker
                    v-model="value"
                    type="month"
                    placeholder="选择月"
                    value-format="yyyy-MM"
                    @change="getMonth">
                </el-date-picker>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                
                <!-- <el-table-column prop="vipName" label="员工姓名">
                </el-table-column> -->
                <el-table-column prop="date" label="日期">
                </el-table-column>
                <el-table-column prop="minTime" label="上午考勤">
                </el-table-column>
                <el-table-column prop="maxTime" label="下午考勤">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import https from '../../../https'
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                total:0,
                value:'',
                vipName:''
            }
        },
        created() {
            this.value = this.addDate()
            this.getData();
        },
        computed: {
            
        },
        
        methods: {
            // 选择日期
            getMonth(val){
                console.log(val)
                this.value = val;
                this.getData();
            },
            // 获取当前日期
            addDate () {
                let nowDate = new Date()
                let date = {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth() + 1,
                    date: nowDate.getDate()
                }
                return date.year + '-' + date.month
            },
            
            // 获取 easy-mock 的模拟数据
            getData() {
                var that = this;
                let params = {
                    pageIndexB1:that.cur_page,
                    pageSize:10,
                }
                console.log(params)
                https.fetchGet('/smallapp/duty/'+that.$route.query.shopId+'/'+that.$route.query.id+'/'+that.value,params ).then((e) => {
                console.log(e)
                if(e.code==0){
                    that.tableData = e.body;
                    that.total = e.total;
                    that.vipName = that.$route.query.vipName
                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            
            search() {
                this.getData()
            },
        }
    }

</script>

<style scoped>
    .handle-box {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    .handle-name{
        font-size: 16px;
        color: #666666;
        margin-right: 10px;
    }
    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 200px;
        /* display: inline-block; */
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
