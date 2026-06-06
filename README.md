# 주식용어 사전

주식 뉴스와 시황을 이해하기 위한 정적 용어 사전입니다. GitHub Pages로 바로 배포할 수 있고, 데이터는 `data/terms.json`에서 관리합니다.

## 구성

- `index.html`: 페이지 구조
- `styles.css`: 화면 스타일
- `script.js`: JSON 로딩, 검색, 분류 필터
- `data/terms.json`: 용어 데이터

## 용어 추가

`data/terms.json`의 `terms` 배열에 아래 형식으로 항목을 추가하면 됩니다.

```json
{
  "term": "용어명",
  "category": "분류명",
  "definition": "용어 설명",
  "example": "뉴스나 투자 상황에서 쓰이는 예시",
  "tags": ["태그1", "태그2"],
  "sourceUrl": "https://example.com"
}
```

## 로컬 확인

브라우저 보안 정책 때문에 파일을 직접 여는 대신 간단한 로컬 서버로 확인하는 것을 권장합니다.

```bash
python3 -m http.server 8000
```

그다음 `http://localhost:8000`으로 접속합니다.

## GitHub Pages 배포

1. GitHub 저장소에 이 파일들을 올립니다.
2. 저장소의 `Settings > Pages`로 이동합니다.
3. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
4. 브랜치는 `main`, 폴더는 `/root`를 선택하고 저장합니다.
