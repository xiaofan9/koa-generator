const _ = require("lodash");

/**
 * 根据规则格式化日期
 * @param { Date | String | Number } date 日期，一般为字符串日期，可以传入 Date 对象实例，也可以传入时间戳（数字
 * @param { String } pattern 格式化规则，正则
 * @returns { String } 返回一个格式化好的日期
 */
module.exports.formatDate = (date = new Date(), pattern) => {
  // date 默认值为当天日期数据
  if (!_.isDate(date)) date = new Date(date);
  const DEFAULT_PATTERN = "yyyy-MM-dd";
  const SIGN_REGEXP = /([yMdhsm])(\1*)/g;

  pattern = pattern || DEFAULT_PATTERN;
  return pattern.replace(SIGN_REGEXP, function($0) {
    switch ($0.charAt(0)) {
      case "y":
        return padding(date.getFullYear(), $0.length);
      case "M":
        return padding(date.getMonth() + 1, $0.length);
      case "d":
        return padding(date.getDate(), $0.length);
      case "w":
        return date.getDay() + 1;
      case "h":
        return padding(date.getHours(), $0.length);
      case "m":
        return padding(date.getMinutes(), $0.length);
      case "s":
        return padding(date.getSeconds(), $0.length);
    }
  });
};

function padding(s, len) {
  let len_ = len - (s + "").length;
  for (let i = 0; i < len_; i++) s = "0" + s;

  return s;
}
