import Backbone from "backbone";

const ProductModel = Backbone.Model.extend({
  // idAttribute: "productid",
  defaults:{
    isRander: false,
    visible: true
  }
});

export default ProductModel;
