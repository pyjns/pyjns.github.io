<template>
  <el-row>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :replace="true" to="/article/list">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ articleId ? '编辑' : '新建' }}文章</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div isShowIcon>文章发布</div>
      <div class="specification">
        <router-link to="/article/specification">发文规范</router-link>
      </div>
      <el-form label-width="100px" :model="form" :rules="rules" ref="ArticleForm">
        <el-form-item label="文章标题：" prop="title">
          <el-input
            v-model="form.title"
            :maxlength="64"
            placeholder="请输入5～64字符长度的文章标题"
            :disabled="publishStatus == 2"
          ></el-input>
        </el-form-item>
        <el-form-item label="原作者：" prop="author">
          <el-input
            v-model="form.author"
            :maxlength="30"
            placeholder="请输入原作者"
            :disabled="publishStatus == 2"
          ></el-input>
        </el-form-item>
        <el-form-item label="同步平台：" prop="platform">
          <el-checkbox
            v-model="form.platformApp"
            label="APP"
            :disabled="publishStatus == 2 && platformApp"
          ></el-checkbox>
          <el-checkbox
            v-model="form.platformAlipay"
            label="支付宝小程序"
            :disabled="publishStatus == 2 && platformAlipay"
          ></el-checkbox>
          <el-checkbox
            v-model="form.platformWechat"
            label="微信小程序"
            :disabled="publishStatus == 2 && platformWechat"
          ></el-checkbox>
        </el-form-item>
        <el-form-item label="封面：" prop="cover">
          <el-upload
            class="avatar-uploader"
            :action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :disabled="publishStatus == 2"
          >
            <img v-if="form.cover" :src="form.cover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div>封面图片为jpg png不支持gif 大小不能超过2MB，建议尺寸：200*140</div>
        </el-form-item>
        <el-form-item label="分类：" prop="categoryId">
          <el-select
            style="width: 100%"
            v-model="form.categoryId"
            placeholder="请选择分类"
            :disabled="publishStatus == 2"
          >
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
        <div id="editor" ref="editor"></div>
      </div>
      <el-row class="mt-28">
        <el-button style="margin-left: 100px;s" type="primary" @click="save">保存</el-button>
        <!-- <el-button type="primary" @click="saveHtml">预览</el-button> -->
      </el-row>
    </div>
  </el-row>
</template>
<script>
import { getUrl } from '@/tools/route';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
// http://www.ngchina.com.cn/statics/images/index_lunbo/ad_video_2.mp4
// 这里引入修改过的video模块并注册
// import Video from './video';
// Quill.register(Video, true);

const FontSize = Quill.import('attributors/style/size');
FontSize.whitelist = [
  '0.32rem',
  '0.37rem',
  '0.4rem',
  '0.43rem',
  '0.45rem',
  '0.48rem',
  '0.53rem',
  '0.59rem',
  '0.64rem',
  '0.69rem',
  '0.8rem',
  '0.96rem',
  '1.12rem',
];
Quill.register(FontSize, true);

Quill.register('modules/imageResize', ImageResize);

