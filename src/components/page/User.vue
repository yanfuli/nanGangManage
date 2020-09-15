<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
                <el-button type="primary" class="handle-del mr10" @click="addAdmin">添加成员</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column label="序号" width="60">
                    <template slot-scope="scope">
                        {{scope.$index}}
                    </template>
                </el-table-column>
                <el-table-column prop="displayName" label="姓名">
                </el-table-column>
                <el-table-column prop="username" label="用户名">
                </el-table-column>
                <el-table-column prop="password" label="密码" >
                </el-table-column>
                <el-table-column prop="role" label="角色">
                </el-table-column>
                <el-table-column label="操作" width="260">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" @click="changePassword(scope.$index, scope.row)">修改密码</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="显示名">
                    <el-input v-model="form.displayName" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="登录名">
                    <el-input v-model="form.username" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="密码" v-if="dialogTitle=='添加'">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="旧密码" v-if="dialogTitle=='修改密码'">
                    <el-input v-model="form.oldPwd"></el-input>
                </el-form-item>
                <el-form-item label="新密码" v-if="dialogTitle=='修改密码'">
                    <el-input v-model="form.newPwd"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" v-if="dialogTitle!='编辑'">
                    <el-input v-model="form.confirmPwd"></el-input>
                </el-form-item>
                <el-form-item label="角色" v-if="dialogTitle!='修改密码'">
                    <el-select v-model="form.role" class="handle-select mr10">
                        <el-option key="1" label="管理员" value="admin"></el-option>
                        <el-option key="2" label="用户" value=""></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

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
    import https from '../../https.js' 
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
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1,
                disabled:false,
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
            // 获取 easy-mock 的模拟数据
            getData() {
                var that = this;
                let params = {
                    pageIndexB1:that.cur_page,
                    pageSize:10,
                }
                console.log(params)
                https.fetchPost('console/user',params ).then((e) => {
                console.log(e)
                if(e.code==0){
                    that.tableData = e.body;
                    that.total = e.total;
                }
                if(e.code==5003){
                    this.$router.push('/login');
                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            // 添加
            addAdmin(){
                let that = this;
                that.form = {
                    confirmPwd: '',
                    password:'',
                    username:'',
                    displayName:'',
                    role:''
                }
                that.editVisible = true;
                that.dialogTitle="添加"
            },
            // 修改
            handleEdit(index, row) {
                let that = this;
                that.idx = index;
                const item = this.tableData[index];
                console.log(item)
                that.form = {
                    confirmPwd: item.confirmpsw,
                    password:item.password,
                    username:item.username,
                    displayName:item.displayName,
                    role:item.role,
                    id:item.id
                }
                that.editVisible = true;
                that.dialogTitle="编辑"
            },
            // 修改密码
            changePassword(index, row){
                let that = this;
                that.idx = index;
                const item = this.tableData[index];
                console.log(item)
                that.form = {
                    confirmPwd: '',
                    newPwd:'',
                    oldPwd:'',
                    username:item.username,
                    displayName:item.displayName,
                    id:item.id
                }
                that.disabled = true;
                that.editVisible = true;
                that.dialogTitle="修改密码"
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
                this.form = {
                    id:row.id
                }
            },
            // delAll() {
            //     const length = this.multipleSelection.length;
            //     let str = '';
            //     this.del_list = this.del_list.concat(this.multipleSelection);
            //     for (let i = 0; i < length; i++) {
            //         str += this.multipleSelection[i].name + ' ';
            //     }
            //     this.$message.error('删除了' + str);
            //     this.multipleSelection = [];
            // },
            // handleSelectionChange(val) {
            //     this.multipleSelection = val;
            // },
            // 保存编辑
            saveEdit() {
                // this.$set(this.tableData, this.idx, this.form);
                // this.editVisible = false;
                // this.$message.success(`修改第 ${this.idx+1} 行成功`);
                let that = this;
                let params;
                if(that.dialogTitle=='添加'){
                    params = {
                        displayName:that.form.displayName,
                        username:that.form.username,
                        role:that.form.role,
                        password:that.form.password
                    }
                    https.fetchPut('console/user',params ).then((e) => {
                    console.log(e)
                    if(e.code==0){
                        that.getData()
                        that.editVisible = false;
                    }
                    }).catch(err=>{
                        console.log(err)
                    })
                }
                if(that.dialogTitle=='编辑'){
                    params = {
                        displayName:that.form.displayName,
                        username:that.form.username,
                        role:that.form.role,
                        id:that.form.id
                    }
                    https.fetchPut('console/user',params ).then((e) => {
                    console.log(e)
                    if(e.code==0){
                        that.getData()
                        that.editVisible = false;
                    }
                    }).catch(err=>{
                        console.log(err)
                    })
                }
                if(that.dialogTitle=='修改密码'){
                    params = {
                        id:that.form.id,
                        confirmPwd: that.form.confirmPwd,
                        newPwd:that.form.newPwd,
                        oldPwd:that.form.oldPwd,
                    }
                    // console/user/changePwd
                    console.log(params)
                    https.fetchPost('console/user/changePwd',params ).then((e) => {
                    console.log(e)
                    if(e.code==0){
                        that.getData()
                        that.editVisible = false;
                    }
                    }).catch(err=>{
                        console.log(err)
                    })
                }
                
            },
            // 确定删除
            deleteRow(){
                let that = this;
                let params = {
                    }
                    console.log(params)
                    https.fetchPost('console/user/remove/'+that.form.id,params ).then((e) => {
                    console.log(e)
                    if(e.code==0){
                        that.getData()
                        that.delVisible = false;
                        that.$message.success('删除成功');
                    }
                    }).catch(err=>{
                        console.log(err)
                    })
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
