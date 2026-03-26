# Release playbook

## English

1. run `pnpm local:verify`
2. build the extension bundle
3. refresh smoke evidence if the user flow changed
4. package or load-unpacked validate the extension
5. deploy the static web app if those pages changed

## 한국어

1. `pnpm local:verify` 실행
2. extension 번들 빌드
3. 사용자 흐름이 바뀌었다면 smoke evidence 갱신
4. extension 패키징 또는 load-unpacked 검증
5. web 페이지가 바뀌었다면 정적 웹앱 배포
