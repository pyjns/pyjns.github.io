<template>
  <el-row>
    <title>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :replace="true" to="/article/list">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ articleId ? '编辑' : '新建' }}文章</el-breadcrumb-item>
      </el-breadcrumb>
    </title>
    <wrapper>
      <div class="specification">
        <router-link to="/article/specification">发文规范</router-link>
      </div>
      <el-form label-width="100px" :model="form" :rules="rules" ref="ArticleForm">
        <el-form-item label="文章标题：" prop="title">
          <el-input
            :value="form.title"
            @input="onInputTitle"
            :maxlength="30"
            placeholder="请输入5～30字符长度的文章标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="原作者：" prop="author">
          <el-input v-model="form.author" :maxlength="30" placeholder="请输入原作者"></el-input>
        </el-form-item>
        <el-form-item label="同步平台：" prop="platform">
          <el-checkbox v-model="form.platformApp" label="APP"></el-checkbox>
          <el-checkbox v-model="form.platformAlipay" label="支付宝小程序"></el-checkbox>
          <el-checkbox v-model="form.platformWechat" label="微信小程序"></el-checkbox>
        </el-form-item>
        <el-form-item label="封面：" prop="cover">
          <el-upload
            class="avatar-uploader"
            :action="baseURL + ''"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.cover" :src="form.cover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div>封面图片为jpg png不支持gif 大小不能超过2MB，建议尺寸：200*140</div>
        </el-form-item>
        <el-form-item label="分类：" prop="categoryId">
          <el-select style="width: 100%" v-model="form.categoryId" placeholder="请选择分类">
            <template v-for="{ categoryName, categoryId } in categoryList">
              <el-option
                :key="categoryId"
                v-bind:label="categoryName"
                v-bind:value="categoryId"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div id="quill-container">
        <slot name="toolbar"></slot>
        <div ref="editor"></div>
      </div>
      <el-row class="mt-28">
        <el-button style="margin-left: 100px;s" type="primary" @click="save">保存</el-button>
        <!-- <el-button type="primary" @click="saveHtml">预览</el-button> -->
      </el-row>
    </wrapper>
  </el-row>
</template>
<script>
import { getUrl } from '@/tools/route';
import Quill from 'quill';
// import { ImageDrop } from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize-module';

// // quill编辑器的字体
// var fonts = ['Microsoft-YaHei', 'SimSun', 'SimHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
// var Font = Quill.import('formats/font')
// Font.whitelist = fonts
// Quill.register(Font, true)

// http://www.ngchina.com.cn/statics/images/index_lunbo/ad_video_2.mp4
// 这里引入修改过的video模块并注册
// import Video from './video';

// Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);
// Quill.register(Video, true);

