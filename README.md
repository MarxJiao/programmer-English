# programmer-English

一个根据 csv 生成英语单词视频的工具。我会把每天学习的单词通过这个工具生成视频，放到我的 YouTube 频道：[MarkEnglish马克英语](https://www.youtube.com/@MarkEnglish%E9%A9%AC%E5%85%8B%E8%8B%B1%E8%AF%AD) 欢迎订阅。

我认为听英语之后跟读是很好的学习方式。希望这个工具或者我的 YouTube 频道对你有所帮助。

## 工具原理

1. 通过 canvas 生成视频；
2. 调用百度的语音合成 API 生成音频；
3. 通过 FFmpeg 将图片和音频合成视频。

## 使用方式

执行下列命令后，会在 csv 同目录生成单词文件夹和一个 video.mp4 文件。
```
node index.js path-to-csv-file
```

## csv 示例

```
word,pronunciation,wordType,translation,example,exampleTranslation
exceed,/ɪkˈsiːd/,v.,超出,"In this case, if the routine exceeds the safety limit, it stops recursing.",在这例子中，如果子程序调用次数超出安全上限，递归就会停止
```
