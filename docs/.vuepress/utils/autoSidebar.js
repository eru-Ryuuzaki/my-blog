const PATH = require("path");
const { suffixDirName } = require("../../suffixDir");
const { filehelper } = require("./filehelper");
// 侧边栏创建工具
const sideBarTool = {
  /**
   * 创建一个侧边栏(带分组),支持多层级递归
   * @param {String} RootPath 目录路径
   * @param {Array} unDirIncludes 需要排除的某些目录(文件夹)
   * @param {Array} SuffixIncludes 需要处理的文件后缀
   * @param {Object} param3 暂未用上(分组相关配置参数)
   * @returns {Array} 返回一个数组,如下所示
   * [{
   *  "title": "",
   *  "collapsable": true,
   *  "sidebarDepth": 2,
   *  "children": ["/view/"]
   *   },
   *  {
   *  "title": "GFW",
   *   "collapsable": true,
   *   "sidebarDepth": 2,
   *  "children": ["/view/GFW/"]
   *  },
   *  {
   *  "title": "html",
   *  "collapsable": true,
   *  "sidebarDepth": 2,
   *  "children": [
   *      ["/view/html/day1", "day1"],
   *      ["/view/html/day2", "day2"],
   *      ["/view/html/day3", "day3"],
   *      ["/view/html/day4", "day4"],
   *      ["/view/html/day5", "day5"]
   *    ]
   * }]
   */
  getSideBarGroup: (
    RootPath,
    unDirIncludes,
    SuffixIncludes,
    { title = "", children = [""], collapsable = true, sidebarDepth = 2 }
  ) => {
    let sidebars = [];
    let allDirs = filehelper.getAllDirs(RootPath, unDirIncludes);
    allDirs.forEach((dir) => {
      let children = filehelper.getAllFiles(dir, unDirIncludes, SuffixIncludes);
      if (!children.length) return;
      const relativeDir = dir.replace(suffixDirName, "");
      children = children.flatMap((cur) => [
        // 貌似要用 windows 的 '/' 才能识别
        [PATH.join(relativeDir, cur).replace(/\\/g, "/"), cur],
      ]);
      let Obj = {
        title: PATH.basename(dir),
        collapsable: true,
        sidebarDepth: 2,
        children,
        relativeCurDir: PATH.join(relativeDir, "/")
          .replace(/\\/g, "/")
          .replace(/(\/[^/]+\/)(.*)/, "$1"), //  取第一组 /***/ 作为 relativeCurDir
      };
      sidebars.push(Obj);
    });
    return sidebars;
  },
};

module.exports = { sideBarTool };
