// 汉字数据服务

// 汉字信息类型定义
interface CharacterInfo {
  pinyin: string;
  radical: string;
  strokes: number;
  strokeOrder: string;
  meaning: string[];
  words: string[];
  similar: string[];
}

// 汉字数据库 - 包含一些常用小学汉字
const characterDatabase: Record<string, CharacterInfo> = {
  '我': {
    pinyin: 'wǒ',
    radical: '戈',
    strokes: 7,
    strokeOrder: 'ノ丶一丨フ一一',
    meaning: ['第一人称代词', '表示自己'],
    words: ['我们', '我国', '自我', '我的'],
    similar: ['找', '戒', '成']
  },
  '你': {
    pinyin: 'nǐ',
    radical: '亻',
    strokes: 7,
    strokeOrder: '丨フ一一丨ノ丶',
    meaning: ['第二人称代词', '表示对方'],
    words: ['你们', '你好', '谢谢你', '你的'],
    similar: ['他', '们', '伙']
  },
  '好': {
    pinyin: 'hǎo',
    radical: '女',
    strokes: 6,
    strokeOrder: '丶ノ丶一一一',
    meaning: ['美好', '善良', '友好', '喜欢'],
    words: ['好人', '很好', '好吃', '好看'],
    similar: ['如', '她', '妈']
  },
  '学': {
    pinyin: 'xué',
    radical: '子',
    strokes: 8,
    strokeOrder: '丶ノ一丨フ一ノ丶',
    meaning: ['学习', '模仿', '效法'],
    words: ['学校', '学生', '学习', '小学'],
    similar: ['字', '孩', '存']
  },
  '习': {
    pinyin: 'xí',
    radical: '习',
    strokes: 3,
    strokeOrder: '丶フ丶',
    meaning: ['学习', '练习', '习惯'],
    words: ['学习', '习惯', '练习', '复习'],
    similar: ['羽', '风', '飞']
  },
  '字': {
    pinyin: 'zì',
    radical: '子',
    strokes: 6,
    strokeOrder: '丶ノ一一丨一',
    meaning: ['文字', '汉字', '字体'],
    words: ['汉字', '字体', '名字', '字典'],
    similar: ['学', '子', '存']
  },
  '天': {
    pinyin: 'tiān',
    radical: '大',
    strokes: 4,
    strokeOrder: '一丨一一',
    meaning: ['天空', '自然', '天气', '日子'],
    words: ['天空', '今天', '天气', '天下'],
    similar: ['夫', '太', '大']
  },
  '人': {
    pinyin: 'rén',
    radical: '人',
    strokes: 2,
    strokeOrder: 'ノ丶',
    meaning: ['人类', '他人', '人物'],
    words: ['人民', '人类', '人生', '人才'],
    similar: ['入', '八', '大']
  },
  '小': {
    pinyin: 'xiǎo',
    radical: '小',
    strokes: 3,
    strokeOrder: '丨ノ丶',
    meaning: ['小的', '少的', '不大的'],
    words: ['小学', '小心', '小朋友', '小说'],
    similar: ['少', '尖', '水']
  },
  '大': {
    pinyin: 'dà',
    radical: '大',
    strokes: 3,
    strokeOrder: '一ノ丶',
    meaning: ['大的', '多的', '重要的'],
    words: ['大人', '大小', '大学', '大家'],
    similar: ['太', '天', '夫']
  },
  '中': {
    pinyin: 'zhōng',
    radical: '丨',
    strokes: 4,
    strokeOrder: '丨一一丨',
    meaning: ['中间', '中国', '适中'],
    words: ['中国', '中间', '中心', '中文'],
    similar: ['申', '由', '甲']
  },
  '国': {
    pinyin: 'guó',
    radical: '囗',
    strokes: 8,
    strokeOrder: '丨フ一一丨一ノ丶',
    meaning: ['国家', '国度', '国籍'],
    words: ['中国', '国家', '国旗', '国王'],
    similar: ['因', '回', '固']
  },
  '家': {
    pinyin: 'jiā',
    radical: '宀',
    strokes: 10,
    strokeOrder: '一丶丶一丨一ノ丶一丨',
    meaning: ['家庭', '家人', '专家'],
    words: ['家庭', '国家', '家人', '家乡'],
    similar: ['冢', '稼', '嫁']
  },
  '爱': {
    pinyin: 'ài',
    radical: '爫',
    strokes: 10,
    strokeOrder: '丶丶丶一ノ丶一丨一丨',
    meaning: ['喜爱', '热爱', '爱护'],
    words: ['爱心', '爱好', '爱情', '爱护'],
    similar: ['受', '爷', '变']
  },
  '日': {
    pinyin: 'rì',
    radical: '日',
    strokes: 4,
    strokeOrder: '一丨一一',
    meaning: ['太阳', '日子', '每天'],
    words: ['日子', '日记', '日期', '日出'],
    similar: ['白', '目', '旦']
  },
  '月': {
    pinyin: 'yuè',
    radical: '月',
    strokes: 4,
    strokeOrder: '一フ一一',
    meaning: ['月亮', '月份', '月球'],
    words: ['月亮', '月份', '农历', '月球'],
    similar: ['有', '肉', '朋']
  },
  '水': {
    pinyin: 'shuǐ',
    radical: '水',
    strokes: 4,
    strokeOrder: '丶丶丶ノ',
    meaning: ['水分', '液体', '水平'],
    words: ['水果', '水平', '水分', '水库'],
    similar: ['永', '冰', '泉']
  },
  '火': {
    pinyin: 'huǒ',
    radical: '火',
    strokes: 4,
    strokeOrder: '丶ノ丶丶',
    meaning: ['火焰', '火灾', '火热'],
    words: ['火车', '火山', '火柴', '火焰'],
    similar: ['灭', '炎', '焱']
  },
  '山': {
    pinyin: 'shān',
    radical: '山',
    strokes: 3,
    strokeOrder: '丨ノ丶',
    meaning: ['山峰', '山脉', '山区'],
    words: ['山水', '山区', '山峰', '火山'],
    similar: ['岗', '岛', '屿']
  },
  '木': {
    pinyin: 'mù',
    radical: '木',
    strokes: 4,
    strokeOrder: '一丨ノ丶',
    meaning: ['树木', '木头', '木材'],
    words: ['树木', '木头', '木材', '木工'],
    similar: ['本', '未', '末']
  },
  '口': {
    pinyin: 'kǒu',
    radical: '口',
    strokes: 3,
    strokeOrder: '一丨一',
    meaning: ['嘴巴', '口子', '入口'],
    words: ['口水', '出口', '入口', '口味'],
    similar: ['日', '目', '田']
  },
  '手': {
    pinyin: 'shǒu',
    radical: '手',
    strokes: 4,
    strokeOrder: '一ノ一丶',
    meaning: ['手掌', '手臂', '人手'],
    words: ['手指', '手表', '手机', '洗手'],
    similar: ['毛', '气', '毫']
  },
  '心': {
    pinyin: 'xīn',
    radical: '心',
    strokes: 4,
    strokeOrder: '丶ノ丶丶',
    meaning: ['心脏', '心思', '中心'],
    words: ['开心', '心情', '爱心', '中心'],
    similar: ['必', '忄', '恭']
  },
  '花': {
    pinyin: 'huā',
    radical: '艹',
    strokes: 7,
    strokeOrder: '一一一ノ丶丶丶',
    meaning: ['花朵', '花卉', '花费'],
    words: ['花朵', '花园', '鲜花', '花草'],
    similar: ['芳', '苗', '草']
  },
  '草': {
    pinyin: 'cǎo',
    radical: '艹',
    strokes: 9,
    strokeOrder: '一一一ノ丶丨一一丨',
    meaning: ['草地', '草原', '草率'],
    words: ['草地', '草原', '花草', '草莓'],
    similar: ['花', '苗', '芽']
  },
  '鱼': {
    pinyin: 'yú',
    radical: '鱼',
    strokes: 8,
    strokeOrder: '丶一ノ丶丨一一丨',
    meaning: ['鱼类', '鱼儿', '鱼肉'],
    words: ['鱼类', '金鱼', '鱼缸', '鱼肉'],
    similar: ['鲁', '鲜', '鳞']
  },
  '鸟': {
    pinyin: 'niǎo',
    radical: '鸟',
    strokes: 5,
    strokeOrder: '丶丨ノ丶丶',
    meaning: ['鸟类', '鸟儿', '飞鸟'],
    words: ['小鸟', '鸟类', '鸟巢', '飞鸟'],
    similar: ['乌', '鸦', '鸭']
  },
  '虫': {
    pinyin: 'chóng',
    radical: '虫',
    strokes: 6,
    strokeOrder: '一丨一一丨一',
    meaning: ['昆虫', '虫子', '害虫'],
    words: ['昆虫', '虫子', '害虫', '蚂蚁'],
    similar: ['蛇', '蚁', '蝶']
  },
  '车': {
    pinyin: 'chē',
    radical: '车',
    strokes: 4,
    strokeOrder: '一丨一一',
    meaning: ['车辆', '汽车', '车子'],
    words: ['汽车', '火车', '自行车', '车站'],
    similar: ['轮', '辆', '轩']
  },
  '马': {
    pinyin: 'mǎ',
    radical: '马',
    strokes: 3,
    strokeOrder: '一ノ丶',
    meaning: ['马匹', '马儿', '骏马'],
    words: ['马匹', '马路', '骑马', '马车'],
    similar: ['驴', '骑', '驰']
  },
  '羊': {
    pinyin: 'yáng',
    radical: '羊',
    strokes: 6,
    strokeOrder: '一丨一ノ丶丶',
    meaning: ['羊群', '山羊', '绵羊'],
    words: ['羊肉', '山羊', '绵羊', '羊群'],
    similar: ['美', '善', '群']
  },
  '牛': {
    pinyin: 'niú',
    radical: '牛',
    strokes: 4,
    strokeOrder: '一ノ丶丶',
    meaning: ['牛只', '牛肉', '公牛'],
    words: ['牛奶', '牛肉', '水牛', '奶牛'],
    similar: ['午', '牡', '特']
  },
  '猫': {
    pinyin: 'māo',
    radical: '犭',
    strokes: 11,
    strokeOrder: 'ノ丶丶一丨一一丨一ノ丶',
    meaning: ['猫咪', '猫科', '家猫'],
    words: ['猫咪', '小猫', '猫科', '家猫'],
    similar: ['狗', '猪', '猴']
  },
  '狗': {
    pinyin: 'gǒu',
    radical: '犭',
    strokes: 8,
    strokeOrder: 'ノ丶丶一丨一ノ丶',
    meaning: ['狗狗', '狗叫', '看门狗'],
    words: ['小狗', '狗狗', '狗叫', '看门狗'],
    similar: ['猫', '猪', '狼']
  },
  '一': {
    pinyin: 'yī',
    radical: '一',
    strokes: 1,
    strokeOrder: '一',
    meaning: ['数字1', '第一', '相同'],
    words: ['一个', '一天', '一年', '第一'],
    similar: ['二', '三', '七']
  },
  '二': {
    pinyin: 'èr',
    radical: '二',
    strokes: 2,
    strokeOrder: '一一',
    meaning: ['数字2', '第二', '两个'],
    words: ['二月', '第二', '二年级', '两个'],
    similar: ['一', '三', '两']
  },
  '三': {
    pinyin: 'sān',
    radical: '一',
    strokes: 3,
    strokeOrder: '一一一',
    meaning: ['数字3', '第三', '三个'],
    words: ['三个', '三月', '三年级', '第三'],
    similar: ['一', '二', '四']
  },
  '四': {
    pinyin: 'sì',
    radical: '囗',
    strokes: 5,
    strokeOrder: '丨一一一丨',
    meaning: ['数字4', '第四', '四个'],
    words: ['四个', '四月', '四年级', '第四'],
    similar: ['三', '五', '六']
  },
  '五': {
    pinyin: 'wǔ',
    radical: '二',
    strokes: 4,
    strokeOrder: '一一一丨',
    meaning: ['数字5', '第五', '五个'],
    words: ['五个', '五月', '五年级', '第五'],
    similar: ['四', '六', '七']
  },
  '六': {
    pinyin: 'liù',
    radical: '八',
    strokes: 4,
    strokeOrder: '一丨ノ丶',
    meaning: ['数字6', '第六', '六个'],
    words: ['六个', '六月', '六年级', '第六'],
    similar: ['五', '七', '八']
  },
  '七': {
    pinyin: 'qī',
    radical: '一',
    strokes: 2,
    strokeOrder: '一ノ',
    meaning: ['数字7', '第七', '七个'],
    words: ['七个', '七月', '七年级', '第七'],
    similar: ['六', '八', '九']
  },
  '八': {
    pinyin: 'bā',
    radical: '八',
    strokes: 2,
    strokeOrder: 'ノ丶',
    meaning: ['数字8', '第八', '八个'],
    words: ['八个', '八月', '八年级', '第八'],
    similar: ['七', '九', '人']
  },
  '九': {
    pinyin: 'jiǔ',
    radical: '乙',
    strokes: 2,
    strokeOrder: '丨乚',
    meaning: ['数字9', '第九', '九个'],
    words: ['九个', '九月', '九年级', '第九'],
    similar: ['八', '十', '几']
  },
  '十': {
    pinyin: 'shí',
    radical: '十',
    strokes: 2,
    strokeOrder: '一丨',
    meaning: ['数字10', '第十', '十个'],
    words: ['十个', '十月', '十年级', '第十'],
    similar: ['九', '千', '百']
  },
  '百': {
    pinyin: 'bǎi',
    radical: '白',
    strokes: 6,
    strokeOrder: '一丨一一丨一',
    meaning: ['数字100', '许多', '百分'],
    words: ['百分', '百年', '百花', '百科'],
    similar: ['白', '千', '万']
  },
  '千': {
    pinyin: 'qiān',
    radical: '十',
    strokes: 3,
    strokeOrder: '一丨ノ',
    meaning: ['数字1000', '许多', '千年'],
    words: ['千年', '千里', '千万', '千克'],
    similar: ['百', '万', '十']
  },
  '万': {
    pinyin: 'wàn',
    radical: '一',
    strokes: 3,
    strokeOrder: '一ノ丶',
    meaning: ['数字10000', '许多', '万年'],
    words: ['万年', '万物', '万岁', '万能'],
    similar: ['千', '百', '亿']
  },
  '红': {
    pinyin: 'hóng',
    radical: '纟',
    strokes: 6,
    strokeOrder: 'ノ丶丶一丨一',
    meaning: ['红色', '红润', '喜庆'],
    words: ['红色', '红花', '红旗', '红包'],
    similar: ['绿', '黄', '蓝']
  },
  '黄': {
    pinyin: 'huáng',
    radical: '黄',
    strokes: 11,
    strokeOrder: '一丨一一丨一一丨一ノ丶',
    meaning: ['黄色', '黄金', '发黄'],
    words: ['黄色', '黄金', '黄河', '黄昏'],
    similar: ['红', '绿', '蓝']
  },
  '蓝': {
    pinyin: 'lán',
    radical: '艹',
    strokes: 13,
    strokeOrder: '一一一丨一一丨一一丨一ノ丶',
    meaning: ['蓝色', '蓝天', '发蓝'],
    words: ['蓝色', '蓝天', '蓝图', '蓝莓'],
    similar: ['红', '绿', '黄']
  },
  '绿': {
    pinyin: 'lǜ',
    radical: '纟',
    strokes: 11,
    strokeOrder: 'ノ丶丶一丨一一丨一ノ丶',
    meaning: ['绿色', '绿叶', '发绿'],
    words: ['绿色', '绿叶', '绿茶', '绿化'],
    similar: ['红', '蓝', '黄']
  },
  '白': {
    pinyin: 'bái',
    radical: '白',
    strokes: 5,
    strokeOrder: '一丨一一丨',
    meaning: ['白色', '明白', '空白'],
    words: ['白色', '白云', '白天', '明白'],
    similar: ['百', '自', '日']
  },
  '黑': {
    pinyin: 'hēi',
    radical: '黑',
    strokes: 12,
    strokeOrder: '一丨一一丨一一丨一一丨一',
    meaning: ['黑色', '黑暗', '发黑'],
    words: ['黑色', '黑夜', '黑板', '黑白'],
    similar: ['黄', '墨', '默']
  },
  '来': {
    pinyin: 'lái',
    radical: '木',
    strokes: 7,
    strokeOrder: '一丨ノ丶一ノ丶',
    meaning: ['来到', '未来', '前来'],
    words: ['来到', '未来', '欢迎', '来信'],
    similar: ['去', '走', '回']
  },
  '去': {
    pinyin: 'qù',
    radical: '厶',
    strokes: 5,
    strokeOrder: '一丨一ノ丶',
    meaning: ['去掉', '离去', '前去'],
    words: ['去年', '离去', '前去', '去掉'],
    similar: ['来', '走', '回']
  },
  '走': {
    pinyin: 'zǒu',
    radical: '走',
    strokes: 7,
    strokeOrder: '一丨一一丨ノ丶',
    meaning: ['行走', '走路', '走开'],
    words: ['走路', '行走', '走开', '走向'],
    similar: ['来', '去', '跑']
  },
  '跑': {
    pinyin: 'pǎo',
    radical: '足',
    strokes: 12,
    strokeOrder: '一丨一一丨ノ丶一丨一ノ丶',
    meaning: ['跑步', '奔跑', '跑开'],
    words: ['跑步', '奔跑', '跑道', '跑车'],
    similar: ['走', '跳', '跨']
  }
};

