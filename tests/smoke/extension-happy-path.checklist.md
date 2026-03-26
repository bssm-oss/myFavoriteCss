# Extension happy path checklist

## English

### Preconditions

- `pnpm local:setup` completed
- `pnpm local:dev` running
- unpacked extension loaded from `apps/extension/dist`

### Flow

1. Open `http://localhost:5173/fixtures/article`
2. Open the side panel
3. Enable the site
4. Select `Reader Focus`
5. Preview
6. Apply
7. Undo
8. Re-apply
9. Reload
10. Confirm cache reuse

### Expected result

- enablement persists
- preview does not break the page
- undo restores the page
- apply works again
- reload can reuse cached state

## 한국어

### 사전 조건

- `pnpm local:setup` 완료
- `pnpm local:dev` 실행 중
- `apps/extension/dist`에서 unpacked extension 로드 완료

### 흐름

1. `http://localhost:5173/fixtures/article` 열기
2. 사이드패널 열기
3. 사이트 enable
4. `Reader Focus` 선택
5. Preview
6. Apply
7. Undo
8. 다시 Apply
9. 새로고침
10. 캐시 재사용 확인

### 기대 결과

- enable 상태가 유지됨
- preview가 페이지를 망가뜨리지 않음
- undo가 페이지를 복원함
- 다시 apply 가능
- 새로고침 후 캐시를 재사용할 수 있음
