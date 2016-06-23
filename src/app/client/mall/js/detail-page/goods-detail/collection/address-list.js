import Backbone from "backbone";
import Address from "app/client/mall/js/detail-page/goods-detail/model/address.js";

const AddressList = Backbone.Collection.extend({
  model: Address
});

export default AddressList;
