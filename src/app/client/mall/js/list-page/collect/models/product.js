import Backbone from "backbone";

const ProductModel = Backbone.Model.extend({
  // idAttribute: "productid",
  defaults:{
    isRender: false,
    visible: true
  }
});

export default ProductModel;
