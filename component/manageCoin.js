const currencyList = require("../js/currencyList")
const storage = require("../js/storage.js")
const coinUtil = require("../js/coinUtil")
module.exports=require("../js/lang.js")({ja:require("./ja/manageCoin.html"),en:require("./en/manageCoin.html")})({
  data:()=>({
    coins:[],
    loading:false,
    requirePassword:false,
    password:"",
    incorrect:false,
    infoDlg:false,
    editDlg:false,
    info:{
      blocks:[],
      coinId:"",
      unit:"",
      apiEndpoint:""
    },
    c:{}
  }),
  methods:{
    push(){
      this.$emit("push",require("./send.js"))
    },
    load(){
      this.curs=[]
      this.fiatConv=0
      currencyList.each(cur=>{
        this.coins.push({
          coinId:cur.coinId,
          screenName:cur.coinScreenName,
          icon:cur.icon,
          usable:!!cur.hdPubNode
        })
      })
    },
    
    operateCoins(){
      const curs=[]
      this.loading=true
      this.coins.forEach(v=>{
        if(v.usable){
          curs.push(v.coinId)
        }
      })
      this.requirePassword=false
      
      coinUtil.shortWait()
        .then(()=>storage.get("keyPairs"))
        .then((cipher)=>coinUtil.makePairsAndEncrypt({
          entropy:coinUtil.decrypt(cipher.entropy,this.password),
          password:this.password,
          makeCur:curs
        }))
        .then((data)=>storage.set("keyPairs",data))
        .then((cipher)=>{
          this.password=""
          this.$emit("replace",require("./login.js"))
        }).catch(()=>{
          this.password=""
          this.requirePassword=true
          this.loading=false
          this.incorrect=true
          setTimeout(()=>{
            this.incorrect=false
          },3000)
        })
    },
    showInfo(coinId){
      this.infoDlg=true
      const cur=currencyList.get(coinId)
      Object.assign(this.info,{
        blocks:[],
        coinId:cur.coinId,
        unit:cur.unit,
        apiEndpoint:cur.apiEndpoint
      })
      cur.getBlocks().then(r=>{
        this.info.blocks=r
      })
    },
    editCoinParam(coinId){
      this.editDlg=true
      const cur=currencyList.get(coinId)
      this.$set(this,"c",{
        coinScreenName:cur.coinScreenName,
        coinId:cur.coinId,
        unit:cur.unit,
        unitEasy:cur.unitEasy,
        bip44:cur.bip44||{},
        bip49:cur.bip49||{},
        bip21:cur.bip21,
        defaultFeeSatPerByte:cur.defaultFeeSatPerByte,
        icon:cur.icon,
        defaultAPIEndpoint:cur.apiEndpoints[0],
        
        explorer:cur.explorer,
        network:{
          messagePrefix: cur.network.messagePrefix,
          bip32: {
            public: cur.network.bip32.public|0,
            
            private: cur.network.bip32.private|0
          },
          pubKeyHash: cur.network.pubKeyHash|0,
          scriptHash: cur.network.scriptHash|0,
          wif: cur.network.wif|0
        },
        
        enableSegwit:cur.enableSegwit,
        lib:cur.libName,
        price:cur.price||{},
        confirmations:6,
        counterpartyEndpoint:cur.counterpartyEndpoint
      })
      
    },
    changeServer(){
      const cur=currencyList.get(this.info.coinId)
      cur.changeApiEndpoint()
      this.showInfo(this.info.coinId)
    },
    openBlock(h){
      currencyList.get(this.info.coinId).openExplorer({blockHash:h})
    },
    save(coinId){
      storage.get("customCoins").then(r=>{
        r=r||[]
        r.push(this.c)
        this.editDlg=false
        return storage.set("customCoins",r)
      })
    }
  },
  
  store:require("../js/store.js"),
  mounted(){
    this.$nextTick(this.load)
  },
  computed:{
    priceJsonPath:{
      get(){
        if(!this.c||!this.c.price||!this.c.price.url){return ""}
        return this.c.price.jsonPath.join(".")
      },
      set(d){
        if(!this.c||!this.c.price||!this.c.price.url){return ""}
        this.c.price.jsonPath= d.split(".")
      }
    },
    messagePrefix:{
      get(){
        return JSON.stringify(this.c.network.messagePrefix).slice(1,-1)
      },set(d){
        try{
          this.c.network.messagePrefix = eval("'"+ d +"'")
        }catch(e){
          
        }
      }
    },
    enableSegwit:{
      get(){
        return this.c.enableSegwit==="legacy"
      },
      set(d){
        return !!(this.c.enableSegwit=d?"legacy":false)
      }
    }
  }
});
