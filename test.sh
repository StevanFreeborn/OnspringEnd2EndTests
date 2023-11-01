  echo "Changed files in this PR:"
  BASE_SHA=597428b2747023e0843c01594e88b8f012ffe0a7
  PR_HEAD_SHA=f1f0374078062f69168eb790cf39166fc98a2dcc
  CHANGED_FILES=$(git diff --name-only $BASE_SHA $PR_HEAD_SHA | grep '\.spec\.ts')
  if [ -n "$CHANGED_FILES" ]
  then
    echo "Test files changed:"
    echo "$CHANGED_FILES"
    echo "::set-output name=changed_test_files::${CHANGED_FILES}"
  else
    echo "No test files changed."
  fi
