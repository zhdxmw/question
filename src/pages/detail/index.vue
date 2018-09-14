<template>
  <div class="container">
    <div class="question-type-index" v-if="!showResult">
      <text class="type">单选题</text>
      <text class="index">
        <text class="now">{{ index }}</text>
        <text>/{{ list.length }}</text>
      </text>
    </div>
    <div class="swiper-wrap" v-if="!showResult">
      <swiper :indicator-dots="false" :autoplay="false" :duration="300" @change="swiperChange" :style="{height: sHeight}">
        <div v-for="(item, index) in list" :key="index" >
          <swiper-item>
            <scroll-view scroll-y="true" class="swiper-scroll" :style="{height: sHeight}">
              <div class="scroll-content" :class="{showExplain: showExplain}">
                <div class="question-title">{{ item.title }}</div>
                <div class="choice-item" v-for="(choice,j) in item.choices" :key="j">
                  <div class="choice-btn">
                    <button class="circle-btn" :class="{checked: item.checked === j}" @click="selectItem(item,j,index)" v-if="!showExplain">{{ chartArr[j] }}</button>
                    <button class="circle-btn" :class="{selected: item.checked === j,correct: item.answer === j}"  v-if="showExplain">{{ chartArr[j] }}</button>
                  </div>
                  <div class="choice-content">
                    {{choice}}
                  </div>
                </div>
                <button class="common-btn sub-btn" v-if="index === (list.length - 1) && !showExplain" @click="submitTest">交 卷</button>
              </div>
              <div class="explain-wrap" v-if="showExplain">
                <div class="answer-title">答案解析：</div>
                <div class="correct-answer">
                  正确答案
                  <text>{{ chartArr[item.answer] }}</text>
                </div>
                <div class="explain-content">
                  {{ item.explain }}
                </div>
              </div>
            </scroll-view>
          </swiper-item>
        </div>
      </swiper>
    </div>
    <div class="result-wrap" v-if="showResult">
      <div class="result">
        <canvas canvas-id='customCanvas' id="customCanvas"></canvas>
        <div class="result-info">
          <div>
            <text class="percent">{{correctPer}}</text>
            <text class="per">%</text>
          </div>
          <div class="desc">正确率</div>
        </div>
      </div>
      <div class="remark">
        <div class="error">
          <text class="error-icon remark-icon"></text>
          回答错误
        </div>
        <div class="correct">
          <text class="correct-icon remark-icon"></text>
          回答正确
        </div>
        <div class="no-answer">
          <text class="no-answer-icon remark-icon"></text>
          未回答
        </div>
      </div>
      <div class="result-detail">
        <div class="result-item" v-for="(item,index) in list"  :key="index" :class="{correct:item.checked === item.answer,error: item.checked !== item.answer && item.checked !== null,noAnswer: item.checked === null}">{{ index+1 }}</div>
      </div>
      <button class="common-btn explain-btn" @click="toExplain">查看试题解析</button>
      <button class="df-btn back-btn" @click="backHome">回首页</button>
      <button class="df-btn next-btn" @click="nextExam" :class="{noNext:page >= num}">下一组练习</button>
    </div>

  </div>
</template>

<script>

