echo "Clearing out existing files, just in case..."
rm ./prisma/libquery_engine-*

echo "Building Libraries to ensure binaries are available..."
for file in **/*.prisma
do
    echo "Generating ${file##*/}" 
    npx prisma generate --schema=${file}
done

echo "Temporarily copying over the openssl binary to ./prisma, where it is available to every instance when searched for..."
cp -f ./src/generated/**/libquery_engine-rhel-openssl-1.0.x.so.node ./prisma