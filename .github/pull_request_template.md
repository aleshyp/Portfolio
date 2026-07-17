<!-- The `npm run pr` helper prefills "Closes #<issue>" from the branch name. -->

## Summary
<!-- What changed and why. -->

## Checklist
- [ ] Design review pass (`/design-system` + `/design-guidelines`) if UI changed
- [ ] Tests pass (`npm run test:e2e`) / Test Pass run if behavior changed
- [ ] Security Pass (`/security-guidelines`) if inputs, headers, deps, or external links touched
- [ ] No hardcoded hex / arbitrary Tailwind values; theme-aware `fg-*` tokens used
