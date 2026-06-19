# 🛠 Promptrest 운영자 가이드 (나만 보는 문서)

> 이 파일은 **나(운영자)만 보는 설명서**예요. 깃헙에 올려도 비밀(토큰 등)은 들어있지 않지만,
> 공개가 싫으면 `.gitignore` 에 `OWNER_GUIDE.md` 한 줄을 추가하면 저장소에 안 올라갑니다.

전체 그림: **① 파일을 GitHub에 올린다 → ② Vercel에 연결해 배포한다 → ③ 토큰을 만든다 →
④ `?admin=1` 로 업로드 버튼을 켜고 게시한다.** 게시하면 GitHub 저장소가 갱신되고 Vercel이 자동 재배포합니다.
**서버·DB·이메일 백엔드는 필요 없습니다.**

---

## ① 파일을 GitHub에 올리기 (한 번)

### 가장 쉬운 방법 — 웹에서 드래그&드롭 (개발 지식 0)
1. [github.com](https://github.com) 가입 → 로그인.
2. 우측 상단 **+ → New repository**.
   - **Repository name**: `promptrest` (원하는 이름)
   - Public / Private 아무거나 (코드에 비밀이 없어 Public도 안전)
   - **Create repository**.
3. 빈 저장소 화면에서 **uploading an existing file** 링크 클릭
   (또는 **Add file → Upload files**).
4. 압축을 푼 `promptrest` 폴더 **안의 내용물 전부**(`index.html`, `app.js`, `styles.css`,
   `data`, `images` 폴더 등)를 드래그해서 올립니다. ⚠️ `promptrest` 폴더 자체가 아니라 **그 안의 파일들**을.
5. 아래 **Commit changes** 클릭. 끝.

### (대안) GitHub Desktop / 명령어
- **GitHub Desktop**(앱) 으로 저장소를 Clone → 파일 복사 → Commit → Push.
- 또는 터미널:
  ```bash
  git init && git add . && git commit -m "init"
  git branch -M main
  git remote add origin https://github.com/<내아이디>/promptrest.git
  git push -u origin main
  ```

> 앞으로 **수정한 파일을 다시 올릴 때도** 같은 자리(Add file → Upload files, 또는 push)에 덮어쓰면 됩니다.

---

## ② Vercel로 배포 (한 번)

1. [vercel.com](https://vercel.com) → GitHub 계정으로 가입/로그인.
2. **Add New → Project** → 방금 만든 `promptrest` 저장소 **Import**.
3. Framework Preset = **Other** (그대로 두면 됨), 빌드 설정 건드릴 것 없음 → **Deploy**.
4. 1~2분 뒤 `https://promptrest-xxxx.vercel.app` 같은 주소가 나옵니다. 이게 사이트 주소예요.

> 이후 GitHub 저장소가 바뀔 때마다(=내가 업로드할 때마다) Vercel이 **자동으로 다시 배포**합니다.
> 공개용 README의 "데모" 자리에 이 주소를 넣어두면 좋아요.

---

## ③ GitHub 토큰 만들기 (무료, 한 번)

업로드가 저장소에 글을 쓰려면 "쓰기 열쇠"인 토큰이 필요합니다.

1. GitHub → 우측 상단 프로필 → **Settings**
2. 좌측 맨 아래 **Developer settings**
3. **Personal access tokens → Fine-grained tokens → Generate new token**
4. 설정:
   - **Token name**: 아무거나 (예: `promptrest`)
   - **Expiration**: 원하는 기간 (만료되면 다시 만들면 됨)
   - **Repository access**: *Only select repositories* → **`promptrest` 저장소 하나만** 선택
   - **Permissions → Repository permissions → Contents → Read and write** (이것 하나만!)
5. **Generate token** → 나오는 `github_pat_...` 문자열 복사 (이 화면에서만 보임).

> 토큰은 **내 브라우저에만** 저장되고 파일/저장소에는 절대 안 들어갑니다.
> 분실하면 그 토큰을 Revoke 하고 새로 만들면 됩니다.

---

## ④ (선택) 매번 안 적게 기본값 박아두기

`app.js` 맨 위 `CONFIG.GITHUB` 에 내 정보를 적어두면, 업로드 때 저장소를 매번 안 골라도 됩니다.

```js
GITHUB: { owner: "내깃헙아이디", repo: "promptrest", branch: "main" },
```

(토큰은 보안상 여기에 넣지 않습니다. 토큰만 사이트에서 한 번 붙여넣으면 브라우저가 기억해요.)

---

## ⑤ 업로드 버튼 켜고 게시하기

업로드 버튼은 **평소엔 숨겨져** 있습니다(방문자에겐 안 보임).

1. 내 사이트 주소 끝에 **`?admin=1`** 을 붙여 한 번 접속 → 업로드 버튼이 나타나고 그 브라우저에 기억됩니다.
   - 예: `https://promptrest-xxxx.vercel.app/?admin=1`
   - 끄려면 `?admin=off`.
2. 헤더의 **업로드** 클릭.
3. 폼의 **"게시 대상 — 내 GitHub 저장소"** 칸에 **아이디 / 저장소 이름 / (브랜치 비우면 자동)** 입력,
   복사해둔 **토큰** 붙여넣고 **연결**. → "연결됨" 표시되면 준비 끝.
4. 결과 이미지(큰 영역) · 원본(선택) · 제목 · 프롬프트 · 태그 입력 → **게시**.
5. 약 1~2분 뒤 Vercel 재배포가 끝나면 모두에게 보입니다. (내 화면엔 즉시 미리보기로 떠요.)

> 한 번 연결하면 다음부터는 **게시 버튼만** 누르면 됩니다. 게시는 토큰이 있어야만 되므로,
> 누가 `?admin=1` 로 버튼을 봐도 **토큰 없이는 못 올립니다.** (보안은 토큰이 담당)

### 폼 메모
- **모델·비율 칸 없음** — 프롬프트는 모델 무관, 비율은 이미지에서 자동 인식(레이아웃용).
- **태그 추가** — 카테고리 줄의 **+ 태그 추가**로 새 태그 생성, 그 브라우저에 기억됨.
- 이미지는 올리기 전 **자동으로 1280px로 축소·압축**되어 커밋됩니다.

---

## ⑥ 수정 후 화면이 그대로면? (캐시)

브라우저는 파일을 **주소(URL)** 기준으로 저장(캐시)해 둡니다. 그래서 수정해도 예전 화면이 보일 수 있어요.

- **확인법:** 화면 맨 아래 footer의 **build YYYYMMDD‑HHMM** 숫자를 보세요. 최신 숫자면 OK.
- **안 바뀌면:** **강력 새로고침** `Ctrl/Cmd + Shift + R`, 또는 시크릿 창, 또는 개발자도구(F12) →
  Network → **Disable cache** 체크.
- 로컬에서 옛 버전과 비교하려면 폴더마다 **포트를 다르게**: `python3 -m http.server 8001`.

---

## ⑦ (선택) 내 도메인 연결

Vercel 프로젝트 → **Settings → Domains** → 갖고 있는 도메인 추가 → 안내대로 DNS 설정.

---

## 🔧 자주 막히는 곳
| 증상 | 원인 / 해결 |
| --- | --- |
| 업로드 버튼이 안 보임 | 정상. `?admin=1` 로 접속해 켜기 |
| "연결" 눌러도 실패 | 토큰 권한이 **Contents: Read and write** 인지, 저장소 이름/아이디 철자 확인 |
| 게시했는데 사이트에 없음 | Vercel 재배포(1~2분) 대기 → 그래도 안 보이면 강력 새로고침(캐시) |
| 로컬에서 더블클릭하니 빈 화면 | `file://` 라 데이터가 안 불러와짐 → `python3 -m http.server` 로 열기 |
| 수정했는데 옛날 화면 | ⑥ 캐시 항목 참고 (footer build 숫자로 확인) |

문의/메모: jinmiyangplus@gmail.com

---

## 📊 수집되는 데이터 & 보는 법 (GA4)

앱은 아래 이벤트를 자동으로 보냅니다. **이후 추가되는 이미지·버튼도 같은 코드로 자동 수집**돼요(따로 작업 불필요).

| 이벤트 | 언제 | 함께 담기는 값 |
| --- | --- | --- |
| `open_pin` | 이미지를 클릭해 열 때 | `id`, `title`, `category`, `from`(feed/similar) |
| `copy_prompt` | 프롬프트 복사 | `id`, `title`, `category`, `where`(card/detail) |
| `open_in` | 바로가기로 보낼 때 | `tool`, `platform`(ChatGPT 등), `id`, `title`, `category` |

GA4에서 보기:
1. **참여도 → 이벤트** 에서 `open_pin` / `copy_prompt` / `open_in` 총횟수 확인.
2. "**어떤 아이템**을 많이 눌렀는지"처럼 `id`·`platform` 별로 쪼개 보려면 한 번만 등록:
   **관리(⚙️) → 데이터 표시 → 맞춤 정의 → 맞춤 측정기준 만들기** 로
   `id`, `title`, `category`, `platform`, `where`, `from` 를 **이벤트 범위**로 등록.
   (등록 후 하루 정도 지나야 보고서 집계에 뜨고, 그 전엔 **탐색(Explore)** 이나 **실시간**에서 바로 보입니다.)
3. 가장 많이 복사된 아이템 = `copy_prompt` 를 `id`(또는 `title`)로 분해, 플랫폼 분포 = `open_in` 을 `platform` 으로 분해.

---

## 🪄 이미지 → 프롬프트 생성기 켜기

홈 상단의 "이미지로 프롬프트 만들기"는 **방문자가 이미지를 올리면 비슷한 결과를 내는 프롬프트를 만들어 주는** 도구예요. LLM을 호출하므로 **키를 서버에 숨기는 작은 함수**가 함께 들어있습니다(`api/generate-prompt.js`). **키를 설정하기 전에는 "준비 중"으로만 보이고 요금이 들지 않습니다.**

켜는 법:
1. [console.anthropic.com](https://console.anthropic.com) 에서 **API 키** 발급 + 약간의 크레딧 충전.
2. Vercel 프로젝트 → **Settings → Environment Variables** 에 추가:
   - 이름 `ANTHROPIC_API_KEY`, 값 = 발급받은 키. (저장 후 **Redeploy**)
   - (선택) `PROMPT_MODEL` 로 모델 변경 가능. 기본은 저렴한 비전 모델.
3. 끝. 홈에서 이미지를 올리면 프롬프트가 생성됩니다.

비용을 줄이려고 이미 넣어둔 장치:
- 업로드 이미지를 **768px로 축소**해서 보냄(토큰↓).
- **브라우저당 하루 8회** 소프트 제한.
- 저렴한 **Haiku 비전 모델** 기본 사용.

더 통제하고 싶다면:
- **운영자 전용으로 전환** — `app.js` 의 `CONFIG.PUBLIC_GENERATOR` 를 `false` 로 바꾸면, `?admin=1` 인 나에게만 보입니다(방문자는 호출 못 함 = 공개 요금 0).
- Anthropic 콘솔에서 **월 지출 한도(Spend limit)** 설정.
- 키를 지우면 즉시 "준비 중" 상태로 돌아가 비용이 멈춥니다.

> 키는 **Vercel 서버 환경변수에만** 있고 정적 파일/저장소에는 안 들어갑니다. 방문자에게 절대 노출되지 않아요.
