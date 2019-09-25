### Auto start node app
```
sudo cp exitpuzzles.zoltar.service /etc/systemd/system/

# install service
sudo systemctl enable exitpuzzles.zoltar.service

# start service
sudo systemctl start exitpuzzles.zoltar.service

# to check status
sudo systemctl status exitpuzzles.zoltar.service

```

Afterwards, should be able to 'shutdown -r now' and see it come online with ssh and node service

### Start/Stop to run by hand
```
sudo systemctl stop exitpuzzles.zoltar.service
```
