// 不能用 index.md 命名，被坑浪费了好多时间！（初步猜测是因为编译生成 index.html 有冲突啥的）

const PATH = require("path");
const rootPath = PATH.dirname(__dirname);
const { sideBarTool } = require(PATH.join(__dirname, "./utils/autoSidebar"));
const { navTool } = require(PATH.join(__dirname, "./utils/autoNav"));
const { mySiderbarConf, myNavConf } = require("./myconf");
const { AtoO } = require("./utils/arr_to_obj");

// 需要排除的一些目录
const unDirIncludes = ["node_modules", "assets", "public", ".vuepress", "test"];
// 只需要处理后缀的文件类型
const SuffixIncludes = ["md", "html"];
// 自动生成侧边栏配置
const autoSidebarConf = sideBarTool.getSideBarGroup(
  rootPath,
  unDirIncludes,
  SuffixIncludes,
  {}
);
// 自动生成导航栏配置
const autoNavConf = navTool.getNav(rootPath, unDirIncludes);

let sidebar = [...autoSidebarConf, ...mySiderbarConf];
let nav = [...myNavConf, ...autoNavConf];

sidebar = AtoO(sidebar); // obj 形式的配置

// 把配置保存到文件中查看
const fs = require("fs");

fs.writeFile("./finallysidebar.txt", JSON.stringify(sidebar), (err) => {
  if (err) {
    console.error(err);
    return;
  }
  //file written successfully
  console.log("file written successfully");
});

module.exports = {
  title: "个人笔记",
  description: "...", // 这个不知道干嘛的
  // 配置主题（需要安装依赖 npm install vuepress-theme-reco --save-dev）
  theme: "reco",
  base: "/my-blog/", // 部署的项目名称
  themeConfig: {
    nav,
    sidebar,
    // 全局开启(vuepress-theme-reco 将原有的侧边栏的中的多级标题移出，生成子侧边栏，放在了页面的右侧)
    subSidebar: "auto",
  },
  // 设置语言
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
};
