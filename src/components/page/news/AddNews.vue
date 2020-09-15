<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!-- <el-breadcrumb-item><i class="el-icon-date"></i> 表单</el-breadcrumb-item> -->
                <el-breadcrumb-item>{{barTitle}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px" :rules="rule">
                    <el-form-item label="作者" prop="authorName">
                        <el-input v-model="form.authorName"></el-input>
                    </el-form-item>
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示" prop="display">
                        <el-radio-group v-model="form.display">
                            <el-radio :label="0">隐藏</el-radio>
                            <el-radio :label="1">显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="上传封面" prop="file">
                        <el-upload
                            class="cover-upload"
                            :action="saveImg"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess">
                            <i class="el-icon-plus cover-icon"></i>
                            <img class="cover-img" width="100%" :src="imageUrl" alt="">
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="内容">
                        <div>
                            <!-- 图片上传组件辅助-->
                            <el-upload
                            class="img-upload"
                            :action="saveImg"
                            name="img"
                            :headers="header"
                            :show-file-list="false"
                            :on-success="uploadSuccess"
                            :on-error="uploadError">
                            </el-upload>
                            <quill-editor
                            v-model="content"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @change="onEditorChange($event)"
                            >
                            </quill-editor>
                            </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    import https from '../../../https.js' 
    const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],  // toggled buttons
    [{'header': 1}, {'header': 2}],    // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'indent': '-1'}, {'indent': '+1'}],   // outdent/indent
    [{'direction': 'rtl'}],       // text direction
    [{'size': ['small', false, 'large', 'huge']}], // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],   // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image'],
    ['clean']
    
    ]
    export default {
        data: function(){
            var imgCheck = (rule, value, callback) => {
		      if (value == "") {
		        callback(new Error("请输入手机号"));
		      } else if (!this.isCellPhone(value)) {//引入methods中封装的检查手机格式的方法
		        callback(new Error("请输入正确的手机号!"));
		      } else {
		        callback();
		      }
		    };
            return {
                barTitle:'添加新闻',
                id:'',
                form: {
                },
                rule: {
                    authorName: [{ required: true, message: '请填写作者名', trigger: 'blur' },],
                    title: [{ required: true, message: '请填新闻标题', trigger: 'blur' },],
                    display: [{ required: true, message: '请上选择显示或隐藏', trigger: 'change'}],
                    file: [{ required: true, validator:imgCheck, trigger: 'change'}],
                },
                imageUrl: '',
                saveImg:'https://ng.mangocloud.com.cn/imgserv/image/uploadImages',
                quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
                content: null,
                editorOption: {
                    placeholder: '',
                    theme: 'snow', // or 'bubble'
                    modules: {
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        document.querySelector('.img-upload input').click()
                                    }else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                },
                header: {
                // token: sessionStorage.token
                } // 有的图片服务器要求请求头需要有token
                
            }
        },
        created() {
            if(this.$route.query.id){
                this.barTitle = '修改新闻';
                this.id = this.$route.query.id
                this.getData();
            }
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.coverImgId = res.data[0];
            },
            // 获取编辑新闻信息
            getData() {
                var that = this;
                let params = {
                }
                console.log(params)
                https.fetchGet('information2/news/'+this.$route.query.id,params ).then((e) => {
                console.log(e)
                if(e.code==0){
                    that.form = {
                        authorId:e.body.authorId,
                        authorName:e.body.authorName,
                        title:e.body.title,
                        contentHtml:that.content,
                        coverImgId:e.body.coverImgId,
                        display:e.body.display,
                        id:that.id,
                    }
                    that.content = e.body.contentHtml;
                    that.imageUrl = e.body.coverImgId

                }
                }).catch(err=>{
                    console.log(err)
                })
            },
            onSubmit(form) {
                let that = this;
                this.$refs[form].validate(valid => {
                    if (valid) {
                        let params = {
                            authorId:that.form.authorId,
                            authorName:that.form.authorName,
                            contentHtml:that.content,
                            title:that.form.title,
                            coverImgId:that.coverImgId,
                            display:that.form.display,
                            id:that.id
                        }
                        https.fetchPost('information2/news/add',params ).then((e) => {
                        console.log(e)
                        if(e.code==0){
                            that.$router.push({ path: '/newsList'})
                        }
                        }).catch(err=>{
                            console.log(err)
                        })
                    }
                })
            },
            onEditorChange({editor, html, text}) {//内容改变事件
                this.content = html
                },
                // 富文本图片上传前
                beforeUpload() {
                // 显示loading动画
                this.quillUpdateImg = true
                },
                
                uploadSuccess(res, file) {
                // res为图片服务器返回的数据
                // 获取富文本组件实例
                console.log(res);
                let quill = this.$refs.myQuillEditor.quill
                // 如果上传成功
                if (res.errno == 0 ) {
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片 res.url为服务器返回的图片地址
                quill.insertEmbed(length, 'image', res.data[0])
                // 调整光标到最后
                quill.setSelection(length + 1)
                } else {
                this.$message.error('图片插入失败')
                }
                // loading动画消失
                this.quillUpdateImg = false
                },
                // 富文本图片上传失败
                uploadError() {
                // loading动画消失
                this.quillUpdateImg = false
                this.$message.error('图片插入失败')
                }
        }
    }
</script>
<style>
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .img-upload{
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
  }
</style>