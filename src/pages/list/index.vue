<template>
  <div class="container">
    <div class="list">
      <div v-for="(item,index) in num" :key="index" class="item" :class="{itempro: type === 2}">
        <image class="img" src="/static/list_bg1.png" v-if="type === 1"/>
        <image class="img" src="/static/list_bg2.png" v-else/>
        <div class="item-info">
          <div class="title">
            综合练习（{{ upCaseNum[index] }}）
          </div>
          <div class="desc">共20道题</div>
        </div>
        <button class="sm-btn" @click="toDetail(index+1)" v-if="(index + 1) <= page">开始做题</button>
        <div class="mask" v-if="(index + 1) > page">
          <image class="lock" src="/static/lock.png"></image>
          <button class="sm-btn" @click="showDialog" >开始做题</button>
        </div>
      </div>
    </div>
    <div class="dialog-wrap" v-if="dialogShow">
      <div class="dialog-content">
        <image src="/static/checklist.png" class="icon"/>
        <div class="remark">上一组练习做完后才能继续后面的练习哦~</div>
        <div class="confirm" @click="closeDialog">确定</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  data () {
    return {
      pageLoading: true,
      dialogShow: false,
      id: 0,
      num: 0,
      type: '',
      page: 1,
      records: {},
      upCaseNum: ['一','二','三','四','五','六','七','八','九','十','十一','十二']
    }
  },
  onShareAppMessage(res) {
    return {
      // title: '自定义转发标题',
      // path: '/page/user?id=123',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    };
  },
  methods:{
    checkStorage(){
      let records = wx.getStorageSync('records')
      //本地缓存不存在任何记录
      if(!records){
        //本条记录存缓存
        records = {}
        records['subject_'+this.id] = 1
        wx.setStorageSync('records', records)
      }else{
        //缓存不存在本条记录
        if(!records['subject_'+this.id]){
          records['subject_'+this.id] = 1
          wx.setStorageSync('records', records)
        }else{
          //存在本条记录获取历史page
          this.page = records['subject_'+this.id]
        }
      }
    },
    toDetail(page){
      if(this.pageLoading){
        this.pageLoading = false
        wx.navigateTo({
          url: '/pages/detail/main?id=' + this.id + '&num=' + this.num + '&page=' + page
        })
      }

    },
    //提示框显示
    showDialog(){
      this.dialogShow = true
    },
    closeDialog(){
      this.dialogShow = false
    }
  },
  onShow(){
    this.pageLoading = true
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    this.id = Page.options.id;
    this.num = parseInt(Page.options.num);
    this.type = parseInt(Page.options.type)  // 1 public 2  professional
    wx.setNavigationBarTitle({
        title: Page.options.title
    });
    this.checkStorage()
  },
  created () {
    // wx.showShareMenu()
    // const logs = (wx.getStorageSync('logs') || [])
    // this.logs = logs.map(log => formatTime(new Date(log)))
  }
}
</script>

<style lang="scss" scoped>
  .dialog-wrap{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.6);
    .dialog-content{
      position: relative;
      width: 264px;
      height: 200px;
      background: #FFFFFF;
      border-radius: 5px;
      .icon{
        position: absolute;
        left: 90px;
        top: -38px;
        width: 82px;
        height: 100px;
      }
      .remark{
        font-size: 14px;
        line-height: 23px;
        padding: 83px 30px 0 30px;
        color: #333333;
      }
      .confirm{
        height: 50px;
        border-top: 1px solid #DDDDDD;
        box-sizing: border-box;
        font-size: 18px;
        line-height: 50px;
        text-align: center;
        margin-top: 21px;
        color: #05D17E;
      }
    }
  }
.list{
  padding: 25px 15px;
  .item{
    position: relative;
    width: 100%;
    height: 90px;
    margin-bottom: 25px;
    box-shadow: 0 0 20px RGBA(20, 21, 23, 0.2);
    .mask{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0,0,0,0.3);
      .sm-btn{
        background: rgba(0,0,0,0.4);
        color:rgba(255,255,255,0.6);
      }
      .lock{
        width: 39px;
        height: 47px;
      }
    }
    .img{
      float: right;
      height: 90px;
      width: 146px;
    }
    .sm-btn{
      position: absolute;
      top: 32px;
      right: 15px;
    }
    .item-info{
      width: 210px;
      height: 100%;
      padding-top: 20px;
      box-sizing: border-box;
      .title{
        font-size: 15px;
        color: #101010;
        margin: 0 0 14px 20px;
      }
      .desc{
        font-size: 12px;
        color: #848484;
        margin-left: 20px;
      }
    }
  }
}
</style>