export default {
  name: 'quill-editor',
  data() {
    const self = this;
    return {
      baseURL: getUrl(process.env.VUE_APP_API),

      articleId: this.$route.query.articleId || '',
      content: ``,
      options: {
        theme: 'snow',
        boundary: document.body,
        // scrollingContainer: '#scrolling-container',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            // ['code-block'],
            [{ header: 1 }, { header: 2 }],
            ['blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            // [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            // [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            // ['link', 'image', 'video'],
            ['link', 'image'],
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false,
          },
          // imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white',
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
          },
        },
      },
      categoryList: [],
      form: {
        title: '',
        author: '',
        platformApp: false,
        platformAlipay: false,
        platformWechat: false,
        cover: '',
        categoryId: '',
      },
      rules: {
        title: [
          { required: true, message: '请填写文章标题！', trigger: 'blur' },
          { min: 5, message: '文章标题长度至少5个字符！', trigger: 'blur' },
        ],
        author: [{ required: true, message: '请填写原作者！', trigger: 'blur' }],
        platform: [
          {
            required: true,
            validator(rule, value, callback) {
              if (
                !self.form.platformApp &&
                !self.form.platformAlipay &&
                !self.form.platformWechat
              ) {
                callback(new Error('请选择发布平台！'));
              }
              callback();
            },
            trigger: 'change',
          },
        ],
        cover: [
          {
            required: true,
            validator(rule, value, callback) {
              if (self.form.cover === '') {
                callback(new Error('请上传封面！'));
              }

              callback();
            },
            trigger: 'blur',
          },
        ],
        categoryId: [{ required: true, message: '您选择文章分类！', trigger: 'change' }],
      },
    };
  },
  watch: {
    // content(newVal, oldVal) {
    content(newVal) {
      if (this.quill) {
        if (newVal && newVal !== this.content) {
          // this.content = newVal.replaceAll("tp=webp&amp;","");
          this.content = newVal;
          // tp=webp&amp;
          this.quill.pasteHTML(newVal);
        } else if (!newVal) {
          this.quill.setText('');
        }
        // this.notifyHostTarget(1000 + document.getElementById('quill-container').offsetHeight);
      }
    },
  },
  mounted() {
    this.notifyHostTarget(1600);

    this.fetchCategories();
    if (this.articleId) {
      this.fetchData();
    } else {
      this.init();
    }
  },
  beforeDestroy() {
    this.quill = null;
    delete this.quill;
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== '/article/detail') {
      this.$confirm('退出后所编辑内容将不被保存～', {
        title: '是否确定退出？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
        });
    } else {
      next();
    }
  },
  // computed: {
  //   editor() {
  //     return this.$refs.myQuillEditor.quill;
  //   },
  // },
  methods: {
    onInputTitle(value) {
      this.form.title = value.replace(
        /[^a-zA-Z0-9，、。：；“”《》\\?\\!\\（\\）【】{}\u4e00-\u9fa5]/g,
        ''
      );
    },
    fetchCategories() {
      this.ajax.get('', {}).then(res => {
        this.categoryList = res.bizContent.resultList;
      });
    },
    fetchData() {
      this.ajax.get('', { articleId: this.articleId }).then(res => {
        this.form.title = res.bizContent.title;
        this.form.author = res.bizContent.author;
        this.form.categoryId = res.bizContent.categoryId;
        this.form.cover = res.bizContent.cover;
        this.form.platformApp = res.bizContent.platformApp;
        this.form.platformAlipay = res.bizContent.platformAlipay;
        this.form.platformWechat = res.bizContent.platformWechat;
        this.content = res.bizContent.content;

        this.init();
      });
    },
    handleAvatarSuccess(res) {
      this.form.cover = res.bizContent.resultList[0].showPath;
    },
    beforeAvatarUpload(file) {
      if (file.type.indexOf('image') === -1) {
        this.$message.error('请上传图片格式文件!');
        return false;
      }
      if (file.type === 'image/gif') {
        this.$message.error('上传封面图片不能是 GIF 格式!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
        return false;
      }
      return true;
    },
    init() {
      this.quill = new Quill(this.$refs.editor, this.options);
      this.quill.enable(true);
      if (this.content) {
        this.quill.pasteHTML(this.content);
      }

      // this.quill.on('selection-change', range => {
      //   if (!range) {
      //     this.onEditorBlur(this.quill);
      //   } else {
      //     this.onEditorFocus(this.quill);
      //   }
      // });

      // this.quill.on('text-change', (delta, oldDelta, source) => {
      this.quill.on('text-change', () => {
        let html = this.$refs.editor.children[0].innerHTML;
        // const quill = this.quill;
        // const text = this.quill.getText();
        if (html === '<p><br></p>') html = '';
        this.content = html;
        // this.onEditorChange({ html, text, quill: this.quill });
      });

      const toolbar = this.quill.getModule('toolbar');
      toolbar.addHandler('image', () => {
        let fileInput = toolbar.container.querySelector('input.ql-image[type=file]');
        if (fileInput == null) {
          fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.setAttribute(
            'accept',
            'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
          );
          fileInput.classList.add('ql-image');
          fileInput.addEventListener('change', () => {
            if (fileInput.files != null && fileInput.files[0] != null) {
              this.uploadToServer(fileInput.files[0], res => {
                const range = this.quill.getSelection();
                if (range) {
                  fileInput.value = null;
                  //  在当前光标位置插入图片
                  toolbar.quill.insertEmbed(
                    range.index,
                    'image',
                    // this.$ajax.defaults.baseURL + res.file.path
                    res.file.path
                  );
                  //  将光标移动到图片后面
                  toolbar.quill.setSelection(range.index + 1);
                }
              });
            }
          });
          toolbar.container.appendChild(fileInput);
        }

        fileInput.click();
      });
    },
    uploadToServer(file, callback) {
      // callback({
      //   file: {
      //     path:
      //       'https://mmbiz.qpic.cn/mmbiz_gif/jEv515Ev56FADtelcoPZ6lhW87T8oEoOGPkwTZia89y67qlgTrwVQ3WXxIiabQuMqJj0L42Tq7uDuX1Xa9KOuiaDA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1',
      //   },
      // });
      const formData = new FormData();
      formData.append('upload', file);
      this.ajax.post('', formData).then(res => {
        callback({
          file: {
            path: res.bizContent.resultList[0].showPath,
          },
        });
      });
    },
    // onEditorReady(editor) {
    //   // 准备编辑器
    // },
    // onEditorBlur() {}, // 失去焦点事件
    // onEditorFocus() {}, // 获得焦点事件
    // onEditorChange(editor) {}, // 内容改变事件
    // saveHtml(event) {
    //   console.log(this.content);
    //   console.log('-------------------------------');
    //   console.log(this.content.replace(/tp=webp&amp;/, ''));
    // },
    emitImageInfo($event) {
      const resetUploader = function() {
        const uploader = document.getElementById('file-upload');
        uploader.value = '';
      };
      const file = $event.target.files[0];
      const Editor = this.quill;
      const range = Editor.getSelection();
      const cursorLocation = range.index;

      const formData = new FormData();
      formData.append('image', file);

      this.ajax
        .post('https://fakeapi.yoursite.com/images', {
          data: formData,
        })
        .then(res => {
          // const url = res.data.url; // Get url from response
          Editor.insertEmbed(cursorLocation, 'image', res.data.url);
          resetUploader();
        })
        .catch(() => {
          // console.log(err);
        });
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.ArticleForm.validate(valid => {
          if (valid) {
            resolve();
          } else {
            this.$message.error({ message: '请检查必填项!', duration: 10000 });
            reject();
          }
        });
      });
    },
    green() {
      const self = this;
      return new Promise((resolve, reject) => {
        self.ajax
          .post('', {
            content: self.content.replace(/tp=webp&amp;/, ''),
          })
          .then(res => {
            if (!res.bizContent.green) {
              let errorTip = '';
              for (let i = 0, len = res.bizContent.messages.length; i < len; i++) {
                const message = res.bizContent.messages[i];
                const hintWords = message.hintWords.join(',');
                errorTip += `${message.suggestion}:${message.label};敏感词:${hintWords}`;
              }
              self.$message.error({ message: errorTip, duration: 10000 });
              reject();
            } else {
              resolve();
            }
          });
      });
    },
    save() {
      const self = this;
      Promise.all([self.validate(), self.green()])
        .then(
          () => {
            self.ajax
              .post('', {
                articleId: self.articleId,
                ...self.form,
                content: self.content.replace(/tp=webp&amp;/g, '').replace(/&amp;tp=webp/g, ''),
              })
              .then(res => {
                // if (res.bizContent.result) {
                self.$message.success('保存成功!');
                setTimeout(() => {
                  self.$router.push(`/article/detail?articleId=${res.bizContent.articleId}`);
                }, 1000);
                // } else {
                //   self.$message.error(res.bizContent.message);
                // }
              });
          },
          () => {}
        )
        .catch(error => {
          console.log(error);
        });
    },
    notifyHostTarget(height) {
      window.parent.postMessage(
        {
          height,
          isLoading: false,
        },
        '*'
      );
    },
  },
};
</script>

<style>
.specification {
  height: 40px;
  line-height: 40px;
  text-align: right;
}
.specification a {
  color: rgb(2, 167, 240);
  text-decoration: none;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
</style>
<style lang="less" scoped>
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.snow.css';

.ql-container {
  font-family: 'pingFang SC', 'pingFang', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
    'Hiragino Sans GB', Arial, sans-serif;
  height: 800px;
}
#quill-container {
  margin-left: 100px;
}
/* #quill-container {
  background-color: #fff;
  height: 400px;
  min-height: 100%;
} */
/* #quill-container .ql-editor {
  font-size: 18px;
  overflow-y: visible;
  height: auto;
  min-height: 10rem auto;
} */
</style>