export default {
  computed: {
  },
  data(){
    return {
      pageLoading: true,
      showExplain: false,
      showResult: false,
      correctPer: 0,
      index: 1,
      id: 0,
      page: 1,
      num: 1,
      sHeight: '400px',
      list: [],
      records: {},
      upCaseNum: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
      chartArr: ['A','B','C','D','E','F','G']
    }
  },
  methods: {
    backHome(){
      if(this.pageLoading){
        this.pageLoading = false
        wx.reLaunch({
          url: '/pages/index/main'
        })
      }
    },
    nextExam(){
      //下一组练习
      if(this.page < this.num){
        this.page++;
        this.getDate(this.page)
        this.index = 1
        this.showResult = false
        wx.setNavigationBarTitle({
          title: '综合练习（'+ this.upCaseNum[this.page - 1] +'）'
        });
      }
    },
    setStorage(){
      //记录本章节完成
      let records = wx.getStorageSync('records')
      let page = this.page + 1
      if(page> this.num){
        page = this.num
      }
      records['subject_'+this.id] = page
      wx.setStorageSync('records', records)
    },
    toExplain(){
      this.showExplain = true
      this.showResult = false
      this.index = 1
      wx.setNavigationBarTitle({
        title: '试题解析'
      });
    },
    //交卷
    submitTest(){
      this.setStorage()
      wx.setNavigationBarTitle({
        title: '练习成绩'
      });
      this.showResult = true
      const ctx = wx.createCanvasContext('customCanvas')
      // Draw arc
      let correctArr = this.list.filter(item => {
        return item.checked === item.answer
      })
      let correctNum = correctArr.length
      this.drawArc(ctx,correctNum,this.list.length)
      this.correctPer = Math.round(correctNum / this.list.length * 100)
    },
    drawArc(ctx,correct,all){
      //correct  正确的数量 all 总题数
      // Draw arc
      let i = 0;
     let interval = setInterval(() => {
        correct > 0 && i++;
        ctx.beginPath()
        ctx.arc(84, 84, 82, 0, 2 * Math.PI)
        ctx.lineWidth=2;
        ctx.setStrokeStyle('#E9E9E9')
        ctx.stroke()

        ctx.beginPath();
        let deg = 3/2 - i/all*2;
        ctx.arc(84, 84, 82, Math.PI * 3 / 2 , deg * Math.PI, true);
        ctx.lineWidth=2;
        ctx.setStrokeStyle('#3F89EB');
        ctx.stroke();
        ctx.draw()
        if(i >= correct){
          clearInterval(interval);

        }
      },50)
    },
    swiperChange(e){
      this.index = e.mp.detail.current + 1
    },
    getDate(page){
      this.$http.get("/wechat/mini/pub/tiku/subjects/"+this.id+"/questions?page="+page).then(res => {
        this.list = res.data.data
        this.list.forEach(item => {
           item.checked = null
        })
      });
    },
    selectItem(item,j,index){
      item.checked = j;
      this.$set(this.list,index,item)
    },
    setLastHiotory(){
      wx.setStorageSync('lastSubId', this.id)
    }
  },
  onShow(){
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    this.id = Page.options.id;
    this.num = parseInt(Page.options.num);  //共几套题
    this.page = parseInt(Page.options.page);
    wx.setNavigationBarTitle({
      title: '综合练习（'+ this.upCaseNum[this.page - 1] +'）'
    });
    this.getDate(this.page)
  },
  onHide(){
    this.list = []
    this.page = 1
    this.showResult = false
    this.showExplain = false
    this.setLastHiotory()
  },
  onUnload(){
    this.list = []
    this.page = 1
    this.showResult = false
    this.showExplain = false
    this.setLastHiotory()
  },
  created(){
    let _this = this
    wx.getSystemInfo({
      success: function (res) {
        _this.sHeight = res.windowHeight - 60;
        _this.sHeight += 'px'
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.question-type-index{
  width: 100%;
  padding: 0 16px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #DDDDDD;
  box-sizing: border-box;
  .type{
    font-size: 18px;
    color: #101010;
  }
  .index{
    float: right;
    font-size: 15px;
    color: #101010;
    .now{
      color: #05D17E;
    }
  }
}
.swiper-wrap{
  .swiper-scroll{
    .scroll-content{
      padding: 15px 17px 0 17px;
      box-sizing: border-box;
      &.showExplain{
        background: #F5F5F5;
        padding-bottom: 2px;
      }
    }
    .explain-wrap{
      background: #FFFFFF;
      padding: 15px;
      font-size: 15px;
      .answer-title{
        font-size: 15px;
        color: #101010;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .correct-answer{
        color: #101010;
        line-height: 24px;
      }
    }
    .question-title{
      color: #101010;
      font-size: 15px;
      line-height:24px;
      margin:0 0 20px 0;
    }
    .choice-item{
      display: flex;
      margin-bottom: 20px;
      .choice-btn{
        width: 30px;
        margin-right: 11px;
        .circle-btn{
          width: 30px;
          height: 30px;
          border:1px solid #B0CDFF;
          box-sizing: border-box;
          border-radius:100%;
          text-align:center;
          margin:0;
          padding:0;
          line-height:28px;
          font-size:15px;
          color:#3F89EB;
          &.selected{
            background: #F93A35;
            border: none;
            color: #FFFFFF;
          }
          &.correct{
            background: #05D17E;
            border: none;
            color: #FFFFFF;
          }
          &.checked{
            background: #3F89EB;
            color: #FFFFFF;
          }
        }
      }
      .choice-content{
        color: #101010;
        width: 300px;
        line-height:24px;
        display:flex;
        align-items:center;
        font-size:15px;
      }
    }
  }
}
.sub-btn{
  position:absolute;
  bottom:10px;
  left:48px;
}
.result-wrap{
  .result{
    position: relative;
    width:170px;
    height:170px;
    margin:40px 105px;
    .result-info{
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 170px;
      height: 170px;
      font-size: 60px;
      font-weight: 300;
      .per{font-size: 18px;}
      .desc{
        font-size: 15px;
        color: #333333;
        margin-top:-8px;
      }
    }
  }
}
.remark{
  display: flex;
  flex-direction: row;
  font-size: 13px;
  color: #9F9F9F;
  .remark-icon{
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    margin-right: 6px;
    margin-left: 14px;
    &.error-icon{
      background: #FFDACE;
    }
    &.correct-icon{
      background: #9BEDCB;
    }
    &.no-answer-icon{
      background: #FFFFFF;
      border: 1px solid #B2B2B2;
      box-sizing: border-box;
    }
  }
}
.result-detail{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 30px;
  margin-top: 25px;
  .result-item{
    width: 35px;
    height: 35px;
    border-radius: 100%;
    font-size: 15px;
    color: #333333;
    margin: 0 35px 30px 0;
    text-align: center;
    line-height: 35px;
    &:nth-child(5n){
      margin-right: 10px;
    }
    &.correct{
      background: #9BEDCB;
    }
    &.error{
      background: #FFDACE;
    }
    &.noAnswer{
      background: #FFFFFF;
      border:1px solid #B2B2B2;
      box-sizing: border-box;
    }
  }
}
.explain-btn{
  width: 330px;
  margin-top: 60px;
  margin-bottom: 20px;
}
.back-btn{
  margin: 0 30px 30px 23px;
}
.noNext{
  border-color: #B2B2B2;
  color: #B2B2B2;
}
#customCanvas{
  width: 170px;
  height: 170px;
}
</style>
