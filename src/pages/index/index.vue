<template>
  <div class="container">
    <div class="user-info">
      <image class="userinfo-avatar" :src="userInfo.avatarUrl" mode="cover"></image>
      <view class="nickname">{{ userInfo.nickName }}</view>
      <image src="/static/bg.png" class="bg"></image>
    </div>
    <div class="question-wrap">
      <div class="public-list question-list">
        <div class="title">公共课试题</div>
        <div class="item" v-for="(item,index) in public" :key="index">
          <image class="item-img" :src="item.cover"/>
          <div class="item-content">
            <image class="img" src="/static/list_bg1.png"/>
            <div class="item-info">
              <div class="item-title">{{ item.subject_name }}</div>
              <div class="item-num" v-if="item.subject_id === lastSubId">
                上次做到这里
              </div>
              <div class="item-num" v-else>
                <text class="num">{{ item.unit_count }}套题</text>
                <text>共{{ item.question_count }}道</text>
              </div>
            </div>
            <button class="sm-btn" @click="toDetail(item.subject_id,item.unit_count,1,item.subject_name)">开始做题</button>
          </div>
        </div>
      </div>
      <div class="professional-list question-list">
        <div class="title">行政管理专业科目试题</div>
        <div class="item" v-for="(item,index) in professional" :key="index">
          <image class="item-img" :src="item.cover"/>
          <div class="item-content">
            <image class="img" src="/static/list_bg2.png"/>
            <div class="item-info">
              <div class="item-title">{{ item.subject_name }}</div>
              <div class="item-num" v-if="item.subject_id === lastSubId">
                上次做到这里
              </div>
              <div class="item-num" v-else>
                <text class="num">{{ item.unit_count }}套题</text>
                <text>共{{ item.question_count }}道</text>
              </div>
            </div>
            <button class="sm-btn" @click="toDetail(item.subject_id,item.unit_count,2,item.subject_name)">开始做题</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: {
      pageLoading: true,
      userInfo: {},
      public: [],
      lastSubId: null,
      professional: []
    },
    methods: {
     toDetail(id,num,type,title){
       if(this.pageLoading){
         if(num > 0 ){
           this.pageLoading = false
           wx.navigateTo({
             url: '/pages/list/main?id=' + id + '&num=' + num + '&type=' + type + '&title=' + title,
           })
         }else{
           wx.showToast({
             title: "暂未开放",
             icon: "none",
             duration: 1000
           });
         }
       }
     },
      bindgetuserinfo(e) {
        console.log(e);
      },
      bindgetphonenumber(e) {
        console.log(e);
      },
    },
    onShareAppMessage(res) {
      return {
        // title: '自定义转发标题',
        // path: '/page/user?id=123',
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          console.log("error");
          // 转发失败
        }
      };
    },
    onShow(){
      this.pageLoading = true
      this.lastSubId = parseInt(wx.getStorageSync('lastSubId')) || null
    },
    created() {
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
      this.$http.get("/wechat/mini/pub/tiku/subjects/public").then(res => {
        this.public = res.data.data
      });
      this.$http.get("/wechat/mini/pub/tiku/subjects/professional").then(res => {
       this.professional = res.data.data
      });
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    .user-info{
      position: relative;
      width: 100%;
      height: 114px;
    }
    .bg{
      width: 100%;
      height: 114px;
    }
    .userinfo-avatar {
      position: absolute;
      top: 8px;
      left: 153px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
    .nickname{
      position: absolute;
      width: 100%;
      text-align: center;
      left: 0;
      bottom: 13px;
      font-size: 16px;
      color: #FFFFFF;
    }
    .question-wrap{
      background: #F5F5F5;
      .question-list{
        padding: 0 15px 15px 15px;
        background: #FFFFFF;
        .title{
          font-size: 18px;
          color: #101010;
          font-weight: bold;
          text-indent: 11px;
          margin-bottom: 17px;
        }
        .item{
          width: 100%;
          height: 105px;
          position: relative;
          margin-bottom: 15px;
          .item-img{
            position: absolute;
            top: 8px;
            left: 0;
            width: 62px;
            height: 90px;
            border-radius: 2px;
            z-index: 11;
            box-shadow: 0 0 20px RGBA(20, 21, 23, 0.2);
          }
          .item-content{
            position: relative;
            margin-left: 30px;
            width: 315px;
            height: 105px;
            border-radius: 3px;
            box-shadow: 0 0 20px RGBA(20, 21, 23, 0.2);
            .img{
              float: right;
              width: 170px;
              height: 105px;
            }
            .sm-btn{
              position: absolute;
              top: 39px;
              right: 15px;
            }
            .item-info{
              position: relative;
              width: 170px;
              margin-left: 53px;
              height: 100%;
              .item-title{
                width: 100%;
                position: absolute;
                left: 0;
                top: 23px;
                font-size: 15px;
                height: 40px;
                overflow: hidden;
                color: #101010;
                font-weight: bold;
              }
              .item-num{
                position: absolute;
                bottom: 23px;
                left: 0;
                width: 100%;
                font-size: 12px;
                color: #848484;
                .num{
                  margin-right: 20px;
                }
              }
            }
          }
        }
        &.public-list{
          margin-bottom: 15px;
          padding-top: 17px;
          .title{
            border-left: 3px solid #0A88FF;
          }
        }
        &.professional-list{
          padding-top: 22px;
          .title{
            border-left: 3px solid #FC721D;
          }
       }
      }
    }

  }

</style>
