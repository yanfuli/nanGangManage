<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column label="序号" width="60">
                    <template slot-scope="scope">
                        {{scope.$index}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="coverImgId"
                        label="封面图"
                >
                    <template slot-scope="scope">
                        <img :src="scope.row.url" alt="" width="auto" height="90px">
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <!-- <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-upload
                    class="cover-upload"
                    :action="saveImg"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess">
                    <i class="el-icon-plus cover-icon"></i>
                    <img class="cover-img" width="100%" :src="imageUrl" alt="">
                </el-upload>
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
                cur_page:1,
                tableData: [],
                imageUrl: '',
                saveImg:'https://ng.mangocloud.com.cn/imgserv/image/uploadImages',
                editVisible: false,
                delVisible: false,
                form: {
                    
                },
                url:'',
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
        },
        methods: {
            handleAvatarSuccess(res, file) {
                console.log(res)
                this.imageUrl = URL.createObjectURL(file.raw);
                this.url = res.data[0]
            },
            handleEdit(index, row) {
                console.log(row)
                let that = this;
                that.editVisible = true;
                that.id = row.id
            },
            getData() {
                var that = this;
                let params = {
                    pageIndexB1:that.cur_page,
                    pageSize:10,
                }
                console.log(params)
                https.fetchPost('banner2/banners',params ).then((e) => {
                console.log(e)
                if(e.code==0){
                    that.tableData = e.body;
                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            
            handleDelete(index, row) {
                
            },
            // 保存编辑
            saveEdit() {
                let that = this
                let params = {
                    id:that.id,
                    url:that.url,
                }
                console.log(params)
                https.fetchPost('banner2/add',params ).then((e) => {
                console.log(e)
                if(e.code==0){
                    that.editVisible = false;
                    this.$message.success(`修改成功`);
                    that.getData();
                }
                }).catch(err=>{
                    console.log(err)
                })
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
                        that.delVisible = true;
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
    .cover-upload .el-upload{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
   }
   .cover-upload .cover-icon{
        font-size: 28px;
        color: #8c939d;
        line-height: 180px;
   }
   .cover-img{
       width: 100%;
       height: 100%;
       position: absolute;
       top: 0;
       left: 0;
   }
</style>
