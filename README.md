# upload2qiniu
Command line tool for uploading file to QiNiuYun

## Install

```bash
# with npm
npm install upload2qiniu

# or with Yarn
yarn add upload2qiniu
```

## Usage

touch a .env file under user home page like: 

```json
QINIU_AK=your qiniu ak
QINIU_SK=your qiniu sk
QINIU_BUCKET=bucket your want upload file in
QINIU_CDNLINK=the cdn link
```

upload file

```bash
upload2qiniu -f package.json
```