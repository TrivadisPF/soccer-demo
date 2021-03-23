# Export the variable with the password for the unzip
# export ZIP_PASSWORD=xxxxx

mkdir -p docker

cd docker

cp ../platys-platform/config.yml .

platys gen

# copy streamsets plugins
cp -r ../infrastructure/streamsets/user-libs/ plugins/streamsets/

# copy data files and unzip
cp -r ../data/* ./data-transfer/
unzip -P ${ZIP_PASSWORD} data-transfer/fixture-livestream.zip -d data-transfer


# 