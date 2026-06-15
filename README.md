<div align="center">

# 🪄 Promptrest

**프롬프트로 만든 이미지를 모아 보고, 한 번의 클릭으로 그 프롬프트를 가져가는 큐레이션 갤러리**

*A Pinterest‑style gallery of AI image results — tap any pin to copy the exact prompt behind it.*

[![made with](https://img.shields.io/badge/built%20with-vanilla%20JS-f7df1e)](#-기술-tech)
[![no backend](https://img.shields.io/badge/backend-none-19A57E)](#-기술-tech)
[![deploy](https://img.shields.io/badge/hosting-Vercel-black)](https://vercel.com)

🔗 **데모:** _배포 후 여기에 주소를 넣어주세요_ · 🔗 **Demo:** _add your URL here_

</div>

---

## ✨ 무엇인가요 · What it is

이미지를 보고 마음에 들면 **그 결과를 만든 프롬프트를 그대로 복사**할 수 있는 갤러리예요.
핀터레스트처럼 제목 없이 이미지만 흐르는 피드를 보다가, 하나를 클릭하면 **그 핀이 큰 카드로 펼쳐지고
같은 태그의 비슷한 이미지들이 주변을 채웁니다.** 각 핀에는 결과 이미지, 정확한 프롬프트,
그리고 (있다면) 원본 → 결과 비교가 함께 들어 있습니다.

> A curated feed where every image comes with the **exact prompt** that produced it —
> one click to copy, one click to send it to your favorite AI tool.

## 🧩 주요 기능 · Features

- 🖼 **이미지 전용 마소너리 피드** — 제목 없이 이미지만, 핀터레스트 감성
- 🔍 **클릭하면 펼쳐지는 상세** — 큰 카드(이미지 + 프롬프트) + 같은 태그 유사 이미지가 오른쪽·아래로 마소너리
- 📋 **프롬프트 원클릭 복사**
- 🚀 **바로 보내기** — ChatGPT · Gemini · Midjourney 로 프롬프트 전달
- 🔄 **Before → After** — 원본 사진과 결과를 나란히/호버 비교
- 🏷 **태그 필터 + 검색**
- 🇰🇷🇺🇸 **한국어 / 영어 전환**
- ⚡ **완전 정적** — 서버도 DB도 없음. 파일만 올리면 끝.

## 🖥 화면 · Screenshots

> 배포 후 스크린샷을 `docs/` 에 넣고 아래 경로를 바꿔주세요.

| 홈 피드 | 핀 상세 |
| --- | --- |
| `docs/home.png` | `docs/closeup.png` |

## 🛠 기술 · Tech

순수 **HTML · CSS · 바닐라 JavaScript** 한 묶음. 프레임워크·빌드 단계·외부 의존성이 없습니다.
데이터는 `data/prompts.json` 한 파일에 담기고, 이미지는 `images/` 에 들어갑니다.
호스팅은 [Vercel](https://vercel.com) 정적 배포.

```
index.html · styles.css · app.js     화면과 로직 (빌드 없음)
data/prompts.json                     핀 목록
images/                               결과·원본 이미지
robots.txt · 404.html · vercel.json   배포 설정
```

## ▶️ 로컬에서 보기 · Run locally

브라우저 보안 때문에 파일을 더블클릭하면 데이터가 안 불러와집니다. 간단한 로컬 서버로 여세요:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 📜 콘텐츠 · Content & usage

이 갤러리의 프롬프트와 이미지는 **운영자가 직접 큐레이션한 것**입니다.
개인적으로 참고하고 프롬프트를 활용하는 건 환영하지만, 페이지·이미지·프롬프트를
**대량 수집(스크래핑)하거나 무단 복제·재배포하는 것은 허용되지 않습니다.**

## 🙌 만든 사람 · Author

큐레이션·운영 — **Promptrest**
문의: jinmiyangplus@gmail.com

<div align="center"><sub>Pinterest 기반 큐레이션 컨셉 · Built as a static site, no tracking beyond privacy‑first analytics.</sub></div>
