module.exports=require("../js/lang.js")({ja:require("./ja/coinParam.html"),en:require("./en/coinParam.html")})({
  data(){
    return {
      c:{
        coinScreenName:"Monacoin",
        coinId:"mona",
        unit:"MONA",
        unitEasy:"Mona",
        bip44:{
          coinType:22,
          account:0
        },
        bip21:"monacoin",
        defaultFeeSatPerByte:200,
        icon:require("../res/coins/btc.png"),
        defaultAPIEndpoint:"https://mona.insight.monaco-ex.org/insight-api-monacoin",
        apiEndpoints:["https://mona.insight.monaco-ex.org/insight-api-monacoin","https://mona.monya.ga/insight-api-monacoin"],
        explorer:"https://mona.insight.monaco-ex.org/insight",
        network:{
          messagePrefix: '\x19Monacoin Signed Message:\n',
          bip32: {
            public: 0x0488b21e,
            
            private: 0x0488ade4
          },
          pubKeyHash: 50,
          scriptHash: 55,
          wif: 178,
          bech32:"mona"
        },
        enableSegwit:false,
        price:{
          url:"https://public.bitbank.cc/mona_jpy/ticker",
          json:true,
          jsonPath:["data","last"],
          fiat:"jpy"
        },
        confirmations:6,
        counterpartyEndpoint:"https://wallet.monaparty.me/_api"
      }
    }
  },
  methods:{
    
  },
  mounted(){
    
  }
})
