<template>
  <van-skeleton title :row="22" :loading="skeletonLoading">
    <div class="wrap">
      <!-- 收藏/取消动画 -->
      <div v-if="coverShow" class="cover" @click="closeCover">
        <div :style="style" ref="lavContainer"></div>
      </div>
      <!-- 文章切换loading -->
      <van-overlay :show="vanLoading">
        <img class="kangaroo" src="XX.gif" />
        <!-- <van-loading type="spinner" color="rgba(255, 149, 67, 1)" />-->
      </van-overlay>

      <div v-if="!article.withdrawn" :class="coverShow || vanLoading ?'blur':''">
        <div class="head-title">{{article.title}}</div>
        <div class="desc-wrap">
          <div class="desc">
            <div class="author">{{article.author}}</div>
            <div class="time">{{article.publishTime}}</div>
          </div>
          <div v-if="!article.collected" class="collect" @click="collect">
            <span>收藏</span>
          </div>
          <div v-else class="collect collected" @click="cancelCollect">
            <span>已收藏</span>
          </div>
        </div>

        <div id="editor" class="ql-editor"></div>

        <div class="desc-wrap bottom-desc-wrap">
          <div class="desc">
            <div class="pv">阅读量 {{article.readCount}}</div>
          </div>
          <div v-if="!article.collected" class="collect" @click="collect">
            <span>收藏</span>
          </div>
          <div v-else class="collect collected" @click="cancelCollect">
            <span>已收藏</span>
          </div>
        </div>

        <template v-if="article.relations.length >0">
          <div class="segment"></div>
          <section class="recommend-wrap">
            <div class="recommend-title">猜你喜欢</div>
            <router-link
              :to="'/article/index?id='+item.articleId+'&from='+from+'&token='+token"
              class="item"
              v-for="item in article.relations"
              :key="item.articleId"
              replace
            >
              <div>
                <div class="title">{{item.title}}</div>
                <div class="desc">
                  <span>{{item.author}}</span>
                  <span>阅读 {{item.readCount}}</span>
                </div>
              </div>
              <img :src="item.cover" />
            </router-link>
          </section>
        </template>
      </div>
      <div v-else class="no-data">
        <img src="../../assets/article/no-data.png" />
        <div>该内容已被发布者删除</div>
      </div>
    </div>
  </van-skeleton>
</template>

<script>
import Quill from "quill";
import { Skeleton, Overlay, Loading } from "vant";
import lottie from "lottie-web";
// import { BridgeClient } from "@/utils/tools.js";
// import * as animationData from "../../assets/article/collect/collect.json";
// import animationData from "../../assets/article/collect/json.js";

