<h1 align="center" id="title">2024 南投山城黑克松專案 - 老有所問， 「Line有所答」</h1>

<h2>🧐 Features</h2>

Here're some of the project's best features:

* 本地模型
* 支持api調用
* 模型呼叫
* 語音辨識
* Gemini Api

<h2>🛠️ Installation Steps:</h2>

<p>1. 安裝套件(npm)</p>

```
npm i
```

<p>2. 將.env.example重新命名成.env並填寫其中的值</p>

```
mv .env.example .env
```

<p>3. 啟動Bot</p>

```
node ./Bot/index.js
```

# Building Whisper API on Colab

## open `APIonColab.ipynb` or [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1bBXOUBvQkJCRHu0vPIiPhABIgiuUhvzP?usp=sharing)

首先將ngrok.set_auth_token("")替換成你的ngrok api key

執行全部程式碼，然後她會給你一個公共ip位置(使用ngrok)

將這個公共api複製到.env裡面的FLASK_API_URL


# Building Whisper Api on local


執行 `./run_local_Whisper.bat`

把.env裡面的FLASK_API_URL替換成http://localhost:5000

注意，large模型需要10gb的顯存
