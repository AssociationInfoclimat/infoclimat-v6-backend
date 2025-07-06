FROM debian:jessie

RUN printf '\
deb http://archive.debian.org/debian/ jessie main non-free contrib \n\
deb-src http://archive.debian.org/debian/ jessie main non-free contrib \n\
deb http://archive.debian.org/debian-security/ jessie/updates main non-free contrib \n\
deb-src http://archive.debian.org/debian-security/ jessie/updates main non-free contrib \n\
' > /etc/apt/sources.list
RUN cat /etc/apt/sources.list

RUN apt-get -o Acquire::Check-Valid-Until=false update

RUN apt-get -y --force-yes install software-properties-common
RUN add-apt-repository -y ppa:builds/sphinxsearch-beta
RUN apt-get -y --force-yes install build-essential

# useless to install mysql-server?
# I was not sure if sphinxsearch uses the mysql client to connect the MYSQL host client, but mysql-server is certainly useless
RUN echo mysql-server-5.1 mysql-server/root_password password PASSWORD | debconf-set-selections
RUN echo mysql-server-5.1 mysql-server/root_password_again password PASSWORD | debconf-set-selections
RUN apt-get -y --force-yes install mysql-server

# but this is required:
RUN apt-get -y --force-yes install libmysqlclient-dev

# https://sphinxsearch.com/downloads/sphinx-2.2.11-release.tar.gz/thankyou.html
COPY ./sphinx-2.2.11-release /sphinx-2.2.11
WORKDIR /sphinx-2.2.11
RUN ./configure --with-mysql
RUN make 
RUN make install

RUN mkdir /var/lib/sphinx
RUN mkdir /var/lib/sphinx/data

RUN mkdir /var/log/sphinx
RUN mkdir /var/run/sphinx

RUN mkdir /app
WORKDIR /app