export default {
  name: "article-index",
  components: {
    [Skeleton.name]: Skeleton,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading
  },
  props: ["id", "from", "token"],
  data() {
    return {
      vanLoading: false,
      skeletonLoading: true,
      animationSpeed: 1,
      style: {
        width: "100px",
        height: "100px",
        overflow: "hidden",
        margin: "0 auto"
      },
      article: {
        withdrawn: false,
        publishTime: "",
        articleId: "",
        title: "",
        cover: "",
        readCount: "",
        collected: false,
        relations: [],
        content: ``
      },
      options: {
        theme: "bubble"
      },
      timer: "",
      coverShow: false
    };
  },
  watch: {
    $route(to, from) {
      this.vanLoading = true;
      this.fetchData();
    }
  },
  mounted() {
    localStorage.setItem("TOKEN", this.token);
    this.fetchData();
  },
  beforeDestroy() {
    this.quill = null;
    delete this.quill;
  },
  methods: {
    lottieCollect(path) {
      const self = this;
      this.ajax.$get(path).then(res => {
        const animationData = res.data;
        self.anim = lottie.loadAnimation({
          container: self.$refs.lavContainer,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData: animationData
        });
      });
    },
    init() {
      this.$nextTick(() => {
        this.quill = new Quill("#editor", this.options);
        this.quill.enable(false);
        document.querySelector("#editor").innerHTML = this.article.content;
        setTimeout(() => {
          this.vanLoading = false;
        }, 1000);
      });
    },
    fetchData() {
      this.ajax
        .$get("", {
          articleId: this.id,
          platform: this.from
        })
        .then(
          res => {
            this.skeletonLoading = false;

            this.article = res.data.content;
            if (!res.data.content.withdrawn) {
              this.init();
            }
            // BridgeClient(
            //   "call",
            //   "UpdateArticleReadCount",
            //   {
            //     articleId: res.data.content.articleId,
            //     readCount: res.data.content.readCount
            //   },
            //   function(data) {}
            // );
          },
          () => {}
        );
    },
    collect() {
      this.lottieCollect(`${document.location.origin}/collect/collect.json`);
      // this.lottieCollect(`/collect/collect.json`);
      this.coverShow = true;
      this.timer = setTimeout(() => {
        this.coverShow = false;
      }, 2000);
      this.ajax
        .$post("", {
          articleId: this.id,
          platform: this.from
        })
        .then(res => {
          this.article.collected = true;
        });
    },
    cancelCollect() {
      this.lottieCollect(`${document.location.origin}/cancel/cancel.json`);
      // this.lottieCollect(`/cancel/cancel.json`);
      this.coverShow = true;
      this.timer = setTimeout(() => {
        this.coverShow = false;
      }, 2000);

      this.ajax
        .$post("", {
          articleId: this.id,
          platform: this.from
        })
        .then(res => {
          this.article.collected = false;
        });
    },
    closeCover() {
      this.coverShow = false;
      clearTimeout(this.timer);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.bubble.css";

.ql-container {
  font-family: "PingFangSC-Regular", "PingFangSC", "PingFang SC",
    "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", Arial,
    sans-serif;
  font-size: 15px;
}
/deep/ .ql-editor img {
  max-width: 100%;
}
.van-overlay {
  background-color: #fff;
}

.van-loading {
  margin: auto;
  top: 48%;
  text-align: center;
}
.kangaroo {
  width: 76px;
  height: 76px;
  margin: auto;
  top: 50%;
  overflow: hidden;
  border-radius: 50%;
  position: fixed;
  left: 0;
  right: 0;
  margin-top: -38px;
  z-index: 10;
}

.wrap {
  position: relative;
}

.head-title {
  padding: 0.24rem 0.3rem;
  font-size: 0.48rem;
  font-weight: bolder;
  color: rgba(51, 51, 51, 1);
  line-height: 0.68rem;
}
.desc-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  .desc {
    .author {
      height: 25px;
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
      line-height: 25px;
    }
    .time {
      height: 17px;
      font-size: 13px;
      color: rgba(153, 153, 153, 1);
      line-height: 17px;
    }
    .pv {
      height: 20px;
      font-size: 14px;
      color: rgba(153, 153, 153, 1);
      line-height: 20px;
    }
  }
  .collect {
    display: inline-block;
    padding: 4px 10px;
    padding-left: 25px;
    // height: 28px;
    // line-height: 28px;
    margin: 0;
    border-radius: 50px;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 149, 67, 1) url("../../assets/article/collect.png")
      no-repeat 9px center / 14px;
  }
  .collected {
    background: rgba(232, 232, 232, 1);
    color: rgba(189, 189, 189, 1);
    padding-left: 10px;
  }
}
.bottom-desc-wrap {
  padding: 16px 15px;
}
.segment {
  height: 8px;
  background: rgba(246, 242, 239, 1);
}
.recommend-wrap {
  padding: 15px;
  .recommend-title {
    padding-left: 9px;
    height: 25px;
    font-size: 18px;
    font-weight: bolder;
    color: rgba(15, 15, 15, 1);
    line-height: 25px;
    position: relative;
  }
  .recommend-title::before {
    position: absolute;
    content: "";
    top: 50%;
    left: 0;
    margin-top: -7px;
    width: 3px;
    height: 14px;
    background: rgba(255, 149, 67, 1);
    border-radius: 50px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    position: relative;
    img {
      width: 100px;
      height: 70px;
      background: rgba(245, 245, 245, 1);
      border-radius: 6px;
    }
    > div {
      width: 230px;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      .title {
        font-size: 14px;
        font-weight: bolder;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        padding-bottom: 7px;
      }
      .desc {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
  .item + .item {
    > div::before {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 230px;
      height: 1px;
      background-color: #eee;
      height: 1px;
      transform: scaleY(0.5);
    }
  }
}
.no-data {
  color: #0f0f0f;
  font-size: 18px;
  text-align: center;
  img {
    width: 150px;
    height: 88px;
    margin: 60px auto 20px;
  }
}
.cover {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100px;
    height: 100px;
  }
}
.blur {
  // opacity: 0.45;
  filter: blur(8px);
}
</style>