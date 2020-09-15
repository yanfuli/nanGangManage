<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 员工管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>。 -->
                <!-- <el-select v-model="select_cate" placeholder="选择区域" class="handle-select mr10">
                    <el-option key="1" label="南岗区" value="南岗区"></el-option>
                    <el-option key="2" label="道里区" value="道里区"></el-option>
                    <el-option key="1" label="江北区" value="江北区"></el-option>
                    <el-option key="2" label="香坊区" value="香坊区"></el-option>
                    <el-option key="1" label="道外区" value="道外区"></el-option>
                    <el-option key="2" label="平房区" value="平房区"></el-option>
                    <el-option key="1" label="松北区" value="松北区"></el-option>
                    <el-option key="2" label="开发区" value="开发区"></el-option>
                </el-select> -->
                <el-input v-model="shopName" size="small" placeholder="请输入商户名称"  class="handle-input mr10" @change="getShopName"></el-input>
                <el-input v-model="vipIdNo" size="small" placeholder="请输入员工身份证号" class="handle-input mr10" @change="getVipIdNo"></el-input>
                <el-input v-model="vipName" size="small" placeholder="请输入员工姓名" class="handle-input mr10" @change="getVipName"></el-input>
                <el-input v-model="vipPhone" size="small" placeholder="请输入员工电话" class="handle-input mr10" @change="getVipPhone"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="vipName" label="姓名">
                </el-table-column>
                <el-table-column prop="name" label="头像">
                    <template slot-scope="scope">
                        <img :src="imgUrl + scope.row.id" alt="" srcset="" width="auto" height="90px">
                    </template>
                </el-table-column>
                <el-table-column prop="vipIdNo" label="身份证号">
                </el-table-column>
                <el-table-column prop="vipPhone" label="电话">
                </el-table-column>
                <el-table-column prop="createTm" label="创建时间">
                </el-table-column>
                <el-table-column prop="shopName" label="商户名称">
                </el-table-column>
                <el-table-column prop="shopAddress" label="区域" width="260">
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleSee(scope.row)">查看考勤</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
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
                imgUrl:'http://192.168.2.206:8090/smallapp/membersImage/',
                shopName:'',
                shopAddress:'',
                vipName:'',
                vipIdNo:'',
                vipPhone:''
            }
        },
        created() {
            this.getData();
        },
        computed: {
            
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                console.log(val)
                this.cur_page = val;
                this.getData();
            },
            getShopName(val){
                console.log(val)
                this.shopName = val;
                this.getData();
            },
            getVipIdNo(val){
                this.VipIdNo = val;
                this.getData();
            },
            getVipName(val){
                this.vipName = val;
                this.getData();
            },
            getVipPhone(val){
                this.vipPhone = val;
                this.getData();
            },
            // 时间转化
            timeTransverter(date) {
                var date = new Date(date);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? "0" + m : m;
                var d = date.getDate();
                d = d < 10 ? "0" + d : d;
                return y + "-" + m + "-" + d;
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                var that = this;
                let params = {
                    pageIndexB1:that.cur_page,
                    pageSize:10,
                    shopName:that.shopName,
                    shopAddress:that.shopAddress,
                    vipName:that.vipName,
                    vipIdNo:that.vipIdNo,
                    vipPhone:that.vipPhone
                }
                console.log(params)
                https.fetchPost('/member/list',params ).then((e) => {
                console.log(e)
                if(e.code==0){
                    that.tableData = e.body;
                    that.total = e.total;
                    for(var i=0; i<that.tableData.length; i++){
                        that.tableData[i].createTm = that.timeTransverter(that.tableData[i].createTm);
                    }
                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            
            search() {
                this.getData()
            },
            handleSee(row){
                this.$router.push({ path: '/employeeAtt', query: { id: row.id,shopId:row.appUserId,vipName:row.vipName }})
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