export default {
  name: 'quill-editor',
  data() {
    const self = this;
    return {
      baseURL: getUrl(process.env.VUE_APP_API),
      articleId: this.$route.query.articleId || '',
      content: '',
      publishStatus: '',
      platformApp: false,
      platformAlipay: false,
      platformWechat: false,
      options: {
        theme: 'snow',
        boundary: document.body,
        // scrollingContainer: '#scrolling-container',
        modules: {
          toolbar: [
            [{ size: FontSize.whitelist }],
            [{ color: [] }, { background: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            // ['code-block'],
            // [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            // [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            // [{ direction: 'rtl' }],
            [{ align: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            // [{ font: [] }],
            // ['clean'],
            // ['link', 'image', 'video'],
            ['image'],
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
      // if (this.quill) {
      //   if (newVal && newVal !== this.content) {
      //     this.content = newVal;
      //     this.quill.pasteHTML(newVal);
      //   } else if (!newVal) {
      //     this.quill.setText('');
      //   }
      // }
      if (newVal !== this.quill.root.innerHTML && !this.quill.hasFocus()) {
        this.quill.root.innerHTML = newVal;
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
  methods: {
    onInputTitle(value) {
      this.form.title = value.replace(
        /[^a-zA-Z0-9，、。：；“”《》\\?\\!\\（\\）【】{}\u4e00-\u9fa5]/g,
        ''
      );
    },
    fetchCategories() {
      this.ajax.get('', {}).then(res => {
        this.categoryList = res.content.resultList;
      });
    },
    fetchData() {
      this.ajax.get('', { articleId: this.articleId }).then(res => {
        this.form.title = res.content.title;
        this.form.author = res.content.author;
        this.form.categoryId = res.content.categoryId;
        this.form.cover = res.content.cover;
        this.platformApp = res.content.platformApp;
        this.platformAlipay = res.content.platformAlipay;
        this.platformWechat = res.content.platformWechat;
        this.form.platformApp = res.content.platformApp;
        this.form.platformAlipay = res.content.platformAlipay;
        this.form.platformWechat = res.content.platformWechat;
        this.publishStatus = res.content.publishStatus;
        this.content = res.content.content;

        this.init();
      });
    },
    handleAvatarSuccess(res) {
      this.form.cover = res.content.resultList[0].showPath;
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
      // document.querySelector('#editor').innerHTML = this.content;

      this.quill = new Quill(this.$refs.editor, this.options);
      this.quill.enable(this.publishStatus !== 2);

      // this.quill.pasteHTML(this.content);
      this.quill.root.innerHTML = this.content;

      // this.quill.on('text-change', (delta, oldDelta, source) => {
      this.quill.on('text-change', () => {
        let html = this.$refs.editor.children[0].innerHTML;
        if (html === '<p><br></p>') html = '';
        this.content = html;
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
            if (this.publishStatus !== 2 && fileInput.files != null && fileInput.files[0] != null) {
              this.uploadToServer(fileInput.files[0], res => {
                const range = this.quill.getSelection();
                if (range) {
                  fileInput.value = null;
                  //  在当前光标位置插入图片
                  toolbar.quill.insertEmbed(range.index, 'image', res.file.path);
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
      const formData = new FormData();
      formData.append('upload', file);
      this.ajax.post('', formData).then(res => {
        callback({
          file: {
            path: res.content.resultList[0].showPath,
          },
        });
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
      this.cleanSensitiveWords();
      const self = this;
      return new Promise((resolve, reject) => {
        self.ajax
          .post('', {
            content: self.content.replace(/tp=webp&amp;/, ''),
          })
          .then(res => {
            if (!res.content.green) {
              let errorTip = '';
              let sensitiveWordsList = [];
              for (let i = 0, len = res.content.messages.length; i < len; i++) {
                const message = res.content.messages[i];
                const hintWords = message.hintWords.join(',');
                for (let j = 0, jLen = message.hintWords.length; j < jLen; j++) {
                  sensitiveWordsList = sensitiveWordsList.concat(message.hintWords[j].split(' '));
                }
                errorTip += `${message.suggestion}:${message.label};敏感词:${hintWords}`;
              }
              self.$message.error({ message: errorTip, duration: 10000 });

              this.markSensitiveWords(sensitiveWordsList);
              reject();
            } else {
              resolve();
            }
          });
      });
    },
    markSensitiveWords(wordsList) {
      const sensitiveWordsList = [...new Set(wordsList)];
      for (let i = 0, len = sensitiveWordsList.length; i < len; i++) {
        if (sensitiveWordsList[i]) {
          const reg = new RegExp(`(${sensitiveWordsList[i]})`, 'gim');
          this.content = this.content.replace(reg, '<em class="sensitive">$1</em>');
        }
      }
      this.quill.root.innerHTML = this.content;
    },
    cleanSensitiveWords() {
      this.content = this.content.replace(/<em class="sensitive">(.+?)<\/em>/gim, '$1');
      this.quill.root.innerHTML = this.content;
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
                // if (res.content.result) {
                self.$message.success('保存成功!');
                setTimeout(() => {
                  self.$router.push(`/article/detail?articleId=${res.content.articleId}`);
                }, 1000);
                // } else {
                //   self.$message.error(res.content.message);
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

<style scoped>
.specification {
  height: 40px;
  line-height: 40px;
  text-align: right;
}
.specification a {
  color: rgb(2, 167, 240);
  text-decoration: none;
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/ .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 140px;
  line-height: 140px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 140px;
  display: block;
}
</style>
<style>
html {
  font-size: 37.5px;
}
</style>
<style lang="less" scoped>
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.snow.css';

/deep/ .sensitive {
  color: red;
  font-weight: bold;
  text-decoration: line-through;
  font-size: 20px;
  background-color: #eee;
  font-style: normal;
}
.ql-container {
  font-family: 'pingFang SC', 'pingFang', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
    'Hiragino Sans GB', Arial, sans-serif;
  height: 800px;
  white-space: pre;
  font-size: 15px;
}
#quill-container {
  margin-left: 100px;
}

/deep/ .ql-snow {
  .ql-picker.ql-size {
    width: 60px;
  }
  .ql-picker.ql-header {
    width: 88px;
  }
}

/deep/ .ql-snow .ql-picker.ql-header {
  .ql-picker-label::before,
  .ql-picker-item::before {
    content: '普通文本';
  }
  .ql-picker-label[data-value='1']::before,
  .ql-picker-item[data-value='1']::before {
    content: '标题 1';
  }
  .ql-picker-label[data-value='2']::before,
  .ql-picker-item[data-value='2']::before {
    content: '标题 2';
  }
  .ql-picker-label[data-value='3']::before,
  .ql-picker-item[data-value='3']::before {
    content: '标题 3';
  }
  .ql-picker-label[data-value='4']::before,
  .ql-picker-item[data-value='4']::before {
    content: '标题 4';
  }
  .ql-picker-label[data-value='5']::before,
  .ql-picker-item[data-value='5']::before {
    content: '标题 5';
  }
  .ql-picker-label[data-value='6']::before,
  .ql-picker-item[data-value='6']::before {
    content: '标题 6';
  }
}
/deep/ .ql-snow .ql-picker.ql-size {
  .ql-picker-label[data-value='0.32rem']::before,
  .ql-picker-item[data-value='0.32rem']::before {
    content: '12px';
    font-size: 12px;
  }
  .ql-picker-label[data-value='0.37rem']::before,
  .ql-picker-item[data-value='0.37rem']::before {
    content: '14px';
    font-size: 14px;
  }
  .ql-picker-label[data-value='0.4rem']::before,
  .ql-picker-item[data-value='0.4rem']::before {
    content: '15px';
    font-size: 15px;
  }
  .ql-picker-label[data-value='0.43rem']::before,
  .ql-picker-item[data-value='0.43rem']::before {
    content: '16px';
    font-size: 16px;
  }
  .ql-picker-label[data-value='0.45rem']::before,
  .ql-picker-item[data-value='0.45rem']::before {
    content: '17px';
    font-size: 17px;
  }
  .ql-picker-label[data-value='0.48rem']::before,
  .ql-picker-item[data-value='0.48rem']::before {
    content: '18px';
    font-size: 18px;
  }
  .ql-picker-label[data-value='0.53rem']::before,
  .ql-picker-item[data-value='0.53rem']::before {
    content: '20px';
    font-size: 20px;
  }
  .ql-picker-label[data-value='0.59rem']::before,
  .ql-picker-item[data-value='0.59rem']::before {
    content: '22px';
    font-size: 22px;
  }
  .ql-picker-label[data-value='0.64rem']::before,
  .ql-picker-item[data-value='0.64rem']::before {
    content: '24px';
    font-size: 24px;
  }
  .ql-picker-label[data-value='0.69rem']::before,
  .ql-picker-item[data-value='0.69rem']::before {
    content: '26px';
    font-size: 26px;
  }
  .ql-picker-label[data-value='0.8rem']::before,
  .ql-picker-item[data-value='0.8rem']::before {
    content: '30px';
    font-size: 30px;
  }
  .ql-picker-label[data-value='0.96rem']::before,
  .ql-picker-item[data-value='0.96rem']::before {
    content: '36px';
    font-size: 36px;
  }
  .ql-picker-label[data-value='1.12rem']::before,
  .ql-picker-item[data-value='1.12rem']::before {
    content: '42px';
    font-size: 42px;
  }
  .ql-picker-label::before {
    font-size: 15px !important;
  }
}
</style>
