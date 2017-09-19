#!/bin/bash

# sysinfo_page - A script to update the server mode

if [ $# lt 2 ]; then
    echo "You're missing a server status argument."
    echo "Usage: setServerStatus <status>"
else if [ $# gt 2 ]; then
    echo "You have used too many arguments."
    echo "Usage: setServerStatus <status>"
else
  set_status()
fi


set_status () { 
  echo "Updating server status to $1"
  
  mongo polymorph --eval "db.serverModes.update({}, {'server_mode': $1})"
  mongo polymorph --eval "db.serverModes.update({}, {'server_mode': $1})"
  
  echo "Server status updated"
  exit

}