import Step1 from "app/client/mall/js/active-page/active/20161215/views/step-01.js";
import Step2 from "app/client/mall/js/active-page/active/20161215/views/step-02.js";
import Step3 from "app/client/mall/js/active-page/active/20161215/views/step-03.js";
import Step4 from "app/client/mall/js/active-page/active/20161215/views/step-04.js";
import Step5 from "app/client/mall/js/active-page/active/20161215/views/step-05.js";
import Step6 from "app/client/mall/js/active-page/active/20161215/views/step-06.js";
import Step7 from "app/client/mall/js/active-page/active/20161215/views/step-07.js";
import Step8 from "app/client/mall/js/active-page/active/20161215/views/step-08.js";
import Step9 from "app/client/mall/js/active-page/active/20161215/views/step-09.js";
import Step10 from "app/client/mall/js/active-page/active/20161215/views/step-10.js";
import Step11 from "app/client/mall/js/active-page/active/20161215/views/step-11.js";
import Step12 from "app/client/mall/js/active-page/active/20161215/views/step-12.js";

import {createRouter} from "app/client/mall/js/common/router/router-factory.js";

var viewDic = {
  "step-01": Step1,
  "step-02": Step2,
  "step-03": Step3,
  "step-04": Step4,
  "step-05": Step5,
  "step-06": Step6,
  "step-07": Step7,
  "step-08": Step8,
  "step-09": Step9,
  "step-10": Step10,
  "step-11": Step11,
  "step-12": Step12,
};

module.exports = createRouter({
  viewDic: viewDic,
  defaultView: "step-01"
});
