const PATH = require("path");
const fs = require("fs");
// 文件助手
const filehelper = {
  /**
   *
   * @param {String} mypath 目录路径
   * @param {Array} unDirIncludes 需要排除的某些目录(文件夹)
   * @param {Array} SuffixIncludes 需要处理的文件后缀
   * @returns
   */
  getAllFiles: (mypath, unDirIncludes, SuffixIncludes) => {
    let filenameList = [];
    // readdirSync 仅返回当前这层的数据
    fs.readdirSync(mypath).forEach((file) => {
      // statSync() 用来获取文件信息 stat => status
      let fileInfo = fs.statSync(PATH.join(mypath, file));
      // 只处理固定后缀的文件
      //获取最后一个.的位置
      const index = file.lastIndexOf(".");
      //获取后缀
      const suffix = file.slice(index + 1);
      if (fileInfo.isFile() && SuffixIncludes.includes(suffix)) {
        //  过滤readme.md文件
        if (file.toLocaleLowerCase() !== "readme.md") {
          file = file.replace(".md", "");
        } else {
          return;
        }
        filenameList.push(file);
      }
    });
    //  排序
    filenameList.sort();
    return filenameList;
  },
  /**
   *
   * @param {String} mypath 当前的目录路径
   * @param {Array} unDirIncludes 需要排除的某些目录(文件夹)
   * @returns {Array} allDirs 所有的目录
   */
  getAllDirs: function getAllDirs(mypath = ".", unDirIncludes) {
    // 获取目录数据
    const items = fs.readdirSync(mypath);
    let allDirs = [];
    // 递归遍历目录中所有文件夹
    items.map((item) => {
      let dirName = PATH.join(mypath, item);
      if (fs.statSync(dirName).isDirectory() && !unDirIncludes.includes(item)) {
        allDirs.push(dirName);
        allDirs = allDirs.concat(getAllDirs(dirName, unDirIncludes));
      }
    });
    return allDirs;
  },

  /**
   *
   * @param {String} mypath 当前的目录路径
   * @param {Array} unDirIncludes 需要排除的某些目录(文件夹)
   * @returns {Array} allCurDirs 当前这层所有的目录
   */
  getAllCurDirs: function getAllCurDirs(mypath = ".", unDirIncludes) {
    // 获取目录数据
    const items = fs.readdirSync(mypath);
    let allCurDirs = [];
    // 递归遍历目录中所有文件夹
    items.map((item) => {
      let dirName = PATH.join(mypath, item);
      if (fs.statSync(dirName).isDirectory() && !unDirIncludes.includes(item)) {
        allCurDirs.push(dirName);
      }
    });
    return allCurDirs;
  },
};

module.exports = {
  filehelper,
};
