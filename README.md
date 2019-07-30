# 合利宝支付 for nodejs
[境内收单][跨境收单][跨境汇款][报关查询] 

## 功能概述
- `境内收单` - 支付结果通知,
- `支付模式支持` - 付款码/公众号/小程序/APP/H5/扫码支付
- `服务商模式支持` - 所有api均可自行传入merchant_no
- `支付仿真测试系统` - 支持沙盒模式, 用于测试支付


## 使用前必读
#### 版本要求
nodejs >= 8.3.0


#### 关于错误
> API和中间件均对所有错误进行了处理, 统一通过error返回, 包括:

- `网络类错误` - 网络中断, 连接超时等
- `请求回调返回值检验错误` - 返回值非法(伪造请求等, 可能性非常低)
- `其它错误` - 应传参数未传入等

#### 关于返回值
> 未出错时正常返回为JSON格式数据


## 安装
```Bash
npm i node-helipay

# 如已安装旧版, 重新安装最新版
npm i node-helipay@latest
```

## 实例化
```javascript
const helipay = require('helipay');
const config = {
  merchant_no: '商户编号',
  notify_url:'支付回调网址',
  sandbox:false,
};

const api = new helipay(config);

// 调试模式(传入第二个参数为true, 可在控制台输出数据)
const api = new helipay(config, true);
```

#### config说明:
- `merchant_no` - 商户编号(必填)
- `notify_url` - 支付结果通知回调地址(选填)
  - 可以在初始化的时候传入设为默认值, 不传则需在调用相关API时传入
  - 调用相关API时传入新值则使用新值
- `sandbox` - 是否沙盒环境(选填)
  - 可以在初始化的时候传入设为默认值, 不传则默认值为false


## API 列表
- 某些API预设了某些必传字段的默认值, 调用时不传参数则使用默认值
- 初始化时已传入的参数无需调用时重复传入, 如`merchant_no` `sandbox` 
- 签名(sign)会在调用API时自动处理, 无需手动传入


### domesticPay: 境内收单(自动下单，返回结果)
```javascript
let result = await api.domesticPay({
  productCode: '产品编码，ALIPAYSCAN/WXPAYSCAN',
  orderNo: '商户内部订单号',
  orderAmount: '订单金额',
  goodsName: '商品简单描述',
  aes_key:'商户该产品编码对应的aeskey',
  sha256_key:'商户该产品编码对应的sha256'
},'appScan');

第二个参数为类别：appScan(扫码下单)，wxApp(微信小程序)
```

##### 更多api未完待续...



