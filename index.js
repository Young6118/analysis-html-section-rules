import fs from 'fs';
import readline from 'readline';
import path from 'path';

// 使用 readline 逐行读取大文件
const fileStream = fs.createReadStream('./annotation_test_data_1.jsonl', 'utf8');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

// 逐行处理
let total = 0;
const pages = [];
rl.on('line', (line) => {
  if (line.trim()) {
    try {
      const data = JSON.parse(line);
      /**
       * [
  'annotation_name',
  'batch_name',
  'index_id',
  'unique_id',
  'content_type',
  'lang',
  'original_content',
  'full_content',
  'parsed_content',
  'parsed_title'
]
       */
      if (!fs.existsSync(`./original_content/${total}`)) {
        fs.mkdirSync(`./original_content/${total}`, { recursive: true });
      }
      const filename = `${total}/${data.unique_id}.html`;
      fs.writeFileSync(`./original_content/${filename}`, data.original_content);
      pages.push(`/${filename}`);
      // if (total >= 1) {
      //   rl.close();
      // }
      total++;
      // 在这里处理每一行的数据
    } catch (error) {
      console.error('解析 JSON 失败:', error.message);
    }
  }
});

rl.on('close', () => {
  console.log('文件读取完成');
  fs.writeFileSync('./original_content/pages.json', JSON.stringify(pages, null, 2));
});

// copy index.html to original_content
fs.copyFileSync('index.html', './original_content/index.html');