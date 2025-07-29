npm run build && \
scp -r dist root@89.169.45.102:~/front_trash_test/ 
# ssh -i ~/deploy_ssh root@217.28.223.212 "cd ~/front && screen -x front serve -s dist"