git status > status.txt
echo CHECK-IGNORE: >> status.txt
git check-ignore -v frontend/node_modules >> status.txt
