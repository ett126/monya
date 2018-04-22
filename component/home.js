const currencyList = require("../js/currencyList")
const coinUtil = require("../js/coinUtil")
module.exports=require("../js/lang.js")({ja:require("./ja/home.html"),en:require("./en/home.html")})({
  data(){
    return {
      curs:[],
      fiatConv:0,
      loading:false,
      state:"initial",
      error:false,
      isSingleWallet:currencyList.isSingleWallet,
      lastUpdate:(Date.now()/1000)|0,
      outdatedWatcher:0
    }
  },
  methods:{
    qr(){
      
      this.$emit("push",require("./qrcode.js"))
    },
    load(done){
      this.curs=[]
      this.fiatConv=0
      this.loading=true;
      this.error=false
      
      const promises=[]
      currencyList.eachWithPub(cur=>{
        let obj={
          coinId:cur.coinId,
          balance:0,
          unconfirmed:0,
          screenName:cur.coinScreenName,
          price:0,
          icon:cur.icon
        }
        
        promises.push(cur.getWholeBalanceOfThisAccount()
          .then(res=>{
            obj.balance=res.balance
            obj.unconfirmed=res.unconfirmed
            this.curs.push(obj)
            return coinUtil.getPrice(cur.coinId,this.$store.state.fiat)
          }).then(res=>{
            this.fiatConv += res*obj.balance
            obj.price=res
            return obj
          }).catch(()=>{
            this.error=true
            obj.screenName=""
            return obj
          }))
      })
      Promise.all(promises).then(data=>{
        this.curs=data
        this.loading=false
        this.lastUpdate=(Date.now()/1000)|0
        typeof(done)==='function'&&done()
      })
    },
    goToManageCoin(){
      this.$emit("push",require("./manageCoin.js"))
    },
    receive(){
      this.$emit("push",require("./receive.js"))
    },
    send(){
      this.$emit("push",require("./send.js"))
    },
    history(){
      this.$emit("push",require("./history.js"))
    },
    monaparty(){
      this.$emit("push",require("./monaparty.js"))
    }
  },
  store:require("../js/store.js"),
  mounted(){
    this.load()

    this.outdatedWatcher=setInterval(()=>{
      if((Date.now()/1000)>this.lastUpdate+60*15){
        this.load()
      }
    },1000*60*10)
  },
  beforeDestroy(){
    clearInterval(this.outdatedWatcher)
  },
  computed:{
    fiat(){
      return this.$store.state.fiat
    }
  }
})
