/**
 * 创建一个侧边栏(带分组),支持多层级递归
 * @param {Array} siderbarArr siderbar 数组结构的配置
 * @returns {Object} 返回一个对象结构的配置
 */
const AtoO = function (siderbarArr) {
  let siderbarObj = {};
  siderbarArr.forEach((siderbarItem) => {
    if (!siderbarItem.relativeCurDir) return siderbarItem;
    siderbarItem.children.forEach((child) => {
      child[0] = child[0].replace(siderbarItem.relativeCurDir, "");
    });

    if (!siderbarObj[siderbarItem.relativeCurDir]) {
      siderbarObj[siderbarItem.relativeCurDir] = [
        {
          title: "前言",
          path: siderbarItem.relativeCurDir,
        },
      ];
    }
    siderbarObj[siderbarItem.relativeCurDir].push(siderbarItem);
  });

  return siderbarObj;
};
module.exports = {
  AtoO,
};
