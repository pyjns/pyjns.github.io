<template>
  <el-row style="min-height: 100vh;">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :replace="true" to="/article/list">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>文章预览</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div isShowIcon>文章预览</div>
      <el-row class="preview-wrap">
        <el-button-group>
          <el-button
            :type="wrap == 'phone-wrap' ? 'default' : 'primary'"
            @click="privew('article-wrap')"
            >pc端预览</el-button
          >
          <el-button
            :type="wrap == 'phone-wrap' ? 'primary' : 'default'"
            @click="privew('phone-wrap')"
            >手机端预览</el-button
          >
        </el-button-group>
        <template v-if="publishStatus != 2">
          <el-button type="primary" @click="publish" style="float:right">发布</el-button>
          <el-button style="float:right;margin-right:20px;" @click="editArticle"
            >重新编辑</el-button
          >
        </template>
      </el-row>
      <div class="content-wrap">
        <div :class="wrap == 'phone-wrap' ? 'phone-wrap' : 'article-wrap'">
          <div class="wrap" id="quill-container">
            <div class="title">{{ title }}</div>
            <div class="author">{{ author }}</div>
            <div class="publishTime">{{ publishTime }}</div>
            <div id="editor" class="ql-editor"></div>
          </div>
        </div>
        <div class="qrcode-wrap">
          <img class="qrcode" :src="qrcodeImg" />
          <div>
            <p>手机扫一扫</p>
            预览文章
          </div>
        </div>
      </div>
    </div>
  </el-row>
</template>
<script>
import Quill from 'quill';
import QRCode from 'qrcode';

// import Video from './video';

// Quill.register(Video, true);

export default {
  name: 'quill-editor',
  data() {
    return {
      articleId: this.$route.query.articleId || '',
      wrap: 'phone-wrap',
      qrcodeImg: '',
      publishStatus: '',
      title: '',
      author: '',
      publishTime: '',
      content: '',
      options: {
        theme: 'bubble',
        boundary: '.phone-wrap .wrap',
      },
    };
  },
  mounted() {
    this.fetchData();
    QRCode.toDataURL(``).then(
      url => {
        this.qrcodeImg = url;
      }
    );
  },
  beforeDestroy() {
    this.quill = null;
    delete this.quill;
  },
  methods: {
    fetchData() {
      this.ajax.get('', { articleId: this.articleId }).then(res => {
        this.title = res.content.title;
        this.publishStatus = res.content.publishStatus;
        this.author = res.content.author;
        this.publishTime = res.content.publishTime;
        this.content = res.content.content;
        this.init();
      });
    },
    init() {
      this.quill = new Quill('#editor', this.options);
      this.quill.enable(false);
      document.querySelector('#editor').innerHTML = this.content;
      setTimeout(() => {
        if (this.wrap === 'article-wrap') {
          this.notifyHostTarget(200 + document.getElementById('quill-container').offsetHeight);
        } else {
          this.notifyHostTarget(1000);
        }
      }, 0);
    },
    privew(wrap) {
      this.wrap = wrap;
      this.options.boundary = `.${wrap} .wrap`;
      this.init();
    },
    publish() {
      const self = this;

      this.$confirm('建议发布文章前检查一遍，确定发布？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        self.ajax
          .post('', {
            articleId: self.articleId,
            action: 'publish',
          })
          .then(res => {
            if (res.content.result) {
              self.$message.success('发布成功!');
              setTimeout(() => {
                self.$router.push(`/article/list`);
              }, 1000);
            } else {
              self.$message.error(res.content.message);
            }
          });
      });
    },
    editArticle() {
      this.$router.push(`/article/edit?articleId=${this.articleId}`);
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
html {
  font-size: 37.5px;
}
</style>
<style lang="less" scoped>
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.bubble.css';

.ql-container {
  font-family: 'PingFangSC-Regular', 'PingFangSC', 'PingFang SC', 'Helvetica Neue', Helvetica,
    'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  font-size: 15px;
}

/deep/ .ql-editor img {
  max-width: 100%;
}

.div {
  position: relative;
  min-width: 1160px;
}
.title {
  text-align: left;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  padding: 15px;
  word-break: break-all;
}
.author {
  padding-left: 15px;
}
.publishTime {
  padding-left: 15px;
  padding-top: 6px;
}
.desc {
  height: 40px;
  line-height: 40px;
}
.desc > div {
  display: flex;
  align-items: center;
}
.desc i {
  display: inline-flex;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  margin-left: 4px;
}
.kangaroo {
  background: url('../../assets/icon/kangaroo.png') no-repeat center/24px auto;
}
.alipay {
  background: url('../../assets/icon/alipay.png') no-repeat center/24px auto;
}
.wechat {
  background: url('../../assets/icon/wechat.png') no-repeat center/24px auto;
}
.ql-container {
  height: auto;
}
.content-wrap {
  padding-top: 20px;
}
.content-wrap::after {
  content: '';
  clear: both;
  display: block;
}
.article-wrap,
.phone-wrap {
  margin-right: 20px;
  width: 920px;
  margin: auto;
  border: solid 1px rgba(234, 234, 236, 1);
  float: left;
  background-color: #fff;
}
.phone-wrap {
  margin: auto;
  // width: 414px;
  height: 802px;
  overflow: scroll;
  background: url('../../assets/bg/phone.png') no-repeat center/ 420px auto;
}
.phone-wrap .wrap {
  width: 350px;
  height: 600px;
  margin: 106px auto 0;
  overflow-y: scroll;
}

.preview-wrap {
  position: relative;
}
.qrcode-wrap {
  margin-left: 20px;
  float: left;
  height: 240px;
  border: solid 1px rgba(234, 234, 236, 1);
  // position: fixed;
  // right: 10px;
  // top: 200px;
  text-align: center;
  font-size: 14px;
  background-color: #fff;
  z-index: 10;
}
.qrcode {
  width: 160px;
  height: 160px;
  background-color: #fff;
}
</style>
