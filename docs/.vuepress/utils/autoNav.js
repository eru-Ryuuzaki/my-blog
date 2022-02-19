const PATH = require("path");
const { filehelper } = require("./filehelper");
const { suffixDirName } = require("../../suffixDir");

navTool = {
  /**
   * 创建一个导航栏
   * @param {String} RootPath 目录路径
   * @param {Array} unDirIncludes 需要排除的某些目录(文件夹)
   * @returns {Array} 返回一个数组
   */
  getNav: (RootPath, unDirIncludes) => {
    let navs = [];
    const allCurDirs = filehelper.getAllCurDirs(RootPath, unDirIncludes);
    allCurDirs.forEach((dir) => {
      const obj = {
        text: PATH.basename(dir),
        link: PATH.join(dir, "/")
          .replace(suffixDirName, "")
          .replace(/\\/g, "/"),
      };
      navs.push(obj);
    });
    return navs;
  },
};

module.exports = { navTool };
