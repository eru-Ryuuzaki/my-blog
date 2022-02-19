// 自己的配置
const mySiderbarConf = [
  {
    title: "首页",
    path: "/",
    collapsable: false, // 不折叠
    children: [{ title: "README", path: "/" }],
  },
];
const myNavConf = [
  { text: "首页", link: "/" },
  {
    text: "相关链接",
    items: [
      { text: "Github", link: "https://github.com/eru-Ryuuzaki" },
      {
        text: "力扣",
        link: "https://leetcode-cn.com/u/camille_ferros/",
      },
      {
        text: "掘金",
        link: "https://juejin.cn/user/3316549695047431",
      },
    ],
  },
];

module.exports = {
  mySiderbarConf,
  myNavConf,
};
