
//index.js
import mqtt from './../../utils/mqtt.js';

//获取应用实例
const app = getApp();

Page({
  data: {
    client: null,
    topic: {
      LEDcontrolTopic: 'sensor/work',
      HumdTopic: 'sensor/humidity',
      TempTopic: 'Temp',
    },
    value: {
      Humdlogo: './../images/humd.png',
      HumdValue: 0,
      Templogo: './../images/temp.png',
      TempValue: 0,
    },
    LEDValue: [{
      LEDlogo: './../images/LED_gray.png',
      ButtonValue: '开灯',
      ButtonFlag: true,
    }]
  },

  onLoad: function() {
    var that = this;
    this.data.client = app.globalData.client;

    // console.log("on load");

    that.data.client.on('connect', that.ConnectCallback);
    that.data.client.on("message", that.MessageProcess);
    that.data.client.on("error", that.ConnectError);
    that.data.client.on("reconnect", that.ClientReconnect);
    that.data.client.on("offline", that.ClientOffline);
  },

  onShow: function() {
    // console.log("on show");
  },

  onHide: function() {
    console.log("on hide");
  },

  onUnload: function() {
    console.log("on unload");
    var that = this;
    that.data.client.end();
  },

  LedControl: function(e) {
    var that = this;
    
    if (that.data.LEDValue[0].ButtonFlag) {
        that.setData({
          'LEDValue[0].ButtonValue': '关灯',
          'LEDValue[0].ButtonFlag': false,
          "LEDValue[0].LEDlogo": './../images/LED_red.png',
        })
      that.data.client.publish(that.data.topic.LEDcontrolTopic, "1",{
        qos: 1
      });
    } else {
          that.setData({
            'LEDValue[0].ButtonValue': '开灯',
            'LEDValue[0].ButtonFlag': true,
            "LEDValue[0].LEDlogo": './../images/LED_gray.png',
          })
      that.data.client.publish(that.data.topic.LEDcontrolTopic, "0",{
        qos: 1
      });
    }
  },

  MessageProcess: function(topic, payload) {
    var that = this;

    var payload_string = payload.toString();
      if (topic == that.data.topic.HumdTopic) {
        that.setData({
          'value.HumdValue': payload_string
        
          
        })
        
      }
      if (topic == that.data.topic.TempTopic) {
        that.setData({
          'value.TempValue': payload_string
        })
      }

  },

  

  ConnectCallback: function(connack) {
    var that = this;
    // that.data.client.on("message", function (topic, payload) {
    //   console.log(" 收到 topic:" + topic + " , payload :" + payload)
    //   wx.showModal({
    //    content: " 收到topic:[" + topic + "], payload :[" + payload + "]",
    //     showCancel: false,
    //   });
    // })

    // console.log("connect callback ");
    for (var v in that.data.topic) {
      that.data.client.subscribe(that.data.topic[v], {
        qos: 1
      });
    }
  },

  ConnectError: function(error) {
    console.log(error)
  },

  ClientReconnect: function() {
    console.log("Client Reconnect")
  },

  ClientOffline: function() {
    console.log("Client Offline")
  }
   
})