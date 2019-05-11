$(function () {
  var fields = ['ak', 'sk', 'bucket', 'domain'];
  var isConfigured = true;
  for (var i = 0; i < fields.length; i++) {
    if (!localStorage.getItem(fields[i])) {
      isConfigured = false;
    }
  }
  if (!isConfigured) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon.png',
      title: '提示',
      message: '首次使用请填写七牛云配置文件',
      requireInteraction: true
    });
    chrome.tabs.create({
      url: 'options.html'
    });
    return;
  }

  var uptoken = genUpToken(
    localStorage.getItem('ak'),
    localStorage.getItem('sk'),
    localStorage.getItem('bucket')
  );

  var domain = localStorage.getItem('domain');
  domain = domain.indexOf('http') === -1 ? 'http://' + domain : domain;

  var uploader = WebUploader.create({
    auto: true,
    swf: 'Uploader.swf',
    server: 'https://upload.qbox.me',
    pick: '#pickfiles',
    resize: false,
    dnd: '#uploader',
    paste: document.body,
    disableGlobalDnd: true,
    accept: [{
      title: 'Images',
      extensions: 'gif,jpg,jpeg,bmp,png',
      mimeTypes: 'image/*'
    }],
    compress: false,
    prepareNextFile: true,
    chunked: true,
    chunkSize: 4194304,
    threads: 5,
    fileNumLimit: 100,
    fileSingleSizeLimit: 10000 * 1024 * 1024,
    duplicate: true,
    formData: {
      token: uptoken
    }
  });
  uploader.on('startUpload', function () {
    $('#status').html('上传中...');
  });
  uploader.on('uploadSuccess', function (file, res) {
    $('#status').html('上传完成 <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
    setTimeout(function () {
      $('#status').html('');
    }, 3000);
    var link = domain + '/' + res.key;
    var markdownLink = '![](' + link + ')';
    var aLink = '<img src="' + link + '">';
    $('#link').val(link);
    $('#markdown').val(markdownLink);
    $('#a-link').val(aLink);
  });
  uploader.on('uploadError', function (file, err) {
    if (err === 'http') {
      err = '请检查AK/SK等配置是否正确，然后重新开启本窗口';
    }
    $('#status').html('上传失败：' + err);
    setTimeout(function () {
      $('#status').html('');
    }, 5000);
  });

  var clipboard = new ClipboardJS('.btn');
  clipboard.on('success', function (e) {
    if (!e.text.trim()) return;
    $(e.trigger).html('OK <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
    setTimeout(function () {
      $(e.trigger).html('复制');
    }, 500);
  });
});