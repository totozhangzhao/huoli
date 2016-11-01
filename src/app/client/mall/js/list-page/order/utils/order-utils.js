import _ from "lodash";
const orderNavDataList = [
  {
    title: "全部",
    target: "all"
  },
  {
    title: "待支付",
    target: "pending"
  },
  {
    title: "待收货",
    target: "express"
  },
  {
    title: "已完成",
    target: "success"
  }
];
const typeEnum = {
  "all": {
    title: "全部",
    orderStatus: 0,
    view: "all"
  },
  "pending": {
    title: "待付款",
    orderStatus: 1,
    view: "pending"
  },
  "express": {
    title: "待收货",
    orderStatus: 2,
    view: "express"
  },
  "success": {
    title: "已完成",
    orderStatus: 3,
    view: "success"
  }
};
class OrderUtil {
  constructor() {
    this.typeEnum = typeEnum;
    this.orderNavDataList = orderNavDataList;
  }

  hasType(orderStatus) {
    return _.includes(_.keys(this.typeEnum), orderStatus);
  }

  getTypeValue(orderStatus) {
    return this.typeEnum[orderStatus].orderStatus;
  }

  getViewByTypeValue(typeValue) {
    var a =_.find(this.typeEnum, (item) => {
      return item.orderStatus === typeValue;
    });
    return a.view;
  }
}
const orderUtil = new OrderUtil();
export default orderUtil;