// 笔画名称映射
const strokeMap: Record<string, string> = {
  '一': '横',
  '丨': '竖',
  'ノ': '撇',
  '丶': '点',
  'フ': '折',
  '乚': '竖钩',
  '亅': '横钩',
  '丿': '撇',
};

/**
 * 从网络获取汉字信息
 * @param character 要查询的汉字
 * @returns 汉字信息对象，如果获取失败则返回null
 */
async function fetchCharacterInfoFromNetwork(character: string): Promise<CharacterInfo | null> {
  try {
    // 模拟从网络获取汉字信息
    // 在实际应用中，这里应该是一个真实的API调用
    // 例如：const response = await fetch(`https://api.example.com/hanzi/${character}`);
    const response = await fetch(`https://hanyuapp.baidu.com/dictapp/word/detail_getworddetail?wd=${character}&client=pc&lesson_from=xiaodu&smp_names=wordNewData1`);
    const data = await response.json();
    
    // 创建一个基本的汉字信息对象
    return {
      pinyin: data.data.detail.comprehensiveDefinition[0].pinyin,
      radical: data.data.detail.radical,
      strokes: data.data.detail.wordStrokeCount,
      strokeOrder: '一', // 提供一个基本笔画，确保动画可以工作
      meaning:  data.data.detail.comprehensiveDefinition[0].basicDefinition,
      words: data.data.detail.commonZuci.map((item:any) => item.name),
      similar: data.data.detail.sameRadical.map((item:any) => item.name),
    };
  } catch (error) {
    console.error('从网络获取汉字信息失败:', error);
    return null;
  }
}

/**
 * 获取汉字信息
 * @param character 要查询的汉字
 * @returns 汉字信息对象，如果不存在则返回null
 */
export  function  getCharacterInfo(character: string): CharacterInfo | null {
  // 首先尝试从本地数据库获取
  const localInfo = characterDatabase[character];
  if (localInfo) {
    return localInfo;
  } 
//   else {
//     const netInfo =  fetchCharacterInfoFromNetwork(character);
//     return netInfo;
//   }
  return null;

}

/**
 * 获取笔顺的中文名称
 * @param strokeOrder 笔顺字符串
 * @returns 笔顺的中文名称数组
 */
export function getStrokeNames(strokeOrder: string): string[] {
  return Array.from(strokeOrder).map(stroke => strokeMap[stroke] || stroke);
}

/**
 * 获取可用的汉字列表
 * @returns 可用汉字数组
 */
export function getAvailableCharacters(): string[] {
  return Object.keys(characterDatabase);
}