const gulp = require("gulp");
const fs = require('fs');
const uploadCdn = require('@aixuexi/axx-general-upload');

const uploadCDN = (done) => {
  const info = fs.readFileSync('./package.json', 'utf-8')
  const version = JSON.parse(info).version
  // 请从http://fe-upload.aixuexi.com下载upload.token文件
  const token = fs.readFileSync('./upload.token');//请将upload.token放入gitignore中，每个人用自己的upload.token

  uploadCdn({
    biz: 'diy',//业务id 请替换xxx
    dir: 'pinyin/' + version,//要上传的业务下的子目录 请替换xxx
    token,
    glob: {//匹配要上传的本地文件 请按业务需求设置上传文件glob
      pattern: 'dist/bundle.js',
      options: {
        cwd: '.'
      }
    }
  });

  done()
}

gulp.task('upload',uploadCDN)