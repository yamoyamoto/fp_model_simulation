# 連想記憶 シュミレーションアプリ

## Overview

物理学科の卒業研究テーマ「_ホップフィールド模型と連想記憶の関係_」で使用する、簡単な連想記憶のシュミレーションアプリ。(兼 Next.js の練習)

アプリケーションのリンクは以下。(vercel にホストしている)

<https://fp-model-simulation.vercel.app>

API サーバーのコードは以下で管理している。

<https://github.com/yamoyamoto/fp_model_sumilation_api>

## 使い方

シュミレーションページに移動して、「Go!」ボタンを押すだけ。

ボタンを押すと、「記銘パターン」をシステムが記憶したあと「INPUT パターン」を読んで、「記憶の想起」処理が行われる。
想起の過程は 1 回ごとに出力され、10 回まで行われる。

また、想起の際の「ノイズ値」を設定することができる。これを設定すると「『偽の固定点』から脱出できる確率」のようなものを設定していることになるので、いい感じのノイズ値を設定することで正しい想起が期待できる。(詳しくは下の「連想記憶」セクション参照)

## 後に追加実装したい機能

- 記銘パターンもユーザーから変更できるようにする
- 複数のサンプル記銘パターンを選択肢として選べるようにする

## 連想記憶

### 想起のダイナミクス

N 個の 1 または-1 の値を取る素子を考え、以下の式でダイナミクスを定義する。

<img src=
"https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle+%5Cbegin%7Balign%2A%7D%0AS_i%28t%2B%5CDelta+t%29+%3D+sgn%28%5Csum_%7B%5Cj%3D1%7D%5EN+J_%7Bij%7DS_j%29%0A%5Cend%7Balign%2A%7D%0A"
alt="\begin{align*}
S_i(t+\Delta t) = sgn(\sum_{\j=1}^N J_{ij}S_j)
\end{align*}
">

また、J は結合定数と呼ばれ、パターンを記憶する役割を担う。

### ヘッブの法則

先程登場した J を以下の式で表すことにする。

<img src=
"https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle+%5Cbegin%7Balign%2A%7D%0AJ_%7Bij%7D+%3D+%5Clambda%5Csum_%7B%5Cmu%3D1%7D%5Ep%5Cxi_i%5E%5Cmu%5Cxi_j%5E%5Cmu%0A%5Cend%7Balign%2A%7D%0A"
alt="\begin{align*}
J_{ij} = \lambda\sum_{\mu=1}^p\xi_i^\mu\xi_j^\mu
\end{align*}
">

これを「ヘッブの法則」という。また係数 λ は、学習の振幅や学習率と呼ばれる。
ξ は「μ 番目の記銘パターンにおける i 番目の素子の値」を示し、p は記名するパターン数を示す。

ダイナミクスの実行中、記名したパターンにひとたび遷移すると、それ以降はいくらダイナミクスを実行しても別のパターンには遷移しなくなる。
(上の式を用いて証明可能)

つまり、このヘッブの法則から導かれた結合定数によるダイナミクスの性質を使えば、記銘パターンが固定点になるので「記憶の想起」を実現できる。

### 偽の記憶

先程、ヘッブの法則を用いれば記憶の想起が実現できると説明した。
しかし、「偽の記憶」に対応する**記銘パターン以外の固定点**も存在しうるので完璧とはいえない。

この問題を解決するためには、統計力学で温度 T に対応する量である「ノイズ」を導入する必要がある。

少し天下り的だが、「時刻 t の次の瞬間において、S_i が i を取る確率」を以下で定義する。
h_i は、素子 i にかかる有効磁場を表している。

<img src=
"https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle+%5Cbegin%7Balign%2A%7D%0AW%28t%2B%5CDelta+t%29+%3D+%5Cfrac%7B1%7D%7B1+%2B+%5Cexp%28-2%5Cbeta%5Ch_i%29%7D%0A%5Cend%7Balign%2A%7D%0A"
alt="\begin{align*}
W(t+\Delta t) = \frac{1}{1 + \exp(-2\beta\h_i)}
\end{align*}
">

<img src=
"https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle+%5Cbegin%7Balign%2A%7D%0Ah_i+%3D+%5Csum_%7Bi+%5Cneq+j%7DJ_%7Bij%7DS_j%28t%29%0A%5Cend%7Balign%2A%7D%0A"
alt="\begin{align*}
h_i = \sum_{i \neq j}J_{ij}S_j(t)
\end{align*}
">

この式でダイナミクスを実行していくと、T の大きさに応じてエネルギーが上昇する過程もある程度の確率で許すことができる。

エネルギー関数は以下で定義される。
ノイズが 0 の場合は、このエネルギーはダイナミクスに対して単調に減少する。

<img src=
"https://render.githubusercontent.com/render/math?math=%5Cdisplaystyle+%5Cbegin%7Balign%2A%7D%0AE%5C%7BS%5C%7D+%3D+-+%5Cfrac%7B1%7D%7B2%7D+%5Cquad+%5Csum_%7Bi%2Cj%28i+%5Cneq+j%29%7D+J_%7Bij%7D+S_i+S_j+-+%5Csum_%7Bi%7D+h_i%5E%7Bext%7D+S_i%0A%5Cend%7Balign%2A%7D%0A"
alt="\begin{align*}
E\{S\} = - \frac{1}{2} \quad \sum_{i,j(i \neq j)} J_{ij} S_i S_j - \sum_{i} h_i^{ext} S_i
\end{align*}
">
