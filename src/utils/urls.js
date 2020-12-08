import environment from "../config/environment";

export default {
  loginByPass: `tonginfo/loginByPass`, // 登录
  logout: `tonginfo/logout`, // 登出
  registerPer: `tonginfo/registerPer`, // 消费者注册
  registerOrg: `tonginfo/registerOrg`, // 其他身份注册
  sendSmsCode: `tonginfo/sendSmsCode`, // 获取验证码
  upload: `tonginfo/file/upload/base64`, // 图片上传
  queryByUser: `tonginfo/user/notice/queryByUser`, // 消息查询
  list: `tonginfo/category/list`, // 查询分类
  queryGoods: `tonginfo/goods/queryGoods`, // 查询商品
  goods: `tonginfo/goods`, // 查询商品详情
  addReadNum: `tonginfo/goods/addReadNum`, // 浏览数量
  addCart: `tonginfo/user/cart/add`, // 添加购物车
  queryCartByUser: `tonginfo/user/cart/queryByUser`, // 查询购物车
  updateCart: `tonginfo/user/cart/update`, // 修改购物车
  deleteCart: `tonginfo/user/cart`, // 删除购物车
  saveAddress: `tonginfo/user/address/save`, // 新增收货地址
  queryAddress: `tonginfo/user/address/queryByUser`, // 查询收货地址
  deleteAddress: `tonginfo/user/address`, // 删除收货地址
  saveOrder: `tonginfo/user/order/save`, //保存订单
  getOrders: `tonginfo/user/order/getOrders`, //查询订单
  orderSn: `tonginfo/user/order`, //根据订单号查询订单
  confirmOrderSn: `tonginfo/user/order/confirm`, //确认收货
  refund: `tonginfo/user/order/refund`, //申请退货
  bankcardSave: `tonginfo/user/bankcard/save`, //保存银行卡
  queryBankByUser: `tonginfo/user/bankcard/queryByUser`, //查询银行卡
  deleteCard: `tonginfo/user/bankcard`, //删除银行卡
  articleList: `tonginfo/user/article/list`, //查询视频
  articleDetail: `tonginfo/user/article`, //查询视频详情
  queryRebate: `tonginfo/rebate/queryRebate`, //查询奖励
  rankType: `tonginfo/rebate/rank`, //查询排名
  alipay: `tonginfo/pay/alipay/prepare`, //支付宝支付
  wxpay: `tonginfo/pay/wx/prepare`, //微信支付
  feedbackSave: `tonginfo/user/feedback/save`, //意见反馈

  // loginByPass: `${environment.appUrl}/loginByPass`, // 登录
  // logout: `${environment.appUrl}/logout`, // 登出
  // registerPer: `${environment.appUrl}/registerPer`, // 消费者注册
  // registerOrg: `${environment.appUrl}/registerOrg`, // 其他身份注册
  // sendSmsCode: `${environment.appUrl}/sendSmsCode`, // 获取验证码
  // upload: `${environment.appUrl}/file/upload/base64`, // 图片上传
  // queryByUser: `${environment.appUrl}/user/notice/queryByUser`, // 消息查询
  // list: `${environment.appUrl}/category/list`, // 查询分类
  // queryGoods: `${environment.appUrl}/goods/queryGoods`, // 查询商品
  // goods: `${environment.appUrl}/goods`, // 查询商品详情
  // addReadNum: `${environment.appUrl}/goods/addReadNum`, // 浏览数量
  // addCart: `${environment.appUrl}/user/cart/add`, // 添加购物车
  // queryCartByUser: `${environment.appUrl}/user/cart/queryByUser`, // 查询购物车
  // updateCart: `${environment.appUrl}/user/cart/update`, // 修改购物车
  // deleteCart: `${environment.appUrl}/user/cart`, // 删除购物车
  // saveAddress: `${environment.appUrl}/user/address/save`, // 新增收货地址
  // queryAddress: `${environment.appUrl}/user/address/queryByUser`, // 查询收货地址
  // deleteAddress: `${environment.appUrl}/user/address`, // 删除收货地址
  // saveOrder: `${environment.appUrl}/user/order/save`, //保存订单
  // getOrders: `${environment.appUrl}/user/order/getOrders`, //查询订单
  // orderSn: `${environment.appUrl}/user/order`, //根据订单号查询订单
  // confirmOrderSn: `${environment.appUrl}/user/order/confirm`, //确认收货
  // refund: `${environment.appUrl}/user/order/refund`, //申请退货
  // bankcardSave: `${environment.appUrl}/user/bankcard/save`, //保存银行卡
  // queryBankByUser: `${environment.appUrl}/user/bankcard/queryByUser`, //查询银行卡
  // deleteCard: `${environment.appUrl}/user/bankcard`, //删除银行卡
  // articleList: `${environment.appUrl}/user/article/list`, //查询视频
  // articleDetail: `${environment.appUrl}/user/article`, //查询视频详情
  // queryRebate: `${environment.appUrl}/rebate/queryRebate`, //查询奖励
  // rankType: `${environment.appUrl}/rebate/rank`, //查询排名
  // alipay: `${environment.appUrl}/pay/alipay/prepare`, //支付宝支付
  // wxpay: `${environment.appUrl}/pay/wx/prepare`, //微信支付
  // feedbackSave: `${environment.appUrl}/user/feedback/save`, //意见反馈

}

