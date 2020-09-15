<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 资讯列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
                <el-button type="primary" class="handle-del mr10" @click="addAdmin">添加新闻</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column label="序号" width="60">
                    <template slot-scope="scope">
                        {{scope.$index}}
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column prop="coverImgId" label="封面">
                    <template slot-scope="scope">
                        <img :src="scope.row.coverImgId" alt="" width="100%" height="90px">
                    </template>
                </el-table-column>
                <el-table-column prop="authorName" label="作者" >
                </el-table-column>
                <el-table-column prop="display" label="是否显示">
                    <template slot-scope="scope">
                        <!-- {{scope.row.display==1?"显示":"隐藏"}} -->
                        <el-switch
                        v-model="scope.row.display"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="changeDisplay(scope.row)">
                        </el-switch>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="260">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import https from '../../../https.js' 
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                dialogTitle:'',
                form: {
                },
                idx: -1,
                // disabled:false,
                total:0
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
                this.cur_page = val;
                this.getData();
            },
            getData() {
                var that = this;
                let params = {
                    pageIndexB1:that.cur_page,
                    pageSize:10,
                }
                console.log(params)
                https.fetchPost('information2/news/list',params ).then((e) => {
                console.log(e)
                if(e.code==0){
                    that.tableData = e.body;
                    that.total = e.total;
                    for (let i = 0; i < that.tableData.length; i++) {
                            that.tableData[i].display == 1 ? that.tableData[i].display = true : that.tableData[i].display == 0 ? that.tableData[i].display = false : '';
                        }
                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            
            // 添加
            addAdmin(){
                let that = this;
                that.$router.push({ path: '/addNews'})
            },
            // 修改
            handleEdit(index, row) {
                let that = this;
                that.$router.push({ path: '/addNews', query: { id: row.id }})
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
                this.form = {
                    id:row.id
                }
            },
            // 确定删除
            deleteRow(){
                let that = this;
                let params = {
                    }
                    console.log(params)
                    https.fetchPost('information2/news/remove/'+that.form.id,params ).then((e) => {
                    console.log(e)
                    if(e.code==0){
                        that.getData()
                        that.delVisible = false;
                        that.$message.success('删除成功');
                    }
                    }).catch(err=>{
                        console.log(err)
                    })
            },
            // 改变状态
            changeDisplay(row){
                console.log(row);
                const that = this;
                let display = '';
                row.display == true ? display = 1 : row.display == false ? display = 0 : '';
                if(display==1){
                    let params = {}
                    https.fetchPost('information2/news/show/'+row.id,params ).then((e) => {
                    console.log(e)
                    if(e.code==0){
                        that.$message.success('状态修改成功');
                    }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else{
                    let params = {}
                    https.fetchPost('information2/news/hide/'+row.id,params ).then((e) => {
                        console.log(e)
                        if(e.code==0){
                            that.$message.success('状态修改成功');
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }
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
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }

</style>
